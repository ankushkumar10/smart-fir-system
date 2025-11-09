import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { 
  Download, 
  ShowChart, 
  LocationOn, 
  Assessment,
  TrendingUp,
  TrendingDown,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import Navbar from '../../components/common/Navbar';
import CrimeHeatmap from '../../components/maps/CrimeHeatmap';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

// Mock data for visualizations
const mockCategories = ['Theft', 'Assault', 'Burglary', 'Fraud', 'Cybercrime', 'Property Damage', 'Public Nuisance'];
const mockMonthlyData = [45, 38, 25, 30, 35, 22, 18];
const mockAreaData = ['Downtown', 'North District', 'South District', 'West End', 'East Side'];
const mockAreaValues = [65, 48, 35, 42, 55];
const mockTrendData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'FIRs Filed',
      data: [120, 110, 140, 125, 160, 135],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
    {
      label: 'Cases Resolved',
      data: [80, 95, 110, 105, 125, 115],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }
  ],
};

const categoryColors = [
  'rgba(255, 99, 132, 0.6)',  // Red
  'rgba(54, 162, 235, 0.6)',  // Blue
  'rgba(255, 206, 86, 0.6)',  // Yellow
  'rgba(75, 192, 192, 0.6)',  // Green
  'rgba(153, 102, 255, 0.6)', // Purple
  'rgba(255, 159, 64, 0.6)',  // Orange
  'rgba(199, 199, 199, 0.6)'  // Grey
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [categoryData, setCategoryData] = useState({});
  const [areaData, setAreaData] = useState({});
  const [topIncidents, setTopIncidents] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);

  // Simulate data loading effect
  useEffect(() => {
    // Setup category chart data
    setCategoryData({
      labels: mockCategories,
      datasets: [
        {
          label: 'Number of FIRs',
          data: mockMonthlyData.map(value => 
            timeRange === 'week' ? Math.floor(value / 4) : 
            timeRange === 'year' ? value * 12 : value
          ),
          backgroundColor: categoryColors,
        },
      ],
    });

    // Setup area chart data
    setAreaData({
      labels: mockAreaData,
      datasets: [
        {
          label: 'FIRs by Area',
          data: mockAreaValues.map(value => 
            timeRange === 'week' ? Math.floor(value / 4) : 
            timeRange === 'year' ? value * 12 : value
          ),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
      ],
    });

    // Setup top incidents table data
    setTopIncidents([
      { id: 'FIR00125', title: 'Armed Robbery at Downtown Bank', category: 'Theft', date: '2023-05-15', status: 'Under Investigation', priority: 'High' },
      { id: 'FIR00128', title: 'Break-in at Electronics Store', category: 'Burglary', date: '2023-05-14', status: 'Active', priority: 'High' },
      { id: 'FIR00132', title: 'Vehicle Theft in North Parking Lot', category: 'Theft', date: '2023-05-16', status: 'Active', priority: 'Medium' },
      { id: 'FIR00135', title: 'Cybercrime - Phishing Attack', category: 'Cybercrime', date: '2023-05-13', status: 'Under Investigation', priority: 'Medium' },
      { id: 'FIR00138', title: 'Assault in East Side Park', category: 'Assault', date: '2023-05-12', status: 'Resolved', priority: 'High' },
    ]);

    // Setup heatmap data (mock crime incident locations in India)
    // In a real app, this would come from the API: analyticsService.getHeatmapData({ timeRange })
    const mockHeatmapData = [
      // Delhi - high crime density
      { lat: 28.6139, lng: 77.2090, intensity: 0.9 },
      { lat: 28.6141, lng: 77.2092, intensity: 0.85 },
      { lat: 28.6137, lng: 77.2088, intensity: 0.8 },
      { lat: 28.6140, lng: 77.2091, intensity: 0.75 },
      { lat: 28.6138, lng: 77.2089, intensity: 0.7 },
      { lat: 28.6150, lng: 77.2100, intensity: 0.65 },
      { lat: 28.6128, lng: 77.2078, intensity: 0.6 },
      
      // Mumbai - high crime density
      { lat: 19.0760, lng: 72.8777, intensity: 0.9 },
      { lat: 19.0762, lng: 72.8779, intensity: 0.85 },
      { lat: 19.0758, lng: 72.8775, intensity: 0.8 },
      { lat: 19.0761, lng: 72.8778, intensity: 0.75 },
      { lat: 19.0759, lng: 72.8776, intensity: 0.7 },
      { lat: 19.0770, lng: 72.8787, intensity: 0.65 },
      
      // Bangalore - medium-high density
      { lat: 12.9716, lng: 77.5946, intensity: 0.7 },
      { lat: 12.9718, lng: 77.5948, intensity: 0.65 },
      { lat: 12.9714, lng: 77.5944, intensity: 0.6 },
      { lat: 12.9717, lng: 77.5947, intensity: 0.55 },
      { lat: 12.9720, lng: 77.5950, intensity: 0.5 },
      
      // Kolkata - medium density
      { lat: 22.5726, lng: 88.3639, intensity: 0.6 },
      { lat: 22.5728, lng: 88.3641, intensity: 0.55 },
      { lat: 22.5724, lng: 88.3637, intensity: 0.5 },
      { lat: 22.5727, lng: 88.3640, intensity: 0.45 },
      
      // Chennai - medium density
      { lat: 13.0827, lng: 80.2707, intensity: 0.6 },
      { lat: 13.0829, lng: 80.2709, intensity: 0.55 },
      { lat: 13.0825, lng: 80.2705, intensity: 0.5 },
      { lat: 13.0828, lng: 80.2708, intensity: 0.45 },
      
      // Hyderabad - medium density
      { lat: 17.3850, lng: 78.4867, intensity: 0.5 },
      { lat: 17.3852, lng: 78.4869, intensity: 0.45 },
      { lat: 17.3848, lng: 78.4865, intensity: 0.4 },
      
      // Pune - low-medium density
      { lat: 18.5204, lng: 73.8567, intensity: 0.4 },
      { lat: 18.5206, lng: 73.8569, intensity: 0.35 },
      { lat: 18.5202, lng: 73.8565, intensity: 0.3 },
      
      // Jaipur - low-medium density
      { lat: 26.9124, lng: 75.7873, intensity: 0.4 },
      { lat: 26.9126, lng: 75.7875, intensity: 0.35 },
      
      // Ahmedabad - medium density
      { lat: 23.0225, lng: 72.5714, intensity: 0.5 },
      { lat: 23.0227, lng: 72.5716, intensity: 0.45 },
      
      // Scattered incidents in other cities
      { lat: 25.3176, lng: 82.9739, intensity: 0.3 }, // Varanasi
      { lat: 26.4499, lng: 80.3319, intensity: 0.35 }, // Kanpur
      { lat: 19.2183, lng: 72.9781, intensity: 0.4 }, // Thane
      { lat: 12.9352, lng: 77.6245, intensity: 0.35 }, // Bangalore outskirts
      { lat: 28.4089, lng: 77.0378, intensity: 0.3 }, // Gurgaon
    ];
    
    setHeatmapData(mockHeatmapData);
  }, [timeRange]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'FIR Analysis by Category',
      },
    },
  };

  const areaChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'FIR Distribution by Area',
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '6-Month Trend Analysis',
      },
    },
  };

  const handleExportPDF = () => {
    alert('PDF export functionality would be implemented here');
    // In a real implementation, this would generate and download a PDF report
  };

  return (
    <>
      <Navbar title="Police Analytics" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
              Crime Analytics Dashboard
            </Typography>
            <Box>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleExportPDF}
                sx={{ mr: 2 }}
              >
                Export Report
              </Button>
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel id="time-range-label">Time Range</InputLabel>
                <Select
                  labelId="time-range-label"
                  id="time-range"
                  value={timeRange}
                  label="Time Range"
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <MenuItem value="week">Last Week</MenuItem>
                  <MenuItem value="month">Last Month</MenuItem>
                  <MenuItem value="year">Last Year</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Summary Cards */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total FIRs
                  </Typography>
                  <Typography variant="h4" component="div">
                    {timeRange === 'week' ? 68 : timeRange === 'month' ? 213 : 2450}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp color="success" sx={{ mr: 1 }} />
                    {timeRange === 'week' ? 12 : timeRange === 'month' ? 24 : 15}% increase
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Resolved Cases
                  </Typography>
                  <Typography variant="h4" component="div">
                    {timeRange === 'week' ? 42 : timeRange === 'month' ? 158 : 1870}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp color="success" sx={{ mr: 1 }} />
                    {timeRange === 'week' ? 8 : timeRange === 'month' ? 18 : 20}% increase
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Pending Cases
                  </Typography>
                  <Typography variant="h4" component="div">
                    {timeRange === 'week' ? 26 : timeRange === 'month' ? 55 : 580}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingDown color="error" sx={{ mr: 1 }} />
                    {timeRange === 'week' ? 5 : timeRange === 'month' ? 10 : 8}% decrease
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Response Rate
                  </Typography>
                  <Typography variant="h4" component="div">
                    {timeRange === 'week' ? 94 : timeRange === 'month' ? 92 : 90}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp color="success" sx={{ mr: 1 }} />
                    {timeRange === 'week' ? 2 : timeRange === 'month' ? 4 : 3}% increase
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Charts */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper elevation={1} sx={{ p: 2, height: 400 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ShowChart sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Case Categories Analysis</Typography>
                </Box>
                {Object.keys(categoryData).length > 0 && (
                  <Box sx={{ height: 320 }}>
                    <Bar options={chartOptions} data={categoryData} />
                  </Box>
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={1} sx={{ p: 2, height: 400 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BarChartIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Category Distribution</Typography>
                </Box>
                {Object.keys(categoryData).length > 0 && (
                  <Box sx={{ height: 320, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Pie 
                      data={{
                        labels: categoryData.labels,
                        datasets: [{
                          data: categoryData.datasets[0].data,
                          backgroundColor: categoryColors,
                        }]
                      }} 
                    />
                  </Box>
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Paper elevation={1} sx={{ p: 2, height: 400 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ShowChart sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Trend Analysis</Typography>
                </Box>
                <Box sx={{ height: 320 }}>
                  <Line options={lineChartOptions} data={mockTrendData} />
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={1} sx={{ p: 2, height: 400 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Area Analysis</Typography>
                </Box>
                {Object.keys(areaData).length > 0 && (
                  <Box sx={{ height: 320 }}>
                    <Bar options={areaChartOptions} data={areaData} />
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Crime Heatmap */}
            <Grid size={12}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Crime Heatmap</Typography>
                </Box>
                <Box 
                  sx={{ 
                    height: 400,
                    borderRadius: 1,
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.12)'
                  }}
                >
                  {heatmapData.length > 0 ? (
                    <CrimeHeatmap 
                      heatmapData={heatmapData}
                      center={[23.0225, 77.2090]}
                      zoom={6}
                      height={400}
                      options={{
                        radius: 30,
                        blur: 20,
                        maxZoom: 18,
                        max: 1.0,
                        gradient: {
                          0.0: 'blue',
                          0.2: 'cyan',
                          0.4: 'lime',
                          0.6: 'yellow',
                          0.8: 'orange',
                          1.0: 'red'
                        }
                      }}
                    />
                  ) : (
                    <Box 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        bgcolor: 'rgba(0,0,0,0.05)'
                      }}
                    >
                      <Typography color="text.secondary">
                        Loading heatmap data...
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  The heatmap displays crime hotspots based on reported incidents. Red areas indicate higher concentration of cases.
                </Typography>
              </Paper>
            </Grid>

            {/* Top Incidents Table */}
            <Grid size={12}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  High-Priority Incidents
                </Typography>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>FIR ID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Priority</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topIncidents.map((incident) => (
                        <TableRow key={incident.id}>
                          <TableCell>{incident.id}</TableCell>
                          <TableCell>{incident.title}</TableCell>
                          <TableCell>{incident.category}</TableCell>
                          <TableCell>{incident.date}</TableCell>
                          <TableCell>{incident.status}</TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                bgcolor: 
                                  incident.priority === 'High' ? 'error.light' : 
                                  incident.priority === 'Medium' ? 'warning.light' : 'success.light',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                display: 'inline-block',
                              }}
                            >
                              {incident.priority}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default Analytics;