import React, { useState } from 'react';
import {
  AccountCircle,
  Visibility,
  VisibilityOff,
  PersonOutline,
  LockOutlined,
  Business,
  Email,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  Link,
  OutlinedInput,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../common/api';
import { showToast } from '../../common/util';
import { startSessionTimer } from '../../common/sessionManager';

export const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      organizationName: '',
      organizationEmail: '',
      adminName: '',
      adminEmail: '',
      adminPassword: '',
      confirmPassword: '',
    },
  });
  const navigate = useNavigate();
  const adminPassword = watch('adminPassword');

  const validatePasswordStrength = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password) || 'Password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number';
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError(null);
    try {
      const response = await apiRequest(
        `${process.env.REACT_APP_API_URL}/organizations/signup`,
        {
          method: 'POST',
          body: {
            organizationName: data.organizationName,
            organizationEmail: data.organizationEmail,
            adminName: data.adminName,
            adminEmail: data.adminEmail,
            adminPassword: data.adminPassword,
          },
        }
      );

      // Store the token
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify({
        id: response.data.adminEmail,
        name: response.data.adminName,
        email: response.data.adminEmail,
        organizationId: response.data.organizationId,
        organizationName: response.data.organizationName,
      }));

      // Start session timer
      startSessionTimer(response.data.token);

      showToast('Organization created successfully! Welcome!', 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      
      // Handle specific error codes from backend
      if (error.code === 'ORG_EXISTS') {
        setServerError('Organization email already exists. Please use a different email.');
      } else if (error.code === 'EMAIL_EXISTS') {
        setServerError('This email is already registered in the system. Please use a different email or sign in.');
      } else {
        setServerError(error.message || 'Signup failed. Please try again.');
      }
      
      showToast(serverError || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0b1b1a',
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url('/images/loging.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          width: { xs: 'min(92vw, 520px)', md: 820 },
          p: { xs: 3.5, sm: 4.5 },
          borderRadius: 3,
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'rgba(34, 120, 170, 0.55)',
          border: '2px solid rgba(255,255,255,0.6)',
          boxShadow: '0 22px 60px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(6px)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* top avatar */}
        <Box
          sx={{
            position: 'absolute',
            top: -34,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 74,
            height: 74,
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.35)',
            border: '2px solid rgba(255,255,255,0.75)',
            display: 'grid',
            placeItems: 'center',
          }}
          aria-hidden="true"
        >
          <AccountCircle sx={{ fontSize: 54, color: 'rgba(255,255,255,0.95)' }} />
        </Box>

        <Typography
          sx={{
            textAlign: 'center',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.95)',
            mb: { xs: 2.5, md: 3 },
            mt: 1.5,
          }}
          variant="h5"
        >
          Create Organization
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}

          {/* Organization Details Section */}
          <Typography
            sx={{
              fontWeight: 600,
              color: 'rgba(255,255,255,0.9)',
              mb: 2,
              fontSize: 14,
              textTransform: 'uppercase',
            }}
          >
            Organization Details
          </Typography>

          <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
            {/* Organization Name */}
            <OutlinedInput
              fullWidth
              placeholder="Organization Name"
              startAdornment={
                <InputAdornment position="start">
                  <Business sx={{ color: 'rgba(255,255,255,0.85)' }} />
                </InputAdornment>
              }
              sx={{
                color: 'rgba(255,255,255,0.95)',
                backgroundColor: 'rgba(255,255,255,0.06)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.55)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.75)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.9)',
                },
                '& input::placeholder': { color: 'rgba(255,255,255,0.75)', opacity: 1 },
              }}
              {...register('organizationName', {
                required: 'Organization name is required',
                minLength: { value: 3, message: 'Organization name must be at least 3 characters' },
              })}
            />
            {errors.organizationName && (
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'rgba(255, 230, 230, 0.95)' }}>
                {errors.organizationName.message}
              </Typography>
            )}

            {/* Organization Email */}
            <OutlinedInput
              fullWidth
              type="email"
              placeholder="Organization Email"
              startAdornment={
                <InputAdornment position="start">
                  <Email sx={{ color: 'rgba(255,255,255,0.85)' }} />
                </InputAdornment>
              }
              sx={{
                color: 'rgba(255,255,255,0.95)',
                backgroundColor: 'rgba(255,255,255,0.06)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.55)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.75)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.9)',
                },
                '& input::placeholder': { color: 'rgba(255,255,255,0.75)', opacity: 1 },
              }}
              {...register('organizationEmail', {
                required: 'Organization email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              })}
            />
            {errors.organizationEmail && (
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'rgba(255, 230, 230, 0.95)' }}>
                {errors.organizationEmail.message}
              </Typography>
            )}
          </Box>

          {/* Admin User Section */}
          <Typography
            sx={{
              fontWeight: 600,
              color: 'rgba(255,255,255,0.9)',
              mb: 2,
              fontSize: 14,
              textTransform: 'uppercase',
            }}
          >
            Admin Account
          </Typography>

          <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
            {/* Admin Name */}
            <OutlinedInput
              fullWidth
              placeholder="Admin Full Name"
              startAdornment={
                <InputAdornment position="start">
                  <PersonOutline sx={{ color: 'rgba(255,255,255,0.85)' }} />
                </InputAdornment>
              }
              sx={{
                color: 'rgba(255,255,255,0.95)',
                backgroundColor: 'rgba(255,255,255,0.06)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.55)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.75)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.9)',
                },
                '& input::placeholder': { color: 'rgba(255,255,255,0.75)', opacity: 1 },
              }}
              {...register('adminName', {
                required: 'Admin name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
            />
            {errors.adminName && (
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'rgba(255, 230, 230, 0.95)' }}>
                {errors.adminName.message}
              </Typography>
            )}

            {/* Admin Email */}
            <OutlinedInput
              fullWidth
              type="email"
              placeholder="Admin Email"
              startAdornment={
                <InputAdornment position="start">
                  <Email sx={{ color: 'rgba(255,255,255,0.85)' }} />
                </InputAdornment>
              }
              sx={{
                color: 'rgba(255,255,255,0.95)',
                backgroundColor: 'rgba(255,255,255,0.06)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.55)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.75)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.9)',
                },
                '& input::placeholder': { color: 'rgba(255,255,255,0.75)', opacity: 1 },
              }}
              {...register('adminEmail', {
                required: 'Admin email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              })}
            />
            {errors.adminEmail && (
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'rgba(255, 230, 230, 0.95)' }}>
                {errors.adminEmail.message}
              </Typography>
            )}

            {/* Password */}
            <OutlinedInput
              fullWidth
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              startAdornment={
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: 'rgba(255,255,255,0.85)' }} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((s) => !s)}
                    sx={{ color: 'rgba(255,255,255,0.85)' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              sx={{
                color: 'rgba(255,255,255,0.95)',
                backgroundColor: 'rgba(255,255,255,0.06)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.55)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.75)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.9)',
                },
                '& input::placeholder': { color: 'rgba(255,255,255,0.75)', opacity: 1 },
              }}
              {...register('adminPassword', {
                required: 'Password is required',
                validate: validatePasswordStrength,
              })}
            />
            {errors.adminPassword && (
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'rgba(255, 230, 230, 0.95)' }}>
                {errors.adminPassword.message}
              </Typography>
            )}
            <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
              Password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number
            </Typography>

            {/* Confirm Password */}
            <OutlinedInput
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              startAdornment={
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: 'rgba(255,255,255,0.85)' }} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    aria-label="toggle password visibility"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    sx={{ color: 'rgba(255,255,255,0.85)' }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              sx={{
                color: 'rgba(255,255,255,0.95)',
                backgroundColor: 'rgba(255,255,255,0.06)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.55)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.75)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.9)',
                },
                '& input::placeholder': { color: 'rgba(255,255,255,0.75)', opacity: 1 },
              }}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === adminPassword || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'rgba(255, 230, 230, 0.95)' }}>
                {errors.confirmPassword.message}
              </Typography>
            )}
          </Box>

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button
              type="button"
              disableElevation
              onClick={() => navigate('/login')}
              disabled={loading}
              sx={{
                minWidth: 120,
                borderRadius: 1.5,
                fontWeight: 700,
                textTransform: 'none',
                color: 'rgba(255,255,255,0.95)',
                backgroundColor: 'rgba(255,255,255,0.22)',
                border: '1px solid rgba(255,255,255,0.25)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.28)' },
              }}
            >
              Back to Login
            </Button>
            <Button
              type="submit"
              disableElevation
              disabled={loading}
              sx={{
                minWidth: 120,
                borderRadius: 1.5,
                fontWeight: 700,
                textTransform: 'none',
                color: 'rgba(255,255,255,0.95)',
                backgroundColor: 'rgba(0,0,0,0.55)',
                border: '1px solid rgba(255,255,255,0.25)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.65)' },
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {loading && <CircularProgress size={20} sx={{ color: 'inherit' }} />}
              {loading ? 'Creating...' : 'Create Organization'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
