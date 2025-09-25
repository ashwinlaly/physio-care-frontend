// src/features/patients/AssessmentForm.jsx
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  Stack,
  CircularProgress,
  Slider,
  Tabs,
  Tab,
  FormControl
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Helper component for Tab Panels
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Define the expanded validation schema using Yup (unchanged)
const assessmentSchema = yup.object().shape({
  patientId: yup.string().required('Patient ID is required'),

  // Chief Complaint Section
  chiefComplaintOnset: yup.string().required('When did it start? is required').max(200, 'Max 200 characters'),
  chiefComplaintWorse: yup.string().required('What makes it worse? is required').max(200, 'Max 200 characters'),
  chiefComplaintBetter: yup.string().required('What makes it better? is required').max(200, 'Max 200 characters'),
  chiefComplaintTreatment: yup.string().required('Any previous treatments? is required').max(200, 'Max 200 characters'),
  chiefComplaintDescription: yup.string().required('Chief Complaint description is required').max(500, 'Max 500 characters'),

  // Pain Evaluation Section
  painOnset: yup.string().optional().max(100, 'Max 100 characters'),
  painDuration: yup.string().optional().max(100, 'Max 100 characters'),
  painLocation: yup.string().optional().max(200, 'Max 200 characters'),
  painType: yup.string().optional().max(100, 'Max 100 characters'),
  aggravatingFactors: yup.string().optional().max(200, 'Max 200 characters'),
  relievingFactors: yup.string().optional().max(200, 'Max 200 characters'),
  painScale: yup.number().min(0).max(10).required('Pain scale is required').typeError('Pain scale must be a number'),
  painFrequency: yup.string().optional().max(100, 'Max 100 characters'),
  painRadiation: yup.string().optional().max(200, 'Max 200 characters'),
  painTiming: yup.string().optional().max(100, 'Max 100 characters'),
  functionalLimitation: yup.string().optional().max(300, 'Max 300 characters'),

  // Palpation
  palpationFindings: yup.string().optional().max(500, 'Max 500 characters'),

  // Associated Problems
  associatedProblems: yup.string().optional().max(500, 'Max 500 characters'),

  // Muscular Evaluation (placeholders for now)
  muscularEvaluation: yup.string().optional(),
  // Joint Evaluation (placeholders for now)
  jointEvaluation: yup.string().optional(),

  // Posture Evaluation
  postureFindings: yup.string().optional().max(500, 'Max 500 characters'),

  // Gait Evaluation
  gaitAnalysis: yup.string().optional().max(500, 'Max 500 characters'),

  // Special Tests
  specialTests: yup.string().optional().max(500, 'Max 500 characters'),

  // Diagnosis
  diagnosis: yup.string().required('Diagnosis is required').max(500, 'Max 500 characters'),

  // Treatment Plan
  shortTermGoals: yup.string().optional().max(500, 'Max 500 characters'),
  longTermGoals: yup.string().optional().max(500, 'Max 500 characters'),
  interventions: yup.string().optional().max(1000, 'Max 1000 characters'),
});

export const AssessmentForm = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0); // State for managing tabs

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(assessmentSchema),
    defaultValues: {
      patientId: patientId,
      // Chief Complaint
      chiefComplaintOnset: '',
      chiefComplaintWorse: '',
      chiefComplaintBetter: '',
      chiefComplaintTreatment: '',
      chiefComplaintDescription: '',
      // Pain Evaluation
      painOnset: '',
      painDuration: '',
      painLocation: '',
      painType: '',
      aggravatingFactors: '',
      relievingFactors: '',
      painScale: 0,
      painFrequency: '',
      painRadiation: '',
      painTiming: '',
      functionalLimitation: '',
      // Palpation
      palpationFindings: '',
      // Associated Problems
      associatedProblems: '',
      // Muscular Evaluation
      muscularEvaluation: '',
      // Joint Evaluation
      jointEvaluation: '',
      // Posture Evaluation
      postureFindings: '',
      // Gait Evaluation
      gaitAnalysis: '',
      // Special Tests
      specialTests: '',
      // Diagnosis
      diagnosis: '',
      // Treatment Plan
      shortTermGoals: '',
      longTermGoals: '',
      interventions: '',
    }
  });

  useEffect(() => {
    if (patientId) {
      console.log(`Loading assessment for patient ID: ${patientId}`);
      setValue('patientId', patientId);
      // In a real app, fetch existing patient data and pre-fill the form
      // e.g., const fetchedData = await fetchPatientAssessment(patientId);
      // for (const key in fetchedData) { setValue(key, fetchedData[key]); }
    } else {
      console.error("No patient ID provided for assessment.");
      navigate('/patients');
    }
  }, [patientId, setValue, navigate]);

  const onSubmit = async (data) => {
    console.log('Assessment Form Data:', data);
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert(`Assessment saved for patient ${patientId}!`);
    navigate(`/patients/${patientId}/history`);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    // Removed justifyContent, alignItems, and maxWidth from the outer Box
    <Box sx={{
      minHeight: 'calc(100vh - 64px)', // Still ensures it takes full height
      py: 4, // Vertical padding
      px: { xs: 2, sm: 4, md: 8 }, // Horizontal padding for full width, responsive
      bgcolor: 'background.default',
      width: '100%', // Ensure it takes full width
      boxSizing: 'border-box' // Include padding in width calculation
    }}>
      {/* Removed maxWidth from Paper to allow it to stretch */}
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, width: '100%' }}>
        <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ mb: 1, fontWeight: 'bold' }}>
          Patient Assessment Form
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Complete the comprehensive assessment for Patient ID: {patientId}
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={4}>

            {/* Hidden field for patientId */}
            <Controller
              name="patientId"
              control={control}
              render={({ field }) => (
                <input type="hidden" {...field} />
              )}
            />

            {/* 1. Patient Details Section (Placeholder - will display actual patient info) */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                1. Patient Details
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  Name: John Doe (Pre-filled from patient record)
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Age: 35, Gender: Male
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Contact: 123-456-7890
                </Typography>
                <Button variant="outlined" size="small" sx={{ mt: 1 }}>Edit Patient Info</Button>
              </Paper>
            </Box>

            <Divider />

            {/* 2. Chief Complaint Section */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                2. Chief Complaint
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="chiefComplaintOnset"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="When did the problem start?"
                        fullWidth
                        required
                        multiline
                        rows={1}
                        variant="outlined"
                        error={!!errors.chiefComplaintOnset}
                        helperText={errors.chiefComplaintOnset?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="chiefComplaintWorse"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="What makes the problem worse?"
                        fullWidth
                        required
                        multiline
                        rows={1}
                        variant="outlined"
                        error={!!errors.chiefComplaintWorse}
                        helperText={errors.chiefComplaintWorse?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="chiefComplaintBetter"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="What makes the problem better?"
                        fullWidth
                        required
                        multiline
                        rows={1}
                        variant="outlined"
                        error={!!errors.chiefComplaintBetter}
                        helperText={errors.chiefComplaintBetter?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="chiefComplaintTreatment"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Have you had any previous treatments for this problem?"
                        fullWidth
                        required
                        multiline
                        rows={1}
                        variant="outlined"
                        error={!!errors.chiefComplaintTreatment}
                        helperText={errors.chiefComplaintTreatment?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="chiefComplaintDescription"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Describe the Chief Complaint / Presenting Problem in detail"
                        fullWidth
                        required
                        multiline
                        rows={4}
                        variant="outlined"
                        error={!!errors.chiefComplaintDescription}
                        helperText={errors.chiefComplaintDescription?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* 3. Pain Evaluation Section */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                3. Pain Evaluation
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="painOnset"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Onset of Pain"
                        fullWidth
                        variant="outlined"
                        error={!!errors.painOnset}
                        helperText={errors.painOnset?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="painDuration"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Duration of Pain"
                        fullWidth
                        variant="outlined"
                        error={!!errors.painDuration}
                        helperText={errors.painDuration?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="painLocation"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Pain Location"
                        fullWidth
                        variant="outlined"
                        error={!!errors.painLocation}
                        helperText={errors.painLocation?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="painType"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Pain Type (e.g., sharp, dull, throbbing)"
                        fullWidth
                        variant="outlined"
                        error={!!errors.painType}
                        helperText={errors.painType?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="aggravatingFactors"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Aggravating Factors"
                        fullWidth
                        multiline
                        rows={2}
                        variant="outlined"
                        error={!!errors.aggravatingFactors}
                        helperText={errors.aggravatingFactors?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="relievingFactors"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Relieving Factors"
                        fullWidth
                        multiline
                        rows={2}
                        variant="outlined"
                        error={!!errors.relievingFactors}
                        helperText={errors.relievingFactors?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.painScale}>
                    <Typography component="legend" variant="subtitle1" sx={{ mb: 1 }}>Pain Scale (0-10)</Typography>
                    <Controller
                      name="painScale"
                      control={control}
                      render={({ field: { onChange, value, ...restField } }) => (
                        <Slider
                          {...restField}
                          value={typeof value === 'number' ? value : 0}
                          onChange={(event, newValue) => onChange(newValue)}
                          aria-labelledby="pain-scale-slider"
                          valueLabelDisplay="auto"
                          step={1}
                          marks
                          min={0}
                          max={10}
                          sx={{ mt: 2, width: '95%', ml: '2.5%' }}
                        />
                      )}
                    />
                    {errors.painScale && (
                      <Typography variant="caption" color="error">
                        {errors.painScale?.message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="painFrequency"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Frequency of Pain"
                        fullWidth
                        variant="outlined"
                        error={!!errors.painFrequency}
                        helperText={errors.painFrequency?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="painRadiation"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Radiation of Pain (e.g., Yes/No, description)"
                        fullWidth
                        multiline
                        rows={1}
                        variant="outlined"
                        error={!!errors.painRadiation}
                        helperText={errors.painRadiation?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="painTiming"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Timing of Pain (e.g., morning, night, activity-related)"
                        fullWidth
                        multiline
                        rows={1}
                        variant="outlined"
                        error={!!errors.painTiming}
                        helperText={errors.painTiming?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="functionalLimitation"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Functional Limitations due to Pain"
                        fullWidth
                        multiline
                        rows={2}
                        variant="outlined"
                        error={!!errors.functionalLimitation}
                        helperText={errors.functionalLimitation?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              {/* Image placeholder */}
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <img src="https://via.placeholder.com/300x400?text=Pain+Diagram" alt="Pain Diagram" style={{ maxWidth: '100%', height: 'auto' }} />
              </Box>
            </Box>

            <Divider />

            {/* 4. Palpation Section */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                4. Palpation
              </Typography>
              <Controller
                name="palpationFindings"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Palpation Findings"
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    error={!!errors.palpationFindings}
                    helperText={errors.palpationFindings?.message}
                  />
                )}
              />
            </Box>

            <Divider />

            {/* 5. Associated Problems Section */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                5. Associated Problems
              </Typography>
              <Controller
                name="associatedProblems"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Associated Problems / Comorbidities"
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    error={!!errors.associatedProblems}
                    helperText={errors.associatedProblems?.message}
                  />
                )}
              />
            </Box>

            <Divider />

            {/* Muscular & Joint Evaluation Tabs */}
            <Box sx={{ width: '100%' }}>
              <Tabs value={currentTab} onChange={handleTabChange} aria-label="evaluation tabs" variant="fullWidth">
                <Tab label="6. Muscular Evaluation" />
                <Tab label="7. Joint Evaluation" />
              </Tabs>
              <TabPanel value={currentTab} index={0}>
                <Typography variant="h6" gutterBottom color="primary">
                  Muscular Evaluation
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Fields for Muscle Strength, Tone, Power, Endurance, etc. will go here.
                    (e.g., MMT grades, specific muscle assessments).
                    For now, a simple text area.
                  </Typography>
                  <Controller
                    name="muscularEvaluation"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Muscular Evaluation Findings"
                        fullWidth
                        multiline
                        rows={5}
                        variant="outlined"
                        error={!!errors.muscularEvaluation}
                        helperText={errors.muscularEvaluation?.message}
                      />
                    )}
                  />
                </Paper>
              </TabPanel>
              <TabPanel value={currentTab} index={1}>
                <Typography variant="h6" gutterBottom color="primary">
                  Joint Evaluation
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Fields for Range of Motion (ROM), Joint Play, Swelling, Tenderness, etc. will go here.
                    (e.g., goniometric measurements, specific joint assessments).
                    For now, a simple text area.
                  </Typography>
                  <Controller
                    name="jointEvaluation"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Joint Evaluation Findings"
                        fullWidth
                        multiline
                        rows={5}
                        variant="outlined"
                        error={!!errors.jointEvaluation}
                        helperText={errors.jointEvaluation?.message}
                      />
                    )}
                  />
                </Paper>
              </TabPanel>
            </Box>

            <Divider />

            {/* 8. Posture Evaluation Section */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                8. Posture Evaluation
              </Typography>
              <Controller
                name="postureFindings"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Posture Findings"
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    error={!!errors.postureFindings}
                    helperText={errors.postureFindings?.message}
                  />
                )}
              />
            </Box>

            <Divider />

            {/* 9. Gait Evaluation Section */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                9. Gait Evaluation
              </Typography>
              <Controller
                name="gaitAnalysis"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Gait Analysis"
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    error={!!errors.gaitAnalysis}
                    helperText={errors.gaitAnalysis?.message}
                  />
                )}
              />
            </Box>

            <Divider />

            {/* 10. Special Tests Section */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                10. Special Tests
              </Typography>
              <Controller
                name="specialTests"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Special Tests Performed & Results"
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    error={!!errors.specialTests}
                    helperText={errors.specialTests?.message}
                  />
                )}
              />
            </Box>

            <Divider />

            {/* 11. Diagnosis Section */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                11. Diagnosis
              </Typography>
              <Controller
                name="diagnosis"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Diagnosis"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    required
                    error={!!errors.diagnosis}
                    helperText={errors.diagnosis?.message}
                  />
                )}
              />
            </Box>

            <Divider />

            {/* 12. Treatment Plan Section */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                12. Treatment Plan
              </Typography>
              <Controller
                name="shortTermGoals"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Short Term Goals"
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    error={!!errors.shortTermGoals}
                    helperText={errors.shortTermGoals?.message}
                  />
                )}
              />
              <Controller
                name="longTermGoals"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Long Term Goals"
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    sx={{ mt: 2 }}
                    error={!!errors.longTermGoals}
                    helperText={errors.longTermGoals?.message}
                  />
                )}
              />
              <Controller
                name="interventions"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Interventions / Modalities"
                    fullWidth
                    multiline
                    rows={5}
                    variant="outlined"
                    sx={{ mt: 2 }}
                    error={!!errors.interventions}
                    helperText={errors.interventions?.message}
                  />
                )}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 4 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Save Assessment'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};
