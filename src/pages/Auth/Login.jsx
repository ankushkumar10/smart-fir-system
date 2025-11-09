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
  CircularProgress
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Enter a valid email')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      
      try {
        const user = await login(values.email, values.password);
        navigate(user.role === 'police' ? '/police' : '/citizen');
      } catch (err) {
        setError('Invalid email or password');
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
          <LockOutlined sx={{ color: 'white' }} />
        </Box>
        
        <Typography component="h1" variant="h5">
          Sign in
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
            id="email"
            name="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
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
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link component={RouterLink} to="/" variant="body2">
              Back to home
            </Link>
            <Link component={RouterLink} to="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;