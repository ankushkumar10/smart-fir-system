import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Paper, 
  AppBar, 
  Toolbar 
} from '@mui/material';
import { Report, Search, Security } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Smart FIR System
          </Typography>
          {isAuthenticated ? (
            <>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to={user.role === 'police' ? '/police' : '/citizen'}
              >
                Dashboard
              </Button>
              <Button color="inherit" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">Login</Button>
              <Button color="inherit" component={RouterLink} to="/register">Register</Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8, textAlign: 'center' }}>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            AI-Powered Smart FIR & Crime Analytics
          </Typography>
          <Typography variant="h5" component="div" paragraph>
            File complaints, track status, and help make communities safer.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large" 
            component={RouterLink} 
            to={isAuthenticated ? (user.role === 'citizen' ? '/citizen/file-fir' : '/police') : '/register'}
            sx={{ mt: 2 }}
          >
            {isAuthenticated 
              ? (user.role === 'citizen' ? 'File New FIR' : 'Go to Police Dashboard') 
              : 'Get Started'}
          </Button>
        </Container>
      </Box>

      <Container sx={{ my: 8}}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          How It Works
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', width: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Report sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                File FIR Online
              </Typography>
              <Typography align="center">
                Submit your complaint through our structured form with auto-location detection and AI-powered categorization.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', width: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Search sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Track Status
              </Typography>
              <Typography align="center">
                Get real-time updates on your complaint status through notifications and our tracking system.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', width: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Security sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Enhanced Police Response
              </Typography>
              <Typography align="center">
                Police officials can efficiently manage cases with advanced filtering, search, and analytics.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Box component="footer" sx={{ bgcolor: 'grey.200', p: 6 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} AI-Powered Smart FIR & Crime Analytics System
        </Typography>
      </Box>
    </>
  );
};

export default Home;