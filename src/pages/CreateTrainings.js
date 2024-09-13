import { useState } from 'react';
import { Container, TextField, Button, Grid, MenuItem, Typography } from '@mui/material';
import axios from 'axios';

const goals = ['kracht', 'afvallen', 'conditie'];
const experiences = ['beginner', 'intermediate', 'advanced'];
const locations = ['sportschool', 'thuis'];

export default function CreateTrainingForm({ onNewTrainingCreated }) {
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '', machine: '' }]);

  const handleExerciseChange = (index, field, value) => {
    const newExercises = exercises.map((exercise, i) => 
      i === index ? { ...exercise, [field]: value } : exercise
    );
    setExercises(newExercises);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '', machine: '' }]);
  };

  const handleSubmit = async () => {
    const trainingData = {
      title,
      goal,
      experience,
      location,
      description,
      exercises,
    };

    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.post('http://127.0.0.1:5000/create-trainings', trainingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Notify the parent that a new training was created
      onNewTrainingCreated();
    } catch (error) {
      console.error('Error creating training:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Creeer Nieuwe Training</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField label="Titel" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Doel"
            fullWidth
            select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            {goals.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Ervaring"
            fullWidth
            select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          >
            {experiences.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Locatie"
            fullWidth
            select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {locations.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Beschrijving"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Oefeningen</Typography>
          {exercises.map((exercise, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={3}>
                <TextField
                  label="Oefening"
                  fullWidth
                  value={exercise.name}
                  onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Sets"
                  fullWidth
                  value={exercise.sets}
                  onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Reps"
                  fullWidth
                  value={exercise.reps}
                  onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label="Machine"
                  fullWidth
                  value={exercise.machine}
                  onChange={(e) => handleExerciseChange(index, 'machine', e.target.value)}
                />
              </Grid>
            </Grid>
          ))}
          <Button onClick={addExercise}>Voeg oefening toe</Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Creeer Training
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
