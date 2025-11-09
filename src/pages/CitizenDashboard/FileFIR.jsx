import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import {
  PersonOutline,
  LocationOn,
  Description,
  AttachFile,
  Check,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Navbar from "../../components/common/Navbar";
import { AuthContext } from "../../context/AuthContext";
import LocationPicker from "../../components/maps/LocationPicker";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

// Mock categories for AI auto-categorization suggestions
const crimeCategories = [
  "Theft",
  "Assault",
  "Burglary",
  "Fraud",
  "Cybercrime",
  "Property Damage",
  "Public Nuisance",
  "Traffic Violation",
  "Missing Person",
  "Others",
];

const steps = [
  "Personal Details",
  "Incident Details",
  "Location",
  "Evidence",
  "Review & Submit",
];

// Validation schemas for each step
const personalDetailsSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be 10 digits"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  address: Yup.string().required("Address is required"),
});

const incidentDetailsSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(50, "Please provide more details (at least 50 characters)"),
  date: Yup.date()
    .required("Date is required")
    .max(new Date(), "Date cannot be in the future"),
  time: Yup.string().required("Approximate time is required"),
  category: Yup.string().required("Category is required"),
});

const locationSchema = Yup.object({
  location: Yup.string().required("Location is required"),
  latitude: Yup.number().required("Please select a location on the map"),
  longitude: Yup.number().required("Please select a location on the map"),
});

const evidenceSchema = Yup.object({
  witnesses: Yup.string(),
  additionalInfo: Yup.string(),
  // File uploads will be handled separately
});

const FileFIR = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [activeStep, setActiveStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [success, setSuccess] = useState(false);
  const [submissionDateTime, setSubmissionDateTime] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 452);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 452);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Update the submission date time whenever the review page is shown
  useEffect(() => {
    if (activeStep === 4) {
      const now = new Date();
      setSubmissionDateTime(now.toLocaleString());
    }
  }, [activeStep]);
  
  // Get the validation schema for current step
  const getValidationSchema = () => {
    switch (activeStep) {
      case 0:
        return personalDetailsSchema;
      case 1:
        return Yup.object().shape({
          ...personalDetailsSchema.fields,
          ...incidentDetailsSchema.fields
        });
      case 2:
        return Yup.object().shape({
          ...personalDetailsSchema.fields,
          ...incidentDetailsSchema.fields,
          ...locationSchema.fields
        });
      case 3:
        return Yup.object().shape({
          ...personalDetailsSchema.fields,
          ...incidentDetailsSchema.fields,
          ...locationSchema.fields,
          ...evidenceSchema.fields
        });
      default:
        return Yup.object({});
    }
  };
  
  // Main formik instance
  const formik = useFormik({
    initialValues: {
      // Personal Details
      name: user?.name || "",
      phone: "",
      email: user?.email || "",
      address: "",

      // Incident Details
      title: "",
      description: "",
      date: "",
      time: "",
      category: "",

      // Location
      location: "",
      latitude: null,
      longitude: null,

      // Evidence
      witnesses: "",
      additionalInfo: "",
    },
    validationSchema: getValidationSchema(),
    onSubmit: async (values) => {
      setSubmitting(true);
      setError("");

      try {
        // Include the submission date time in the form data
        const submissionData = {
          ...values,
          files,
          submissionDateTime,
        };

        // Simulate API call
        console.log("Submitting FIR:", submissionData);

        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setSuccess(true);
        // After success, redirect after 3 seconds
        // setTimeout(() => {
        //   navigate("/citizen/status");
        // }, 3000);
      } catch {
        setError("Failed to submit FIR. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Handle next button click
  // Update your handleNext function
  const handleNext = async () => {
    // Mark all fields as touched for the current step
    const currentStepFields = Object.keys(getValidationSchema().fields);
    const touchedFields = {};
    currentStepFields.forEach((field) => {
      touchedFields[field] = true;
    });
    formik.setTouched({ ...formik.touched, ...touchedFields });

    // Validate form
    const errors = await formik.validateForm();
    const currentStepHasErrors = Object.keys(errors).some((error) =>
      currentStepFields.includes(error)
    );

    if (!currentStepHasErrors) {
      // If incident details step, simulate AI category suggestion
      if (
        activeStep === 1 &&
        formik.values.description &&
        !formik.values.category
      ) {
        simulateAICategorization(formik.values.description);
      }

      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  // Handle back button click
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Simulate AI categorization based on description
  const simulateAICategorization = (description) => {
    // Simple keyword-based simulation - would be replaced with actual NLP
    const lowerDesc = description.toLowerCase();
    let suggestions = [];

    if (
      lowerDesc.includes("stole") ||
      lowerDesc.includes("theft") ||
      lowerDesc.includes("stolen")
    ) {
      suggestions.push("Theft");
    }
    if (
      lowerDesc.includes("hit") ||
      lowerDesc.includes("attack") ||
      lowerDesc.includes("beat")
    ) {
      suggestions.push("Assault");
    }
    if (
      lowerDesc.includes("broke") ||
      lowerDesc.includes("entered") ||
      lowerDesc.includes("break-in")
    ) {
      suggestions.push("Burglary");
    }
    if (
      lowerDesc.includes("online") ||
      lowerDesc.includes("internet") ||
      lowerDesc.includes("hack")
    ) {
      suggestions.push("Cybercrime");
    }

    // If no specific matches, offer general suggestions
    if (suggestions.length === 0) {
      suggestions = crimeCategories.slice(0, 3);
    }

    setAiSuggestions(suggestions);
  };

  // Handle file upload
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  // Remove file from the list
  const handleRemoveFile = (fileToRemove) => {
    setFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };

  // Update location from map component
  const handleLocationSelected = (locationData) => {
    formik.setFieldValue("location", locationData.address);
    formik.setFieldValue("latitude", locationData.lat);
    formik.setFieldValue("longitude", locationData.lng);
  };

  // Render different step content based on activeStep
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Alert severity="warning" sx={{ mb: 3 }}>
              Do not file false reports or use this form for testing purposes.
              Filing a false FIR is a punishable offense.
            </Alert>
            <Typography variant="h6" gutterBottom>
              Your Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Full Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Phone Number"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="address"
                  name="address"
                  label="Residential Address"
                  multiline
                  rows={3}
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.address && Boolean(formik.errors.address)
                  }
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Incident Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Incident Title"
                  placeholder="e.g., Theft of Mobile Phone at Central Park"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="date"
                  name="date"
                  label="Incident Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="time"
                  name="time"
                  label="Approximate Time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={formik.values.time}
                  onChange={formik.handleChange}
                  error={formik.touched.time && Boolean(formik.errors.time)}
                  helperText={formik.touched.time && formik.errors.time}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Detailed Description"
                  multiline
                  rows={5}
                  placeholder="Please provide detailed information about what happened..."
                  value={formik.values.description}
                  onChange={(e) => {
                    formik.handleChange(e);
                    // If description length is sufficient, simulate AI categorization
                    if (e.target.value.length > 50) {
                      simulateAICategorization(e.target.value);
                    }
                  }}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={
                    formik.touched.category && Boolean(formik.errors.category)
                  }
                >
                  <InputLabel id="category-label">Incident Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    value={formik.values.category}
                    label="Incident Category"
                    onChange={formik.handleChange}
                  >
                    {crimeCategories.map((category) => (
                      <MenuItem
                        key={category}
                        value={category}
                        // Highlight AI suggested categories
                        sx={{
                          fontWeight: aiSuggestions.includes(category)
                            ? "bold"
                            : "normal",
                          bgcolor: aiSuggestions.includes(category)
                            ? "rgba(25, 118, 210, 0.08)"
                            : "transparent",
                        }}
                      >
                        {category}
                        {aiSuggestions.includes(category) && " (AI Suggested)"}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.category && formik.errors.category ? (
                    <FormHelperText>{formik.errors.category}</FormHelperText>
                  ) : (
                    aiSuggestions.length > 0 && (
                      <FormHelperText>
                        AI has suggested categories based on your description
                      </FormHelperText>
                    )
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Incident Location
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="location"
                  name="location"
                  label="Location Description"
                  placeholder="e.g., Near Central Park West entrance"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.location && Boolean(formik.errors.location)
                  }
                  helperText={formik.touched.location && formik.errors.location}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Select Location on Map
                </Typography>
                <Card variant="outlined">
                  <CardContent>
                    <LocationPicker
                      onLocationSelected={handleLocationSelected}
                    />

                    {/* Debug coordinates - for manual entry if needed */}
                    <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                      <TextField
                        label="Latitude"
                        variant="outlined"
                        size="small"
                        value={formik.values.latitude || ""}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "latitude",
                            parseFloat(e.target.value) || null
                          )
                        }
                        helperText="Auto-filled from map selection"
                      />
                      <TextField
                        label="Longitude"
                        variant="outlined"
                        size="small"
                        value={formik.values.longitude || ""}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "longitude",
                            parseFloat(e.target.value) || null
                          )
                        }
                        helperText="Auto-filled from map selection"
                      />
                    </Box>
                  </CardContent>
                </Card>

                {(formik.touched.latitude && formik.errors.latitude) ||
                (formik.touched.longitude && formik.errors.longitude) ? (
                  <FormHelperText error>
                    Please select a location on the map
                  </FormHelperText>
                ) : null}
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Evidence & Additional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Upload Photos or Documents (optional)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AttachFile />}
                  sx={{ mb: 2 }}
                >
                  Select Files
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>

                <Box sx={{ mt: 2 }}>
                  {files.length > 0 ? (
                    files.map((file, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 1,
                          mb: 1,
                          borderRadius: 1,
                          bgcolor: "rgba(0,0,0,0.03)",
                        }}
                      >
                        <Typography variant="body2">
                          {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </Typography>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleRemoveFile(file)}
                        >
                          Remove
                        </Button>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No files uploaded
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="witnesses"
                  name="witnesses"
                  label="Witnesses (if any)"
                  placeholder="Names and contact information of any witnesses"
                  multiline
                  rows={3}
                  value={formik.values.witnesses}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="additionalInfo"
                  name="additionalInfo"
                  label="Additional Information"
                  placeholder="Any other details you'd like to share"
                  multiline
                  rows={3}
                  value={formik.values.additionalInfo}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 4:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Your FIR
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Submission Timestamp: {submissionDateTime}
            </Typography>

            {/* Use the below style of show submission date you don't like the above one */}
            {/* <Box sx={{ mb: 4, p: 2, bgcolor: "primary.light", borderRadius: 1, color: "white" }}>
              <Typography variant="subtitle1" align="center">
                <strong>Submission Date & Time:</strong> {submissionDateTime}
              </Typography>
            </Box>
            <Typography variant="h6" gutterBottom>
              Review Your FIR
            </Typography> */}

            {/* Personal Details */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                <PersonOutline sx={{ mr: 1, verticalAlign: "middle" }} />
                Personal Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Name:</strong> {formik.values.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {formik.values.phone}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Email:</strong> {formik.values.email}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Address:</strong> {formik.values.address}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Incident Details */}
            <Box sx={{ my: 3 }}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                <Description sx={{ mr: 1, verticalAlign: "middle" }} />
                Incident Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Title:</strong> {formik.values.title}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Date:</strong> {formik.values.date}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Time:</strong> {formik.values.time}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Category:</strong> {formik.values.category}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Description:</strong>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      p: 1,
                      bgcolor: "rgba(0,0,0,0.03)",
                      borderRadius: 1,
                    }}
                  >
                    {formik.values.description}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Location */}
            <Box sx={{ my: 3 }}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                <LocationOn sx={{ mr: 1, verticalAlign: "middle" }} />
                Location
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Location:</strong> {formik.values.location}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Coordinates:</strong> {formik.values.latitude},{" "}
                    {formik.values.longitude}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Evidence & Additional Info */}
            <Box sx={{ my: 3 }}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                <AttachFile sx={{ mr: 1, verticalAlign: "middle" }} />
                Evidence & Additional Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Files:</strong>{" "}
                    {files.length > 0
                      ? `${files.length} file(s) attached`
                      : "No files attached"}
                  </Typography>
                  {files.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {files.map((file, index) => (
                        <Typography key={index} variant="body2">
                          - {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Grid>

                {formik.values.witnesses && (
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      <strong>Witnesses:</strong> {formik.values.witnesses}
                    </Typography>
                  </Grid>
                )}

                {formik.values.additionalInfo && (
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      <strong>Additional Information:</strong>{" "}
                      {formik.values.additionalInfo}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>

            <Alert severity="info" sx={{ mt: 3 }}>
              Please review all information carefully before submitting. Once
              submitted, a FIR cannot be edited directly.
            </Alert>
          </Box>
        );

      default:
        return "Unknown step";
    }
  };

  // If submission was successful, show success message
  if (success) {
    return (
      <>
        <Navbar title="Citizen Portal" />
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                bgcolor: "success.main",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Check sx={{ color: "white", fontSize: 40 }} />
            </Box>

            <Typography variant="h5" gutterBottom>
              FIR Successfully Submitted
            </Typography>

            <Typography variant="body1" align="center" paragraph>
              Your FIR has been successfully submitted. The FIR number is{" "}
              <strong>FIR00124</strong>.
            </Typography>

            <Typography variant="body1" align="center" sx={{ mb: 3 }}>
              You will receive notifications as your case progresses. You can
              also check the status anytime from your dashboard.
            </Typography>

            <Button
              variant="contained"
              onClick={() => navigate("/citizen/status")}
              sx={{ mt: 2 }}
            >
              View FIR Status
            </Button>
          </Paper>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar title="Citizen Portal" />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography component="h1" variant="h5" gutterBottom sx={{ mb: 3 }}>
            File a New FIR
          </Typography>

          <Box sx={{ mb: 4 }}>
            {isMobile ? (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  Step {activeStep + 1} of {steps.length}
                </Typography>
                <Typography variant="h6">{steps[activeStep]}</Typography>
              </Box>
            ) : (
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit}>
            {getStepContent(activeStep)}

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>

              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowConfirmation(true)}
                    disabled={submitting}
                    sx={{ minWidth: 100 }}
                  >
                    {submitting ? <CircularProgress size={24} /> : "Submit"}
                  </Button>
                ) : (
                  <Button variant="contained" onClick={handleNext}>
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>

      <Dialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
      >
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit this FIR? Once submitted, it cannot
            be edited.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmation(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setShowConfirmation(false);
              formik.submitForm();
            }}
            variant="contained"
          >
            Confirm Submission
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FileFIR;
