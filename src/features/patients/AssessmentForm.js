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
import {showToast} from "../../common/util";
import {apiRequest} from "../../common/api";
import {MuscularEvaluationMMT} from "./components/MuscularEvaluationMMT";
import {JointEvaluationComponent} from "./components/JointEvaluationComponent";

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

const endpoint = process.env.REACT_APP_API_URL;
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

  const [patientDetails, setPatientDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      setLoading(true);
      try {
        const details = await apiRequest(`${endpoint}/patients/${patientId}`, {
          method: 'GET',
          auth: true, // set to true if endpoint requires auth
        });
        setPatientDetails(details);
      } catch (error) {
        showToast(error.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientDetails();
    }
  }, [patientId]);

  const onSubmit = async (data) => {
    try {
      const newPatient = await apiRequest(`${endpoint}/assessment/${patientDetails.id}/assessments`, {
        method: 'POST',
        body: data,
        auth: true,
      });
      showToast(`Patient assessment ${newPatient.name} added successfully.`, 'info');
      navigate(`/patients/${patientDetails.id}/assessment`);
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const MAP = {
    name: "my-body-map",
    areas: [
      { name: "head", shape: "poly", coords: [180,50,220,50,220,100,180,100], preFillColor: "rgba(200,200,200,0.5)", fillColor: "rgba(0,123,255,0.7)", data: { part: "Head" } },
      { name: "left-arm", shape: "rect", coords: [100,150,120,250], preFillColor: "rgba(200,200,200,0.5)", fillColor: "rgba(0,123,255,0.7)", data: { part: "Left Arm" } },
      { name: "right-arm", shape: "rect", coords: [280,150,300,250], preFillColor: "rgba(200,200,200,0.5)", fillColor: "rgba(0,123,255,0.7)", data: { part: "Right Arm" } },
      { name: "torso", shape: "poly", coords: [150,100,250,100,250,300,150,300], preFillColor: "rgba(200,200,200,0.5)", fillColor: "rgba(0,123,255,0.7)", data: { part: "Torso" } },
      // Add more areas for other body parts
    ]
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
          Complete the comprehensive assessment for Patient ID: {patientDetails?.contactNo}
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
                  Name: {patientDetails?.name?.toUpperCase()}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Age: {patientDetails?.age}, Gender: {patientDetails?.gender?.toUpperCase()}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Contact: {patientDetails?.contactNo}
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
                <Grid container spacing={2} mb={2}>
                  <Grid item size={6} xs={6} sm={6}  >
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
                  <Grid item  size={6} xs={6} sm={6} >
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
                </Grid>
                <Grid  container spacing={2} mb={2}>
                  <Grid item size={6} xs={6} sm={6}  >
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
                  <Grid item size={6} xs={6} sm={6}  >
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
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} size={12}>
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
              <Grid container spacing={2} mb={2}>
                <Grid item size={8}>
                  <Grid container spacing={2} mb={2}>
                    <Grid item size={6} xs={12} sm={12}>
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
                    <Grid item size={6} xs={12} sm={6}>
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
                  </Grid>
                  <Grid container spacing={2} mb={2}>
                    <Grid item  size={6} xs={12} sm={6}>
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
                    <Grid item size={6} xs={12} sm={6}>
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
                  </Grid>
                  <Grid container spacing={2} mb={2}>
                    <Grid item size={6} xs={12} sm={6}>
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
                    <Grid item size={6} xs={12} sm={6}>
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
                  </Grid>
                  <Grid container spacing={2} mb={2}>
                    <Grid item size={6} xs={12} sm={6}>
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
                    <Grid item size={6} xs={12} sm={6}>
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
                  </Grid>
                  <Grid container spacing={2} mb={2}>
                    <Grid item size={6} xs={12} sm={6}>
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
                    <Grid item  size={6} xs={12} sm={6}>
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
                  </Grid>
                  <Grid container spacing={2} mb={2}>
                    <Grid item size={6} xs={ 12} sm={6}>
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
                </Grid>
                <Grid item size={4}>
                  {/*<Box sx={{mt: 3, display: 'flex', justifyContent: 'center'}}>*/}
                  {/*  <img*/}
                  {/*      src="https://www.researchgate.net/profile/Justin-Carpentier/publication/331063965/figure/fig2/AS:725802211610628@1550056140430/Unveiled-human-body-Illustration-of-the-main-skeletal-muscles-constitutive-of-the-human.ppm"*/}
                  {/*      useMap="#image-map"/>*/}

                  {/*  <map name="image-map">*/}
                  {/*    <area target="_self" alt="sholder" title="sholder" coords="123,159,169,198" shape="rect" />*/}
                  {/*    <area target="_self" alt="arm" title="arm" href="" coords="159,294,111,205" shape="rect"/>*/}
                  {/*  </map>*/}
                  {/*</Box>*/}
                </Grid>
              </Grid>
            </Box>

            <Divider/>

            {/* 4. Palpation Section */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                4. Palpation
              </Typography>
              <Controller
                  name="palpationFindings"
                  control={control}
                  render={({field}) => (
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
                <MuscularEvaluationMMT />
              </TabPanel>
              <TabPanel value={currentTab} index={1}>
                <JointEvaluationComponent control={control} errors={errors} />
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
