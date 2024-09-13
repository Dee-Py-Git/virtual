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
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  subheader: PropTypes.string, // Add subheader prop
  total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Adjust total to handle strings (for date)
  sx: PropTypes.object,
};

export default function AppWidgetSummary({ title, subheader, total, icon, color = 'primary', sx, ...other }) {
  const resolvedColor = color.includes('.') ? color.split('.')[0] : color;
  const colorShade = color.includes('.') ? color.split('.')[1] : 'main'; // default to 'main' if no shade is provided

  return (
    <Card
      sx={{
        py: 5,
        boxShadow: 0,
        textAlign: 'center',
        color: (theme) => theme.palette[resolvedColor]?.[colorShade] || theme.palette.primary.main,
        bgcolor: (theme) => theme.palette[resolvedColor]?.lighter || theme.palette.primary.lighter,
        ...sx,
      }}
      {...other}
    >
      <StyledIcon
        sx={{
          color: (theme) => theme.palette[resolvedColor]?.dark || theme.palette.primary.dark,
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette[resolvedColor]?.dark || theme.palette.primary.dark, 0)} 0%, ${alpha(
              theme.palette[resolvedColor]?.dark || theme.palette.primary.dark,
              0.24
            )} 100%)`,
        }}
      >
        <Iconify icon={icon} width={24} height={24} />
      </StyledIcon>

      <Typography variant="h3">{total}</Typography>

      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {title}
      </Typography>

      {subheader && (
        <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
          {subheader}
        </Typography>
      )}
    </Card>
  );
}

