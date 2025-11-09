import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  AssignmentTurnedIn,
  Schedule,
  ThumbDown,
  Visibility,
  KeyboardArrowDown,
  KeyboardArrowUp,
  DescriptionOutlined,
  PersonOutline,
  EventNote,
  Comment,
  Download,
  Notifications,
  NotificationsActive
} from '@mui/icons-material';
import Navbar from '../../components/common/Navbar';

// Dummy data for demo
const sampleFIRs = [
  {
    id: 'FIR00123',
    title: 'Theft of Mobile Phone',
    date: '2023-05-10',
    status: 'Under Investigation',
    category: 'Theft',
    location: 'Central Park',
    officer: 'Officer John Doe',
    description: 'My mobile phone was stolen while I was walking through Central Park around 5 PM...',
    statusUpdates: [
      { date: '2023-05-10', status: 'Filed', comment: 'FIR submitted successfully' },
      { date: '2023-05-11', status: 'Under Review', comment: 'FIR is under initial review' },
      { date: '2023-05-12', status: 'Assigned', comment: 'Officer John Doe has been assigned to your case' },
      { date: '2023-05-15', status: 'Under Investigation', comment: 'Investigation is in progress' }
    ]
  },
  {
    id: 'FIR00122',
    title: 'Vehicle Damage',
    date: '2023-04-28',
    status: 'Resolved',
    category: 'Property Damage',
    location: 'Main Street Parking',
    officer: 'Officer Jane Smith',
    description: 'Found my car with a large scratch on the driver\'s side door in the parking lot...',
    statusUpdates: [
      { date: '2023-04-28', status: 'Filed', comment: 'FIR submitted successfully' },
      { date: '2023-04-29', status: 'Under Review', comment: 'FIR is under initial review' },
      { date: '2023-04-30', status: 'Assigned', comment: 'Officer Jane Smith has been assigned to your case' },
      { date: '2023-05-05', status: 'Under Investigation', comment: 'Investigation is in progress' },
      { date: '2023-05-10', status: 'Resolved', comment: 'Case resolved - Insurance company has been notified' }
    ]
  },
  {
    id: 'FIR00120',
    title: 'Noise Complaint',
    date: '2023-04-15',
    status: 'Closed',
    category: 'Public Nuisance',
    location: 'Residential Area 7',
    officer: 'Officer Mike Johnson',
    description: 'Continuous loud noise from neighboring apartment during late night hours...',
    statusUpdates: [
      { date: '2023-04-15', status: 'Filed', comment: 'FIR submitted successfully' },
      { date: '2023-04-16', status: 'Under Review', comment: 'FIR is under initial review' },
      { date: '2023-04-17', status: 'Assigned', comment: 'Officer Mike Johnson has been assigned to your case' },
      { date: '2023-04-20', status: 'Under Investigation', comment: 'Investigation is in progress' },
      { date: '2023-04-25', status: 'Closed', comment: 'No further action will be taken at this time' }
    ]
  }
];

const getStatusIcon = (status) => {
  switch(status) {
    case 'Under Investigation':
    case 'Under Review':
    case 'Assigned':
      return <Schedule color="warning" />;
    case 'Resolved':
      return <AssignmentTurnedIn color="success" />;
    case 'Closed':
      return <ThumbDown color="error" />;
    default:
      return <DescriptionOutlined />;
  }
};

const getStatusColor = (status) => {
  switch(status) {
    case 'Under Investigation':
    case 'Under Review':
    case 'Assigned':
      return 'warning';
    case 'Resolved':
      return 'success';
    case 'Closed':
      return 'error';
    default:
      return 'default';
  }
};

const StatusCheck = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const firIdFromQuery = queryParams.get('id');
  
  const [searchQuery, setSearchQuery] = useState(firIdFromQuery || '');
  const [expandedId, setExpandedId] = useState(firIdFromQuery || null);
  const [filteredFIRs, setFilteredFIRs] = useState(
    firIdFromQuery 
      ? sampleFIRs.filter(fir => fir.id === firIdFromQuery) 
      : sampleFIRs
  );

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredFIRs(sampleFIRs);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = sampleFIRs.filter(fir => 
      fir.id.toLowerCase().includes(query) || 
      fir.title.toLowerCase().includes(query) ||
      fir.category.toLowerCase().includes(query)
    );
    
    setFilteredFIRs(filtered);
  };

  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <Navbar title="Citizen Portal" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography component="h1" variant="h5">
              Track FIR Status
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                size="small"
                placeholder="Search by FIR ID or Title"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearch} edge="end">
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          </Box>
          
          {filteredFIRs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No FIRs found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try a different search or check if the FIR ID is correct
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>FIR ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredFIRs.map((fir) => (
                    <React.Fragment key={fir.id}>
                      <TableRow 
                        hover
                        sx={{ 
                          '&:hover': { cursor: 'pointer' },
                          bgcolor: expandedId === fir.id ? 'rgba(0, 0, 0, 0.04)' : 'inherit'
                        }}
                        onClick={() => handleToggleExpand(fir.id)}
                      >
                        <TableCell padding="checkbox">
                          {expandedId === fir.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </TableCell>
                        <TableCell>{fir.id}</TableCell>
                        <TableCell>{fir.title}</TableCell>
                        <TableCell>{fir.date}</TableCell>
                        <TableCell>{fir.category}</TableCell>
                        <TableCell>
                          <Chip 
                            icon={getStatusIcon(fir.status)} 
                            label={fir.status} 
                            size="small" 
                            color={getStatusColor(fir.status)} 
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            color="primary" 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleExpand(fir.id);
                            }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                          <IconButton 
                            color="primary" 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Download PDF for", fir.id);
                            }}
                          >
                            <Download fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Detail Row */}
                      {expandedId === fir.id && (
                        <TableRow>
                          <TableCell colSpan={7} sx={{ py: 0 }}>
                            <Box sx={{ p: 3 }}>
                              <Grid container spacing={3}>
                                {/* Left Column - FIR Details */}
                                <Grid item xs={12} md={6}>
                                  <Card variant="outlined">
                                    <CardContent>
                                      <Typography variant="h6" gutterBottom color="primary">
                                        FIR Details
                                      </Typography>
                                      
                                      <List dense>
                                        <ListItem>
                                          <ListItemIcon>
                                            <DescriptionOutlined />
                                          </ListItemIcon>
                                          <ListItemText 
                                            primary="Title" 
                                            secondary={fir.title} 
                                          />
                                        </ListItem>
                                        
                                        <ListItem>
                                          <ListItemIcon>
                                            <EventNote />
                                          </ListItemIcon>
                                          <ListItemText 
                                            primary="Date Filed" 
                                            secondary={fir.date} 
                                          />
                                        </ListItem>
                                        
                                        <ListItem>
                                          <ListItemIcon>
                                            <PersonOutline />
                                          </ListItemIcon>
                                          <ListItemText 
                                            primary="Assigned Officer" 
                                            secondary={fir.officer} 
                                          />
                                        </ListItem>
                                        
                                        <ListItem>
                                          <ListItemIcon>
                                            <Comment />
                                          </ListItemIcon>
                                          <ListItemText 
                                            primary="Description" 
                                            secondary={fir.description} 
                                            secondaryTypographyProps={{
                                              style: {
                                                whiteSpace: 'normal',
                                                overflow: 'visible'
                                              }
                                            }}
                                          />
                                        </ListItem>
                                      </List>
                                      
                                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                          startIcon={<Download />}
                                          variant="outlined"
                                          size="small"
                                          onClick={() => console.log("Download PDF for", fir.id)}
                                        >
                                          Download Report
                                        </Button>
                                      </Box>
                                    </CardContent>
                                  </Card>
                                </Grid>
                                
                                {/* Right Column - Status Timeline */}
                                <Grid item xs={12} md={6}>
                                  <Card variant="outlined">
                                    <CardContent>
                                      <Typography variant="h6" gutterBottom color="primary">
                                        Status Timeline
                                      </Typography>
                                      
                                      <Stepper orientation="vertical" sx={{ mt: 2 }}>
                                        {fir.statusUpdates.map((update, index) => (
                                          <Step key={index} active={true} completed={true}>
                                            <StepLabel 
                                              StepIconComponent={() => (
                                                <Box sx={{ 
                                                  bgcolor: getStatusColor(update.status) + '.main', 
                                                  borderRadius: '50%', 
                                                  width: 24, 
                                                  height: 24, 
                                                  display: 'flex', 
                                                  alignItems: 'center', 
                                                  justifyContent: 'center' 
                                                }}>
                                                  {index === fir.statusUpdates.length - 1 && <NotificationsActive sx={{ fontSize: 16, color: 'white' }} />}
                                                  {index !== fir.statusUpdates.length - 1 && <Notifications sx={{ fontSize: 16, color: 'white' }} />}
                                                </Box>
                                              )}
                                            >
                                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" fontWeight={index === fir.statusUpdates.length - 1 ? 'bold' : 'normal'}>
                                                  {update.status}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                  {update.date}
                                                </Typography>
                                              </Box>
                                            </StepLabel>
                                            <StepContent>
                                              <Typography variant="body2">
                                                {update.comment}
                                              </Typography>
                                            </StepContent>
                                          </Step>
                                        ))}
                                      </Stepper>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              </Grid>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default StatusCheck;