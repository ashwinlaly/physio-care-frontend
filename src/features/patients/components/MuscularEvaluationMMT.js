import React, { useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Controller } from 'react-hook-form';

export const MuscularEvaluationMMT = ({ control, errors }) => {
    const [expanded, setExpanded] = useState({
        spine: false,
        upperLimb: false,
        lowerLimb: false,
    });

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded((prev) => ({
            ...prev,
            [panel]: isExpanded,
        }));
    };

    const MMTTableRow = ({ movement, muscles, leftFieldName, rightFieldName, bilateralFieldName }) => (
        <TableRow>
            <TableCell sx={{ width: '10%' }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {movement}
                </Typography>
                {muscles && (
                    <Typography variant="caption" color="text.secondary">
                        ({muscles})
                    </Typography>
                )}
            </TableCell>
            <TableCell align="center" sx={{ width: '20%' }}>
                {leftFieldName ? (
                    <Controller
                        name={`muscularEvaluation.${leftFieldName}`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                size="small"
                                placeholder="0-5"
                                sx={{ width: '100%' }}
                                error={!!errors[leftFieldName]}
                            />
                        )}
                    />
                ) : '—'}
            </TableCell>
            <TableCell align="center" sx={{ width: '20%' }}>
                {rightFieldName ? (
                    <Controller
                        name={`muscularEvaluation.${rightFieldName}`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                size="small"
                                placeholder="0-5"
                                sx={{ width: '100%' }}
                                error={!!errors[rightFieldName]}
                            />
                        )}
                    />
                ) : '—'}
            </TableCell>
            <TableCell align="center" sx={{ width: '20%' }}>
                {bilateralFieldName ? (
                    <Controller
                        name={`muscularEvaluation.${bilateralFieldName}`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                size="small"
                                placeholder="0-5"
                                sx={{ width: '100%' }}
                                error={!!errors[bilateralFieldName]}
                            />
                        )}
                    />
                ) : '—'}
            </TableCell>
        </TableRow>
    );

    const TableHeader = () => (
        <TableHead>
            <TableRow sx={{ backgroundColor: '#E3F2FD' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Movement / Muscle Group</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Left</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Right</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Remark</TableCell>
            </TableRow>
        </TableHead>
    );

    return (
        <Box sx={{ width: '100%' }}>
            {/* SPINE ACCORDION */}
            <Accordion expanded={expanded.spine} onChange={handleAccordionChange('spine')} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: expanded.spine ? '#E3F2FD' : 'inherit', '&:hover': { backgroundColor: '#F5F5F5' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ fontWeight: 'bold' }}>Spine Assessment</Typography>
                        <Typography sx={{ color: 'text.secondary', ml: 2, fontSize: '0.875rem' }}>(Cervical, Thoracic, Lumbar)</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3, backgroundColor: '#FAFAFA' }}>
                    {/* Cervical Spine */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>Cervical Spine</Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow movement="Flexion" muscles="Sternocleidomastoid, Scalenes" bilateralFieldName="spine_cervical_flexion" />
                                <MMTTableRow movement="Extension" muscles="Neck Extensors, Trapezius" bilateralFieldName="spine_cervical_extension" />
                                <MMTTableRow movement="Lateral Flexion" muscles="Scalenes, Levator Scapulae" leftFieldName="spine_cervical_lateral_flexion_left" rightFieldName="spine_cervical_lateral_flexion_right" />
                                <MMTTableRow movement="Rotation" muscles="SCM, Splenius" leftFieldName="spine_cervical_rotation_left" rightFieldName="spine_cervical_rotation_right" />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Thoracic Spine */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>Thoracic Spine</Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow movement="Extension" muscles="Erector Spinae - Thoracic" bilateralFieldName="spine_thoracic_extension" />
                                <MMTTableRow movement="Rotation" muscles="Obliques, Rotators" leftFieldName="spine_thoracic_rotation_left" rightFieldName="spine_thoracic_rotation_right" />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Lumbar Spine */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>Lumbar Spine</Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow movement="Flexion" muscles="Abdominals, Psoas" bilateralFieldName="spine_lumbar_flexion" />
                                <MMTTableRow movement="Extension" muscles="Erector Spinae - Lumbar" bilateralFieldName="spine_lumbar_extension" />
                                <MMTTableRow movement="Lateral Flexion" muscles="Quadratus Lumborum, Obliques" leftFieldName="spine_lumbar_lateral_flexion_left" rightFieldName="spine_lumbar_lateral_flexion_right" />
                                <MMTTableRow movement="Rotation" muscles="Obliques, Multifidus" leftFieldName="spine_lumbar_rotation_left" rightFieldName="spine_lumbar_rotation_right" />
                            </TableBody>
                        </Table>
                    </TableContainer>
                </AccordionDetails>
            </Accordion>

            {/* UPPER LIMB ACCORDION */}
            <Accordion expanded={expanded.upperLimb} onChange={handleAccordionChange('upperLimb')} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: expanded.upperLimb ? '#E3F2FD' : 'inherit', '&:hover': { backgroundColor: '#F5F5F5' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ fontWeight: 'bold' }}>Upper Limb Assessment</Typography>
                        <Typography sx={{ color: 'text.secondary', ml: 2, fontSize: '0.875rem' }}>(Shoulder, Elbow, Forearm, Wrist, Hand)</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3, backgroundColor: '#FAFAFA' }}>
                    {/* Shoulder */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>Shoulder</Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow movement="Flexion" muscles="Anterior Deltoid, Pectoralis" leftFieldName="upper_limb_shoulder_flexion_left" rightFieldName="upper_limb_shoulder_flexion_right" />
                                <MMTTableRow movement="Extension" muscles="Latissimus Dorsi, Teres Major" leftFieldName="upper_limb_shoulder_extension_left" rightFieldName="upper_limb_shoulder_extension_right" />
                                <MMTTableRow movement="Abduction" muscles="Deltoid, Supraspinatus" leftFieldName="upper_limb_shoulder_abduction_left" rightFieldName="upper_limb_shoulder_abduction_right" />
                                <MMTTableRow movement="Adduction" muscles="Pectoralis, Latissimus" leftFieldName="upper_limb_shoulder_adduction_left" rightFieldName="upper_limb_shoulder_adduction_right" />
                                <MMTTableRow movement="Internal Rotation" muscles="Subscapularis, Pectoralis" leftFieldName="upper_limb_shoulder_internal_rotation_left" rightFieldName="upper_limb_shoulder_internal_rotation_right" />
                                <MMTTableRow movement="External Rotation" muscles="Infraspinatus, Teres Minor" leftFieldName="upper_limb_shoulder_external_rotation_left" rightFieldName="upper_limb_shoulder_external_rotation_right" />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Elbow */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>Elbow</Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow movement="Flexion" muscles="Biceps Brachii, Brachialis" leftFieldName="upper_limb_elbow_flexion_left" rightFieldName="upper_limb_elbow_flexion_right" />
                                <MMTTableRow movement="Extension" muscles="Triceps Brachii" leftFieldName="upper_limb_elbow_extension_left" rightFieldName="upper_limb_elbow_extension_right" />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Forearm */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>Forearm</Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow movement="Supination" muscles="Supinator, Biceps" leftFieldName="upper_limb_forearm_supination_left" rightFieldName="upper_limb_forearm_supination_right" />
                                <MMTTableRow movement="Pronation" muscles="Pronator Teres, Quadratus" leftFieldName="upper_limb_forearm_pronation_left" rightFieldName="upper_limb_forearm_pronation_right" />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Wrist */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>Wrist</Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow movement="Flexion" muscles="Flexor Carpi Radialis/Ulnaris" leftFieldName="upper_limb_wrist_flexion_left" rightFieldName="upper_limb_wrist_flexion_right" />
                                <MMTTableRow movement="Extension" muscles="Extensor Carpi Radialis/Ulnaris" leftFieldName="upper_limb_wrist_extension_left" rightFieldName="upper_limb_wrist_extension_right" />
                                <MMTTableRow movement="Radial Deviation" muscles="Extensor/Flexor Carpi Radialis" leftFieldName="upper_limb_wrist_radial_deviation_left" rightFieldName="upper_limb_wrist_radial_deviation_right" />
                                <MMTTableRow movement="Ulnar Deviation" muscles="Extensor/Flexor Carpi Ulnaris" leftFieldName="upper_limb_wrist_ulnar_deviation_left" rightFieldName="upper_limb_wrist_ulnar_deviation_right" />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Hand & Fingers */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>Hand & Fingers</Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow movement="Finger Flexion (MCP)" muscles="Lumbricals, Interossei" leftFieldName="upper_limb_hand_finger_flexion_left" rightFieldName="upper_limb_hand_finger_flexion_right" />
                                <MMTTableRow movement="Finger Extension (MCP)" muscles="Extensor Digitorum" leftFieldName="upper_limb_hand_finger_extension_left" rightFieldName="upper_limb_hand_finger_extension_right" />
                                <MMTTableRow movement="Finger Abduction" muscles="Dorsal Interossei" leftFieldName="upper_limb_hand_finger_abduction_left" rightFieldName="upper_limb_hand_finger_abduction_right" />
                                <MMTTableRow movement="Finger Adduction" muscles="Palmar Interossei" leftFieldName="upper_limb_hand_finger_adduction_left" rightFieldName="upper_limb_hand_finger_adduction_right" />
                                <MMTTableRow movement="Thumb Opposition" muscles="Opponens Pollicis" leftFieldName="upper_limb_hand_thumb_opposition_left" rightFieldName="upper_limb_hand_thumb_opposition_right" />
                                <MMTTableRow movement="Grip Strength" muscles="Overall Hand Strength" leftFieldName="upper_limb_hand_grip_strength_left" rightFieldName="upper_limb_hand_grip_strength_right" />
                            </TableBody>
                        </Table>
                    </TableContainer>
                </AccordionDetails>
            </Accordion>

            {/* LOWER LIMB ACCORDION */}
            <Accordion expanded={expanded.lowerLimb} onChange={handleAccordionChange('lowerLimb')} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: expanded.lowerLimb ? '#E3F2FD' : 'inherit', '&:hover': { backgroundColor: '#F5F5F5' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ fontWeight: 'bold' }}>Lower Limb Assessment</Typography>
                        <Typography sx={{ color: 'text.secondary', ml: 2, fontSize: '0.875rem' }}>(Hip, Knee, Ankle, Foot)</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3, backgroundColor: '#FAFAFA' }}>
                    {/* Hip */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>Hip</Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow movement="Flexion" muscles="Iliopsoas, Rectus Femoris" leftFieldName="lower_limb_hip_flexion_left" rightFieldName="lower_limb_hip_flexion_right" />
                                <MMTTableRow movement="Extension" muscles="Gluteus Maximus, Hamstrings" leftFieldName="lower_limb_hip_extension_left" rightFieldName="lower_limb_hip_extension_right" />
                                <MMTTableRow movement="Abduction" muscles="Gluteus Medius, Minimus" leftFieldName="lower_limb_hip_abduction_left" rightFieldName="lower_limb_hip_abduction_right" />
                                <MMTTableRow movement="Adduction" muscles="Adductor Magnus, Longus" leftFieldName="lower_limb_hip_adduction_left" rightFieldName="lower_limb_hip_adduction_right" />
                                <MMTTableRow movement="Internal Rotation" muscles="Gluteus Medius, TFL" leftFieldName="lower_limb_hip_internal_rotation_left" rightFieldName="lower_limb_hip_internal_rotation_right" />
                                <MMTTableRow movement="External Rotation" muscles="Piriformis, Obturators" leftFieldName="lower_limb_hip_external_rotation_left" rightFieldName="lower_limb_hip_external_rotation_right" />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Knee */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>Knee</Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow movement="Flexion" muscles="Hamstrings, Gastrocnemius" leftFieldName="lower_limb_knee_flexion_left" rightFieldName="lower_limb_knee_flexion_right" />
                                <MMTTableRow movement="Extension" muscles="Quadriceps" leftFieldName="lower_limb_knee_extension_left" rightFieldName="lower_limb_knee_extension_right" />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Ankle & Foot */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>Ankle & Foot</Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow movement="Dorsiflexion" muscles="Tibialis Anterior" leftFieldName="lower_limb_ankle_dorsiflexion_left" rightFieldName="lower_limb_ankle_dorsiflexion_right" />
                                <MMTTableRow movement="Plantarflexion" muscles="Gastrocnemius, Soleus" leftFieldName="lower_limb_ankle_plantarflexion_left" rightFieldName="lower_limb_ankle_plantarflexion_right" />
                                <MMTTableRow movement="Inversion" muscles="Tibialis Posterior" leftFieldName="lower_limb_ankle_inversion_left" rightFieldName="lower_limb_ankle_inversion_right" />
                                <MMTTableRow movement="Eversion" muscles="Peroneus Longus, Brevis" leftFieldName="lower_limb_ankle_eversion_left" rightFieldName="lower_limb_ankle_eversion_right" />
                                <MMTTableRow movement="Toe Flexion" muscles="Flexor Digitorum" leftFieldName="lower_limb_ankle_toe_flexion_left" rightFieldName="lower_limb_ankle_toe_flexion_right" />
                                <MMTTableRow movement="Toe Extension" muscles="Extensor Digitorum" leftFieldName="lower_limb_ankle_toe_extension_left" rightFieldName="lower_limb_ankle_toe_extension_right" />
                            </TableBody>
                        </Table>
                    </TableContainer>
                </AccordionDetails>
            </Accordion>

            {/* General Notes */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    General Muscular Evaluation Notes
                </Typography>
                <Controller
                    name="muscularEvaluation_notes"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            multiline
                            rows={4}
                            placeholder="Additional observations, compensations, asymmetries, overall strength assessment, etc."
                            variant="outlined"
                            sx={{ mt: 1 }}
                            error={!!errors.muscularEvaluation_notes}
                        />
                    )}
                />
            </Box>
        </Box>
    );
};