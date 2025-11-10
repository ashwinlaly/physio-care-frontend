// src/features/patients/components/MuscularEvaluationMMT.jsx

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

    // Helper component for table rows
    const MMTTableRow = ({ movement, muscles, leftField, rightField, bilateralField }) => (
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
                {leftField || '—'}
            </TableCell>
            <TableCell align="center" sx={{ width: '20%' }}>
                {rightField || '—'}
            </TableCell>
            <TableCell align="center" sx={{ width: '20%' }}>
                {bilateralField || '—'}
            </TableCell>
        </TableRow>
    );

    // Common table header
    const TableHeader = () => (
        <TableHead>
            <TableRow sx={{ backgroundColor: '#E3F2FD' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Movement / Muscle Group</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Left</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Right</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Bilateral</TableCell>
            </TableRow>
        </TableHead>
    );

    return (
        <Box sx={{ width: '100%' }}>
            {/* SPINE ACCORDION */}
            <Accordion
                expanded={expanded.spine}
                onChange={handleAccordionChange('spine')}
                sx={{ mb: 2 }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                        backgroundColor: expanded.spine ? '#E3F2FD' : 'inherit',
                        '&:hover': { backgroundColor: '#F5F5F5' },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ fontWeight: 'bold' }}>Spine Assessment</Typography>
                        <Typography sx={{ color: 'text.secondary', ml: 2, fontSize: '0.875rem' }}>
                            (Cervical, Thoracic, Lumbar)
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3, backgroundColor: '#FAFAFA' }}>
                    {/* Cervical Spine */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Cervical Spine
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow
                                    movement="Flexion"
                                    muscles="Sternocleidomastoid, Scalenes"
                                    bilateralField={
                                        <TextField size="small" placeholder="0-5" sx={{ width: '100%' }} multiline/>
                                    }
                                />
                                <MMTTableRow
                                    movement="Extension"
                                    muscles="Neck Extensors, Trapezius"
                                    bilateralField={
                                        <TextField size="small" placeholder="0-5" sx={{ width: '100%' }} multiline/>
                                    }
                                />
                                <MMTTableRow
                                    movement="Lateral Flexion"
                                    muscles="Scalenes, Levator Scapulae"
                                    leftField={
                                        <TextField size="small" placeholder="0-5" sx={{ width: '100%' }} multiline/>
                                    }
                                    rightField={
                                        <TextField size="small" placeholder="0-5" sx={{ width: '100%'}} multiline/>
                                    }
                                />
                                <MMTTableRow
                                    movement="Rotation"
                                    muscles="SCM, Splenius"
                                    leftField={
                                        <TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>
                                    }
                                    rightField={
                                        <TextField size="small" placeholder="0-5" sx={{width: '100%' }} multiline/>
                                    }
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Thoracic Spine */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Thoracic Spine
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow
                                    movement="Extension"
                                    muscles="Erector Spinae - Thoracic"
                                    bilateralField={
                                        <TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>
                                    }
                                />
                                <MMTTableRow
                                    movement="Rotation"
                                    muscles="Obliques, Rotators"
                                    leftField={
                                        <TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>
                                    }
                                    rightField={
                                        <TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>
                                    }
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Lumbar Spine */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Lumbar Spine
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow
                                    movement="Flexion"
                                    muscles="Abdominals, Psoas"
                                    bilateralField={
                                        <TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>
                                    }
                                />
                                <MMTTableRow
                                    movement="Extension"
                                    muscles="Erector Spinae - Lumbar"
                                    bilateralField={
                                        <TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>
                                    }
                                />
                                <MMTTableRow
                                    movement="Lateral Flexion"
                                    muscles="Quadratus Lumborum, Obliques"
                                    leftField={
                                        <TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>
                                    }
                                    rightField={
                                        <TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>
                                    }
                                />
                                <MMTTableRow
                                    movement="Rotation"
                                    muscles="Obliques, Multifidus"
                                    leftField={
                                        <TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>
                                    }
                                    rightField={
                                        <TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>
                                    }
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>
                </AccordionDetails>
            </Accordion>

            {/* UPPER LIMB ACCORDION */}
            <Accordion
                expanded={expanded.upperLimb}
                onChange={handleAccordionChange('upperLimb')}
                sx={{ mb: 2 }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                        backgroundColor: expanded.upperLimb ? '#E3F2FD' : 'inherit',
                        '&:hover': { backgroundColor: '#F5F5F5' },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ fontWeight: 'bold' }}>Upper Limb Assessment</Typography>
                        <Typography sx={{ color: 'text.secondary', ml: 2, fontSize: '0.875rem' }}>
                            (Shoulder, Elbow, Forearm, Wrist, Hand)
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3, backgroundColor: '#FAFAFA' }}>
                    {/* Shoulder */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Shoulder
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow
                                    movement="Flexion"
                                    muscles="Anterior Deltoid, Pectoralis"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Extension"
                                    muscles="Latissimus Dorsi, Teres Major"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Abduction"
                                    muscles="Deltoid, Supraspinatus"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Adduction"
                                    muscles="Pectoralis, Latissimus"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Internal Rotation"
                                    muscles="Subscapularis, Pectoralis"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="External Rotation"
                                    muscles="Infraspinatus, Teres Minor"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Elbow */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Elbow
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow
                                    movement="Flexion"
                                    muscles="Biceps Brachii, Brachialis"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Extension"
                                    muscles="Triceps Brachii"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Forearm */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Forearm
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow
                                    movement="Supination"
                                    muscles="Supinator, Biceps"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Pronation"
                                    muscles="Pronator Teres, Quadratus"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Wrist */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Wrist
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow
                                    movement="Flexion"
                                    muscles="Flexor Carpi Radialis/Ulnaris"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Extension"
                                    muscles="Extensor Carpi Radialis/Ulnaris"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Radial Deviation"
                                    muscles="Extensor/Flexor Carpi Radialis"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Ulnar Deviation"
                                    muscles="Extensor/Flexor Carpi Ulnaris"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Hand & Fingers */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Hand & Fingers
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow
                                    movement="Finger Flexion (MCP)"
                                    muscles="Lumbricals, Interossei"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Finger Extension (MCP)"
                                    muscles="Extensor Digitorum"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Finger Abduction"
                                    muscles="Dorsal Interossei"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Finger Adduction"
                                    muscles="Palmar Interossei"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Thumb Opposition"
                                    muscles="Opponens Pollicis"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Grip Strength"
                                    muscles="Overall Hand Strength"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>
                </AccordionDetails>
            </Accordion>

            {/* LOWER LIMB ACCORDION */}
            <Accordion
                expanded={expanded.lowerLimb}
                onChange={handleAccordionChange('lowerLimb')}
                sx={{ mb: 2 }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                        backgroundColor: expanded.lowerLimb ? '#E3F2FD' : 'inherit',
                        '&:hover': { backgroundColor: '#F5F5F5' },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ fontWeight: 'bold' }}>Lower Limb Assessment</Typography>
                        <Typography sx={{ color: 'text.secondary', ml: 2, fontSize: '0.875rem' }}>
                            (Hip, Knee, Ankle, Foot)
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3, backgroundColor: '#FAFAFA' }}>
                    {/* Hip */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Hip
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow
                                    movement="Flexion"
                                    muscles="Iliopsoas, Rectus Femoris"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Extension"
                                    muscles="Gluteus Maximus, Hamstrings"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Abduction"
                                    muscles="Gluteus Medius, Minimus"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Adduction"
                                    muscles="Adductor Magnus, Longus"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Internal Rotation"
                                    muscles="Gluteus Medius, TFL"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="External Rotation"
                                    muscles="Piriformis, Obturators"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Knee */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Knee
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow
                                    movement="Flexion"
                                    muscles="Hamstrings, Gastrocnemius"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Extension"
                                    muscles="Quadriceps"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Ankle & Foot */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Ankle & Foot
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <MMTTableRow
                                    movement="Dorsiflexion"
                                    muscles="Tibialis Anterior"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Plantarflexion"
                                    muscles="Gastrocnemius, Soleus"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Inversion"
                                    muscles="Tibialis Posterior"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Eversion"
                                    muscles="Peroneus Longus, Brevis"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Toe Flexion"
                                    muscles="Flexor Digitorum"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
                                <MMTTableRow
                                    movement="Toe Extension"
                                    muscles="Extensor Digitorum"
                                    leftField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                    rightField={<TextField size="small" placeholder="0-5"sx={{ width: '100%' }} multiline/>}
                                />
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
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Additional observations, compensations, asymmetries, overall strength assessment, etc."
                    variant="outlined"
                    sx={{ mt: 1 }}
                />
            </Box>
        </Box>
    );
};
