import React, { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Chip,
  useTheme,
  useMediaQuery,
  Stack,
  Fade
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Dashboard,
  ReportProblem,
  TrackChanges,
  BarChart,
  Assignment,
  Person,
  ExitToApp,
  Close,
  Security
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';

const Navbar = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifications] = useState(3); // Mock notification count

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate('/');
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const citizenMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/citizen' },
    { text: 'File FIR', icon: <ReportProblem />, path: '/citizen/file-fir' },
    { text: 'Track Status', icon: <TrackChanges />, path: '/citizen/status' },
  ];

  const policeMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/police' },
    { text: 'FIR Management', icon: <Assignment />, path: '/police/fir-management' },
    { text: 'Analytics', icon: <BarChart />, path: '/police/analytics' },
  ];

  const menuItems = user?.role === 'police' ? policeMenuItems : citizenMenuItems;

  const isActiveRoute = (path) => {
    // For dashboard specifically (special case)
    if (path === '/citizen' || path === '/police') {
      return location.pathname === path;
    }
    // For other routes
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const drawer = (
    <Box 
      sx={{ 
        width: { xs: 280, sm: 320 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }} 
      role="presentation"
    >
      {/* Drawer Header */}
      <Box 
        sx={{ 
          p: 3,
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)',
              width: 48,
              height: 48,
              fontWeight: 'bold'
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="600">
              {user?.name || 'User'}
            </Typography>
            <Chip 
              label={user?.role === 'police' ? 'Police Officer' : 'Citizen'}
              size="small"
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                height: 20,
                fontSize: '0.7rem',
                mt: 0.5
              }}
            />
          </Box>
        </Box>
        <IconButton 
          onClick={toggleDrawer(false)}
          sx={{ color: 'white' }}
        >
          <Close />
        </IconButton>
      </Box>

      <Divider />

      {/* Navigation Items */}
      <List sx={{ flex: 1, pt: 2 }}>
        {menuItems.map((item) => {
          const active = isActiveRoute(item.path);
          return (
            <ListItem 
              key={item.text} 
              component={RouterLink} 
              to={item.path}
              onClick={toggleDrawer(false)}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 2,
                bgcolor: active ? 'primary.main' : 'transparent',
                color: active ? 'white' : 'text.primary',
                '&:hover': {
                  bgcolor: active ? 'primary.dark' : 'action.hover',
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <ListItemIcon sx={{ color: active ? 'white' : 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: active ? 600 : 400
                }}
              />
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Drawer Footer */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ExitToApp />}
          onClick={() => {
            toggleDrawer(false)();
            handleLogout();
          }}
          sx={{ 
            borderColor: 'error.main',
            color: 'error.main',
            '&:hover': {
              borderColor: 'error.dark',
              bgcolor: 'error.50'
            }
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(10px)',
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar 
            disableGutters
            sx={{ 
              minHeight: { xs: 56, sm: 64, md: 70 }, // Adjusted height for different breakpoints
              px: { xs: 1, sm: 2 },
              py: 1, // Added vertical padding
              display: 'flex',
              flexWrap: 'wrap', // Allow wrapping on very small screens
              justifyContent: 'space-between' // Better spacing between items
            }}
          >
            {/* Mobile Menu Button */}
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ 
                mr: 1, 
                display: { xs: 'flex', md: 'none' },
                color: 'white'
              }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Logo/Title */}
            <Box
              component={RouterLink}
              to={user ? (user.role === 'police' ? '/police' : '/citizen') : '/'}
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                flexGrow: { xs: 1, md: 0 },
                mr: { xs: 1, md: 3 }
              }}
            >
              <Security sx={{ mr: 1, fontSize: { xs: 24, md: 28 } }} />
              <Typography
                variant={isMobile ? "h6" : "h5"}
                noWrap
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                {title || 'Smart FIR System'}
              </Typography>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  display: { xs: 'block', sm: 'none' }
                }}
              >
                {title || 'FIR'}
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: { md: 1, lg: 2 } }}>
              {menuItems.map((item) => {
                const active = isActiveRoute(item.path);
                return (
                  <Button
                    key={item.text}
                    component={RouterLink}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      my: 1,
                      color: active ? 'white' : 'rgba(255,255,255,0.8)',
                      display: 'flex',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      bgcolor: active ? 'rgba(255,255,255,0.2)' : 'transparent',
                      fontWeight: active ? 600 : 400,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.15)',
                        color: 'white'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    {item.text}
                  </Button>
                );
              })}
            </Box>

            {/* Right Side Actions */}
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton 
                  sx={{ 
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  <Badge badgeContent={notifications} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              {/* User Menu */}
              <Tooltip title="Account settings">
                <IconButton 
                  onClick={handleOpenUserMenu} 
                  sx={{ 
                    p: 0,
                    border: '2px solid',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.5)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <Avatar 
                    alt={user?.name || 'User'} 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 'bold',
                      width: 40,
                      height: 40
                    }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ 
                  mt: '50px',
                  '& .MuiPaper-root': {
                    borderRadius: 2,
                    minWidth: 200,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                  }
                }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {user?.name || 'User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email || 'user@example.com'}
                  </Typography>
                  <Chip 
                    label={user?.role === 'police' ? 'Police Officer' : 'Citizen'}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mt: 1, fontSize: '0.7rem' }}
                  />
                </Box>
                <MenuItem 
                  component={RouterLink} 
                  to="/profile" 
                  onClick={handleCloseUserMenu}
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  <Typography>Profile</Typography>
                </MenuItem>
                <Divider />
                <MenuItem 
                  onClick={handleLogout}
                  sx={{
                    py: 1.5,
                    color: 'error.main',
                    '&:hover': {
                      bgcolor: 'error.50'
                    }
                  }}
                >
                  <ListItemIcon>
                    <ExitToApp fontSize="small" color="error" />
                  </ListItemIcon>
                  <Typography>Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer 
        anchor="left" 
        open={drawerOpen} 
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: { xs: 280, sm: 320 }
          }
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default React.memo(Navbar);
