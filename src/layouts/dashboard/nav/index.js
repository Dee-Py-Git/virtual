import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Button, Link, Drawer, Typography, Avatar, Stack } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
//
import navConfig from './config';
import axios from 'axios';
import { useTheme } from '@mui/material/styles'; // Import theme

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
  color: theme.palette.common.white, // Make sure the text and icons are white
}));

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const isDesktop = useResponsive('up', 'lg');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await axios.get('http://127.0.0.1:5000/user-data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 4, display: 'inline-flex' }}>
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link
          underline="none"
          sx={{
            color: theme.palette.common.white, // Ensure link text is white
            '&:hover': {
              color: theme.palette.primary.main, // Set hover color
            },
          }}
        >
          <StyledAccount>
            <Avatar />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'inherit' }}>
                {loading ? 'Loading...' : userData ? `${userData.name}` : 'User'}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      <NavSection
        data={navConfig(userData?.role)}
        sx={{
          '& .MuiListItemButton-root': {
            color: '#FFFFFF !important', // Force text in buttons to be white
          },
          '& .MuiListItemIcon-root': {
            color: '#FFFFFF !important', // Force icons to be white
          },
          '& .MuiListItemText-root': {
            color: '#FFFFFF !important', // Ensure text is white
          },
          '& .MuiListItemButton-root:hover': {
            backgroundColor: theme.palette.action.hover, // Use default hover color
            color: '#FFFFFF', // Ensure the text stays white during hover
          },
        }}
      />

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
          <Box
            component="img"
            src="/assets/images/virtual.png"
            sx={{ width: 120, position: 'absolute', top: -110 }}
          />

          {/* <Box sx={{ textAlign: 'center' }}>
            <Typography gutterBottom variant="h6">
              Get more?
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              From only $69
            </Typography>
          </Box>

          <Button href="https://material-ui.com/store/items/minimal-dashboard/" target="_blank" variant="contained">
            Upgrade to Pro
          </Button> */}
        </Stack>
      </Box>

    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: theme.palette.custom.navbarBackground,
              borderRightStyle: 'dashed',
              color: theme.palette.common.white, // Set text color to white
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: theme.palette.custom.navbarBackground,
              color: theme.palette.common.white, // Set text color to white
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
