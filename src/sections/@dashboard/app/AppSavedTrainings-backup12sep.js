import PropTypes from 'prop-types';
import { useState } from 'react';
import { Typography, Box, Divider, Avatar, Drawer, IconButton, useMediaQuery } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete Icon
import { useTheme, alpha } from '@mui/material/styles';
import axios from 'axios';

// The AppSavedTrainings component receives an array of trainings as props
export default function AppSavedTrainings({ trainings = [], onDeleteTraining }) { // Add onDeleteTraining prop
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg')); // Detect large screens

  // Function to handle when a user clicks on a training
  const handleTrainingClick = (training) => {
    setSelectedTraining(training);
    setDrawerOpen(true); // Open the drawer when a training is clicked
  };

  // Function to close the drawer
  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedTraining(null); // Clear the selected training
  };

  // Function to delete a training
  const handleDeleteTraining = async (trainingId) => {
    try {
      const token = localStorage.getItem('userToken'); // Get token from local storage
      await axios.delete(`http://127.0.0.1:5000/delete-training/${trainingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onDeleteTraining(trainingId); // Call the prop function to remove the training from the list
    } catch (error) {
      console.error('Error deleting training:', error);
    }
  };

  return (
    <>
      <Box>
        {trainings.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No trainings available.
          </Typography>
        ) : (
          trainings.map((training, index) => (
            <Box
              key={training.id}
              mb={4}
              sx={{
                cursor: 'pointer',
                padding: 2,
                borderRadius: 2,
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1), // Highlight on hover
                  boxShadow: 3, // Add a subtle shadow on hover
                },
              }}
            >
              {/* Display the training image, title, and delete button */}
              <Box display="flex" alignItems="center" mb={2} justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <Avatar
                    alt={training.title}
                    src={`/assets/images/covers/cover_${index + 1}.png`} // Load image based on index
                    sx={{ width: 75, height: 75, marginRight: 2 }} // Increased size by 50%
                  />
                  <Typography variant="h6" gutterBottom>
                    {training.title}
                  </Typography>
                </Box>

                {/* Delete Button */}
                <IconButton onClick={() => handleDeleteTraining(training.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>

              {/* Display the goal and experience */}
              <Typography variant="body2" color="textSecondary">
                Doel: {training.goal}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Ervaring: {training.experience}
              </Typography>

              <Divider sx={{ mt: 2, mb: 2 }} /> {/* Divider between trainings */}
            </Box>
          ))
        )}
      </Box>

      {/* Drawer for showing details of the selected training */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: { width: isLargeScreen ? '25%' : '75%' }, // Adjust width based on screen size
        }}
      >
        {selectedTraining && (
          <Box p={3}>
            {/* Close Button */}
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

// PropTypes to validate the structure of the trainings prop
AppSavedTrainings.propTypes = {
  trainings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      goal: PropTypes.string.isRequired,
      experience: PropTypes.string.isRequired,
      description: PropTypes.string,
      exercises: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          sets: PropTypes.number.isRequired,
          reps: PropTypes.number.isRequired,
          machine: PropTypes.string,
        })
      ),
    })
  ),
  onDeleteTraining: PropTypes.func.isRequired, // Add prop validation for the delete function
};
