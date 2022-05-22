import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

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
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/styles';

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import QRCode from 'react-qr-code';
import ChartTab3 from '../components/chartTab3';
import ChartTab4 from '../components/chartTab4';

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
  const today = currentYear.concat('/', currentMonth, '/', currentDate);
  return today;
}
function get7PreviousDay() {
  const sevenDays = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
  const last7Date = String(sevenDays.getDate());
  const changeMonth = String(sevenDays.getMonth() + 1);
  const currentYear = String(sevenDays.getFullYear());
  const preDays = currentYear.concat('/', changeMonth, '/', last7Date);

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
  const [chartData3Tab2, setChartData3Tab2] = useState({});

  const [totalOrders, setTotalOrders] = useState([]);
  const [dateArrays, setDateArrays] = useState([]);
  const handleChangeTab = (event, newValue) => {
    setValueIndexTab(newValue);
  };
  // const [ingredients,setIngredients] =useState([]);
  const token = sessionStorage.getItem('token');
  // console.log(token);
  const idUser = sessionStorage.getItem('idUser');
  const QRCODE_ID = `https://survey-grilla.netlify.app/`;

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
    setFeedbackList((feedbackList) => [...feedbackList, ...FinalData]);
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
  const chart3 = async () => {
    let totalOrders = [];
    let hoursArray = [];

    const response = await fetch(
      `http://103.116.105.48/api/performance/order-by-hour?start=${startDayGraph1}&end=${endDayGraph1}`,
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
    hoursArray = [
      '8:00',
      '9:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00'
    ];
    if (response.ok) {
      setChartData3Tab2({
        labels: hoursArray,
        datasets: [
          {
            label: 'Number of Orders By Hours',
            data: totalOrders,
            borderColor: '#1013dc',
            backgroundColor: '#1013dc',
            borderWidth: 4
          }
        ]
      });
    }
  };
  useEffect(() => {
    chart();
    chart3();
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
        <Stack
          direction="row"
          alignItems="baseline"
          justifyContent="space-between"
          mb={5}
          width="90%"
        >
          <Typography variant="h4" gutterBottom>
            Kithen Performance
          </Typography>
          <div
            style={{
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <div>
              <QRCode
                id="qrCodeEl"
                size={150}
                value={QRCODE_ID + idUser}
                onClick={(e) => console.log(e.target.value)}
              />
            </div>
          </div>
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
                      {feedbackList?.map((item, index) => (
                        <div key={index} style={{ width: '100%', marginLeft: '40px' }}>
                          <Card
                            sx={{ minWidth: 275, width: '90%', marginTop: '30px', borderRadius: 0 }}
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
                <CardHeader title="Total Orders and Income By Day" />
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
                        setEndDayGraph1(moment(newValue).format('YYYY/MM/DD'));
                        setRefresh(true);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    <Typography style={{ marginRight: 10, marginLeft: 10 }}>~</Typography>
                    <DatePicker
                      value={startDayGraph1}
                      style={{ size: '10px' }}
                      onChange={(newValue) => {
                        setStartDayGraph1(moment(newValue).format('YYYY/MM/DD'));
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
                  <Divider />
                  {/* <Line options={options} data={data} /> */}
                  <Bar
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top'
                        },
                        title: {
                          display: true,
                          text: 'Total Order per Hour'
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
                    data={chartData3Tab2}
                  />
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
