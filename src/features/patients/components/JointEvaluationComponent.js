// src/features/patients/components/JointEvaluationComponent.jsx

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
    Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const JointEvaluationComponent = ({ control, errors }) => {
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

    // Helper component for joint assessment rows
    const JointTableRow = ({ movement, leftROM, rightROM, bilateralROM, leftNotes, rightNotes, bilateralNotes }) => (
        <TableRow>
            <TableCell sx={{ width: '25%' }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {movement}
                </Typography>
            </TableCell>
            <TableCell sx={{ width: '25%', px: 1 }}>
                {leftROM || leftNotes ? (
                    <Grid container spacing={1}>
                        {leftROM && (
                            <Grid item xs={12}>
                                <TextField
                                    size="small"
                                    placeholder="ROM (e.g., 0-90°)"
                                    fullWidth
                                    multiline
                                    sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                />
                            </Grid>
                        )}
                        {leftNotes && (
                            <Grid item xs={12}>
                                <TextField
                                    size="small"
                                    placeholder="Notes"
                                    fullWidth
                                    multiline
                                    sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                />
                            </Grid>
                        )}
                    </Grid>
                ) : '—'}
            </TableCell>
            <TableCell sx={{ width: '25%', px: 1 }}>
                {rightROM || rightNotes ? (
                    <Grid container spacing={1}>
                        {rightROM && (
                            <Grid item xs={12}>
                                <TextField
                                    size="small"
                                    placeholder="ROM (e.g., 0-90°)"
                                    fullWidth
                                    multiline
                                    sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                />
                            </Grid>
                        )}
                        {rightNotes && (
                            <Grid item xs={12}>
                                <TextField
                                    size="small"
                                    placeholder="Notes"
                                    fullWidth
                                    multiline
                                    sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                />
                            </Grid>
                        )}
                    </Grid>
                ) : '—'}
            </TableCell>
            <TableCell sx={{ width: '25%', px: 1 }}>
                {bilateralROM || bilateralNotes ? (
                    <Grid container spacing={1}>
                        {bilateralROM && (
                            <Grid item xs={12}>
                                <TextField
                                    size="small"
                                    placeholder="ROM (e.g., 0-90°)"
                                    fullWidth
                                    multiline
                                    sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                />
                            </Grid>
                        )}
                        {bilateralNotes && (
                            <Grid item xs={12}>
                                <TextField
                                    size="small"
                                    placeholder="Notes"
                                    fullWidth
                                    multiline
                                    sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                />
                            </Grid>
                        )}
                    </Grid>
                ) : '—'}
            </TableCell>
        </TableRow>
    );

    // Common table header
    const TableHeader = () => (
        <TableHead>
            <TableRow sx={{ backgroundColor: '#E3F2FD' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Joint / Movement</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Left</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Right</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Remark</TableCell>
            </TableRow>
        </TableHead>
    );

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                Joint Evaluation (Range of Motion)
            </Typography>

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
                        <Typography sx={{ fontWeight: 'bold' }}>Spine Joint Evaluation</Typography>
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
                                <JointTableRow
                                    movement="Flexion"
                                    bilateralROM={true}
                                    bilateralNotes={true}
                                />
                                <JointTableRow
                                    movement="Extension"
                                    bilateralROM={true}
                                    bilateralNotes={true}
                                />
                                <JointTableRow
                                    movement="Lateral Flexion"
                                    leftROM={true}
                                    leftNotes={true}
                                    rightROM={true}
                                    rightNotes={true}
                                />
                                <JointTableRow
                                    movement="Rotation"
                                    leftROM={true}
                                    leftNotes={true}
                                    rightROM={true}
                                    rightNotes={true}
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Special Tests for Cervical */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Special Tests / Observations
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="e.g., Spurling's test, distraction test, instability, crepitus, etc."
                        variant="outlined"
                        sx={{ mb: 3 }}
                    />

                    {/* Thoracic Spine */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Thoracic Spine
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <JointTableRow
                                    movement="Extension"
                                    bilateralROM={true}
                                    bilateralNotes={true}
                                />
                                <JointTableRow
                                    movement="Rotation"
                                    leftROM={true}
                                    leftNotes={true}
                                    rightROM={true}
                                    rightNotes={true}
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Special Tests for Thoracic */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Special Tests / Observations
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="e.g., rib mobility, postural assessment, breathing pattern, etc."
                        variant="outlined"
                        sx={{ mb: 3 }}
                    />

                    {/* Lumbar Spine */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Lumbar Spine
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <JointTableRow
                                    movement="Flexion"
                                    bilateralROM={true}
                                    bilateralNotes={true}
                                />
                                <JointTableRow
                                    movement="Extension"
                                    bilateralROM={true}
                                    bilateralNotes={true}
                                />
                                <JointTableRow
                                    movement="Lateral Flexion"
                                    leftROM={true}
                                    leftNotes={true}
                                    rightROM={true}
                                    rightNotes={true}
                                />
                                <JointTableRow
                                    movement="Rotation"
                                    leftROM={true}
                                    leftNotes={true}
                                    rightROM={true}
                                    rightNotes={true}
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Special Tests for Lumbar */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Special Tests / Observations
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="e.g., SLR, slump test, instability tests, joint play, etc."
                        variant="outlined"
                    />
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
                        <Typography sx={{ fontWeight: 'bold' }}>Upper Limb Joint Evaluation</Typography>
                        <Typography sx={{ color: 'text.secondary', ml: 2, fontSize: '0.875rem' }}>
                            (Shoulder, Elbow, Forearm, Wrist)
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
                                <JointTableRow movement="Flexion" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                                <JointTableRow movement="Extension" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                                <JointTableRow movement="Abduction" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                                <JointTableRow movement="Adduction" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                                <JointTableRow movement="Internal Rotation" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                                <JointTableRow movement="External Rotation" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Special Tests for Shoulder */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Special Tests / Observations
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="e.g., Hawkins-Kennedy, Neer's, Empty Can, Drop Arm, Apprehension, etc."
                        variant="outlined"
                        sx={{ mb: 3 }}
                    />

                    {/* Elbow */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Elbow
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <JointTableRow movement="Flexion" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                                <JointTableRow movement="Extension" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Special Tests for Elbow */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Special Tests / Observations
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="e.g., Varus/valgus stress, tennis/golfer's elbow tests, etc."
                        variant="outlined"
                        sx={{ mb: 3 }}
                    />

                    {/* Forearm */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Forearm
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <JointTableRow movement="Supination" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                                <JointTableRow movement="Pronation" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
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
                                <JointTableRow movement="Flexion" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                                <JointTableRow movement="Extension" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                                <JointTableRow movement="Radial Deviation" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                                <JointTableRow movement="Ulnar Deviation" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Special Tests for Wrist */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Special Tests / Observations
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="e.g., Phalen's, Tinel's, Finkelstein's, carpal mobility, etc."
                        variant="outlined"
                    />
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
                        <Typography sx={{ fontWeight: 'bold' }}>Lower Limb Joint Evaluation</Typography>
                        <Typography sx={{ color: 'text.secondary', ml: 2, fontSize: '0.875rem' }}>
                            (Hip, Knee, Ankle)
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
                                <JointTableRow movement="Flexion" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                                <JointTableRow movement="Extension" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                                <JointTableRow movement="Abduction" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                                <JointTableRow movement="Adduction" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                                <JointTableRow movement="Internal Rotation" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                                <JointTableRow movement="External Rotation" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Special Tests for Hip */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Special Tests / Observations
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="e.g., FABER, FADIR, Thomas test, Trendelenburg, etc."
                        variant="outlined"
                        sx={{ mb: 3 }}
                    />

                    {/* Knee */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Knee
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <JointTableRow movement="Flexion" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                                <JointTableRow movement="Extension" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Special Tests for Knee */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Special Tests / Observations
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="e.g., Lachman, Drawer, McMurray, Varus/Valgus stress, Patellar mobility, etc."
                        variant="outlined"
                        sx={{ mb: 3 }}
                    />

                    {/* Ankle & Foot */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Ankle & Foot
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <JointTableRow movement="Dorsiflexion" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                                <JointTableRow movement="Plantarflexion" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                                <JointTableRow movement="Inversion" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                                <JointTableRow movement="Eversion" leftROM={true} leftNotes={true} rightROM={true} rightNotes={true} />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Special Tests for Ankle */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Special Tests / Observations
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="e.g., Anterior drawer, Talar tilt, Thompson test, weight-bearing assessment, etc."
                        variant="outlined"
                    />
                </AccordionDetails>
            </Accordion>

            {/* General Notes */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    General Joint Evaluation Notes
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Overall joint mobility, patterns of restriction, hypermobility, compensations, etc."
                    variant="outlined"
                    sx={{ mt: 1 }}
                />
            </Box>
        </Box>
    );
};
