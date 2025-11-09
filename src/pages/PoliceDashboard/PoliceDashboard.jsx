import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  Badge,
  LinearProgress,
  Fade,
  Skeleton,
  useTheme,
  useMediaQuery,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search,
  Notifications,
  Assignment,
  BarChart,
  LocationOn,
  People,
  TrendingUp,
  TrendingDown,
  MoreVert,
  Refresh,
  FilterList,
  Assessment,
  Security,
  Schedule,
  Warning,
  CheckCircle,
  ArrowForward
} from '@mui/icons-material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import Navbar from '../../components/common/Navbar';
import { AuthContext } from '../../context/AuthContext';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend, ArcElement, PointElement, LineElement);

// Mock data for demo
const recentFIRs = [
  {
    id: 'FIR00125',
    title: 'Mobile Phone Snatching',
    date: '2023-05-15',
    status: 'New',
    category: 'Theft',
    location: 'Downtown Market',
    urgency: 'High'
  },
  {
    id: 'FIR00124',
    title: 'Car Vandalism',
    date: '2023-05-14',
    status: 'Assigned',
    category: 'Property Damage',
    location: 'West Avenue Parking',
    urgency: 'Medium',
    assignedTo: 'Officer Smith'
  },
  {
    id: 'FIR00123',
    title: 'Apartment Break-in',
    date: '2023-05-13',
    status: 'Under Investigation',
    category: 'Burglary',
    location: 'Riverside Apartments',
    urgency: 'High',
    assignedTo: 'Officer Johnson'
  },
  {
    id: 'FIR00122',
    title: 'Online Fraud Case',
    date: '2023-05-12',
    status: 'New',
    category: 'Cybercrime',
    location: 'Online Transaction',
    urgency: 'Medium'
  },
  {
    id: 'FIR00121',
    title: 'Public Disturbance',
    date: '2023-05-11',
    status: 'Assigned',
    category: 'Public Nuisance',
    location: 'City Park',
    urgency: 'Low',
    assignedTo: 'Officer Brown'
  }
];

const statusCounts = {
  'New': 12,
  'Assigned': 24,
  'Under Investigation': 38,
  'Closed': 87,
  'Resolved': 45
};

const categoryCounts = {
  'Theft': 42,
  'Assault': 28,
  'Burglary': 19,
  'Fraud': 31,
  'Cybercrime': 24,
  'Property Damage': 18,
  'Public Nuisance': 15
};

const areaStats = [
  { area: 'Downtown', count: 47 },
  { area: 'Westside', count: 35 },
  { area: 'North District', count: 28 },
  { area: 'East End', count: 26 },
  { area: 'South Hills', count: 19 }
];

const assignedCases = recentFIRs.filter(fir => fir.assignedTo);

// Helper functions
const getUrgencyColor = (urgency) => {
  switch(urgency) {
    case 'High': return 'error';
    case 'Medium': return 'warning';
    case 'Low': return 'success';
    default: return 'default';
  }
};

const getStatusColor = (status) => {
  switch(status) {
    case 'New': return 'error';
    case 'Assigned': return 'warning';
    case 'Under Investigation': return 'info';
    case 'Resolved': return 'success';
    case 'Closed': return 'default';
    default: return 'default';
  }
};

// Memoized Stat Card Component
const StatCard = React.memo(({ icon, title, value, change, trend, color = 'primary' }) => {
  const IconComponent = icon;
  const colorMap = {
    error: { main: '#f44336', dark: '#c62828' },
    warning: { main: '#ff9800', dark: '#e65100' },
    info: { main: '#2196f3', dark: '#1565c0' },
    success: { main: '#4caf50', dark: '#2e7d32' },
    primary: { main: '#1976d2', dark: '#0d47a1' }
  };
  const colors = colorMap[color] || colorMap.primary;
  
  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${colors.main} 0%, ${colors.dark} 100%)`,
        color: 'white',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <IconComponent sx={{ fontSize: 40, opacity: 0.9 }} />
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {trend === 'up' ? <TrendingUp /> : <TrendingDown />}
            <Typography variant="caption">{change}</Typography>
          </Box>
        )}
      </Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        {title}
      </Typography>
    </CardContent>
  </Card>
  );
});

StatCard.displayName = 'StatCard';

const PoliceDashboard = () => {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Memoized chart data
  const statusChartData = useMemo(() => ({
    labels: Object.keys(statusCounts),
    datasets: [{
      label: 'FIR Status',
      data: Object.values(statusCounts),
      backgroundColor: [
        'rgba(244, 67, 54, 0.8)',
        'rgba(255, 152, 0, 0.8)',
        'rgba(33, 150, 243, 0.8)',
        'rgba(158, 158, 158, 0.8)',
        'rgba(76, 175, 80, 0.8)'
      ],
      borderColor: [
        'rgba(244, 67, 54, 1)',
        'rgba(255, 152, 0, 1)',
        'rgba(33, 150, 243, 1)',
        'rgba(158, 158, 158, 1)',
        'rgba(76, 175, 80, 1)'
      ],
      borderWidth: 2
    }]
  }), []);

  const trendChartData = useMemo(() => ({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'New FIRs',
        data: [12, 19, 15, 25, 22, 18, 14],
        borderColor: 'rgb(25, 118, 210)',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Resolved',
        data: [8, 12, 10, 15, 18, 14, 12],
        borderColor: 'rgb(76, 175, 80)',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }), []);

  const categoryChartData = useMemo(() => ({
    labels: Object.keys(categoryCounts).slice(0, 5),
    datasets: [{
      label: 'Cases',
      data: Object.values(categoryCounts).slice(0, 5),
      backgroundColor: [
        'rgba(244, 67, 54, 0.6)',
        'rgba(255, 152, 0, 0.6)',
        'rgba(33, 150, 243, 0.6)',
        'rgba(156, 39, 176, 0.6)',
        'rgba(76, 175, 80, 0.6)'
      ]
    }]
  }), []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          usePointStyle: true
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const lineChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        position: 'top',
        labels: {
          padding: 10,
          usePointStyle: true
        }
      }
    }
  };

  const totalFIRs = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  return (
    <>
      <Navbar title="Police Dashboard" />
      <Box sx={{ 
        bgcolor: 'grey.50',
        minHeight: '100vh',
        pb: 4
      }}>
        <Container maxWidth="xl" sx={{ pt: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
          {loading ? (
            <Box>
              <Skeleton variant="rectangular" height={200} sx={{ mb: 3, borderRadius: 2 }} />
              <Grid container spacing={3}>
                {[1, 2, 3, 4].map((i) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                    <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Fade in={!loading}>
              <Box>
                {/* Welcome Header */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: { xs: 2, md: 4 },
                    mb: 3,
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    color: 'white',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(25, 118, 210, 0.2)'
                  }}
                >
                  <Grid container spacing={3} alignItems="center">
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography 
                        variant={isMobile ? "h5" : "h4"} 
                        fontWeight="bold" 
                        gutterBottom
                      >
                        Welcome, Officer {user?.name || 'Smith'}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.95, mb: 3 }}>
                        You have <strong>{statusCounts.New}</strong> new FIRs pending review and <strong>{statusCounts.Assigned}</strong> cases assigned for investigation.
                      </Typography>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button 
                          variant="contained" 
                          color="secondary"
                          size={isMobile ? "medium" : "large"}
                          startIcon={<Assignment />}
                          component={RouterLink}
                          to="/police/fir-management"
                          sx={{ 
                            bgcolor: 'white',
                            color: 'primary.main',
                            '&:hover': { bgcolor: 'grey.100' }
                          }}
                        >
                          Manage FIRs
                        </Button>
                        <Button 
                          variant="outlined" 
                          size={isMobile ? "medium" : "large"}
                          startIcon={<BarChart />}
                          component={RouterLink}
                          to="/police/analytics"
                          sx={{ 
                            color: 'white', 
                            borderColor: 'white',
                            '&:hover': { 
                              borderColor: 'white',
                              bgcolor: 'rgba(255,255,255,0.1)'
                            }
                          }}
                        >
                          View Analytics
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Quick Stats */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                      icon={Warning}
                      title="New FIRs"
                      value={statusCounts.New}
                      change="+12%"
                      trend="up"
                      color="error"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                      icon={Schedule}
                      title="Assigned"
                      value={statusCounts.Assigned}
                      change="+8%"
                      trend="up"
                      color="warning"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                      icon={Assessment}
                      title="Investigating"
                      value={statusCounts['Under Investigation']}
                      change="+5%"
                      trend="up"
                      color="info"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                      icon={CheckCircle}
                      title="Resolved"
                      value={statusCounts.Resolved}
                      change="+15%"
                      trend="up"
                      color="success"
                    />
                  </Grid>
                </Grid>

                {/* Search and Filters */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    mb: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 8 }}>
                      <TextField
                        fullWidth
                        placeholder="Search FIRs by ID, keyword, location..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size={isMobile ? "small" : "medium"}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'background.paper'
                          }
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Stack 
                        direction="row" 
                        spacing={1} 
                        justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
                        flexWrap="wrap"
                      >
                        <Button 
                          startIcon={<FilterList />} 
                          variant="outlined"
                          size={isMobile ? "small" : "medium"}
                        >
                          Filters
                        </Button>
                        <Button 
                          startIcon={<LocationOn />} 
                          variant="outlined"
                          size={isMobile ? "small" : "medium"}
                        >
                          Map
                        </Button>
                        <Tooltip title="Refresh Data">
                          <IconButton variant="outlined" size={isMobile ? "small" : "medium"}>
                            <Refresh />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Main Content */}
                <Grid container spacing={3}>
                  {/* Main Dashboard Content */}
                  <Grid size={{ xs: 12, lg: 8 }}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden'
                      }}
                    >
                      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                        <Tabs 
                          value={tabValue} 
                          onChange={handleTabChange}
                          variant={isMobile ? "scrollable" : "fullWidth"}
                          scrollButtons="auto"
                          sx={{
                            '& .MuiTab-root': {
                              minHeight: 72,
                              textTransform: 'none',
                              fontSize: '0.95rem',
                              fontWeight: 500
                            }
                          }}
                        >
                          <Tab 
                            label={isMobile ? "Recent" : "Recent FIRs"} 
                            icon={<Badge badgeContent={recentFIRs.length} color="error"><Assignment /></Badge>}
                            iconPosition="start"
                          />
                          <Tab 
                            label={isMobile ? "Assigned" : "Assigned to You"} 
                            icon={<Badge badgeContent={assignedCases.length} color="warning"><People /></Badge>}
                            iconPosition="start"
                          />
                          <Tab 
                            label={isMobile ? "Analytics" : "Analytics Preview"} 
                            icon={<BarChart />}
                            iconPosition="start"
                          />
                        </Tabs>
                      </Box>

                      {/* Tab 1: Recent FIRs */}
                      {tabValue === 0 && (
                        <Box sx={{ p: { xs: 2, md: 3 } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" fontWeight="600">
                              Recently Filed FIRs
                            </Typography>
                            <Button 
                              endIcon={<ArrowForward />}
                              component={RouterLink} 
                              to="/police/fir-management"
                              size="small"
                            >
                              View All
                            </Button>
                          </Box>

                          <Stack spacing={2}>
                            {recentFIRs.map((fir) => (
                              <Card 
                                key={fir.id}
                                elevation={0}
                                sx={{ 
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  borderRadius: 2,
                                  transition: 'all 0.2s ease-in-out',
                                  '&:hover': {
                                    boxShadow: 4,
                                    transform: 'translateY(-2px)'
                                  }
                                }}
                              >
                                <CardContent>
                                  <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Avatar 
                                      sx={{ 
                                        bgcolor: `${getUrgencyColor(fir.urgency)}.main`,
                                        width: 48,
                                        height: 48
                                      }}
                                    >
                                      {fir.id.slice(-2)}
                                    </Avatar>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="600" noWrap>
                                          {fir.title}
                                        </Typography>
                                        <Chip 
                                          label={fir.status} 
                                          size="small" 
                                          color={getStatusColor(fir.status)}
                                          sx={{ ml: 1 }}
                                        />
                                      </Box>
                                      <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {fir.id} • {fir.date}
                                      </Typography>
                                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                        <Chip 
                                          label={fir.category} 
                                          size="small" 
                                          variant="outlined"
                                        />
                                        <Chip 
                                          label={fir.location} 
                                          size="small" 
                                          variant="outlined"
                                          icon={<LocationOn sx={{ fontSize: 16 }} />}
                                        />
                                        <Chip 
                                          label={fir.urgency} 
                                          size="small" 
                                          color={getUrgencyColor(fir.urgency)}
                                        />
                                      </Box>
                                      {fir.assignedTo && (
                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                          Assigned to: <strong>{fir.assignedTo}</strong>
                                        </Typography>
                                      )}
                                      <Stack direction="row" spacing={1}>
                                        <Button size="small" variant="outlined">View</Button>
                                        <Button size="small" variant="contained">Assign</Button>
                                      </Stack>
                                    </Box>
                                  </Box>
                                </CardContent>
                              </Card>
                            ))}
                          </Stack>
                        </Box>
                      )}

                      {/* Tab 2: Assigned to You */}
                      {tabValue === 1 && (
                        <Box sx={{ p: { xs: 2, md: 3 } }}>
                          <Typography variant="h6" fontWeight="600" gutterBottom>
                            Cases Assigned to You
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            You currently have {assignedCases.length} active cases assigned for investigation.
                          </Typography>
                          
                          {assignedCases.length > 0 ? (
                            <Stack spacing={2}>
                              {assignedCases.map((fir) => (
                                <Card 
                                  key={fir.id}
                                  elevation={0}
                                  sx={{ 
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2
                                  }}
                                >
                                  <CardContent>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        {fir.id.slice(-2)}
                                      </Avatar>
                                      <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="600">
                                          {fir.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                          {fir.category} • {fir.location}
                                        </Typography>
                                      </Box>
                                      <Button size="small" variant="contained">
                                        View
                                      </Button>
                                    </Box>
                                  </CardContent>
                                </Card>
                              ))}
                            </Stack>
                          ) : (
                            <Box sx={{ textAlign: 'center', py: 6 }}>
                              <People sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                              <Typography variant="h6" color="text.secondary" gutterBottom>
                                No Assigned Cases
                              </Typography>
                              <Button 
                                variant="contained" 
                                sx={{ mt: 2 }}
                                component={RouterLink}
                                to="/police/fir-management"
                              >
                                Browse Available Cases
                              </Button>
                            </Box>
                          )}
                        </Box>
                      )}

                      {/* Tab 3: Analytics Preview */}
                      {tabValue === 2 && (
                        <Box sx={{ p: { xs: 2, md: 3 } }}>
                          <Typography variant="h6" fontWeight="600" gutterBottom>
                            Analytics Preview
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Quick overview of current crime statistics and trends.
                          </Typography>
                          
                          <Grid container spacing={2}>
                            <Grid size={12}>
                              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                <CardContent>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Weekly FIR Trend
                                  </Typography>
                                  <Box sx={{ height: 250, mt: 2 }}>
                                    <Line data={trendChartData} options={lineChartOptions} />
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                            <Grid size={12}>
                              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                <CardContent>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Status Distribution
                                  </Typography>
                                  <Box sx={{ height: 250, mt: 2 }}>
                                    <Bar data={statusChartData} options={chartOptions} />
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                          </Grid>
                          
                          <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Button 
                              variant="contained"
                              size="large"
                              endIcon={<ArrowForward />}
                              component={RouterLink}
                              to="/police/analytics"
                            >
                              View Full Analytics Dashboard
                            </Button>
                          </Box>
                        </Box>
                      )}
                    </Paper>
                  </Grid>

                  {/* Sidebar */}
                  <Grid size={{ xs: 12, lg: 4 }}>
                    <Stack spacing={3}>
                      {/* Status Overview */}
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
                          FIR Status Overview
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        
                        <Stack spacing={2.5}>
                          {Object.entries(statusCounts).map(([status, count]) => {
                            const percentage = (count / totalFIRs * 100).toFixed(1);
                            return (
                              <Box key={status}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                  <Typography variant="body2" fontWeight={500}>
                                    {status}
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold" color="primary">
                                    {count} ({percentage}%)
                                  </Typography>
                                </Box>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={percentage} 
                                  color={getStatusColor(status)}
                                  sx={{ 
                                    height: 8, 
                                    borderRadius: 4,
                                    bgcolor: 'grey.200'
                                  }}
                                />
                              </Box>
                            );
                          })}
                        </Stack>
                      </Paper>

                      {/* Top Crime Categories */}
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
                          Top Crime Categories
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ height: 200, mb: 2 }}>
                          <Pie 
                            data={categoryChartData} 
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  position: 'bottom',
                                  labels: {
                                    padding: 10,
                                    usePointStyle: true,
                                    font: { size: 11 }
                                  }
                                }
                              }
                            }}
                          />
                        </Box>
                        
                        <List dense>
                          {Object.entries(categoryCounts)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 5)
                            .map(([category, count], index) => (
                              <ListItem key={category} sx={{ px: 0, py: 0.5 }}>
                                <ListItemText 
                                  primary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Typography variant="body2">
                                        <strong>{index + 1}.</strong> {category}
                                      </Typography>
                                      <Chip 
                                        label={count} 
                                        size="small" 
                                        color="primary"
                                        variant="outlined"
                                      />
                                    </Box>
                                  } 
                                />
                              </ListItem>
                            ))
                          }
                        </List>
                      </Paper>

                      {/* Crime Hot Spots */}
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
                          Crime Hot Spots
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        
                        <List dense>
                          {areaStats.map((area, index) => (
                            <ListItem 
                              key={area.area} 
                              sx={{ 
                                px: 0,
                                py: 1,
                                bgcolor: index < 2 ? 'error.50' : 'transparent',
                                borderRadius: 1,
                                mb: 0.5
                              }}
                            >
                              <ListItemText 
                                primary={
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <LocationOn color={index < 2 ? 'error' : 'action'} sx={{ fontSize: 18 }} />
                                      <Typography variant="body2" fontWeight={index < 2 ? 600 : 400}>
                                        {area.area}
                                      </Typography>
                                    </Box>
                                    <Typography variant="body2" fontWeight="bold" color={index < 2 ? 'error.main' : 'text.primary'}>
                                      {area.count}
                                    </Typography>
                                  </Box>
                                } 
                              />
                            </ListItem>
                          ))}
                        </List>
                        
                        <Button 
                          fullWidth 
                          variant="contained"
                          startIcon={<LocationOn />}
                          sx={{ mt: 2 }}
                          component={RouterLink}
                          to="/police/analytics"
                        >
                          View Heat Map
                        </Button>
                      </Paper>
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

export default React.memo(PoliceDashboard);
