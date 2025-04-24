import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, Container, Typography, Grid, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchClassroomLogs } from '../api/logs';

const ClassroomLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await fetchClassroomLogs();
        setLogs(data);
      } catch (error) {
        console.error('Error loading logs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown Date';
    return format(timestamp.toDate(), 'PPpp');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Classroom Analysis Logs
      </Typography>
      <Grid container spacing={3}>
        {logs.map((log) => (
          <Grid item xs={12} md={6} lg={4} key={log.id}>
            <Card
              sx={{
                p: 3,
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out',
                },
              }}
              onClick={() => navigate(`/logs/${log.id}`)}
            >
              <Typography variant="h6" gutterBottom>
                Analysis Report
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(log.timestamp)}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Average Engagement: {log.averageEngagement}
              </Typography>
              <Typography variant="body1">
                Dominant Mood: {log.dominantMood}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ClassroomLogs; 