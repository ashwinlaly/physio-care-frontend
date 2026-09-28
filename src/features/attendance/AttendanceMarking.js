import React, { useEffect, useRef, useState } from 'react';
import { apiRequest } from '../../common/api';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Stack,
    Typography,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import { usePermission } from '../../common/rbac';

const FACE_API_SCRIPT_ID = 'face-api-js-script';
const FACE_API_SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
const VERIFY_FACE_ENDPOINT = process.env.REACT_APP_VERIFY_FACE_ENDPOINT || '/attendance/verify-face';
const MARK_ATTENDANCE_ENDPOINT = process.env.REACT_APP_MARK_ATTENDANCE_ENDPOINT || '/attendance/mark';
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const loadFaceApiScript = () => {
    if (window.faceapi) {
        return Promise.resolve(window.faceapi);
    }

    const existingScript = document.getElementById(FACE_API_SCRIPT_ID);
    if (existingScript) {
        return new Promise((resolve, reject) => {
            existingScript.addEventListener('load', () => resolve(window.faceapi), { once: true });
            existingScript.addEventListener('error', () => reject(new Error('Failed to load face-api.js script')), { once: true });
        });
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.id = FACE_API_SCRIPT_ID;
        script.src = FACE_API_SCRIPT_URL;
        script.async = true;
        script.onload = () => resolve(window.faceapi);
        script.onerror = () => reject(new Error('Failed to load face-api.js script'));
        document.body.appendChild(script);
    });
};

export const AttendanceMarking = () => {
    const [attendanceAction, setAttendanceAction] = useState('checkin');
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [modelError, setModelError] = useState('');
    const [descriptor, setDescriptor] = useState(null);
    const [isCameraRunning, setIsCameraRunning] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [verifiedUser, setVerifiedUser] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isMarking, setIsMarking] = useState(false);

    // Permission checks
    const canMarkAttendance = usePermission('attendance.create');

    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const isCheckin = attendanceAction === 'checkin';
    const actionLabel = isCheckin ? 'Check In' : 'Check Out';
    let captureButtonLabel = `Capture & Verify for ${actionLabel}`;
    if (isCapturing) {
        captureButtonLabel = 'Capturing...';
    } else if (isVerifying) {
        captureButtonLabel = 'Verifying...';
    }

    let statusSeverity = 'info';
    if (modelError || /failed|unable|error|please|not recognized/i.test(statusMessage)) {
        statusSeverity = 'error';
    } else if (/success|welcome|verified/i.test(statusMessage)) {
        statusSeverity = 'success';
    }

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setIsCameraRunning(false);
    };

    const startCamera = async () => {
        try {
            setStatusMessage('');
            setDescriptor(null);
            setVerifiedUser(null);

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false,
            });

            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            setIsCameraRunning(true);
            setStatusMessage('Camera started. Please position your face clearly.');
        } catch (error) {
            setStatusMessage(error?.message || 'Unable to start camera');
            stopCamera();
        }
    };

    const captureAndVerifyFace = async () => {
        if (!window.faceapi || !videoRef.current) {
            setStatusMessage('Face API is not ready yet');
            return;
        }

        setIsCapturing(true);
        setStatusMessage('Scanning face...');

        try {
            const detections = await window.faceapi
                .detectAllFaces(videoRef.current, new window.faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
                .withFaceLandmarks()
                .withFaceDescriptors();

            if (detections.length !== 1) {
                setDescriptor(null);
                setStatusMessage('Please make sure exactly one face is visible and try again.');
                setIsCapturing(false);
                return;
            }

            const capturedDescriptor = Array.from(detections[0].descriptor);
            setDescriptor(capturedDescriptor);
            setStatusMessage('Face captured. Verifying identity...');
            setIsCapturing(false);

            await verifyFace(capturedDescriptor);
        } catch (error) {
            setDescriptor(null);
            setStatusMessage(error?.message || 'Failed to capture face');
            setIsCapturing(false);
        }
    };

    const verifyFace = async (faceDescriptor) => {
        setIsVerifying(true);

        try {
            const response = await apiRequest(`${API_BASE_URL}${VERIFY_FACE_ENDPOINT}`, {
                method: 'POST',
                body: { descriptor: faceDescriptor },
            });

            if (response.verified) {
                setVerifiedUser({
                    userId: response.userId,
                    name: response.name,
                    matchScore: (response.matchScore * 100).toFixed(2),
                });
                setStatusMessage(response.message);
                setShowConfirmation(true);
            } else {
                setVerifiedUser(null);
                setStatusMessage('Face verification failed.');
            }
        } catch (error) {
            setVerifiedUser(null);
            setStatusMessage(error?.message || 'Failed to verify face');
        } finally {
            setIsVerifying(false);
        }
    };

    const confirmAndMarkAttendance = async () => {
        if (!verifiedUser || !descriptor) {
            setStatusMessage('Missing user or descriptor information');
            return;
        }

        setIsMarking(true);
        setStatusMessage(`Marking ${actionLabel.toLowerCase()}...`);

        try {
            const response = await apiRequest(`${API_BASE_URL}${MARK_ATTENDANCE_ENDPOINT}`, {
                method: 'POST',
                body: {
                    userId: verifiedUser.userId,
                    descriptor,
                    name: verifiedUser.name,
                    action: attendanceAction,
                },
            });

            setStatusMessage(response?.message || `✓ ${actionLabel} marked successfully!`);
            setShowConfirmation(false);

            setTimeout(() => {
                setDescriptor(null);
                setVerifiedUser(null);
                setStatusMessage('Ready for next user. Start camera to continue.');
                stopCamera();
            }, 2000);
        } catch (error) {
            setStatusMessage(error?.message || 'Failed to mark attendance');
        } finally {
            setIsMarking(false);
        }
    };

    const handleCancel = () => {
        setShowConfirmation(false);
        setVerifiedUser(null);
        setDescriptor(null);
        setStatusMessage('');
    };

    useEffect(() => {
        let isMounted = true;

        const loadModels = async () => {
            try {
                const faceapi = await loadFaceApiScript();
                const MODEL_URL = `${process.env.PUBLIC_URL}/models`;

                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                ]);

                if (isMounted) {
                    setIsModelsLoaded(true);
                    setStatusMessage('Face recognition ready. Start camera to begin.');
                }
            } catch (error) {
                if (isMounted) {
                    setModelError(error?.message || 'Failed to load face models');
                }
            }
        };

        loadModels();

        return () => {
            isMounted = false;
            stopCamera();
        };
    }, []);

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 120px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
        >
            <Card sx={{ width: '100%', maxWidth: 650, borderRadius: 3, boxShadow: 4 }}>
                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" fontWeight={700} gutterBottom>
                                Mark Attendance
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Face recognition-based attendance system
                            </Typography>
                        </Box>

                        {!isModelsLoaded && !modelError && (
                            <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                                <CircularProgress size={24} />
                                <Typography variant="body2">Loading face recognition models...</Typography>
                            </Stack>
                        )}

                        {modelError && <Alert severity="error">Face model load error: {modelError}</Alert>}

                        {!canMarkAttendance && (
                            <Alert severity="error" icon={<LockIcon />}>
                                You don't have permission to mark attendance. Please contact your administrator.
                            </Alert>
                        )}

                        {isModelsLoaded && (
                            <>
                                <Chip
                                    icon={<CheckCircleIcon />}
                                    color="success"
                                    variant="outlined"
                                    label="Face Recognition Ready"
                                    sx={{ alignSelf: 'center' }}
                                />

                                <Stack spacing={1} alignItems="center">
                                    <Typography variant="body2" color="text.secondary">
                                        Attendance Action
                                    </Typography>
                                    <ToggleButtonGroup
                                        value={attendanceAction}
                                        exclusive
                                        onChange={(_, value) => {
                                            if (value) {
                                                setAttendanceAction(value);
                                            }
                                        }}
                                        disabled={isVerifying || isMarking}
                                        color="primary"
                                    >
                                        <ToggleButton value="checkin">Check In</ToggleButton>
                                        <ToggleButton value="checkout">Check Out</ToggleButton>
                                    </ToggleButtonGroup>
                                </Stack>

                                <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        backgroundColor: '#111',
                                        border: '3px solid',
                                        borderColor: verifiedUser ? '#4caf50' : 'divider',
                                        position: 'relative',
                                    }}
                                >
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        style={{ width: '100%', maxWidth: 520, height: 360, objectFit: 'cover' }}
                                    />
                                    {isCapturing && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'rgba(0,0,0,0.3)',
                                            }}
                                        >
                                            <CircularProgress sx={{ color: 'white' }} />
                                        </Box>
                                    )}
                                </Box>

                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                                    <Button
                                        variant="contained"
                                        onClick={startCamera}
                                        disabled={isCameraRunning || isVerifying || isMarking || !canMarkAttendance}
                                        fullWidth
                                        sx={{ py: 1.5 }}
                                        title={!canMarkAttendance ? 'You don\'t have permission to mark attendance' : ''}
                                    >
                                        Start Camera
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={stopCamera}
                                        disabled={!isCameraRunning || isVerifying || isMarking}
                                        fullWidth
                                        sx={{ py: 1.5 }}
                                    >
                                        Stop Camera
                                    </Button>
                                </Stack>

                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={captureAndVerifyFace}
                                    disabled={!isCameraRunning || isCapturing || isVerifying || isMarking || !canMarkAttendance}
                                    fullWidth
                                    sx={{
                                        py: 2,
                                        background: isCameraRunning && !isCapturing ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined,
                                    }}
                                    title={!canMarkAttendance ? 'You don\'t have permission to mark attendance' : ''}
                                >
                                    {captureButtonLabel}
                                </Button>

                                {descriptor && (
                                    <Alert severity="success" icon={<CheckCircleIcon />}>
                                        Face captured successfully ({descriptor.length} points)
                                    </Alert>
                                )}

                                {statusMessage && <Alert severity={statusSeverity}>{statusMessage}</Alert>}

                                {verifiedUser && (
                                    <Card
                                        sx={{
                                            background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
                                            border: '2px solid #4caf50',
                                            borderRadius: 2,
                                        }}
                                    >
                                        <CardContent>
                                            <Stack spacing={2} alignItems="center">
                                                <Avatar
                                                    sx={{
                                                        width: 80,
                                                        height: 80,
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        fontSize: '2rem',
                                                    }}
                                                >
                                                    {verifiedUser.name.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Stack spacing={0.5} alignItems="center">
                                                    <Typography variant="h6" fontWeight={700}>
                                                        {verifiedUser.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        ID: {verifiedUser.userId}
                                                    </Typography>
                                                    <Chip
                                                        size="small"
                                                        label={`Match: ${verifiedUser.matchScore}%`}
                                                        color="success"
                                                    />
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                )}
                            </>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            <Dialog open={showConfirmation} onClose={handleCancel} maxWidth="sm" fullWidth>
                <DialogTitle>{`Confirm ${actionLabel}`}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    fontSize: '3rem',
                                    margin: '0 auto',
                                    mb: 2,
                                }}
                            >
                                {verifiedUser?.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="h6" gutterBottom>
                                {verifiedUser?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Match Confidence: {verifiedUser?.matchScore}%
                            </Typography>
                        </Box>
                        <Alert severity="info">
                            {`Are you sure you want to ${actionLabel.toLowerCase()} for ${verifiedUser?.name}?`}
                        </Alert>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCancel} disabled={isMarking}>
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmAndMarkAttendance}
                        variant="contained"
                        disabled={isMarking}
                    >
                        {isMarking ? `Marking ${actionLabel}...` : `Confirm ${actionLabel}`}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

