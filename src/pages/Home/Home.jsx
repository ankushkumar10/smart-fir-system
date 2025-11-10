import React, { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import {
  Report,
  Search,
  Security,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";

const Home = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const navigationLinks = isAuthenticated
    ? [
        {
          text: "Dashboard",
          to: user?.role === "police" ? "/police" : "/citizen",
        },
        {
          text: "Logout",
          action: logout,
        },
      ]
    : [
        {
          text: "Login",
          to: "/login",
        },
        {
          text: "Register",
          to: "/register",
        },
      ];

  return (
    <>
      {/* Responsive AppBar */}
      <AppBar position="sticky" elevation={1}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* Logo/Brand for all screen sizes */}
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
                fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                flexGrow: { xs: 1, md: 0 },
              }}
            >
              Smart FIR System
            </Typography>

            {/* Mobile menu button */}
            {isMobile ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              // Navigation links for tablet and desktop
              <Box sx={{ display: "flex", gap: 2 }}>
                {navigationLinks.map((link) =>
                  link.to ? (
                    <Button
                      key={link.text}
                      component={RouterLink}
                      to={link.to}
                      color="inherit"
                      sx={{ fontWeight: 500 }}
                    >
                      {link.text}
                    </Button>
                  ) : (
                    <Button
                      key={link.text}
                      color="inherit"
                      onClick={link.action}
                      sx={{ fontWeight: 500 }}
                    >
                      {link.text}
                    </Button>
                  )
                )}
              </Box>
            )}

            {/* Mobile drawer */}
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <List>
                  {navigationLinks.map((link) => (
                    <ListItem
                      key={link.text}
                      component={link.to ? RouterLink : "button"}
                      to={link.to}
                      onClick={link.action}
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <ListItemText primary={link.text} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section - Responsive padding and font sizes */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3, md: 4 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3.5rem" },
              fontWeight: 700,
              lineHeight: 1.2,
            }}
            gutterBottom
          >
            AI-Powered Smart FIR & Crime Analytics
          </Typography>
          <Typography
            variant="h5"
            component="div"
            paragraph
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              maxWidth: "800px",
              mx: "auto",
              mb: { xs: 3, sm: 4 },
            }}
          >
            File complaints, track status, and help make communities safer.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size={isMobile ? "medium" : "large"}
            component={RouterLink}
            to={
              isAuthenticated
                ? user?.role === "citizen"
                  ? "/citizen/file-fir"
                  : "/police"
                : "/register"
            }
            sx={{
              mt: 2,
              px: { xs: 3, sm: 4 },
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            {isAuthenticated
              ? user?.role === "citizen"
                ? "File New FIR"
                : "Go to Police Dashboard"
              : "Get Started"}
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{
            mb: { xs: 3, sm: 5 },
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            fontWeight: 600,
          }}
        >
          Key Features
        </Typography>

        <Grid
          container
          spacing={{ xs: 2, sm: 4, md: 6 }}
          alignItems="stretch"
          justifyContent="center"
          sx={{
            maxWidth: 1400,
            mx: "auto",
            py: { xs: 4, md: 8 },
          }}
        >
          {/* Feature 1 */}
          <Grid item xs={12} sm={6} md={4} sx={{ width: {md: '400px'} }}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
                borderRadius: 2,
              }}
            >
              <Report
                sx={{
                  fontSize: { xs: 40, md: 60 },
                  color: "primary.main",
                  mb: { xs: 1, sm: 2 },
                }}
              />
              <Typography
                variant="h5"
                component="h3"
                align="center"
                gutterBottom
                sx={{
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                  fontWeight: 600,
                }}
              >
                Easy FIR Filing
              </Typography>
              <Typography
                align="center"
                sx={{
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
              >
                File complaints quickly with our streamlined digital process and
                AI-assistance for categorization.
              </Typography>
            </Paper>
          </Grid>

          {/* Feature 2 */}
          <Grid item xs={12} sm={6} md={4} sx={{ width: {md: '400px'} }}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3 },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <Search
                sx={{
                  fontSize: { xs: 40, md: 60 },
                  color: "primary.main",
                  mb: { xs: 1, sm: 2 },
                }}
              />
              <Typography
                variant="h5"
                component="h3"
                align="center"
                gutterBottom
                sx={{
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                  fontWeight: 600,
                }}
              >
                Real-Time Tracking
              </Typography>
              <Typography
                align="center"
                sx={{
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
              >
                Monitor the status of your complaint in real-time with detailed
                updates from authorities.
              </Typography>
            </Paper>
          </Grid>

          {/* Feature 3 */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            sx={{
              mx: { xs: "auto", sm: 0 },
              width: { xs: "100%", sm: "auto", md: '400px' },
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3 },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <Security
                sx={{
                  fontSize: { xs: 40, md: 60 },
                  color: "primary.main",
                  mb: { xs: 1, sm: 2 },
                }}
              />
              <Typography
                variant="h5"
                component="h3"
                align="center"
                gutterBottom
                sx={{
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                  fontWeight: 600,
                }}
              >
                Enhanced Police Response
              </Typography>
              <Typography
                align="center"
                sx={{
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
              >
                Police officials can efficiently manage cases with advanced
                filtering, search, and analytics.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: "secondary.light", py: { xs: 4, sm: 6 } }}>
        <Container maxWidth="md">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 3, sm: 4 }}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="h5"
              component="p"
              sx={{
                textAlign: { xs: "center", sm: "left" },
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              Ready to get started with digital FIR filing?
            </Typography>
            <Button
              variant="contained"
              size={isMobile ? "medium" : "large"}
              component={RouterLink}
              to={isAuthenticated ? "/citizen/file-fir" : "/register"}
              sx={{
                px: { xs: 3, sm: 4 },
                whiteSpace: "nowrap",
                fontWeight: 600,
              }}
            >
              {isAuthenticated ? "File New FIR" : "Create Account"}
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: "grey.200",
          p: { xs: 3, md: 6 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.75rem", md: "0.875rem" },
              mb: { xs: 1, sm: 2 },
            }}
          >
            © {new Date().getFullYear()} AI-Powered Smart FIR & Crime Analytics
            System
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.75rem", md: "0.875rem" },
            }}
          >
            All rights reserved. For assistance, please contact support.
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default Home;
