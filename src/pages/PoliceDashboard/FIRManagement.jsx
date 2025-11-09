import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Tooltip,
  Stack,
  Avatar,
  Fade,
  Skeleton,
  useTheme,
  useMediaQuery,
  Badge,
  Alert
} from '@mui/material';
import {
  Search,
  FilterList,
  LocationOn,
  Assignment,
  Edit,
  Print,
  Delete,
  Visibility,
  PictureAsPdf,
  Email,
  Phone,
  Schedule,
  AssignmentTurnedIn,
  ThumbDown,
  CloseFullscreen,
  PersonAdd,
  Refresh,
  Clear,
  CheckCircle,
  Warning,
  Info
} from '@mui/icons-material';
import Navbar from '../../components/common/Navbar';

// Mock data for FIRs
const mockFIRs = [
  {
    id: 'FIR00123',
    title: 'Theft of Mobile Phone',
    date: '2023-05-10',
    time: '14:30',
    status: 'Under Investigation',
    category: 'Theft',
    location: 'Central Park',
    citizenName: 'John Doe',
    citizenContact: '1234567890',
    assignedOfficer: 'Officer Smith',
    description: 'My iPhone 13 was stolen while I was sitting on a bench in Central Park.',
    latitude: 40.785091,
    longitude: -73.968285,
  },
  {
    id: 'FIR00124',
    title: 'Vehicle Damage in Parking Lot',
    date: '2023-05-11',
    time: '09:15',
    status: 'Pending',
    category: 'Property Damage',
    location: 'Mall Parking',
    citizenName: 'Alice Johnson',
    citizenContact: '9876543210',
    assignedOfficer: null,
    description: 'Found my car with a large scratch on the driver side door when I returned from shopping.',
    latitude: 40.758896,
    longitude: -73.985130,
  },
  {
    id: 'FIR00125',
    title: 'Cybercrime Fraud Attempt',
    date: '2023-05-12',
    time: '11:45',
    status: 'Pending',
    category: 'Cybercrime',
    location: 'Online',
    citizenName: 'Robert Brown',
    citizenContact: '5551234567',
    assignedOfficer: null,
    description: 'Received phishing emails attempting to steal my banking credentials.',
    latitude: null,
    longitude: null,
  },
  {
    id: 'FIR00126',
    title: 'Assault at Nightclub',
    date: '2023-05-09',
    time: '23:20',
    status: 'Under Investigation',
    category: 'Assault',
    location: 'Downtown Nightclub',
    citizenName: 'Michael Wilson',
    citizenContact: '3334445555',
    assignedOfficer: 'Officer Johnson',
    description: 'Was attacked by an unknown person while leaving the nightclub.',
    latitude: 40.749401,
    longitude: -73.991305,
  },
  {
    id: 'FIR00127',
    title: 'Noise Complaint from Neighbors',
    date: '2023-05-13',
    time: '01:30',
    status: 'Resolved',
    category: 'Public Nuisance',
    location: 'Residential Area',
    citizenName: 'Emily Davis',
    citizenContact: '7778889999',
    assignedOfficer: 'Officer Garcia',
    description: 'Neighbors playing extremely loud music late at night, making it impossible to sleep.',
    latitude: 40.762901,
    longitude: -73.931205,
  }
];

// Mock list of officers
const officers = [
  { id: 1, name: 'Officer Smith' },
  { id: 2, name: 'Officer Johnson' },
  { id: 3, name: 'Officer Garcia' },
  { id: 4, name: 'Officer Chen' },
  { id: 5, name: 'Officer Rodriguez' }
];

const FIRManagement = () => {
  const [firs, setFirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFIR, setSelectedFIR] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    date: '',
    assignedOfficer: ''
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch FIRs (simulated)
  useEffect(() => {
    setTimeout(() => {
      setFirs(mockFIRs);
      setLoading(false);
    }, 800);
  }, []);

  // Filter and search FIRs
  const filteredFIRs = useMemo(() => {
    return firs.filter(fir => {
      const matchesSearch = !searchQuery || 
        fir.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fir.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fir.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fir.citizenName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !filters.status || fir.status === filters.status;
      const matchesCategory = !filters.category || fir.category === filters.category;
      const matchesDate = !filters.date || fir.date === filters.date;
      const matchesOfficer = !filters.assignedOfficer || 
        (filters.assignedOfficer === 'unassigned' ? !fir.assignedOfficer : fir.assignedOfficer === filters.assignedOfficer);
      
      return matchesSearch && matchesStatus && matchesCategory && matchesDate && matchesOfficer;
    });
  }, [firs, searchQuery, filters]);

  const paginatedFIRs = useMemo(() => {
    return filteredFIRs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredFIRs, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handleOpenDetails = (fir) => {
    setSelectedFIR(fir);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  const handleOpenAssignDialog = (fir) => {
    setSelectedFIR(fir);
    setSelectedOfficer(fir.assignedOfficer || '');
    setAssignDialogOpen(true);
  };

  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
  };

  const handleAssignOfficer = () => {
    const updatedFIRs = firs.map(fir => 
      fir.id === selectedFIR.id ? { ...fir, assignedOfficer: selectedOfficer || null } : fir
    );
    setFirs(updatedFIRs);
    setAssignDialogOpen(false);
    
    if (detailsOpen) {
      setSelectedFIR({ ...selectedFIR, assignedOfficer: selectedOfficer || null });
    }
  };

  const handleOpenStatusDialog = (fir) => {
    setSelectedFIR(fir);
    setSelectedStatus(fir.status);
    setStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
  };

  const handleUpdateStatus = () => {
    const updatedFIRs = firs.map(fir => 
      fir.id === selectedFIR.id ? { ...fir, status: selectedStatus } : fir
    );
    setFirs(updatedFIRs);
    setStatusDialogOpen(false);
    
    if (detailsOpen) {
      setSelectedFIR({ ...selectedFIR, status: selectedStatus });
    }
  };

  const handleOpenFilterDialog = () => {
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setFilterDialogOpen(false);
  };

  const handleApplyFilters = () => {
    setFilterDialogOpen(false);
    setPage(0);
  };

  const handleResetFilters = () => {
    setFilters({
      status: '',
      category: '',
      date: '',
      assignedOfficer: ''
    });
    setPage(0);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      'Pending': { color: 'warning', icon: <Schedule /> },
      'Under Investigation': { color: 'info', icon: <Search /> },
      'Resolved': { color: 'success', icon: <CheckCircle /> },
      'Closed': { color: 'error', icon: <ThumbDown /> }
    };
    
    const config = statusConfig[status] || { color: 'default', icon: <Info /> };
    
    return (
      <Chip 
        size="small" 
        color={config.color} 
        label={status}
        icon={config.icon}
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const handleGenerateReport = (fir) => {
    console.log('Generating PDF report for FIR:', fir.id);
    alert(`PDF report for FIR ${fir.id} would be generated here`);
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <>
      <Navbar title="FIR Management" />
      <Box sx={{ 
        bgcolor: 'grey.50',
        minHeight: '100vh',
        pb: 4
      }}>
        <Container maxWidth="xl" sx={{ pt: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
          {loading ? (
            <Box>
              <Skeleton variant="rectangular" height={100} sx={{ mb: 3, borderRadius: 2 }} />
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            </Box>
          ) : (
            <Fade in={!loading}>
              <Box>
                {/* Header Section */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: { xs: 2, md: 3 },
                    mb: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    color: 'white'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" gutterBottom>
                FIR Management
              </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Manage and track all First Information Reports
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        startIcon={<PictureAsPdf />}
                        onClick={() => handleGenerateReport({ id: 'all' })}
                        sx={{ 
                          bgcolor: 'white',
                          color: 'primary.main',
                          '&:hover': { bgcolor: 'grey.100' }
                        }}
                      >
                        Export All
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={() => window.location.reload()}
                        sx={{ 
                          color: 'white',
                          borderColor: 'white',
                          '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                        }}
                      >
                        Refresh
                      </Button>
                    </Box>
                  </Box>
                </Paper>

                {/* Search and Filter Bar */}
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
                        placeholder="Search FIRs by ID, title, location, or citizen name..."
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearch}
                        size={isMobile ? "small" : "medium"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                              <Search color="action" />
                      </InputAdornment>
                    ),
                          endAdornment: searchQuery && (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                onClick={() => setSearchQuery('')}
                              >
                                <Clear fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'background.paper'
                          }
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={handleOpenFilterDialog}
                          size={isMobile ? "small" : "medium"}
                >
                  Filters
                          {activeFiltersCount > 0 && (
                            <Badge badgeContent={activeFiltersCount} color="error" sx={{ ml: 1 }}>
                              <Box />
                            </Badge>
                          )}
                </Button>
                        {activeFiltersCount > 0 && (
                <Button
                            variant="text"
                            startIcon={<Clear />}
                            onClick={handleResetFilters}
                            size={isMobile ? "small" : "medium"}
                          >
                            Clear
                </Button>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Stats Cards */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="h4" fontWeight="bold" color="primary">
                          {filteredFIRs.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total FIRs
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="h4" fontWeight="bold" color="warning.main">
                          {filteredFIRs.filter(f => f.status === 'Pending').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pending
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="h4" fontWeight="bold" color="info.main">
                          {filteredFIRs.filter(f => f.status === 'Under Investigation').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Investigating
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="h4" fontWeight="bold" color="success.main">
                          {filteredFIRs.filter(f => f.status === 'Resolved').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Resolved
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* FIRs Table */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden'
                  }}
                >
                  {filteredFIRs.length === 0 ? (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                      <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No FIRs Found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchQuery || activeFiltersCount > 0 
                          ? 'Try adjusting your search or filters'
                          : 'No FIRs have been filed yet'}
                      </Typography>
                </Box>
              ) : (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.50' }}>
                              <TableCell sx={{ fontWeight: 600 }}>FIR ID</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Assigned To</TableCell>
                              <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                            {paginatedFIRs.map((fir) => (
                              <TableRow 
                                key={fir.id}
                                hover
                                sx={{ 
                                  cursor: 'pointer',
                                  '&:hover': { bgcolor: 'action.hover' }
                                }}
                                onClick={() => handleOpenDetails(fir)}
                              >
                            <TableCell>
                                  <Typography variant="body2" fontWeight={600} color="primary">
                                    {fir.id}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" fontWeight={500}>
                                    {fir.title}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {fir.date}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {fir.time}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip 
                                    label={fir.category} 
                                    size="small" 
                                    variant="outlined"
                                  />
                                </TableCell>
                                <TableCell>
                                  {getStatusChip(fir.status)}
                                </TableCell>
                                <TableCell>
                                  {fir.assignedOfficer ? (
                                    <Chip
                                      size="small"
                                      label={fir.assignedOfficer}
                                      color="primary"
                                      variant="outlined"
                                    />
                                  ) : (
                                <Chip
                                  size="small"
                                  label="Unassigned"
                                  color="default"
                                  variant="outlined"
                                />
                              )}
                            </TableCell>
                                <TableCell align="right">
                                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                <Tooltip title="View Details">
                                      <IconButton 
                                        size="small" 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenDetails(fir);
                                        }}
                                        color="primary"
                                      >
                                    <Visibility fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Assign Officer">
                                      <IconButton 
                                        size="small" 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenAssignDialog(fir);
                                        }}
                                        color="info"
                                      >
                                    <PersonAdd fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Update Status">
                                      <IconButton 
                                        size="small" 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenStatusDialog(fir);
                                        }}
                                        color="warning"
                                      >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Generate Report">
                                      <IconButton 
                                        size="small" 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleGenerateReport(fir);
                                        }}
                                        color="error"
                                      >
                                    <PictureAsPdf fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                        count={filteredFIRs.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{ borderTop: '1px solid', borderColor: 'divider' }}
                  />
                </>
              )}
            </Paper>
              </Box>
            </Fade>
          )}
      </Container>
      </Box>
      
      {/* FIR Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        {selectedFIR && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" fontWeight="600">
                    {selectedFIR.id}
              </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {selectedFIR.title}
                  </Typography>
                </Box>
                <IconButton onClick={handleCloseDetails} size="small">
                  <CloseFullscreen />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {getStatusChip(selectedFIR.status)}
                    <Chip 
                      label={selectedFIR.category} 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Date & Time
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {selectedFIR.date} at {selectedFIR.time}
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Location
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOn fontSize="small" color="action" />
                    {selectedFIR.location}
                  </Typography>
                </Grid>
                
                <Grid size={12}>
                  <Divider />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Reported By
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {selectedFIR.citizenName}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <Phone fontSize="small" color="action" />
                    {selectedFIR.citizenContact}
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Assigned Officer
                  </Typography>
                  {selectedFIR.assignedOfficer ? (
                    <Chip
                      label={selectedFIR.assignedOfficer}
                      color="primary"
                      variant="outlined"
                    />
                  ) : (
                    <Chip
                      label="Unassigned"
                      color="default"
                      variant="outlined"
                    />
                  )}
                </Grid>
                
                <Grid size={12}>
                  <Divider />
                </Grid>
                
                <Grid size={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Description
                  </Typography>
                  <Paper 
                    elevation={0}
                    variant="outlined" 
                    sx={{ p: 2, mt: 1, bgcolor: 'grey.50', borderRadius: 1 }}
                  >
                    <Typography variant="body1">
                      {selectedFIR.description}
                    </Typography>
                  </Paper>
                </Grid>
                
                {selectedFIR.latitude && selectedFIR.longitude && (
                  <Grid size={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Incident Location
                    </Typography>
                    <Card variant="outlined" sx={{ mt: 1 }}>
                      <CardContent sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50' }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <LocationOn sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            Map Component
                        </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Coordinates: {selectedFIR.latitude}, {selectedFIR.longitude}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button onClick={handleCloseDetails}>Close</Button>
              <Button
                variant="outlined"
                startIcon={<PersonAdd />}
                onClick={() => {
                  handleCloseDetails();
                  handleOpenAssignDialog(selectedFIR);
                }}
              >
                Assign Officer
              </Button>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => {
                  handleCloseDetails();
                  handleOpenStatusDialog(selectedFIR);
                }}
              >
                Update Status
              </Button>
              <Button
                variant="contained"
                startIcon={<PictureAsPdf />}
                onClick={() => handleGenerateReport(selectedFIR)}
              >
                Generate Report
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Assign Officer Dialog */}
      <Dialog
        open={assignDialogOpen}
        onClose={handleCloseAssignDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Assign Officer to {selectedFIR?.id}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="assign-officer-label">Select Officer</InputLabel>
            <Select
              labelId="assign-officer-label"
              value={selectedOfficer}
              onChange={(e) => setSelectedOfficer(e.target.value)}
              label="Select Officer"
            >
              <MenuItem value="">
                <em>None (Unassign)</em>
              </MenuItem>
              {officers.map((officer) => (
                <MenuItem key={officer.id} value={officer.name}>
                  {officer.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDialog}>Cancel</Button>
          <Button onClick={handleAssignOfficer} variant="contained">Assign</Button>
        </DialogActions>
      </Dialog>
      
      {/* Update Status Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={handleCloseStatusDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Update Status for {selectedFIR?.id}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="update-status-label">Status</InputLabel>
            <Select
              labelId="update-status-label"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Under Investigation">Under Investigation</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Cancel</Button>
          <Button onClick={handleUpdateStatus} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
      
      {/* Filters Dialog */}
      <Dialog
        open={filterDialogOpen}
        onClose={handleCloseFilterDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Filter FIRs</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="filter-status-label">Status</InputLabel>
                <Select
                  labelId="filter-status-label"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  label="Status"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Under Investigation">Under Investigation</MenuItem>
                  <MenuItem value="Resolved">Resolved</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="filter-category-label">Category</InputLabel>
                <Select
                  labelId="filter-category-label"
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="Theft">Theft</MenuItem>
                  <MenuItem value="Assault">Assault</MenuItem>
                  <MenuItem value="Property Damage">Property Damage</MenuItem>
                  <MenuItem value="Cybercrime">Cybercrime</MenuItem>
                  <MenuItem value="Public Nuisance">Public Nuisance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={filters.date}
                onChange={(e) => setFilters({...filters, date: e.target.value})}
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="filter-officer-label">Assigned Officer</InputLabel>
                <Select
                  labelId="filter-officer-label"
                  value={filters.assignedOfficer}
                  onChange={(e) => setFilters({...filters, assignedOfficer: e.target.value})}
                  label="Assigned Officer"
                >
                  <MenuItem value="">All Officers</MenuItem>
                  <MenuItem value="unassigned">Unassigned</MenuItem>
                  {officers.map((officer) => (
                    <MenuItem key={officer.id} value={officer.name}>
                      {officer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetFilters}>Reset</Button>
          <Button onClick={handleCloseFilterDialog}>Cancel</Button>
          <Button onClick={handleApplyFilters} variant="contained">Apply Filters</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default React.memo(FIRManagement);
