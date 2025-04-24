import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  Grid,
  Box,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import { fetchLogDetail } from '../api/logs';

const LogDetail = () => {
  const { logId } = useParams();
  const [logData, setLogData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogDetail = async () => {
      try {
        const data = await fetchLogDetail(logId);
        setLogData(data);
      } catch (error) {
        console.error('Error loading log details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLogDetail();
  }, [logId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!logData) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          Error loading log data
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Classroom Analysis Report
      </Typography>

      {/* Overall Summary */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Overall Summary
        </Typography>
        <Typography variant="body1">{logData.overallSummary}</Typography>
        <Box sx={{ mt: 2 }}>
          <Chip
            label={`Average Engagement: ${logData.averageEngagement}/10`}
            color="primary"
            sx={{ mr: 1 }}
          />
          <Chip
            label={`Dominant Mood: ${logData.dominantMood}`}
            color="secondary"
          />
        </Box>
      </Card>

      {/* Teaching Strategy Suggestions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Teaching Strategy Suggestions
            </Typography>
            <List>
              {logData.teachingStrategySuggestions.map((suggestion, index) => (
                <ListItem key={index}>
                  <ListItemText primary={suggestion} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Teaching Effectiveness
            </Typography>
            <Typography variant="body1">
              {logData.teachingEffectivenessAssessment}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Individual Student Insights */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Individual Student Insights
      </Typography>
      <Grid container spacing={2}>
        {logData.individualStudentInsights.map((student) => (
          <Grid item xs={12} sm={6} md={4} key={student.id}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Student {student.id}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Engagement Level: {student.engagementLevel}/10
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Emotional State: {student.emotionalState}
              </Typography>
              <Typography variant="body2">{student.remarks}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default LogDetail; 