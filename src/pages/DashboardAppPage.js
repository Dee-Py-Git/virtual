import { useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
  AppSavedTrainings
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();

  // State to hold saved Trainings
  const [savedTrainings, setSavedTrainings] = useState([]);

  // Fetch saved Trainings when the component mounts
  useEffect(() => {
    const fetchSavedTrainings = async () => {
      const token = localStorage.getItem('userToken');
      try {
        const response = await axios.get('http://127.0.0.1:5000/saved-user-trainings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(response.data)
        setSavedTrainings(response.data);
      } catch (error) {
        console.error('Error fetching saved Trainings:', error);
      }
    };
    fetchSavedTrainings();
  }, []);

  // Function to handle deleting a training
  const handleDeleteTraining = (trainingId) => {
    // Update the state to remove the deleted training
    setSavedTrainings((prevTrainings) =>
      prevTrainings.filter((training) => training.id !== trainingId)
    );
  };

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welkom terug!
        </Typography>

        <Grid container spacing={3}>
          {/* Widget 1: Last Login Date */}
          <Grid item xs={6} sm={6} md={3}>
            <AppWidgetSummary
              title="Laatste login"
              subheader="deze week"
              total={new Date().toLocaleDateString()}
              color="primary"  // Primary color for text and icon
              icon="mdi:clock-time-eight"  // Clock icon for login
            />
          </Grid>

          {/* Widget 2: Calories Burned */}
          <Grid item xs={6} sm={6} md={3}>
            <AppWidgetSummary
              title="KCal"
              subheader="deze week"
              total={1267}
              color="error"  // Info color for text and icon
              icon="mdi:fire"  // Fire icon for calories
            />
          </Grid>

          {/* Widget 3: Total Trainings */}
          <Grid item xs={6} sm={6} md={3}>
            <AppWidgetSummary
              title="Trainingen"
              subheader="totaal voltooid"
              total={17}
              color="warning"  // Warning color for text and icon
              icon="mdi:weight-lifter"  // Weightlifting icon
            />
          </Grid>

          {/* Widget 4: Bug Reports */}
          <Grid item xs={6} sm={6} md={3}>
            <AppWidgetSummary
              title="Oefeningen"
              subheader="totaal volbracht"
              total={84}
              color="info"  // Error color for text and icon
              icon="mdi:arm-flex"  // Flexing arm icon
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppSavedTrainings
              title="Jouw Opgeslagen Trainingen"
              trainings={savedTrainings}
              onDeleteTraining={handleDeleteTraining} // Pass the delete function as a prop
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppWebsiteVisits
              title="Trainingen Voltooid"
              subheader="(+28%) t.o.v. vorig jaar!"
              chartLabels={[
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
              ]}  // Use numbers for months
              chartData={[
                {
                  name: '2023',
                  type: 'column',
                  fill: 'solid',
                  data: [5, 7, 4, 1, 6, 5, 2, 5, 8, 6, 5, 5],
                },
                {
                  name: '2024',
                  type: 'column',
                  fill: 'solid',
                  data: [6, 8, 4, 5, 4, 5, 5, ],
                }
              ]}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.string.uuid(),
                title: faker.person.jobTitle(),
                description: faker.person.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.string.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
