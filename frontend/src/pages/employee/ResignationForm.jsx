import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { employeeAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ResignationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lwd: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Check if user already has a resignation submitted
  React.useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData?.userId) {
      const existingResignation = localStorage.getItem(`resignation_${userData.userId}`);
      if (existingResignation) {
        const resignationData = JSON.parse(existingResignation);
        if (resignationData.status === 'pending') {
          toast.error('You already have a pending resignation request');
          navigate('/employee/dashboard');
        }
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await employeeAPI.submitResignation(formData);

      // Store resignation status in localStorage
      const resignationData = {
        status: 'pending',
        lwd: formData.lwd,
        reason: formData.reason,
        submittedAt: new Date().toISOString()
      };

      // Get user ID from localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData?.userId) {
        localStorage.setItem(`resignation_${userData.userId}`, JSON.stringify(resignationData));

        // Emit event to notify dashboard
        window.dispatchEvent(new CustomEvent('resignationSubmitted', {
          detail: resignationData
        }));
      }

      setSuccess(true);
      toast.success('Resignation submitted successfully!');

      // Reset form
      setFormData({ lwd: '', reason: '' });

      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate('/employee/dashboard');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit resignation';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box>
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="h6">Resignation Submitted Successfully!</Typography>
          <Typography>
            Your resignation request has been submitted and is pending HR approval.
            You will be redirected to the dashboard shortly.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Submit Resignation
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom>
          Resignation Request Form
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="reason"
            label="Reason for Resignation"
            name="reason"
            multiline
            rows={3}
            value={formData.reason}
            onChange={handleChange}
            helperText="Please provide your reason for resignation"
            sx={{ mb: 3 }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="lwd"
            label="Last Working Day"
            name="lwd"
            type="date"
            value={formData.lwd}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            helperText="Select your intended last working day (cannot be weekends or holidays)"
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/employee/dashboard')}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Important Notes:</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Last working day cannot be on weekends
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Last working day cannot be on public holidays
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Must be a future date
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • You can only have one pending resignation at a time
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Please provide a clear reason for your resignation
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResignationForm;