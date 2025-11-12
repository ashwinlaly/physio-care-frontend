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
import { Controller } from 'react-hook-form';

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
    const JointTableRow = ({ movement, leftROMName, rightROMName, bilateralROMName, leftNotesName, rightNotesName, bilateralNotesName }) => (
        <TableRow>
            <TableCell sx={{ width: '25%' }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {movement}
                </Typography>
            </TableCell>
            <TableCell sx={{ width: '25%', px: 1 }}>
                {leftROMName || leftNotesName ? (
                    <Grid container spacing={1}>
                        {leftROMName && (
                            <Grid item xs={12}>
                                <Controller
                                    name={`jointEvaluation.${leftROMName}`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            size="small"
                                            placeholder="ROM (e.g., 0-90°)"
                                            fullWidth
                                            multiline
                                            sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                            error={!!errors[leftROMName]}
                                        />
                                    )}
                                />
                            </Grid>
                        )}
                        {leftNotesName && (
                            <Grid item xs={12}>
                                <Controller
                                    name={`jointEvaluation.${leftNotesName}`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            size="small"
                                            placeholder="ROM (e.g., 0-90°)"
                                            fullWidth
                                            multiline
                                            sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                            error={!!errors[leftNotesName]}
                                        />
                                    )}
                                />
                            </Grid>
                        )}
                    </Grid>
                ) : '—'}
            </TableCell>
            <TableCell sx={{ width: '25%', px: 1 }}>
                {rightROMName || rightNotesName ? (
                    <Grid container spacing={1}>
                        {rightROMName && (
                            <Grid item xs={12}>
                                <Controller
                                    name={`jointEvaluation.${rightROMName}`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            size="small"
                                            placeholder="ROM (e.g., 0-90°)"
                                            fullWidth
                                            multiline
                                            sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                            error={!!errors[rightROMName]}
                                        />
                                    )}
                                />
                            </Grid>
                        )}
                        {rightNotesName && (
                            <Grid item xs={12}>
                                <Controller
                                    name={`jointEvaluation.${rightNotesName}`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            size="small"
                                            placeholder="ROM (e.g., 0-90°)"
                                            fullWidth
                                            multiline
                                            sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                            error={!!errors[rightNotesName]}
                                        />
                                    )}
                                />
                            </Grid>
                        )}
                    </Grid>
                ) : '—'}
            </TableCell>
            <TableCell sx={{ width: '25%', px: 1 }}>
                {bilateralROMName || bilateralNotesName ? (
                    <Grid container spacing={1}>
                        {bilateralROMName && (
                            <Grid item xs={12}>
                                <Controller
                                    name={`jointEvaluation.${bilateralROMName}`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            size="small"
                                            placeholder="ROM (e.g., 0-90°)"
                                            fullWidth
                                            multiline
                                            sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                            error={!!errors[bilateralROMName]}
                                        />
                                    )}
                                />
                            </Grid>
                        )}
                        {bilateralNotesName && (
                            <Grid item xs={12}>
                                <Controller
                                    name={`jointEvaluation.${bilateralNotesName}`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            size="small"
                                            placeholder="Notes"
                                            fullWidth
                                            multiline
                                            sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                                            error={!!errors[bilateralNotesName]}
                                        />
                                    )}
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
                                    bilateralROMName="joint_spine_cervical_flexion_rom"
                                    bilateralNotesName="joint_spine_cervical_flexion_notes"
                                />
                                <JointTableRow
                                    movement="Extension"
                                    bilateralROMName="joint_spine_cervical_extension_rom"
                                    bilateralNotesName="joint_spine_cervical_extension_notes"
                                />
                                <JointTableRow
                                    movement="Lateral Flexion"
                                    leftROMName="joint_spine_cervical_lateral_flexion_left_rom"
                                    leftNotesName="joint_spine_cervical_lateral_flexion_left_notes"
                                    rightROMName="joint_spine_cervical_lateral_flexion_right_rom"
                                    rightNotesName="joint_spine_cervical_lateral_flexion_right_notes"
                                />
                                <JointTableRow
                                    movement="Rotation"
                                    leftROMName="joint_spine_cervical_rotation_left_rom"
                                    leftNotesName="joint_spine_cervical_rotation_left_notes"
                                    rightROMName="joint_spine_cervical_rotation_right_rom"
                                    rightNotesName="joint_spine_cervical_rotation_right_notes"
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Special Tests for Cervical */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Special Tests / Observations
                    </Typography>
                    <Controller
                        name={`jointEvaluation.joint_spine_cervical_special_tests`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="e.g., Spurling's test, distraction test, instability, crepitus, etc."
                                variant="outlined"
                                sx={{ mb: 3 }}
                                error={!!errors.joint_spine_cervical_special_tests}
                            />
                        )}
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
                                    bilateralROMName="joint_spine_thoracic_extension_rom"
                                    bilateralNotesName="joint_spine_thoracic_extension_notes"
                                />
                                <JointTableRow
                                    movement="Rotation"
                                    leftROMName="joint_spine_thoracic_rotation_left_rom"
                                    leftNotesName="joint_spine_thoracic_rotation_left_notes"
                                    rightROMName="joint_spine_thoracic_rotation_right_rom"
                                    rightNotesName="joint_spine_thoracic_rotation_right_notes"
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Special Tests for Thoracic */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Special Tests / Observations
                    </Typography>
                    <Controller
                        name={`jointEvaluation.joint_spine_thoracic_special_tests`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="e.g., rib mobility, postural assessment, breathing pattern, etc."
                                variant="outlined"
                                sx={{ mb: 3 }}
                                error={!!errors.joint_spine_thoracic_special_tests}
                            />
                        )}
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
                                    bilateralROMName="joint_spine_lumbar_flexion_rom"
                                    bilateralNotesName="joint_spine_lumbar_flexion_notes"
                                />
                                <JointTableRow
                                    movement="Extension"
                                    bilateralROMName="joint_spine_lumbar_extension_rom"
                                    bilateralNotesName="joint_spine_lumbar_extension_notes"
                                />
                                <JointTableRow
                                    movement="Lateral Flexion"
                                    leftROMName="joint_spine_lumbar_lateral_flexion_left_rom"
                                    leftNotesName="joint_spine_lumbar_lateral_flexion_left_notes"
                                    rightROMName="joint_spine_lumbar_lateral_flexion_right_rom"
                                    rightNotesName="joint_spine_lumbar_lateral_flexion_right_notes"
                                />
                                <JointTableRow
                                    movement="Rotation"
                                    leftROMName="joint_spine_lumbar_rotation_left_rom"
                                    leftNotesName="joint_spine_lumbar_rotation_left_notes"
                                    rightROMName="joint_spine_lumbar_rotation_right_rom"
                                    rightNotesName="joint_spine_lumbar_rotation_right_notes"
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Special Tests for Lumbar */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Special Tests / Observations
                    </Typography>
                    <Controller
                        name={`jointEvaluation.joint_spine_lumbar_special_tests`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="e.g., SLR, slump test, instability tests, joint play, etc."
                                variant="outlined"
                                error={!!errors.joint_spine_lumbar_special_tests}
                            />
                        )}
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
                            (Shoulder, Elbow, Forearm, Wrist, Fingers)
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
                                <JointTableRow movement="Flexion" leftROMName="joint_upper_limb_shoulder_flexion_left_rom" leftNotesName="joint_upper_limb_shoulder_flexion_left_notes" rightROMName="joint_upper_limb_shoulder_flexion_right_rom" rightNotesName="joint_upper_limb_shoulder_flexion_right_notes" />
                                <JointTableRow movement="Extension" leftROMName="joint_upper_limb_shoulder_extension_left_rom" leftNotesName="joint_upper_limb_shoulder_extension_left_notes" rightROMName="joint_upper_limb_shoulder_extension_right_rom" rightNotesName="joint_upper_limb_shoulder_extension_right_notes" />
                                <JointTableRow movement="Abduction" leftROMName="joint_upper_limb_shoulder_abduction_left_rom" leftNotesName="joint_upper_limb_shoulder_abduction_left_notes" rightROMName="joint_upper_limb_shoulder_abduction_right_rom" rightNotesName="joint_upper_limb_shoulder_abduction_right_notes" />
                                <JointTableRow movement="Adduction" leftROMName="joint_upper_limb_shoulder_adduction_left_rom" leftNotesName="joint_upper_limb_shoulder_adduction_left_notes" rightROMName="joint_upper_limb_shoulder_adduction_right_rom" rightNotesName="joint_upper_limb_shoulder_adduction_right_notes" />
                                <JointTableRow movement="Internal Rotation" leftROMName="joint_upper_limb_shoulder_internal_rotation_left_rom" leftNotesName="joint_upper_limb_shoulder_internal_rotation_left_notes" rightROMName="joint_upper_limb_shoulder_internal_rotation_right_rom" rightNotesName="joint_upper_limb_shoulder_internal_rotation_right_notes" />
                                <JointTableRow movement="External Rotation" leftROMName="joint_upper_limb_shoulder_external_rotation_left_rom" leftNotesName="joint_upper_limb_shoulder_external_rotation_left_notes" rightROMName="joint_upper_limb_shoulder_external_rotation_right_rom" rightNotesName="joint_upper_limb_shoulder_external_rotation_right_notes" />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Special Tests for Shoulder */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Special Tests / Observations
                    </Typography>
                    <Controller
                        name={`jointEvaluation.joint_upper_limb_shoulder_special_tests`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="e.g., Hawkins-Kennedy, Neer's, Empty Can, Drop Arm, Apprehension, etc."
                                variant="outlined"
                                sx={{ mb: 3 }}
                                error={!!errors.joint_upper_limb_shoulder_special_tests}
                            />
                        )}
                    />

                    {/* Elbow */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Elbow
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <JointTableRow movement="Flexion" leftROMName="joint_upper_limb_elbow_flexion_left_rom" leftNotesName="joint_upper_limb_elbow_flexion_left_notes" rightROMName="joint_upper_limb_elbow_flexion_right_rom" rightNotesName="joint_upper_limb_elbow_flexion_right_notes" />
                                <JointTableRow movement="Extension" leftROMName="joint_upper_limb_elbow_extension_left_rom" leftNotesName="joint_upper_limb_elbow_extension_left_notes" rightROMName="joint_upper_limb_elbow_extension_right_rom" rightNotesName="joint_upper_limb_elbow_extension_right_notes" />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Special Tests for Elbow */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Special Tests / Observations
                    </Typography>
                    <Controller
                        name={`jointEvaluation.joint_upper_limb_elbow_special_tests`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="e.g., Varus/valgus stress, tennis/golfer's elbow tests, etc."
                                variant="outlined"
                                sx={{ mb: 3 }}
                                error={!!errors.joint_upper_limb_elbow_special_tests}
                            />
                        )}
                    />

                    {/* Forearm */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Forearm
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <JointTableRow movement="Supination" leftROMName="joint_upper_limb_forearm_supination_left_rom" leftNotesName="joint_upper_limb_forearm_supination_left_notes" rightROMName="joint_upper_limb_forearm_supination_right_rom" rightNotesName="joint_upper_limb_forearm_supination_right_notes" />
                                <JointTableRow movement="Pronation" leftROMName="joint_upper_limb_forearm_pronation_left_rom" leftNotesName="joint_upper_limb_forearm_pronation_left_notes" rightROMName="joint_upper_limb_forearm_pronation_right_rom" rightNotesName="joint_upper_limb_forearm_pronation_right_notes" />
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
                                <JointTableRow movement="Flexion" leftROMName="joint_upper_limb_wrist_flexion_left_rom" leftNotesName="joint_upper_limb_wrist_flexion_left_notes" rightROMName="joint_upper_limb_wrist_flexion_right_rom" rightNotesName="joint_upper_limb_wrist_flexion_right_notes" />
                                <JointTableRow movement="Extension" leftROMName="joint_upper_limb_wrist_extension_left_rom" leftNotesName="joint_upper_limb_wrist_extension_left_notes" rightROMName="joint_upper_limb_wrist_extension_right_rom" rightNotesName="joint_upper_limb_wrist_extension_right_notes" />
                                <JointTableRow movement="Radial Deviation" leftROMName="joint_upper_limb_wrist_radial_deviation_left_rom" leftNotesName="joint_upper_limb_wrist_radial_deviation_left_notes" rightROMName="joint_upper_limb_wrist_radial_deviation_right_rom" rightNotesName="joint_upper_limb_wrist_radial_deviation_right_notes" />
                                <JointTableRow movement="Ulnar Deviation" leftROMName="joint_upper_limb_wrist_ulnar_deviation_left_rom" leftNotesName="joint_upper_limb_wrist_ulnar_deviation_left_notes" rightROMName="joint_upper_limb_wrist_ulnar_deviation_right_rom" rightNotesName="joint_upper_limb_wrist_ulnar_deviation_right_notes" />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Special Tests for Wrist */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Special Tests / Observations
                    </Typography>
                    <Controller
                        name={`jointEvaluation.joint_upper_limb_wrist_special_tests`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="e.g., Phalen's, Tinel's, Finkelstein's, carpal mobility, etc."
                                variant="outlined"
                                sx={{ mb: 3 }}
                                error={!!errors.joint_upper_limb_wrist_special_tests}
                            />
                        )}
                    />

                    {/* Fingers */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Fingers
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <JointTableRow movement="MCP Flexion" leftROMName="joint_upper_limb_fingers_mcp_flexion_left_rom" leftNotesName="joint_upper_limb_fingers_mcp_flexion_left_notes" rightROMName="joint_upper_limb_fingers_mcp_flexion_right_rom" rightNotesName="joint_upper_limb_fingers_mcp_flexion_right_notes" />
                                <JointTableRow movement="PIP Flexion" leftROMName="joint_upper_limb_fingers_pip_flexion_left_rom" leftNotesName="joint_upper_limb_fingers_pip_flexion_left_notes" rightROMName="joint_upper_limb_fingers_pip_flexion_right_rom" rightNotesName="joint_upper_limb_fingers_pip_flexion_right_notes" />
                                <JointTableRow movement="DIP Flexion" leftROMName="joint_upper_limb_fingers_dip_flexion_left_rom" leftNotesName="joint_upper_limb_fingers_dip_flexion_left_notes" rightROMName="joint_upper_limb_fingers_dip_flexion_right_rom" rightNotesName="joint_upper_limb_fingers_dip_flexion_right_notes" />
                                <JointTableRow movement="Finger Abduction" leftROMName="joint_upper_limb_fingers_abduction_left_rom" leftNotesName="joint_upper_limb_fingers_abduction_left_notes" rightROMName="joint_upper_limb_fingers_abduction_right_rom" rightNotesName="joint_upper_limb_fingers_abduction_right_notes" />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Special Tests for Fingers */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Special Tests / Observations
                    </Typography>
                    <Controller
                        name={`jointEvaluation.joint_upper_limb_fingers_special_tests`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="e.g., Grip strength, finger dexterity, swelling, deformities, etc."
                                variant="outlined"
                                error={!!errors.joint_upper_limb_fingers_special_tests}
                            />
                        )}
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
                            (Hip, Knee, Ankle, toe)
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
                                <JointTableRow movement="Flexion" leftROMName="joint_lower_limb_hip_flexion_left_rom" leftNotesName="joint_lower_limb_hip_flexion_left_notes" rightROMName="joint_lower_limb_hip_flexion_right_rom" rightNotesName="joint_lower_limb_hip_flexion_right_notes" />
                                <JointTableRow movement="Extension" leftROMName="joint_lower_limb_hip_extension_left_rom" leftNotesName="joint_lower_limb_hip_extension_left_notes" rightROMName="joint_lower_limb_hip_extension_right_rom" rightNotesName="joint_lower_limb_hip_extension_right_notes" />
                                <JointTableRow movement="Abduction" leftROMName="joint_lower_limb_hip_abduction_left_rom" leftNotesName="joint_lower_limb_hip_abduction_left_notes" rightROMName="joint_lower_limb_hip_abduction_right_rom" rightNotesName="joint_lower_limb_hip_abduction_right_notes" />
                                <JointTableRow movement="Adduction" leftROMName="joint_lower_limb_hip_adduction_left_rom" leftNotesName="joint_lower_limb_hip_adduction_left_notes" rightROMName="joint_lower_limb_hip_adduction_right_rom" rightNotesName="joint_lower_limb_hip_adduction_right_notes" />
                                <JointTableRow movement="Internal Rotation" leftROMName="joint_lower_limb_hip_internal_rotation_left_rom" leftNotesName="joint_lower_limb_hip_internal_rotation_left_notes" rightROMName="joint_lower_limb_hip_internal_rotation_right_rom" rightNotesName="joint_lower_limb_hip_internal_rotation_right_notes" />
                                <JointTableRow movement="External Rotation" leftROMName="joint_lower_limb_hip_external_rotation_left_rom" leftNotesName="joint_lower_limb_hip_external_rotation_left_notes" rightROMName="joint_lower_limb_hip_external_rotation_right_rom" rightNotesName="joint_lower_limb_hip_external_rotation_right_notes" />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Special Tests for Hip */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Special Tests / Observations
                    </Typography>
                    <Controller
                        name={`jointEvaluation.joint_lower_limb_hip_special_tests`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="e.g., FABER, FADIR, Thomas test, Trendelenburg, etc."
                                variant="outlined"
                                sx={{ mb: 3 }}
                                error={!!errors.joint_lower_limb_hip_special_tests}
                            />
                        )}
                    />

                    {/* Knee */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Knee
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <JointTableRow movement="Flexion" leftROMName="joint_lower_limb_knee_flexion_left_rom" leftNotesName="joint_lower_limb_knee_flexion_left_notes" rightROMName="joint_lower_limb_knee_flexion_right_rom" rightNotesName="joint_lower_limb_knee_flexion_right_notes" />
                                <JointTableRow movement="Extension" leftROMName="joint_lower_limb_knee_extension_left_rom" leftNotesName="joint_lower_limb_knee_extension_left_notes" rightROMName="joint_lower_limb_knee_extension_right_rom" rightNotesName="joint_lower_limb_knee_extension_right_notes" />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Special Tests for Knee */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Special Tests / Observations
                    </Typography>
                    <Controller
                        name={`jointEvaluation.joint_lower_limb_knee_special_tests`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="e.g., Lachman, Drawer, McMurray, Varus/Valgus stress, Patellar mobility, etc."
                                variant="outlined"
                                sx={{ mb: 3 }}
                                error={!!errors.joint_lower_limb_knee_special_tests}
                            />
                        )}
                    />

                    {/* Ankle & Foot */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Ankle & Foot
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <JointTableRow movement="Dorsiflexion" leftROMName="joint_lower_limb_ankle_dorsiflexion_left_rom" leftNotesName="joint_lower_limb_ankle_dorsiflexion_left_notes" rightROMName="joint_lower_limb_ankle_dorsiflexion_right_rom" rightNotesName="joint_lower_limb_ankle_dorsiflexion_right_notes" />
                                <JointTableRow movement="Plantarflexion" leftROMName="joint_lower_limb_ankle_plantarflexion_left_rom" leftNotesName="joint_lower_limb_ankle_plantarflexion_left_notes" rightROMName="joint_lower_limb_ankle_plantarflexion_right_rom" rightNotesName="joint_lower_limb_ankle_plantarflexion_right_notes" />
                                <JointTableRow movement="Inversion" leftROMName="joint_lower_limb_ankle_inversion_left_rom" leftNotesName="joint_lower_limb_ankle_inversion_left_notes" rightROMName="joint_lower_limb_ankle_inversion_right_rom" rightNotesName="joint_lower_limb_ankle_inversion_right_notes" />
                                <JointTableRow movement="Eversion" leftROMName="joint_lower_limb_ankle_eversion_left_rom" leftNotesName="joint_lower_limb_ankle_eversion_left_notes" rightROMName="joint_lower_limb_ankle_eversion_right_rom" rightNotesName="joint_lower_limb_ankle_eversion_right_notes" />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Special Tests for Ankle */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Special Tests / Observations
                    </Typography>
                    <Controller
                        name={`jointEvaluation.joint_lower_limb_ankle_special_tests`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="e.g., Anterior drawer, Talar tilt, Thompson test, weight-bearing assessment, etc."
                                variant="outlined"
                                sx={{ mb: 3 }}
                                error={!!errors.joint_lower_limb_ankle_special_tests}
                            />
                        )}
                    />

                    {/* Toes */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                        Toes
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHeader />
                            <TableBody>
                                <JointTableRow movement="Great Toe Flexion" leftROMName="joint_lower_limb_toes_great_flexion_left_rom" leftNotesName="joint_lower_limb_toes_great_flexion_left_notes" rightROMName="joint_lower_limb_toes_great_flexion_right_rom" rightNotesName="joint_lower_limb_toes_great_flexion_right_notes" />
                                <JointTableRow movement="Great Toe Extension" leftROMName="joint_lower_limb_toes_great_extension_left_rom" leftNotesName="joint_lower_limb_toes_great_extension_left_notes" rightROMName="joint_lower_limb_toes_great_extension_right_rom" rightNotesName="joint_lower_limb_toes_great_extension_right_notes" />
                                <JointTableRow movement="Lesser Toe Flexion" leftROMName="joint_lower_limb_toes_lesser_flexion_left_rom" leftNotesName="joint_lower_limb_toes_lesser_flexion_left_notes" rightROMName="joint_lower_limb_toes_lesser_flexion_right_rom" rightNotesName="joint_lower_limb_toes_lesser_flexion_right_notes" />
                                <JointTableRow movement="Lesser Toe Extension" leftROMName="joint_lower_limb_toes_lesser_extension_left_rom" leftNotesName="joint_lower_limb_toes_lesser_extension_left_notes" rightROMName="joint_lower_limb_toes_lesser_extension_right_rom" rightNotesName="joint_lower_limb_toes_lesser_extension_right_notes" />
                                <JointTableRow movement="Toe Abduction" leftROMName="joint_lower_limb_toes_abduction_left_rom" leftNotesName="joint_lower_limb_toes_abduction_left_notes" rightROMName="joint_lower_limb_toes_abduction_right_rom" rightNotesName="joint_lower_limb_toes_abduction_right_notes" />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Special Tests for Toes */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Special Tests / Observations
                    </Typography>
                    <Controller
                        name={`jointEvaluation.joint_lower_limb_toes_special_tests`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="e.g., Hallux limitus, toe deformities, calluses, nail condition, etc."
                                variant="outlined"
                                error={!!errors.joint_lower_limb_toes_special_tests}
                            />
                        )}
                    />
                </AccordionDetails>
            </Accordion>

            {/* General Notes */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    General Joint Evaluation Notes
                </Typography>
                <Controller
                    name={`jointEvaluation.joint_lower_limb_toes_special_tests`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            multiline
                            rows={4}
                            placeholder="Overall joint mobility, patterns of restriction, hypermobility, compensations, etc."
                            variant="outlined"
                            sx={{ mt: 1 }}
                            error={!!errors.jointEvaluation_notes}
                        />
                    )}
                />
            </Box>
        </Box>
    );
};