import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Resignations = () => {
  const [resignations, setResignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResignation, setSelectedResignation] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
  const [formData, setFormData] = useState({
    lwd: '',
    rejectionReason: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchResignations();
  }, []);

  const fetchResignations = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllResignations();
      setResignations(response.data.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch resignations';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (resignation, action) => {
    setSelectedResignation(resignation);
    setActionType(action);
    setFormData({
      lwd: action === 'approve' ? resignation.lwd : '',
      rejectionReason: '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const payload = {
        resignationId: selectedResignation._id,
        approved: actionType === 'approve',
      };

      if (actionType === 'approve') {
        if (!formData.lwd) {
          toast.error('Last working day is required for approval');
          setSubmitting(false);
          return;
        }
        payload.lwd = formData.lwd;
      } else {
        if (!formData.rejectionReason) {
          toast.error('Rejection reason is required');
          setSubmitting(false);
          return;
        }
        payload.rejectionReason = formData.rejectionReason;
      }

      await adminAPI.concludeResignation(payload);

      toast.success(
        `Resignation ${actionType === 'approve' ? 'approved' : 'rejected'} successfully!`
      );

      // Refresh the list
      fetchResignations();

      // Close dialog
      setDialogOpen(false);
      setSelectedResignation(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Failed to ${actionType} resignation`;
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Employee Resignations
      </Typography>

      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee ID</TableCell>
                <TableCell>Last Working Day</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resignations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No resignations found
                  </TableCell>
                </TableRow>
              ) : (
                resignations.map((resignation) => (
                  <TableRow key={resignation._id}>
                    <TableCell>{resignation.employeeId}</TableCell>
                    <TableCell>{resignation.lwd}</TableCell>
                    <TableCell>
                      <Chip
                        label={resignation.status.toUpperCase()}
                        color={getStatusColor(resignation.status)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {resignation.status === 'pending' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleAction(resignation, 'approve')}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleAction(resignation, 'reject')}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                      {resignation.status !== 'pending' && (
                        <Typography variant="body2" color="text.secondary">
                          {resignation.status === 'approved' ? 'Approved' : 'Rejected'}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Dialog */}
      <Dialog open={dialogOpen} onClose={() => !submitting && setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'approve' ? 'Approve Resignation' : 'Reject Resignation'}
        </DialogTitle>
        <DialogContent>
          {actionType === 'approve' ? (
            <TextField
              margin="normal"
              required
              fullWidth
              id="lwd"
              label="Final Last Working Day"
              name="lwd"
              type="date"
              value={formData.lwd}
              onChange={(e) => setFormData({ ...formData, lwd: e.target.value })}
              InputLabelProps={{ shrink: true }}
              helperText="Confirm or modify the last working day"
            />
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              id="rejectionReason"
              label="Rejection Reason"
              name="rejectionReason"
              multiline
              rows={3}
              value={formData.rejectionReason}
              onChange={(e) => setFormData({ ...formData, rejectionReason: e.target.value })}
              helperText="Please provide a reason for rejection"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color={actionType === 'approve' ? 'success' : 'error'}
            disabled={submitting}
          >
            {submitting ? 'Processing...' : (actionType === 'approve' ? 'Approve' : 'Reject')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Resignations;