import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, BarElement } from 'chart.js';
import { Box, Grid, Container, Typography, Stack, TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import moment from 'moment';

import { Bar, Line } from 'react-chartjs-2';

import Card from '@mui/material/Card';

import CardHeader from '@mui/material/CardHeader';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';

ChartJS.register(BarElement);
function addColors(b) {
  const arrayColors = [
    '#21740e',
    '#a3bae0',
    '#301792',
    '#6c4f49',
    '#242e62',
    '#5a5035',
    '#2cad96',
    '#1013dc',
    '#657568',
    '#f96946',
    '#c45a54',
    '#f3555a'
  ];
  for (let i = 0; i < b.dataset.length; ) {
    b.dataset[i].backgroundColor = arrayColors[i];
    i += 1;
  }
  return b;
}
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
function ChartTab4() {
  const [chart1Tab3, setChart1Tab3] = useState({ labels: [], dataset: [] });
  const [chart2Tab4, setChart2Tab4] = useState({ labels: [], dataset: [] });

  const [endDayTab3, setEndDayTab3] = useState(getCurrentDate);
  const [startDayTab3, setStartDayTab3] = useState(get7PreviousDay);
  const token = sessionStorage.getItem('token');
  const [refresh, setRefresh] = useState(false);

  const chart = async () => {
    const response = await fetch(
      `http://103.116.105.48/api/performance/ingredient-amount-by-day?start=${startDayTab3}&end=${endDayTab3}`,
      {
        method: 'GET',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      }
    );
    const FinalData = await response.json();
    localStorage.setItem('chart1Tab4', JSON.stringify(FinalData));
    if (response.ok) {
      const list = JSON.parse(localStorage.getItem('chart1Tab4'));
      const final = addColors(list);

      setChart1Tab3(final);
      localStorage.removeItem('chart1Tab4');
    }
  };
  const chart2 = async () => {
    const response = await fetch(
      `http://103.116.105.48/api/performance/performance-by-hour?start=${startDayTab3}&end=${endDayTab3}`,
      {
        method: 'GET',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      }
    );
    const FinalData = await response.json();
    localStorage.setItem('chart2Tab4', JSON.stringify(FinalData.ingredient));
    if (response.ok) {
      const list = JSON.parse(localStorage.getItem('chart2Tab4'));
      const final = addColors(list);
      console.log(final);
      setChart2Tab4(final);
      localStorage.removeItem('chart2Tab4');
    }
  };
  useEffect(() => {
    if (chart1Tab3.length && !refresh) {
      return;
    }
    chart();
    chart2();
  }, [refresh]);
  useEffect(() => {
    if (refresh) {
      setTimeout(() => {
        setRefresh(false);
      }, 50);
    }
  }, [refresh]);

  const options = {
    maintainAspectRatio: false,
    scales: {},
    legend: {
      labels: {
        fontSize: 25
      }
    }
  };

  return (
    <div>
      <Card style={{ marginTop: 40 }}>
        <CardHeader title="Total Used Amount of Ingredient By Day" />
        <Grid container direction="row-reverse" alignItems="center" style={{ width: '95%' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={endDayTab3}
              style={{ size: '10px' }}
              onChange={(newValue) => {
                setEndDayTab3(moment(newValue).format('YYYY/MM/DD'));
                setRefresh(true);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
            <Typography style={{ marginRight: 10, marginLeft: 10 }}>~</Typography>
            <DatePicker
              value={startDayTab3}
              style={{ size: '10px' }}
              onChange={(newValue) => {
                setStartDayTab3(moment(newValue).format('YYYY/MM/DD'));
                setRefresh(true);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Box sx={{ p: 3, pb: 1 }} dir="ltr">
          <Bar
            data={{ labels: chart1Tab3.labels, datasets: chart1Tab3.dataset }}
            height={400}
            options={options}
          />
        </Box>
      </Card>
      <Card style={{ marginTop: 40 }}>
        <CardHeader title="Total Used Amount of Ingredient By Hours" />

        <Box sx={{ p: 3, pb: 1 }} dir="ltr">
          <Bar
            data={{ labels: chart2Tab4.labels, datasets: chart2Tab4.dataset }}
            height={400}
            options={options}
          />
        </Box>
      </Card>
    </div>
  );
}

export default ChartTab4;
