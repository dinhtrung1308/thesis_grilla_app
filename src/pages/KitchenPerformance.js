import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { axios } from 'axios';
// materialimport React, { useState } from 'react';
import { Box, Grid, Container, Typography, Stack, TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import moment from 'moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/styles';

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { width } from '@mui/system';
import ChartTab3 from '../components/chartTab3';
import ChartTab4 from '../components/chartTab4';

import materialImage from '../assets/img/material.png';
import Iconify from '../components/Iconify';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'
  }
}));
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Total Order per Day'
    },
    scales: {
      y: [
        {
          grid: {
            drawOnChartArea: false
          }
        }
      ]
    }
  }
};

function getCurrentDate() {
  const d = new Date();
  const currentDate = String(d.getDate());
  const currentMonth = String(d.getMonth() + 1);
  const currentYear = String(d.getFullYear());
  const today = currentYear.concat('-', currentMonth, '-', currentDate);
  return today;
}
function get7PreviousDay() {
  const sevenDays = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
  const last7Date = String(sevenDays.getDate());
  const changeMonth = String(sevenDays.getMonth() + 1);
  const currentYear = String(sevenDays.getFullYear());
  const preDays = currentYear.concat('-', changeMonth, '-', last7Date);

  return preDays;
}
export default function KithenPerformance() {
  const [valueIndexTab, setValueIndexTab] = React.useState('1');
  const [startDayGraph1, setStartDayGraph1] = useState(get7PreviousDay);
  const [endDayGraph1, setEndDayGraph1] = useState(getCurrentDate);
  const [aspects, setAspects] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [dataOrders, setDataOrders] = useState([]);
  const [chartData1Tab2, setChartData1Tab2] = useState({});
  const [chartData2Tab2, setChartData2Tab2] = useState({});
  const [totalOrders, setTotalOrders] = useState([]);
  const [dateArrays, setDateArrays] = useState([]);
  const handleChangeTab = (event, newValue) => {
    setValueIndexTab(newValue);
  };
  // const [ingredients,setIngredients] =useState([]);
  const token = sessionStorage.getItem('token');
  // console.log(token);
  const getAspects = async () => {
    const response = await fetch('http://103.116.105.48/api/performance/feedback', {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
    const FinalData = await response.json();
    setAspects(FinalData);
  };
  const getData = async () => {
    const response = await fetch('http://103.116.105.48/api/performance/order?start=2022-4-14', {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
    const FinalData = await response.json();
    setDataOrders(FinalData);
  };
  const getFeedbackList = async () => {
    const response = await fetch('http://103.116.105.48/api/performance/feedback-list', {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
    const FinalData = await response.json();
  };
  const fList = [];
  const chart = async () => {
    let totalOrders = [];
    let dateArrays = [];
    let totalIncome = [];
    const response = await fetch(
      `http://103.116.105.48/api/performance/order-amount-by-day?start=${startDayGraph1}&end=${endDayGraph1}`,
      {
        method: 'GET',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      }
    );
    const FinalData = await response.json();
    totalOrders = FinalData.amount;
    dateArrays = FinalData.dates;
    totalIncome = FinalData.profit;
    if (response.ok) {
      setChartData1Tab2({
        labels: dateArrays,
        datasets: [
          {
            label: 'Number of Orders',
            data: totalOrders,
            borderColor: '#FFD992',
            backgroundColor: '#FFD992',
            borderWidth: 4
          }
        ]
      });
      setChartData2Tab2({
        labels: dateArrays,
        datasets: [
          {
            label: 'Total Income ($)',
            data: totalIncome,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            borderWidth: 4
          }
        ]
      });
    }
  };

  useEffect(() => {
    chart();
  }, [refresh]);
  useEffect(() => {
    getFeedbackList();
    getAspects();
    getData();
  }, []);
  useEffect(() => {
    if (refresh) {
      setTimeout(() => {
        setRefresh(false);
      }, 50);
    }
  }, [refresh]);
  return (
    <Page title="Material">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Kithen Performance
          </Typography>
        </Stack>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={valueIndexTab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                <Tab label="Customer Experience" value="1" />
                <Tab label="Orders" value="2" />
                <Tab label="Dish" value="3" />
                <Tab label="Ingredient" value="4" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Container maxWidth="xl">
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography variant="h5">Basic Categories</Typography>
                    <Typography variant="body2">
                      These are the most common aspects in every guest experience. They 're rated by
                      customers.
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={12} md={6}>
                    <Box
                      sx={{
                        width: 400,
                        height: 100,
                        backgroundColor: '#FDFFFD',
                        padding: '15px'
                      }}
                    >
                      <Typography color="003580" variant="h6">
                        Overall: {Number(aspects.overall?.overall).toFixed(2)} / 10 ⭐️
                      </Typography>
                      <BorderLinearProgress
                        variant="determinate"
                        value={Number(aspects.overall?.overall) * 10}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Box
                      sx={{
                        width: 400,
                        height: 100,
                        backgroundColor: '#FDFFFD',
                        padding: '15px'
                      }}
                    >
                      <Typography color="003580" variant="h6">
                        Staff: {Number(aspects.overall?.staff).toFixed(2)} / 10 ⭐️
                      </Typography>
                      <BorderLinearProgress
                        variant="determinate"
                        value={Number(aspects.overall?.staff) * 10}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Box
                      sx={{
                        width: 400,
                        height: 100,
                        backgroundColor: '#FDFFFD',
                        padding: '15px'
                      }}
                    >
                      <Typography color="003580" variant="h6">
                        Cleanliness: {Number(aspects.overall?.cleanliness).toFixed(2)} / 10 ⭐️
                      </Typography>
                      <BorderLinearProgress
                        variant="determinate"
                        value={Number(aspects.overall?.cleanliness) * 10}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Box
                      sx={{
                        width: 400,
                        height: 100,
                        backgroundColor: '#FDFFFD',
                        padding: '15px'
                      }}
                    >
                      <Typography color="003580" variant="h6">
                        Facilities: {Number(aspects.overall?.facilities).toFixed(2)} / 10 ⭐️
                      </Typography>
                      <BorderLinearProgress
                        variant="determinate"
                        value={Number(aspects.overall?.facilities) * 10}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Box
                      sx={{
                        width: 400,
                        height: 100,
                        backgroundColor: '#FDFFFD',
                        padding: '15px'
                      }}
                    >
                      <Typography color="003580" variant="h6">
                        Value For Money: {Number(aspects.overall?.valueForMoney).toFixed(2)} / 10
                        ⭐️
                      </Typography>
                      <BorderLinearProgress
                        variant="determinate"
                        value={Number(aspects.overall?.valueForMoney) * 10}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Box
                      sx={{
                        width: 400,
                        height: 100,
                        backgroundColor: '#FDFFFD',
                        padding: '15px'
                      }}
                    >
                      <Typography color="003580" variant="h6">
                        Appetite: {Number(aspects.overall?.appetite).toFixed(2)} / 10 ⭐️
                      </Typography>
                      <BorderLinearProgress
                        variant="determinate"
                        value={Number(aspects.overall?.appetite) * 10}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Box
                      sx={{
                        width: 400,
                        height: 100,
                        backgroundColor: '#FDFFFD',
                        padding: '15px'
                      }}
                    >
                      <Typography color="003580" variant="h6">
                        Service Time: {Number(aspects.overall?.serviceTime).toFixed(2)} / 10 ⭐️
                      </Typography>
                      <BorderLinearProgress
                        variant="determinate"
                        value={Number(aspects.overall?.serviceTime) * 10}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={9} sm={9} md={9}>
                    <Typography variant="h5">Opinions</Typography>
                  </Grid>
                  <Grid item xs={3} sm={3} md={3}>
                    <Typography variant="h5">Total: {aspects.amount} feedbacks</Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Box
                      sx={{
                        height: '100vh',
                        backgroundColor: '#F2F2F2',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        overflow: 'auto'
                      }}
                      fullWidth
                    >
                      {fList?.map((item, index) => (
                        <div key={item.feedbackId} style={{ width: '100%', marginLeft: '40px' }}>
                          <Card
                            sx={{ minWidth: 275, width: '90%', marginTop: '30px', borderRadius: 0 }}
                            key={item.feedbackId}
                          >
                            <CardContent>
                              {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            a
                          </Typography>
                          <Typography variant="h5" component="div">
                            bar
                          </Typography>
                          <Typography color="text.primary">c</Typography>
                          <Typography variant="body2">defaultValue</Typography> */}
                              <Grid container spacing={1}>
                                <Grid item xs={1} sm={1} md={1}>
                                  <AccountCircleOutlinedIcon />
                                </Grid>
                                <Grid item xs={9} sm={9} md={9}>
                                  Email: {item.email ? item.email : 'Anoymous'}
                                </Grid>
                                <Grid item xs={2} sm={2} md={2}>
                                  Date: {moment(item.createdAt).format('DD/MM/YYYY')}
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                  <Divider />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                  <Box
                                    sx={{
                                      width: 400,
                                      height: 100,
                                      backgroundColor: '#FDFFFD',
                                      padding: '15px'
                                    }}
                                  >
                                    <Typography color="003580" variant="h6">
                                      Overall: {Number(item.overall).toFixed(2)} / 10 ⭐️
                                    </Typography>
                                    <BorderLinearProgress
                                      variant="determinate"
                                      value={Number(item.overall) * 10}
                                    />
                                  </Box>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                  <Box
                                    sx={{
                                      width: 400,
                                      height: 100,
                                      backgroundColor: '#FDFFFD',
                                      padding: '15px'
                                    }}
                                  >
                                    <Typography color="003580" variant="h6">
                                      Staff: {Number(item.staff).toFixed(2)} / 10 ⭐️
                                    </Typography>
                                    <BorderLinearProgress
                                      variant="determinate"
                                      value={Number(item.staff) * 10}
                                    />
                                  </Box>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                  <Box
                                    sx={{
                                      width: 400,
                                      height: 100,
                                      backgroundColor: '#FDFFFD',
                                      padding: '15px'
                                    }}
                                  >
                                    <Typography color="003580" variant="h6">
                                      Cleanliness: {Number(item.cleanliness).toFixed(2)} / 10 ⭐️
                                    </Typography>
                                    <BorderLinearProgress
                                      variant="determinate"
                                      value={Number(item.cleanliness) * 10}
                                    />
                                  </Box>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                  <Box
                                    sx={{
                                      width: 400,
                                      height: 100,
                                      backgroundColor: '#FDFFFD',
                                      padding: '15px'
                                    }}
                                  >
                                    <Typography color="003580" variant="h6">
                                      Facilities: {Number(aspects.overall?.serviceTime).toFixed(2)}{' '}
                                      / 10 ⭐️
                                    </Typography>
                                    <BorderLinearProgress
                                      variant="determinate"
                                      value={Number(aspects.overall?.serviceTime) * 10}
                                    />
                                  </Box>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                  <Box
                                    sx={{
                                      width: 400,
                                      height: 100,
                                      backgroundColor: '#FDFFFD',
                                      padding: '15px'
                                    }}
                                  >
                                    <Typography color="003580" variant="h6">
                                      Service Time:{' '}
                                      {Number(aspects.overall?.serviceTime).toFixed(2)} / 10 ⭐️
                                    </Typography>
                                    <BorderLinearProgress
                                      variant="determinate"
                                      value={Number(aspects.overall?.serviceTime) * 10}
                                    />
                                  </Box>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                  <Box
                                    sx={{
                                      width: 400,
                                      height: 100,
                                      backgroundColor: '#FDFFFD',
                                      padding: '15px'
                                    }}
                                  >
                                    <Typography color="003580" variant="h6">
                                      Service Time:{' '}
                                      {Number(aspects.overall?.serviceTime).toFixed(2)} / 10 ⭐️
                                    </Typography>
                                    <BorderLinearProgress
                                      variant="determinate"
                                      value={Number(aspects.overall?.serviceTime) * 10}
                                    />
                                  </Box>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                  <Box
                                    sx={{
                                      width: 400,
                                      height: 100,
                                      backgroundColor: '#FDFFFD',
                                      padding: '15px'
                                    }}
                                  >
                                    <Typography color="003580" variant="h6">
                                      Service Time:{' '}
                                      {Number(aspects.overall?.serviceTime).toFixed(2)} / 10 ⭐️
                                    </Typography>
                                    <BorderLinearProgress
                                      variant="determinate"
                                      value={Number(aspects.overall?.serviceTime) * 10}
                                    />
                                  </Box>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Container>
            </TabPanel>
            <TabPanel value="2">
              {/* <Typography>Total Orders:</Typography>
              <Typography>{dataOrders.orderAmount}</Typography>
              <Typography>Total Income:</Typography>
              <Typography>
                {dataOrders.retailPrice} {' $'}
              </Typography> */}
              <Card style={{ marginTop: 40 }}>
                <CardHeader title="Total Orders and Income" />
                <Grid
                  container
                  direction="row-reverse"
                  alignItems="center"
                  style={{ width: '95%' }}
                >
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={endDayGraph1}
                      onChange={(newValue) => {
                        setEndDayGraph1(moment(newValue).format('YYYY-MM-DD'));
                        setRefresh(true);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    <Typography style={{ marginRight: 10, marginLeft: 10 }}>~</Typography>
                    <DatePicker
                      value={startDayGraph1}
                      style={{ size: '10px' }}
                      onChange={(newValue) => {
                        setStartDayGraph1(moment(newValue).format('YYYY-MM-DD'));
                        setRefresh(true);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                  <Bar options={options} data={chartData1Tab2} />
                  <Line
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top'
                        },
                        title: {
                          display: true,
                          text: 'Total Profit per Day'
                        },
                        scales: {
                          y: [
                            {
                              grid: {
                                drawOnChartArea: false
                              }
                            }
                          ]
                        }
                      }
                    }}
                    data={chartData2Tab2}
                  />
                  {/* <Line options={options} data={data} /> */}
                </Box>
              </Card>
            </TabPanel>
            <TabPanel value="3">
              <ChartTab3 />
            </TabPanel>
            <TabPanel value="4">
              <ChartTab4 />
            </TabPanel>
          </TabContext>
        </Box>
      </Container>
    </Page>
  );
}
