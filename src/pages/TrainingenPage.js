import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Button, Grid, Stack, Drawer, IconButton, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { TrainingCard, TrainingsSort, TrainingsSearch } from '../sections/@dashboard/training';
import { useTheme } from '@mui/material/styles';
import Iconify from '../components/iconify';
import CloseIcon from '@mui/icons-material/Close';
import CreateTrainings from './CreateTrainings'; // Import the admin page

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

export default function TrainingList() {
  const [trainings, setTrainings] = useState([]);
  const [userRole, setUserRole] = useState(''); // State to hold user role from the server
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [isDrawerOpen, setDrawerOpen] = useState(false); // State for drawer visibility
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg')); // Detect large screens

  // Function to fetch the user's role from the server
  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get('http://127.0.0.1:5000/user-data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserRole(response.data.role); // Assuming the server returns the user role as 'role'
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  // Function to fetch the list of trainings
  const fetchTrainings = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get('http://127.0.0.1:5000/trainings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log('Trainings fetched:', response.data); // Log the response
      setTrainings(response.data);
    } catch (error) {
      console.error('Error fetching trainings:', error);
    }
  };

  // Function to delete a training
  const handleDeleteTraining = async (trainingId) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`http://127.0.0.1:5000/delete-created-trainings/${trainingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Re-fetch trainings after deletion
      fetchTrainings();
    } catch (error) {
      console.error('Error deleting training:', error);
    }
  };

  // Fetch user role first, then fetch trainings
  useEffect(() => {
    const fetchData = async () => {
      await fetchUserRole();
      await new Promise(resolve => setTimeout(resolve, 100)); // Add 0.1-second delay
      await fetchTrainings();
    };

    fetchData();
  }, []);

  // Function to handle saving a training
  const handleSaveTraining = async (trainingId) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.post('http://127.0.0.1:5000/save-user-trainings', { training_id: trainingId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Training saved to your account');
    } catch (error) {
      console.error('Error saving training:', error);
    }
  };

  // Function to open the admin drawer for creating new training
  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  // Function to close the admin drawer
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  // Function to handle new training creation
  const handleNewTrainingCreated = () => {
    // Re-fetch trainings after a new one is created
    fetchTrainings();
    handleCloseDrawer();  // Close the drawer after creating the training
  };

  // Filter and sort trainings based on search query and sort order
  const filteredTrainings = trainings
    .filter((training) => training.title && training.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'latest') return new Date(b.created_at) - new Date(a.created_at);
      if (sortOrder === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      return 0;
    });

  return (
    <>
      <Helmet>
        <title> Dashboard: Trainingen | Minimal UI </title>
      </Helmet>

      <Container>
        {/* Title and New Training Button */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Trainingen
          </Typography>
          {userRole === 'admin' && (
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenDrawer}>
              Nieuwe Training
            </Button>
          )}
        </Stack>

        {/* Search and Sort Components */}
        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <TrainingsSearch posts={trainings} setSearchQuery={setSearchQuery} />
          <TrainingsSort options={SORT_OPTIONS} setSortOrder={setSortOrder} />
        </Stack>

        {/* Training Cards */}
        <Grid container spacing={3}>
          {filteredTrainings.map((training, index) => (
            <Grid item xs={12} sm={6} md={4} key={training.id}>
              <TrainingCard
                training={{
                  ...training,
                  cover: `/assets/images/covers/cover_${index + 1}.png`,
                  trainer: { name: training.trainer_name, avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg` },
                }}
                userRole={userRole}
                onSaveTraining={() => handleSaveTraining(training.id)}
                onDeleteTraining={() => handleDeleteTraining(training.id)}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Drawer for Admin to Create New Training */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{ sx: { width: isLargeScreen ? '50%' : '95%' } }}
      >
        {/* Close Button */}
        <IconButton onClick={handleCloseDrawer} sx={{ m: 2 }}>
          <CloseIcon />
        </IconButton>

        {/* Pass the handleNewTrainingCreated function to the CreateTrainings component */}
        <CreateTrainings onNewTrainingCreated={handleNewTrainingCreated} />
      </Drawer>
    </>
  );
}
