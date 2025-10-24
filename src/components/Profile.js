import React, {useEffect, useRef} from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Avatar,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Divider,
    CardActions,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {showToast} from "../common/util";
import {apiRequest} from "../common/api";
const endpoint = process.env.REACT_APP_API_URL;


const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    phone: yup.string().required('Phone is required'),
    address: yup.string().required('Address is required'),
    slogan: yup.string(),
    sloganDescription: yup.string(),
    facebook: yup.string().url('Enter a valid URL'),
    instagram: yup.string().url('Enter a valid URL'),
    twitter: yup.string().url('Enter a valid URL'),
    logo: yup.string(),
});

const defaultValues = {
    name: '',
    email: '',
    phone: '',
    logo: '',
    slogan: '',
    sloganDescription: '',
    address: '',
    facebook: '',
    instagram: '',
    twitter: '',
};

export const Profile = () => {
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema),
    });

    const logoUrl = watch('logo');
    const fileInputRef = useRef();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await apiRequest(`${endpoint}/me/profile`, {
                    method: 'GET',
                    auth: true, // Add auth token to header
                });
                reset(data); // Populate form fields
                if (data.logo) setValue('logo', data.logo); // Set logo preview if available
            } catch (error) {
                showToast('Error loading profile', 'error');
            }
        };
        fetchProfile();
    }, []);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue('logo', URL.createObjectURL(file));
        }
    };

    const handleClear = () => {
        reset(defaultValues);
        if (logoUrl) {
            URL.revokeObjectURL(logoUrl);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onSubmit = async (data) => {
        try {
            const result = await apiRequest(`${endpoint}/me/profile`, {
                method: 'POST',
                body: data,
                auth: true, // Add auth token to header
            });
            showToast("profile updated successfully", 'info');
        } catch (error) {
            showToast(error.message, 'error');
            console.error('Error updating profile:', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', my: 4 }}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Card elevation={3}>
                    <CardHeader
                        title="Profile Settings"
                        subheader="Update your company information and branding"
                    />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <Avatar src={logoUrl} sx={{ width: 100, height: 100 }} />
                                <Button variant="outlined" component="label">
                                    Upload Logo
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        ref={fileInputRef}
                                    />
                                </Button>
                            </Grid>
                            <Grid item xs={12} size={12}>
                                <Typography variant="h6" gutterBottom>
                                    Basic Information
                                </Typography>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} size={12}>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Company Name"
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                            required
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} size={6}>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Email Address"
                                            type="email"
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                            required
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} size={6}>
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Phone Number"
                                            type="tel"
                                            error={!!errors.phone}
                                            helperText={errors.phone?.message}
                                            required
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} size={12}>
                                <Controller
                                    name="address"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Address"
                                            error={!!errors.address}
                                            helperText={errors.address?.message}
                                            required
                                            multiline
                                            rows={3}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }} size={12}>
                                <Typography variant="h6" gutterBottom>
                                    Branding
                                </Typography>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} size={12}>
                                <Controller
                                    name="slogan"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Slogan"
                                            error={!!errors.slogan}
                                            helperText={errors.slogan?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} size={12}>
                                <Controller
                                    name="sloganDescription"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Slogan Description"
                                            error={!!errors.sloganDescription}
                                            helperText={errors.sloganDescription?.message}
                                            multiline
                                            rows={3}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }} size={12}>
                                <Typography variant="h6" gutterBottom>
                                    Social Media Links
                                </Typography>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} md={6} size={12}>
                                <Controller
                                    name="facebook"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Facebook URL"
                                            error={!!errors.facebook}
                                            helperText={errors.facebook?.message}
                                            placeholder="https://facebook.com/yourpage"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} size={12}>
                                <Controller
                                    name="instagram"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Instagram URL"
                                            error={!!errors.instagram}
                                            helperText={errors.instagram?.message}
                                            placeholder="https://instagram.com/yourprofile"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} size={12}>
                                <Controller
                                    name="twitter"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Twitter URL"
                                            error={!!errors.twitter}
                                            helperText={errors.twitter?.message}
                                            placeholder="https://twitter.com/yourhandle"
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2, gap: 2 }}>
                        <Button type="button" variant="outlined" onClick={handleClear}>
                            Clear
                        </Button>
                        <Button type="submit" variant="contained">
                            Save Changes
                        </Button>
                    </CardActions>
                </Card>
            </form>
        </Box>
    );
};