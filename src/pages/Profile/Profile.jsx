import React, { useState, useContext } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Divider,
  Card,
  CardContent,
  Stack,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Edit,
  Save,
  Cancel,
  Security,
  Badge,
  Assignment,
  CheckCircle
} from '@mui/icons-material';
import Navbar from '../../components/common/Navbar';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isEditing, setIsEditing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    badgeNumber: user?.badgeNumber || '',
    department: user?.department || '',
    rank: user?.rank || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      badgeNumber: user?.badgeNumber || '',
      department: user?.department || '',
      rank: user?.rank || ''
    });
    setIsEditing(false);
  };

  const handleSave = () => {
    // In a real app, this would make an API call to update the profile
    console.log('Saving profile:', formData);
    setSnackbarMessage('Profile updated successfully!');
    setSnackbarOpen(true);
    setIsEditing(false);
    // Update user in context/localStorage would happen here
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const isPolice = user?.role === 'police';

  return (
    <>
      <Navbar title={isPolice ? "Police Portal" : "Citizen Portal"} />
      <Box sx={{ 
        bgcolor: 'grey.50',
        minHeight: '100vh',
        pb: 4
      }}>
        <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
          {/* Header */}
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 2, md: 4 },
              mb: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                  sx={{
                    width: { xs: 80, md: 100 },
                    height: { xs: 80, md: 100 },
                    bgcolor: 'rgba(255,255,255,0.2)',
                    fontSize: { xs: 32, md: 40 },
                    fontWeight: 'bold',
                    border: '4px solid white'
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                <Box>
                  <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" gutterBottom>
                    {user?.name || 'User'}
                  </Typography>
                  <Chip 
                    label={isPolice ? 'Police Officer' : 'Citizen'}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                  {isPolice && formData.badgeNumber && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Badge: {formData.badgeNumber}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={isEditing ? <Save /> : <Edit />}
                onClick={isEditing ? handleSave : handleEdit}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'grey.100' }
                }}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </Box>
          </Paper>

          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="600">
                    Personal Information
                  </Typography>
                  {isEditing && (
                    <Button
                      size="small"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      color="error"
                    >
                      Cancel
                    </Button>
                  )}
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                            <Person color="action" />
                          </Box>
                        )
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                            <Email color="action" />
                          </Box>
                        )
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter phone number"
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                            <Phone color="action" />
                          </Box>
                        )
                      }}
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      multiline
                      rows={3}
                      placeholder="Enter your address"
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, mt: 1, display: 'flex', alignItems: 'flex-start' }}>
                            <LocationOn color="action" />
                          </Box>
                        )
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Professional Information (Police Only) */}
            {isPolice && (
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Professional Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Badge Number"
                      name="badgeNumber"
                      value={formData.badgeNumber}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                            <Badge color="action" />
                          </Box>
                        )
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="e.g., Cyber Crime Unit"
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                            <Security color="action" />
                          </Box>
                        )
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Rank"
                      name="rank"
                      value={formData.rank}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="e.g., Inspector, Sub-Inspector"
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                            <Assignment color="action" />
                          </Box>
                        )
                      }}
                    />
                  </Stack>
                </Paper>
              </Grid>
            )}

            {/* Account Statistics */}
            <Grid size={{ xs: 12, md: isPolice ? 12 : 4 }}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Account Statistics
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  {isPolice ? (
                    <>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Card variant="outlined">
                          <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="h4" color="primary" fontWeight="bold">
                              0
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total FIRs Managed
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Card variant="outlined">
                          <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="h4" color="success.main" fontWeight="bold">
                              0
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Cases Resolved
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Card variant="outlined">
                          <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="h4" color="warning.main" fontWeight="bold">
                              0
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Pending Cases
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid size={12}>
                        <Card variant="outlined">
                          <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="h4" color="primary" fontWeight="bold">
                              0
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              FIRs Filed
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid size={12}>
                        <Card variant="outlined">
                          <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="h4" color="success.main" fontWeight="bold">
                              0
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Cases Resolved
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ width: '100%' }}
          icon={<CheckCircle />}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Profile;





