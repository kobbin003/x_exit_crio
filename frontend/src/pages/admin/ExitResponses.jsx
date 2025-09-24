import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ExitResponses = () => {
  const [exitResponses, setExitResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExitResponses();
  }, []);

  const fetchExitResponses = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getExitResponses();
      setExitResponses(response.data.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch exit responses';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
        Exit Interview Responses
      </Typography>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        Review completed exit interview questionnaires from employees.
      </Typography>

      {exitResponses.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No exit interview responses found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Exit interview responses will appear here once employees complete their questionnaires.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ mt: 3 }}>
          {exitResponses.map((exitResponse, index) => (
            <Accordion key={index} sx={{ mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography variant="h6">
                  Employee ID: {exitResponse.employeeId}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  {exitResponse.responses.map((response, responseIndex) => (
                    <Box key={responseIndex} sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Question {responseIndex + 1}:
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {response.questionText}
                      </Typography>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Response:
                      </Typography>
                      <Paper
                        variant="outlined"
                        sx={{ p: 2, mt: 1, backgroundColor: 'grey.50' }}
                      >
                        <Typography variant="body1">
                          {response.response}
                        </Typography>
                      </Paper>
                      {responseIndex < exitResponse.responses.length - 1 && (
                        <Divider sx={{ mt: 2 }} />
                      )}
                    </Box>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      <Paper sx={{ p: 3, mt: 4, backgroundColor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="body2">
          <strong>Note:</strong> These responses are confidential and should be used to improve
          workplace policies and employee experience. Please handle this information with care
          and in accordance with company privacy policies.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ExitResponses;