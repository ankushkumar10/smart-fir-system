import React, { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper, 
  Link,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { PersonAddOutlined } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required'),
    email: Yup.string()
      .email('Enter a valid email')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password should be at least 6 characters'),
    confirmPassword: Yup.string()
      .required('Confirm your password')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    role: Yup.string()
      .required('Please select a role')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'citizen' // Default role
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      
      try {
        const user = await register({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role
        });
        navigate(user.role === 'police' ? '/police' : '/citizen');
      } catch (err) {
        setError('Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ 
          width: 40, 
          height: 40, 
          borderRadius: '50%', 
          bgcolor: 'primary.main', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          mb: 2 
        }}>
          <PersonAddOutlined sx={{ color: 'white' }} />
        </Box>
        
        <Typography component="h1" variant="h5">
          Create an Account
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            fullWidth
            id="name"
            name="name"
            label="Full Name"
            autoComplete="name"
            autoFocus
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          
          <TextField
            margin="normal"
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          
          <TextField
            margin="normal"
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          
          <TextField
            margin="normal"
            fullWidth
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />
          
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Register as:</FormLabel>
            <RadioGroup
              row
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
            >
              <FormControlLabel value="citizen" control={<Radio />} label="Citizen" />
              <FormControlLabel value="police" control={<Radio />} label="Police Officer" />
            </RadioGroup>
          </FormControl>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link component={RouterLink} to="/" variant="body2">
              Back to home
            </Link>
            <Link component={RouterLink} to="/login" variant="body2">
              {"Already have an account? Sign In"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;