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
    TextField,
    Typography,
} from '@mui/material';

const FACE_API_SCRIPT_ID = 'face-api-js-script';
const FACE_API_SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
const FACE_REGISTER_ENDPOINT = process.env.REACT_APP_FACE_REGISTER_ENDPOINT || '/face/register';
const FACE_ATTENDANCE_ENDPOINT = process.env.REACT_APP_FACE_ATTENDANCE_ENDPOINT || '/attendance/mark';
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


export const RegisterPage = () => {
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [modelError, setModelError] = useState('');
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [isFetchingName, setIsFetchingName] = useState(false);
    const [descriptor, setDescriptor] = useState(null);
    const [isCameraRunning, setIsCameraRunning] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [mode, setMode] = useState('register'); // 'register' or 'attendance'

    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const statusSeverity = modelError || /failed|unable|error|please/i.test(statusMessage)
        ? 'error'
        : /success/i.test(statusMessage)
            ? 'success'
            : 'info';

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
        } catch (error) {
            setStatusMessage(error?.message || 'Unable to start camera');
            stopCamera();
        }
    };

    const fetchUserName = async () => {
        if (!userId.trim()) {
            setStatusMessage('Please enter a user ID first');
            return;
        }

        setIsFetchingName(true);
        setStatusMessage('Fetching user details...');

        try {
            const response = await apiRequest(`${API_BASE_URL}/api/v1/face/register/${userId.trim()}`, {
                method: 'GET',
            });

            if (response.registered) {
                setUserName(response.name || `User ${userId}`);
                setStatusMessage(`Registered user found: ${response.name || userId}`);
            } else {
                setStatusMessage('User not registered yet. Please register first.');
                setUserName('');
            }
        } catch (error) {
            setStatusMessage(error?.message || 'Failed to fetch user details');
            setUserName('');
        } finally {
            setIsFetchingName(false);
        }
    };

    const captureDescriptor = async () => {
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
                return;
            }

            setDescriptor(Array.from(detections[0].descriptor));
            setStatusMessage(`Face detected${userName ? ` for ${userName}` : ''}. You can submit now.`);
        } catch (error) {
            setDescriptor(null);
            setStatusMessage(error?.message || 'Failed to capture face descriptor');
        } finally {
            setIsCapturing(false);
        }
    };

    const submitFaceRegistration = async () => {
        if (!userId.trim()) {
            setStatusMessage('Please enter a user id before submitting');
            return;
        }

        if (!descriptor) {
            setStatusMessage('Please capture a face before submitting');
            return;
        }

        setIsSubmitting(true);
        setStatusMessage('Submitting face registration...');

        try {
            await apiRequest(`${API_BASE_URL}${FACE_REGISTER_ENDPOINT}`, {
                method: 'POST',
                auth: true,
                body: {
                    userId: userId.trim(),
                    descriptor,
                },
            });

            setStatusMessage('Face registration submitted successfully.');
            setDescriptor(null);
            stopCamera();
            setUserId('');
            setUserName('');
        } catch (error) {
            if (/already registered/i.test(error?.message || '')) {
                setStatusMessage(error?.message);
            } else {
                setStatusMessage(error?.message || 'Failed to submit face registration');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const submitAttendance = async () => {
        if (!userId.trim()) {
            setStatusMessage('Please enter a user id before submitting');
            return;
        }

        if (!descriptor) {
            setStatusMessage('Please capture a face before submitting');
            return;
        }

        setIsSubmitting(true);
        setStatusMessage('Marking attendance...');

        try {
            await apiRequest(`${API_BASE_URL}${FACE_ATTENDANCE_ENDPOINT}`, {
                method: 'POST',
                body: {
                    userId: userId.trim(),
                    descriptor,
                    name: userName || userId.trim(),
                    action: 'checkin',
                },
            });

            setStatusMessage('Attendance marked successfully.');
            setDescriptor(null);
            stopCamera();
            setUserId('');
            setUserName('');
        } catch (error) {
            setStatusMessage(error?.message || 'Failed to mark attendance');
        } finally {
            setIsSubmitting(false);
        }
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
            }}
        >
            <Card sx={{ width: '100%', maxWidth: 620, borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2.5}>
                        <Box>
                            <Typography variant="h5" fontWeight={600}>
                                {mode === 'register' ? 'Face Registration' : 'Mark Attendance'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {mode === 'register'
                                    ? 'Capture a clear face image and submit the descriptor.'
                                    : 'Capture your face to mark attendance.'}
                            </Typography>
                        </Box>

                        {!isModelsLoaded && !modelError && (
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <CircularProgress size={20} />
                                <Typography variant="body2">Loading face models...</Typography>
                            </Stack>
                        )}

                        {modelError && <Alert severity="error">Face model load error: {modelError}</Alert>}

                        {isModelsLoaded && (
                            <>
                                <Chip
                                    color="success"
                                    variant="outlined"
                                    label="Face API is ready"
                                    sx={{ alignSelf: 'flex-start' }}
                                />

                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                                    <Button
                                        variant={mode === 'register' ? 'contained' : 'outlined'}
                                        onClick={() => {
                                            setMode('register');
                                            setDescriptor(null);
                                            setStatusMessage('');
                                        }}
                                        disabled={isSubmitting || isCameraRunning}
                                    >
                                        Register Face
                                    </Button>
                                    {/*<Button*/}
                                    {/*    variant={mode === 'attendance' ? 'contained' : 'outlined'}*/}
                                    {/*    onClick={() => {*/}
                                    {/*        setMode('attendance');*/}
                                    {/*        setDescriptor(null);*/}
                                    {/*        setStatusMessage('');*/}
                                    {/*    }}*/}
                                    {/*    disabled={isSubmitting || isCameraRunning}*/}
                                    {/*>*/}
                                    {/*    Mark Attendance*/}
                                    {/*</Button>*/}
                                </Stack>

                                <TextField
                                    label="User Name"
                                    value={userId}
                                    onChange={(event) => setUserId(event.target.value)}
                                    placeholder="Enter user name"
                                    fullWidth
                                    disabled={isCameraRunning || isSubmitting}
                                />

                                {mode === 'attendance' && (
                                    <Button
                                        variant="outlined"
                                        onClick={fetchUserName}
                                        disabled={!userId.trim() || isFetchingName || isCameraRunning || isSubmitting}
                                        fullWidth
                                    >
                                        {isFetchingName ? 'Fetching...' : 'Fetch User Details'}
                                    </Button>
                                )}

                                {userName && (
                                    <Alert severity="success">
                                        {`Registered as: ${userName}`}
                                    </Alert>
                                )}

                                <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        backgroundColor: '#111',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        style={{ width: '100%', maxWidth: 420, height: 280, objectFit: 'cover' }}
                                    />
                                </Box>

                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
                                    <Button
                                        variant="outlined"
                                        onClick={startCamera}
                                        disabled={isCameraRunning || isSubmitting}
                                        fullWidth
                                    >
                                        Start Camera
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        onClick={stopCamera}
                                        disabled={!isCameraRunning || isSubmitting}
                                        fullWidth
                                    >
                                        Stop Camera
                                    </Button>

                                    <Button
                                        variant="contained"
                                        onClick={captureDescriptor}
                                        disabled={!isCameraRunning || isCapturing || isSubmitting}
                                        fullWidth
                                    >
                                        {isCapturing ? 'Capturing...' : 'Capture Face'}
                                    </Button>
                                </Stack>

                                {mode === 'register' ? (
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={submitFaceRegistration}
                                        disabled={!descriptor || isSubmitting}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Face Registration'}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={submitAttendance}
                                        disabled={!descriptor || isSubmitting}
                                    >
                                        {isSubmitting ? 'Marking...' : 'Mark Attendance'}
                                    </Button>
                                )}

                                <Alert severity={descriptor ? 'success' : 'info'}>
                                    Descriptor status: {descriptor ? `Captured (${descriptor.length} values)` : 'Not captured'}
                                </Alert>

                                {statusMessage && <Alert severity={statusSeverity}>{statusMessage}</Alert>}
                            </>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};