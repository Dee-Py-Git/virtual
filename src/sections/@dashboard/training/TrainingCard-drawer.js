import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Card, Avatar, Typography, CardContent, Button, IconButton, Drawer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SvgColor from '../../../components/svg-color';
import CloseIcon from '@mui/icons-material/Close';
import { fDate } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

const StyledCardMedia = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

const StyledTitle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2),
}));

const StyledCover = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

TrainingCard.propTypes = {
  training: PropTypes.object.isRequired,
  onSaveTraining: PropTypes.func.isRequired, // Prop to handle the training save action
  userRole: PropTypes.string.isRequired, // Added userRole prop to handle admin
  onDeleteTraining: PropTypes.func.isRequired, // Prop to handle delete action
};

export default function TrainingCard({ training, onSaveTraining, userRole, onDeleteTraining }) {
  const { cover, title, trainer, createdAt } = training;

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <Card sx={{ position: 'relative' }}>
        <StyledCardMedia>
          <SvgColor
            color="paper"
            src="/assets/icons/shape-avatar.svg"
            sx={{
              width: 80,
              height: 36,
              zIndex: 9,
              bottom: -15,
              position: 'absolute',
              color: 'background.paper',
            }}
          />
          <StyledAvatar alt={trainer.name} src={trainer.avatarUrl} />
          <StyledCover alt={title} src={cover} />
        </StyledCardMedia>

        <CardContent sx={{ pt: 4 }}>
          <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
            {fDate(createdAt)}
          </Typography>

          <StyledTitle color="inherit" variant="subtitle2" underline="hover">
            {title}
          </StyledTitle>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              {/* Goal */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="textPrimary" component="span">
                  Doel:
                </Typography>
                <Typography variant="body2" color="textSecondary" component="span" sx={{ ml: 1 }}>
                  {training.goal}
                </Typography>
              </Box>

              {/* Experience */}
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography variant="body2" color="textPrimary" component="span">
                  Ervaring:
                </Typography>
                <Typography variant="body2" color="textSecondary" component="span" sx={{ ml: 1 }}>
                  {training.experience}
                </Typography>
              </Box>
            </Box>

            {/* Show Delete Button if the user is an admin */}
            {userRole === 'admin' && (
              <IconButton color="error" onClick={() => onDeleteTraining(training.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            )}
          </Box>

          {/* Button to Open Drawer */}
          <Button variant="outlined" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleDrawerOpen}>
            View Details
          </Button>

          {/* Save Training Button */}
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={onSaveTraining}>
            Bewaar Training
          </Button>
        </CardContent>
      </Card>

      {/* Drawer for showing details of the selected training */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: { width: { lg: '25%', xs: '75%' } }, // Adjust drawer width based on screen size
        }}
      >
        <Box p={3}>
          <IconButton onClick={handleDrawerClose} sx={{ mb: 2 }}>
            <CloseIcon />
          </IconButton>

          {/* Display selected training details */}
          <Typography variant="h5" gutterBottom>
            {training.title}
          </Typography>

          {/* Training Details */}
          <Typography variant="body2" color="textPrimary" component="span">
            Doel:
          </Typography>
          <Typography variant="body2" color="textSecondary" component="span" sx={{ ml: 2 }}>
            {training.goal}
          </Typography>
          <br />
          <Typography variant="body2" color="textPrimary" component="span">
            Ervaring:
          </Typography>
          <Typography variant="body2" color="textSecondary" component="span" sx={{ ml: 2 }}>
            {training.experience}
          </Typography>
          <Typography variant="body2" color="textPrimary" sx={{ mt: 2 }}>
            Beschrijving:
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {training.description}
          </Typography>

          {/* Exercises */}
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Oefeningen:
            </Typography>
            {training.exercises && training.exercises.length > 0 ? (
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
                  {training.exercises.map((exercise) => (
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
      </Drawer>
    </>
  );
}
