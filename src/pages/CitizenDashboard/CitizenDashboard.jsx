import React, { useContext, useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container, Grid, Paper, Typography, Box, Button, Card, CardContent, 
  CardActions, Divider, Chip, List, ListItem, ListItemText, ListItemAvatar, 
  Avatar, useTheme, useMediaQuery, Stack, Fade, IconButton, Tooltip, LinearProgress,
  alpha, Skeleton
} from '@mui/material';
import {
  ReportProblem, History, Notifications, AssignmentTurnedIn, Schedule,
  ThumbDown, KeyboardArrowRight, Dashboard, MoreVert, Refresh,
  LocationOn, Category, NotificationsActive, AccessTime, PriorityHigh,
  Phone, Email, Person, Help
} from '@mui/icons-material';
import Navbar from '../../components/common/Navbar';
import { AuthContext } from '../../context/AuthContext';

const CitizenDashboard = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([
    'Your FIR #FIR00123 status has been updated to "Under Investigation"',
    'Officer John Doe has been assigned to your case',
    'Your FIR #FIR00122 has been resolved'
  ]);
  const [recentFIRs, setRecentFIRs] = useState([]);

  // Simulating data loading
  useEffect(() => {
    // Simulate API call to fetch data
    const timer = setTimeout(() => {
      setRecentFIRs([
        {
          id: 'FIR00123',
          title: 'Theft of Mobile Phone',
          date: '2023-05-10',
          status: 'Under Investigation',
          category: 'Theft',
          location: 'Central Park'
        },
        {
          id: 'FIR00122',
          title: 'Vehicle Damage',
          date: '2023-04-28',
          status: 'Resolved',
          category: 'Property Damage',
          location: 'Main Street Parking'
        },
        {
          id: 'FIR00120',
          title: 'Noise Complaint',
          date: '2023-04-15',
          status: 'Closed',
          category: 'Public Nuisance',
          location: 'Residential Area 7'
        }
      ]);
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Under Investigation':
        return 'warning';
      case 'Resolved':
        return 'success';
      case 'Closed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Under Investigation':
        return <Schedule fontSize="small" />;
      case 'Resolved':
        return <AssignmentTurnedIn fontSize="small" />;
      case 'Closed':
        return <ThumbDown fontSize="small" />;
      default:
        return <History fontSize="small" />;
    }
  };

  return (
    <>
      <Navbar title="Citizen Portal" />
      <Box sx={{ 
        bgcolor: '#f8f9ff', // Softer background color
        minHeight: 'calc(100vh - 70px)',
        pb: 6,
        pt: { xs: 3, md: 4 }
      }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <Fade in={!loading} timeout={600}>
              <Box>
                {/* Stats Summary */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                      title="Total FIRs" 
                      value={recentFIRs.length.toString()}
                      icon={<History color="primary" sx={{ fontSize: 32 }} />}
                      color="#e3f2fd"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                      title="In Progress" 
                      value={recentFIRs.filter(fir => fir.status === 'Under Investigation').length.toString()}
                      icon={<Schedule sx={{ fontSize: 32, color: theme.palette.warning.main }} />}
                      color="#fff8e1"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                      title="Resolved" 
                      value={recentFIRs.filter(fir => fir.status === 'Resolved').length.toString()}
                      icon={<AssignmentTurnedIn sx={{ fontSize: 32, color: theme.palette.success.main }} />}
                      color="#e8f5e9"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                      title="Notifications" 
                      value={notifications.length.toString()}
                      icon={<NotificationsActive sx={{ fontSize: 32, color: theme.palette.secondary.main }} />}
                      color="#fce4ec"
                    />
                  </Grid>
                </Grid>

                {/* Welcome Header */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: { xs: 3, md: 4 },
                    mb: 4,
                    background: 'linear-gradient(145deg, #1e3c72 0%, #2a5298 100%)',
                    color: 'white',
                    borderRadius: 4,
                    boxShadow: '0 10px 40px -10px rgba(0,64,128,0.2)',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {/* Background decorative elements */}
                  <Box sx={{
                    position: 'absolute',
                    right: -50,
                    top: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: alpha('#ffffff', 0.05),
                    zIndex: 0
                  }} />
                  <Box sx={{
                    position: 'absolute',
                    left: 20,
                    bottom: -60,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: alpha('#ffffff', 0.05),
                    zIndex: 0
                  }} />
                
                  <Grid container spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid item xs={12} md={7}>
                      <Typography 
                        variant={isMobile ? "h5" : "h3"} 
                        fontWeight="800" 
                        gutterBottom
                        sx={{ letterSpacing: '-0.5px' }}
                      >
                        Welcome, {user?.name || 'Citizen'}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9, mb: 3, fontSize: { xs: '0.95rem', md: '1.1rem' } }}>
                        Track your FIR status, receive case updates, and stay informed about your complaints through your personalized dashboard.
                      </Typography>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button 
                          variant="contained" 
                          size={isMobile ? "medium" : "large"}
                          startIcon={<ReportProblem />}
                          component={RouterLink}
                          to="/citizen/file-fir"
                          sx={{ 
                            bgcolor: alpha('#ffffff', 0.9),
                            color: '#1e3c72',
                            fontWeight: 600,
                            px: 3,
                            '&:hover': { 
                              bgcolor: '#ffffff',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          File New FIR
                        </Button>
                        <Button 
                          variant="outlined" 
                          size={isMobile ? "medium" : "large"}
                          startIcon={<History />}
                          component={RouterLink}
                          to="/citizen/status"
                          sx={{ 
                            color: 'white', 
                            borderColor: alpha('#ffffff', 0.5),
                            fontWeight: 500,
                            px: 3,
                            '&:hover': { 
                              borderColor: '#ffffff',
                              bgcolor: alpha('#ffffff', 0.1),
                              transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Track FIR Status
                        </Button>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        height: '100%'
                      }}>
                        <Box component="img" 
                          src="https://cdn-icons-png.flaticon.com/512/2875/2875438.png" 
                          alt="FIR" 
                          sx={{ 
                            width: 220,
                            filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.2))',
                            opacity: 0.9,
                            transform: 'rotate(-5deg)'
                          }} 
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Dashboard Content */}
                <Grid container spacing={3}>
                  {/* Recent FIRs */}
                  <Grid item xs={12} md={8}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                        transition: 'box-shadow 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
                        }
                      }}
                    >
                      <Box sx={{ 
                        px: 3,
                        py: 2.5,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        bgcolor: '#fff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <History sx={{ color: 'primary.main', mr: 1.5, fontSize: 22 }} />
                          <Typography variant="h6" fontWeight="700" color="text.primary">
                            Recent FIRs
                          </Typography>
                        </Box>
                        <Box>
                          <Tooltip title="Refresh">
                            <IconButton size="small" sx={{ 
                              color: 'primary.main', 
                              bgcolor: alpha(theme.palette.primary.main, 0.08),
                              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.12) },
                              mr: 1
                            }}>
                              <Refresh fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="More options">
                            <IconButton size="small" sx={{ 
                              color: 'text.secondary', 
                              bgcolor: alpha(theme.palette.grey[500], 0.08),
                              '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.12) }
                            }}>
                              <MoreVert fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      
                      <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#fff' }}>
                        {recentFIRs.length === 0 ? (
                          <NoFIRsContent />
                        ) : (
                          <Stack spacing={2.5}>
                            {recentFIRs.map((fir) => (
                              <FIRCard 
                                key={fir.id} 
                                fir={fir} 
                                getStatusColor={getStatusColor}
                                getStatusIcon={getStatusIcon}
                              />
                            ))}
                            
                            <Box sx={{ textAlign: 'center', mt: 1 }}>
                              <Button 
                                component={RouterLink} 
                                to="/citizen/status"
                                variant="outlined" 
                                endIcon={<KeyboardArrowRight />}
                                sx={{
                                  borderWidth: 1.5,
                                  fontWeight: 600,
                                  px: 3,
                                  borderRadius: 2,
                                  '&:hover': {
                                    borderWidth: 1.5,
                                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                                    transform: 'translateY(-2px)'
                                  },
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                View All FIRs
                              </Button>
                            </Box>
                          </Stack>
                        )}
                      </Box>
                    </Paper>
                    
                    {/* Priority Alerts Section - New Addition */}
                    <Paper 
                      elevation={0}
                      sx={{ 
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                        mt: 3,
                        transition: 'box-shadow 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
                        }
                      }}
                    >
                      <Box sx={{ 
                        px: 3,
                        py: 2.5,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        bgcolor: '#fff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PriorityHigh sx={{ color: theme.palette.warning.main, mr: 1.5, fontSize: 22 }} />
                          <Typography variant="h6" fontWeight="700" color="text.primary">
                            Priority Updates
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ p: 3, bgcolor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ textAlign: 'center', py: 3, maxWidth: 600, mx: 'auto' }}>
                          <Typography variant="body1" color="text.secondary" paragraph>
                            Stay informed about important updates and hearings related to your case. We'll notify you when there's something that requires your attention.
                          </Typography>
                          <Button
                            variant="contained"
                            sx={{
                              bgcolor: theme.palette.warning.main,
                              '&:hover': {
                                bgcolor: theme.palette.warning.dark,
                              },
                              fontWeight: 600,
                              px: 3
                            }}
                          >
                            Enable Notifications
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  {/* Right Sidebar */}
                  <Grid item xs={12} md={4}>
                    <Stack spacing={3}>
                      {/* Notifications */}
                      <NotificationsCard notifications={notifications} />
                      
                      {/* Quick Actions */}
                      <QuickActionsCard />
                      
                      {/* Help Card */}
                      <HelpCard />
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Fade>
          )}
        </Container>
      </Box>
    </>
  );
};

// Statistics Card Component - New Component
const StatCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 3,
      bgcolor: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      height: '100%',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
      }
    }}
  >
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: '-0.5px' }}>
        {value}
      </Typography>
    </Box>
    <Avatar
      sx={{
        bgcolor: color,
        width: 56,
        height: 56,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}
    >
      {icon}
    </Avatar>
  </Paper>
);

// Component for FIR Card - Redesigned
const FIRCard = ({ fir, getStatusColor, getStatusIcon }) => {
  const theme = useTheme();
  
  return (
    <Card 
      elevation={0}
      sx={{ 
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.7),
        borderRadius: 3,
        p: 0.5,
        transition: 'all 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          borderColor: alpha(theme.palette.primary.main, 0.2)
        }
      }}
    >
      <CardContent sx={{ pb: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography 
            variant="h6" 
            component="div" 
            fontWeight="700"
            sx={{
              fontSize: { xs: '1rem', sm: '1.1rem' },
              color: theme.palette.text.primary,
              mb: 0.5
            }}
          >
            {fir.title}
          </Typography>
          <Chip 
            label={fir.status} 
            color={getStatusColor(fir.status)} 
            size="small" 
            icon={getStatusIcon(fir.status)}
            sx={{ 
              fontWeight: 600, 
              '& .MuiChip-icon': { ml: 0.5 },
              px: 0.5,
              boxShadow: `0 2px 8px ${alpha(theme.palette[getStatusColor(fir.status)].main, 0.25)}`
            }}
          />
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          color: theme.palette.text.secondary,
          fontSize: '0.8rem'
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'center',
              fontWeight: 500
            }}
          >
            <Box component="span" sx={{ mr: 0.5, opacity: 0.6, display: 'flex', alignItems: 'center' }}>
              <AccessTime fontSize="small" sx={{ fontSize: '0.9rem', mr: 0.5 }} />
            </Box>
            {fir.date}
          </Typography>
          <Box sx={{ mx: 1, color: theme.palette.divider }}>•</Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: theme.palette.primary.main,
              fontWeight: 600
            }}
          >
            {fir.id}
          </Typography>
        </Box>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }}>
          <Box 
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: alpha(theme.palette.primary.light, 0.1),
              color: theme.palette.primary.dark,
              borderRadius: 2,
              py: 0.75,
              px: 1.5
            }}
          >
            <Category sx={{ fontSize: 18, mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="body2" fontWeight={500}>
              {fir.category}
            </Typography>
          </Box>
          
          <Box 
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: alpha(theme.palette.secondary.light, 0.1),
              color: theme.palette.secondary.dark,
              borderRadius: 2,
              py: 0.75,
              px: 1.5
            }}
          >
            <LocationOn sx={{ fontSize: 18, mr: 1, color: theme.palette.secondary.main }} />
            <Typography variant="body2" fontWeight={500}>
              {fir.location}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
      
      <CardActions sx={{ pt: 0, pb: 1, px: 2, justifyContent: 'flex-end' }}>
        <Button 
          size="small" 
          endIcon={<KeyboardArrowRight />}
          component={RouterLink}
          to={`/citizen/status?id=${fir.id}`}
          sx={{ 
            fontWeight: 600,
            color: theme.palette.primary.main,
            '&:hover': { 
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              transform: 'translateX(2px)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

// Component for Notifications Card - Redesigned
const NotificationsCard = ({ notifications }) => {
  const theme = useTheme();
  
  return (
    <Paper 
      elevation={0}
      sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
        }
      }}
    >
      <Box sx={{ 
        px: 3,
        py: 2.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <NotificationsActive sx={{ color: theme.palette.secondary.main, mr: 1.5, fontSize: 22 }} />
          <Typography variant="h6" fontWeight="700" color="text.primary">
            Notifications
          </Typography>
        </Box>
        <Chip 
          label={notifications.length} 
          color="error" 
          size="small" 
          sx={{ 
            fontWeight: 'bold',
            boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.25)}`
          }} 
        />
      </Box>
      
      <Box sx={{ p: 0, bgcolor: '#fff' }}>
        <List sx={{ p: 0 }}>
          {notifications.map((notification, index) => (
            <ListItem 
              key={index} 
              alignItems="flex-start"
              sx={{ 
                px: 3,
                py: 1.5,
                borderBottom: index < notifications.length - 1 ? '1px solid' : 'none',
                borderColor: alpha(theme.palette.divider, 0.6),
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ 
                  bgcolor: alpha(theme.palette.secondary.main, 0.15),
                  color: theme.palette.secondary.main
                }}>
                  <Notifications />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, lineHeight: 1.4 }}>
                    {notification}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime sx={{ fontSize: 12, mr: 0.5 }} />
                    Today, 10:45 AM
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
        
        <Box sx={{ textAlign: 'center', p: 2 }}>
          <Button 
            variant="text" 
            size="small" 
            endIcon={<KeyboardArrowRight />}
            sx={{ 
              fontWeight: 600,
              color: theme.palette.secondary.main,
              '&:hover': { 
                bgcolor: alpha(theme.palette.secondary.main, 0.05),
                transform: 'translateX(2px)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            View All Notifications
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

// Quick Actions Card - Redesigned
const QuickActionsCard = () => {
  const theme = useTheme();
  
  return (
    <Paper 
      elevation={0}
      sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
        }
      }}
    >
      <Box sx={{ 
        px: 3,
        py: 2.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: '#fff',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Dashboard sx={{ color: theme.palette.primary.main, mr: 1.5, fontSize: 22 }} />
        <Typography variant="h6" fontWeight="700" color="text.primary">
          Quick Actions
        </Typography>
      </Box>
      
      <Box sx={{ p: 2, bgcolor: '#fff' }}>
        <Stack spacing={2}>
          <Button
            variant="contained"
            fullWidth
            component={RouterLink}
            to="/citizen/file-fir"
            startIcon={<ReportProblem />}
            sx={{ 
              py: 1.5,
              bgcolor: theme.palette.primary.main,
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
                transform: 'translateY(-2px)',
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.6)}`,
              },
              transition: 'all 0.2s ease'
            }}
          >
            File New FIR
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            component={RouterLink}
            to="/citizen/status"
            startIcon={<History />}
            sx={{ 
              py: 1.5,
              borderWidth: 2,
              borderColor: alpha(theme.palette.primary.main, 0.5),
              color: theme.palette.primary.main,
              fontWeight: 600,
              borderRadius: 2,
              '&:hover': {
                borderWidth: 2,
                borderColor: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Track FIR Status
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            component={RouterLink}
            to="/profile"
            startIcon={<Person />}
            sx={{ 
              py: 1.5,
              borderWidth: 2,
              borderColor: alpha(theme.palette.grey[500], 0.3),
              color: theme.palette.text.primary,
              fontWeight: 600,
              borderRadius: 2,
              '&:hover': {
                borderWidth: 2,
                borderColor: alpha(theme.palette.grey[700], 0.5),
                bgcolor: alpha(theme.palette.grey[500], 0.04),
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Update Profile
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

// Help Card - Redesigned
const HelpCard = () => {
  const theme = useTheme();
  
  return (
    <Paper 
      elevation={0}
      sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
        }
      }}
    >
      <Box sx={{ 
        px: 3,
        py: 2.5,
        bgcolor: '#fff',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
        <PriorityHigh sx={{ color: theme.palette.error.main, mr: 1.5, fontSize: 22 }} />
        <Typography variant="h6" fontWeight="700" color="text.primary">
          Need Help?
        </Typography>
      </Box>
      
      <Box sx={{ p: 3, bgcolor: '#fff' }}>
        <Typography variant="body2" paragraph>
          If you're experiencing an emergency, please call emergency services directly.
        </Typography>
        
        <Box sx={{
          bgcolor: alpha(theme.palette.error.main, 0.1),
          p: 2,
          borderRadius: 2,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <Typography variant="h6" fontWeight="700" color="error.main">
            Emergency: 911
          </Typography>
          <Typography variant="caption" color="text.secondary">
            For immediate assistance
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body2" fontWeight="600" color="text.primary" gutterBottom>
          For system support:
        </Typography>
        
        <Stack spacing={1.5} sx={{ mt: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component="span" sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              bgcolor: theme.palette.primary.main,
              mr: 1.5,
            }}/>
            <Typography variant="body2">
              <strong>Email:</strong> support@smartfir.gov
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component="span" sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              bgcolor: theme.palette.primary.main,
              mr: 1.5,
            }}/>
            <Typography variant="body2">
              <strong>Phone:</strong> 555-123-4567
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component="span" sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              bgcolor: theme.palette.primary.main,
              mr: 1.5,
            }}/>
            <Typography variant="body2">
              <strong>Hours:</strong> Mon-Fri, 9AM - 5PM
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

// Loading Skeleton - Redesigned for better user experience
const LoadingSkeleton = () => {
  const theme = useTheme();
  
  return (
    <Box>
      {/* Stats Skeleton */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height={100} 
              sx={{ 
                borderRadius: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.04)
              }} 
            />
          </Grid>
        ))}
      </Grid>
      
      {/* Welcome Banner Skeleton */}
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={220} 
        sx={{ 
          borderRadius: 4,
          mb: 4,
          bgcolor: alpha(theme.palette.primary.main, 0.06)
        }} 
      />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Main Content Skeleton */}
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height={60}
            sx={{ 
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              bgcolor: alpha(theme.palette.primary.main, 0.04)
            }}
          />
          <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02), borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
            <Stack spacing={2}>
              {[1, 2, 3].map(i => (
                <Skeleton 
                  key={i} 
                  variant="rectangular" 
                  width="100%" 
                  height={120}
                  sx={{ 
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.04)
                  }}
                />
              ))}
              <Box display="flex" justifyContent="center" mt={2}>
                <Skeleton 
                  variant="rectangular" 
                  width={150} 
                  height={40}
                  sx={{ 
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.08)
                  }}
                />
              </Box>
            </Stack>
          </Box>
          
          {/* Second Section Skeleton */}
          <Box mt={3}>
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height={60}
              sx={{ 
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                bgcolor: alpha(theme.palette.primary.main, 0.04)
              }}
            />
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height={150}
              sx={{ 
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
                bgcolor: alpha(theme.palette.primary.main, 0.02)
              }}
            />
          </Box>
        </Grid>
        
        {/* Right Sidebar Skeleton */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {[1, 2, 3].map(i => (
              <Box key={i}>
                <Skeleton 
                  variant="rectangular" 
                  width="100%" 
                  height={60}
                  sx={{ 
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    bgcolor: alpha(theme.palette.primary.main, 0.04)
                  }}
                />
                <Skeleton 
                  variant="rectangular" 
                  width="100%" 
                  height={i === 1 ? 200 : i === 2 ? 180 : 220}
                  sx={{ 
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                    bgcolor: alpha(theme.palette.primary.main, 0.02)
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

// No FIRs Placeholder - Redesigned
const NoFIRsContent = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      textAlign: 'center', 
      py: 5,
      px: 2,
      bgcolor: alpha(theme.palette.background.default, 0.5),
      borderRadius: 3
    }}>
      <Box 
        component="img" 
        src="https://cdn-icons-png.flaticon.com/512/1170/1170576.png"
        alt="No FIRs"
        sx={{ 
          width: 100,
          height: 100,
          opacity: 0.7,
          mb: 3
        }} 
      />
      <Typography variant="h6" color="text.primary" fontWeight="600" gutterBottom>
        You haven't filed any FIRs yet
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 450, mx: 'auto' }}>
        When you file a First Information Report, it will appear here for easy tracking and management. Your FIRs will be processed by our team.
      </Typography>
      <Button 
        variant="contained" 
        startIcon={<ReportProblem />}
        component={RouterLink}
        to="/citizen/file-fir"
        sx={{ 
          px: 3,
          py: 1.2,
          boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
          fontWeight: 600,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.6)}`,
          },
          transition: 'all 0.2s ease'
        }}
      >
        File Your First FIR
      </Button>
    </Box>
  );
};

export default CitizenDashboard;