import React, { useState } from 'react';
import {
  AccountCircle,
  Fingerprint,
  LockOutlined,
  PersonOutline,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  Link,
  OutlinedInput,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {apiRequest} from "../../common/api";
import {showToast} from "../../common/util"; // Import useNavigate

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate(); // Initialize useNavigate

    const onSubmit = async (data) => {
      try {
        const response = await apiRequest(`${process.env.REACT_APP_API_URL}/user/login`, {
          method: 'POST',
          body: data,
        });
        localStorage.setItem('authToken', response.token);
        showToast("Logged in successfully", 'info');
        navigate('/dashboard');
      } catch (error) {
        console.error('Login failed:', error);
        showToast("Logged in Failed", 'error');
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
          width: { xs: 'min(92vw, 420px)', md: 720 },
          p: { xs: 3.5, sm: 4.5 },
          borderRadius: 3,
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'rgba(34, 120, 170, 0.55)',
          border: '2px solid rgba(255,255,255,0.6)',
          boxShadow: '0 22px 60px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(6px)',
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
          User Login
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '240px minmax(0, 1fr)' },
            gap: { xs: 3, md: 4 },
            alignItems: 'center',
            justifyItems: { xs: 'stretch', md: 'center' },
          }}
        >
          {/* fingerprint block */}
          <Box sx={{ display: 'grid', justifyItems: 'center' }}>
            <Box
              sx={{
                width: 170,
                height: 170,
                borderRadius: 2.5,
                backgroundColor: 'rgba(0,0,0,0.18)',
                border: '1px solid rgba(255,255,255,0.45)',
                display: 'grid',
                placeItems: 'center',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 14,
                  borderRadius: 2,
                  border: '2px solid rgba(255,255,255,0.35)',
                  clipPath:
                    'polygon(0% 0%, 22% 0%, 22% 8%, 8% 8%, 8% 22%, 0% 22%, 0% 0%, 100% 0%, 100% 22%, 92% 22%, 92% 8%, 78% 8%, 78% 0%, 100% 0%, 100% 100%, 78% 100%, 78% 92%, 92% 92%, 92% 78%, 100% 78%, 100% 100%, 0% 100%, 0% 78%, 8% 78%, 8% 92%, 22% 92%, 22% 100%, 0% 100%)',
                }}
              />

              <Fingerprint
                sx={{
                  fontSize: 86,
                  color: 'rgba(190, 170, 255, 0.95)',
                  filter: 'drop-shadow(0 0 18px rgba(170, 120, 255, 0.9))',
                }}
              />
            </Box>
            <Typography sx={{ mt: 1.2, fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>
              {/* Touch the fingerprint sensor */}
            </Typography>
          </Box>

          {/* form */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ minWidth: 0, width: '100%', maxWidth: 480, justifySelf: 'center' }}
          >
            <Box sx={{ display: 'grid', gap: 2.2 }}>
              <OutlinedInput
                fullWidth
                autoFocus
                autoComplete="email"
                placeholder="Username or Email"
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
                {...register('email', { required: 'Email is required' })}
              />

              <OutlinedInput
                fullWidth
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="**********"
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
                {...register('password', { required: 'Password is required' })}
              />

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* <Checkbox
                    size="small"
                    sx={{
                      p: 0,
                      color: 'rgba(255,255,255,0.85)',
                      '&.Mui-checked': { color: 'rgba(255,255,255,0.9)' },
                    }}
                  /> */}
                  <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>
                    {/* Keep me logged in for 7 days */}
                  </Typography>
                </Box>
                <Link
                  component="button"
                  type="button"
                  underline="hover"
                  sx={{ fontSize: 12, color: 'rgba(255,255,255,0.9)' }}
                >
                  {/* Forget password? */}
                </Link>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 0.5 }}>
                <Button
                  type="submit"
                  disableElevation
                  sx={{
                    minWidth: 120,
                    borderRadius: 1.5,
                    fontWeight: 700,
                    textTransform: 'none',
                    color: 'rgba(255,255,255,0.95)',
                    backgroundColor: 'rgba(0,0,0,0.55)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.65)' },
                  }}
                >
                  Log in
                </Button>
                <Button
                  type="button"
                  disableElevation
                  onClick={() => navigate('/')}
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
                  Cancel
                </Button>
              </Box>

              {(errors.email || errors.password) && (
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'rgba(255, 230, 230, 0.95)' }}>
                  {errors.email?.message || errors.password?.message}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
    );
  };
