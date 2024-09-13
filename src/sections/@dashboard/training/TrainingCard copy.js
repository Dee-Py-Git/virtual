import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Box, Link, Card, Avatar, Typography, CardContent, Button, IconButton, Modal, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SvgColor from '../../../components/svg-color';
import CloseIcon from '@mui/icons-material/Close';
import { fDate } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

// const StyledCardMedia = styled('div')({
//   position: 'relative',
//   paddingTop: 'calc(100% * 3 / 4)',
//   });
  
//   const StyledTitle = styled(Link)({
//   height: 44,
//   overflow: 'hidden',
//   WebkitLineClamp: 2,
//   display: '-webkit-box',
//   WebkitBoxOrient: 'vertical',
//   });
  
//   const StyledAvatar = styled(Avatar)(({ theme }) => ({
//   zIndex: 9,
//   width: 32,
//   height: 32,
//   position: 'absolute',
//   left: theme.spacing(3),
//   bottom: theme.spacing(-2),
//   }));
  
//   const StyledCover = styled('img')({
//   top: 0,
//   width: '100%',
//   height: '100%',
//   objectFit: 'cover',
//   position: 'absolute',
//   });
  
  // ----------------------------------------------------------------------
  
TrainingCard.propTypes = {
  training: PropTypes.object.isRequired,
  onSaveTraining: PropTypes.func.isRequired, // Prop to handle the training save action
  userRole: PropTypes.string.isRequired, // Added userRole prop to handle admin
  onDeleteTraining: PropTypes.func.isRequired, // Prop to handle delete action
};

export default function TrainingCard({ training, onSaveTraining, userRole, onDeleteTraining }) {
  const { cover, title, trainer, createdAt } = training;

  // State for managing modal visibility
  const [isModalOpen, setModalOpen] = useState(false);

  // Handlers to open and close the modal
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      {/* Training Card */}
      <Card sx={{ position: 'relative' }}>
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
        <Avatar alt={trainer.name} src={trainer.avatarUrl} sx={{ position: 'absolute', left: 24, bottom: -16 }} />
        <Box sx={{ position: 'relative', paddingTop: 'calc(100% * 3 / 4)' }}>
          <img alt={title} src={cover} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0 }} />
        </Box>

        <CardContent sx={{ pt: 4 }}>
          <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
            {fDate(createdAt)}
          </Typography>

          <Link
            variant="subtitle2"
            color="inherit"
            underline="hover"
            sx={{
              height: 44,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
          >
            {title}
          </Link>

          {/* Flexbox for goal, experience, and delete button */}
          {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> */}
            <Box>
              {/* Display Goal */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="textPrimary" component="span">
                  Doel:
                </Typography>
                <Typography variant="body2" color="textSecondary" component="span" sx={{ ml: 1 }}>
                  {training.goal}
                </Typography>
              </Box>

              {/* Display Experience */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="textPrimary" component="span">
                  Ervaring:
                </Typography>
                <Typography variant="body2" color="textSecondary" component="span" sx={{ ml: 1 }}>
                  {training.experience}
                </Typography>
              </Box>
            </Box>

          {/* </Box> */}

          {/* Button to open modal for full training details */}
          <Button variant="outlined" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleModalOpen}>
            Meer Details
          </Button>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
          {/* Save Training Button with 75% width */}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, flex: 5 }}  // 3 parts for 75% width
            onClick={onSaveTraining}
          >
            Bewaar
          </Button>

          {/* Show Delete Button with Icon and 25% width if the user is an admin */}
          {userRole === 'admin' && (
            <Button
              sx={{ mt: 2, flex: 1, bgcolor: 'error.light', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}  // 1 part for 25% width
              onClick={() => onDeleteTraining(training.id)}
            >
              <DeleteIcon />
            </Button>
          )}
        </Box>
        </CardContent>
      </Card>

      {/* Modal for displaying full training details */}
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '60%', md: '40%' },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <IconButton onClick={handleModalClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <CloseIcon />
          </IconButton>

          {/* Modal Content */}
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
      </Modal>
    </>
  );
}
