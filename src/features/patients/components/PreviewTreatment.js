import React from 'react';
import {Box, Button, Divider, Paper, Stack, Typography} from "@mui/material";

export const PreviewTreatment = ({patientDetails, previewData, handleCancelPreview, handleConfirmSubmit}) => (
    <Box
        sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1300,
            p: 2
        }}
    >
        <Paper
            sx={{
                maxHeight: '90vh',
                overflowY: 'auto',
                width: '100%',
                maxWidth: 800,
                p: 4
            }}
        >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Assessment Preview
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack spacing={2} sx={{ mb: 3 }}>
                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Patient
                    </Typography>
                    <Typography variant="body2">{patientDetails?.name}</Typography>
                </Box>

                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Chief Complaint
                    </Typography>
                    <Typography variant="body2">{previewData?.chiefComplaintDescription}</Typography>
                </Box>

                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Pain Scale
                    </Typography>
                    <Typography variant="body2">{previewData?.painScale}/10</Typography>
                </Box>

                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Diagnosis
                    </Typography>
                    <Typography variant="body2">{previewData?.diagnosis}</Typography>
                </Box>

                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Treatment Plan - Interventions
                    </Typography>
                    <Typography variant="body2">{previewData?.interventions}</Typography>
                </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                    variant="outlined"
                    onClick={handleCancelPreview}
                >
                    Edit
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleConfirmSubmit}
                >
                    Confirm & Submit
                </Button>
            </Stack>
        </Paper>

    </Box>
)