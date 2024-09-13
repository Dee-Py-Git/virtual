// AppWidgetSummary.js
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
import Iconify from '../../../components/iconify'; // Icon component

const StyledIcon = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(7), //decreased slightly from 8
  height: theme.spacing(7), //decreased slightly from 8
  justifyContent: 'center',
  marginBottom: theme.spacing(2), //decreased slightly from 3
}));

AppWidgetSummary.propTypes = {
  color: PropTypes.oneOf(['primary', 'info', 'warning', 'error']), // Restrict color options to these four
  icon: PropTypes.string, // Icon for the widget
  title: PropTypes.string.isRequired, // Title of the widget
  subheader: PropTypes.string, // Optional subheader
  total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Can be string (for dates) or numbers
  sx: PropTypes.object, // Extra styles
};

export default function AppWidgetSummary({ title, subheader, total, icon, color = 'primary', sx, ...other }) {
  return (
    <Card
      sx={{
        py: 5,
        boxShadow: 0,
        textAlign: 'center',
        // Set background to default white card color
        bgcolor: 'background.paper', 
        // Set the text and icon color based on the color prop
        color: (theme) => theme.palette[color]?.main || theme.palette.primary.main,
        ...sx,
      }}
      {...other}
    >
      <StyledIcon
        sx={{
          color: (theme) => theme.palette[color]?.dark || theme.palette.primary.dark, // Icon color
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette[color]?.dark || theme.palette.primary.dark, 0)} 0%, ${alpha(
              theme.palette[color]?.dark || theme.palette.primary.dark,
              0.24
            )} 100%)`,
        }}
      >
        <Iconify icon={icon} width={24} height={24} />
      </StyledIcon>

      {/* Display the total (formatted or as a string) */}
      <Typography variant="h4" sx={{ color: (theme) => theme.palette[color]?.main || theme.palette.primary.main }}>
        {total}
      </Typography>

      {/* Display the main title */}
      <Typography variant="subtitle2" sx={{ color: (theme) => theme.palette[color]?.main || theme.palette.primary.main, opacity: 0.72 }}>
        {title}
      </Typography>

      {/* Conditionally display the subheader if it's provided */}
      {subheader && (
        <Typography variant="subtitle2" sx={{ color: (theme) => theme.palette[color]?.main || theme.palette.primary.main, opacity: 0.72 }}>
          {subheader}
        </Typography>
      )}
    </Card>
  );
}
