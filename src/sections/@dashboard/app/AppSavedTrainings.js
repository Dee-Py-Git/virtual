import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';
import { Box, Stack, Link, Card, Button, Divider, Typography, CardHeader, IconButton, Drawer } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableRow, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Scrollbar from '../../../components/scrollbar';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function AppSavedTrainings({ title, trainings = [], onDeleteTraining }) {
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg')); // Detect large screens

  // Function to handle viewing training details
  const handleViewDetails = (training) => {
    setSelectedTraining(training);
    setDrawerOpen(true); // Open the drawer when the eye button is clicked
  };

  // Function to close the drawer
  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedTraining(null); // Clear the selected training
  };

  const handleDeleteTraining = async (trainingId) => {
    try {
      const token = localStorage.getItem('userToken'); // Get token from local storage
      await axios.delete(`http://127.0.0.1:5000/delete-my-saved-training/${trainingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onDeleteTraining(trainingId); // Call the prop function to remove the training from the frontend
    } catch (error) {
      console.error('Error deleting training:', error);
    }
  };

  return (
    <>
      <Card sx={{ display: 'flex', flexDirection: 'column', height: '465px' }}>
        <CardHeader title={title} />

        <Scrollbar sx={{ maxHeight: '465px', flexGrow: 1 }}>
          <Stack spacing={5} sx={{ p: 3, pr: 0 }}>
            {trainings.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                Nog geen trainingen opgeslagen..
              </Typography>
            ) : (
              trainings.map((training) => (
                <TrainingItem
                  key={training.id}
                  training={training}
                  onViewDetails={handleViewDetails}
                  onDeleteTraining={handleDeleteTraining}
                />
              ))
            )}
          </Stack>
        </Scrollbar>

        <Divider />

        <Box sx={{ p: 3, textAlign: 'right' }}>
          <Button size="small" color="inherit" endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}>
            View all
          </Button>
        </Box>
      </Card>

      {/* Drawer for showing details of the selected training */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: { width: isLargeScreen ? '25%' : '75%' }, // Adjust drawer width based on screen size
        }}
      >
        {selectedTraining && (
          <Box p={3}>
            <IconButton onClick={handleDrawerClose} sx={{ mb: 2 }}>
              <CloseIcon />
            </IconButton>

            {/* Display selected training details */}
            <Typography variant="h5" gutterBottom>
              {selectedTraining.title}
            </Typography>

            {/* Training Details */}
            <Typography variant="body2" color="textPrimary" component="span">
              Doel:
            </Typography>
            <Typography variant="body2" color="textSecondary" component="span" sx={{ ml: 2 }}>
              {selectedTraining.goal}
            </Typography>
            <br />
            <Typography variant="body2" color="textPrimary" component="span">
              Ervaring:
            </Typography>
            <Typography variant="body2" color="textSecondary" component="span" sx={{ ml: 2 }}>
              {selectedTraining.experience}
            </Typography>
            <Typography variant="body2" color="textPrimary" sx={{ mt: 2 }}>
              Beschrijving:
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {selectedTraining.description}
            </Typography>

            {/* Exercises */}
            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Oefeningen:
              </Typography>
              {selectedTraining.exercises && selectedTraining.exercises.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Oefening</TableCell>
                      <TableCell align="center">Sets</TableCell>
                      <TableCell align="center">Reps</TableCell>
                      <TableCell align="center">Machine</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedTraining.exercises.map((exercise) => (
                      <TableRow key={exercise.id}>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary">
                            {exercise.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="textSecondary">
                            {exercise.sets}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="textSecondary">
                            {exercise.reps}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="textSecondary">
                            {exercise.machine || 'N/A'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Geen oefeningen opgegeven voor deze training
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Drawer>
    </>
  );
}

// ----------------------------------------------------------------------

TrainingItem.propTypes = {
  training: PropTypes.shape({
    title: PropTypes.string,
    goal: PropTypes.string,
    experience: PropTypes.string,
  }),
  onViewDetails: PropTypes.func,
  onDeleteTraining: PropTypes.func,
};

function TrainingItem({ training, onViewDetails, onDeleteTraining }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        component="img"
        alt={training.title}
        src={`/assets/images/covers/cover_${training.id % 5 + 1}.png`}
        sx={{ width: 64, height: 64, borderRadius: 1.5, flexShrink: 0 }}
      />

      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link color="inherit" variant="subtitle2" underline="hover" noWrap onClick={() => onViewDetails(training)}>
          {training.title}
        </Link>

        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {training.goal} | {training.experience}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => onViewDetails(training)}>
          <VisibilityIcon color="primary" />
        </IconButton>

        <IconButton onClick={() => onDeleteTraining(training.id)}>
          <DeleteIcon color="error" />
        </IconButton>
      </Box>
    </Stack>
  );
}

// PropTypes to validate the structure of the trainings prop
AppSavedTrainings.propTypes = {
  title: PropTypes.string.isRequired,
  trainings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      goal: PropTypes.string.isRequired,
      experience: PropTypes.string.isRequired,
    })
  ),
  onDeleteTraining: PropTypes.func, // Optional if you still need the delete function
};
