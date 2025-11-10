// src/features/patients/NewPatientForm.jsx
import React from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Paper,
  Divider,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ToastContainer, toast } from 'react-toastify';
import {showToast} from "../../common/util";
import {apiRequest} from "../../common/api";

const endpoint = process.env.REACT_APP_API_URL;

// Define the validation schema using Yup (unchanged)
const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  name: yup.string().required('Patient Name is required').min(2, 'Name must be at least 2 characters'),
  date: yup.date().required('Date is required').typeError('Invalid date format'),
  age: yup.number()
    .required('Patient age is required')
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(0, 'Age cannot be negative')
    .max(120, 'Age seems too high')
    .typeError('Age must be a number'),
  gender: yup.string().required('Gender is required'),
  contactNo: yup.string()
    .required('Contact Number is required')
    .matches(/^[0-9]{10}$/, 'Contact Number must be 10 digits'),
  referredBy: yup.string().optional(),
  address: yup.string().optional(),
  occupation: yup.string().optional(),
});

const Item = styled(Paper)(({ theme }) => ({
  paddingTop: '10px'
}));

export const NewPatientForm = () => {
  const [isDisabled, setDisabled] = React.useState(false);
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      name: '',
      date: null,
      age: null,
      gender: '',
      contactNo: '',
      referredBy: '',
      address: '',
      occupation: '',
    }
  });

  const onSubmit = async (data) => {
    setDisabled(true);
    console.log('New Patient Data (validated):', data);
    let newPatientId = '';
    try {
      const newPatient = await apiRequest(`${endpoint}/patients`, {
        method: 'POST',
        body: data,
        auth: true, // set to true if endpoint requires auth
      });
      newPatientId = newPatient.id;
      showToast(`Patient ${newPatient.name} registered successfully.`, 'info');
      navigate(`/patients/${newPatientId}/assessment`);
    } catch (error) {
      showToast(error.message, 'error');
      setDisabled(false);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: 'calc(100vh - 64px)',
      py: 4,
      bgcolor: 'background.default'
    }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, maxWidth: 800, width: '100%' }}>
        <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ mb: 1, fontWeight: 'bold' }}>
          New Patient Registration
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Please fill out the patient's demographic information.
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={4}>
              <Typography variant="h6" gutterBottom>
                Personal Details
              </Typography>
                <Grid container spacing={1}>
                  <Grid size={2} item xs={12} sm={4}>
                    <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Title"
                                fullWidth
                                required
                                error={!!errors.title}
                                helperText={errors.title?.message}
                                variant="outlined"
                                SelectProps={{ native: true }}
                            >
                              <option value=""></option>
                              <option value="Mr.">Mr.</option>
                              <option value="Mrs.">Mrs.</option>
                              <option value="Miss">Miss</option>
                              <option value="Ms.">Ms.</option>
                              <option value="Mx.">Mx.</option>
                            </TextField>
                        )}
                    />
                  </Grid>
                  <Grid size={10} xs={12} sm={8} >
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Patient Name"
                          fullWidth
                          required
                          error={!!errors.name}
                          helperText={errors.name?.message}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid size={8} xs={12} sm={6}>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          label="Registration Date"
                          inputFormat="dd/MM/yyyy"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              required
                              error={!!errors.date}
                              helperText={errors.date?.message}
                              variant="outlined"
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={4} xs={12} sm={6}>
                    <Controller
                      name="age"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Age"
                          type="number"
                          fullWidth
                          error={!!errors.age}
                          helperText={errors.age?.message}
                          inputProps={{ min: 0, max: 120 }}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <FormControl component="fieldset" fullWidth error={!!errors.gender}>
                    <FormLabel component="legend" sx={{ mb: 1 }}>Gender *</FormLabel>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup row {...field}>
                          <FormControlLabel value="male" control={<Radio />} label="Male" />
                          <FormControlLabel value="female" control={<Radio />} label="Female" />
                          <FormControlLabel value="other" control={<Radio />} label="Other" />
                        </RadioGroup>
                      )}
                    />
                    {errors.gender && (
                      <Typography color="error" variant="caption">
                        {errors.gender?.message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom>
                Contact & Background
              </Typography>
                    <Grid>
                        <Grid item xs={12}>
                          <Controller
                            name="contactNo"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Contact Number"
                                fullWidth
                                required
                                error={!!errors.contactNo}
                                helperText={errors.contactNo?.message}
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid>
                    <br/>
              <Grid>
                <Grid item xs={12}>
                  <Controller
                    name="referredBy"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Referred By"
                        fullWidth
                        error={!!errors.referredBy}
                        helperText={errors.referredBy?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                </Grid>
                <br/>

                {/* Address - Full width */}
                <Grid item xs={12}>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Address"
                        fullWidth
                        multiline
                        rows={3}
                        error={!!errors.address}
                        helperText={errors.address?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <br/>

                {/* Occupation - Full width */}
                <Grid item xs={12}>
                  <Controller
                    name="occupation"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Occupation"
                        fullWidth
                        error={!!errors.occupation}
                        helperText={errors.occupation?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
            {console.log(errors)}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 4 }}
              disabled={isDisabled}
            >
              Register Patient & Start Assessment
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};
