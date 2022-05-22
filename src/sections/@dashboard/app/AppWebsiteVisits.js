import React, { useState, useEffect } from 'react';
import axios from 'axios';
// material
import { Card, CardHeader, Box } from '@mui/material';
//
import { Bar, Line } from 'react-chartjs-2';
import { map } from 'lodash';
// ----------------------------------------------------------------------
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
export default function AppWebsiteVisits() {
  const [startDayGraph1, setStartDayGraph1] = useState(get7PreviousDay);
  const [endDayGraph1, setEndDayGraph1] = useState(getCurrentDate);
  const [chartData1Tab2, setChartData1Tab2] = useState({});

  const token = sessionStorage.getItem('token');

  useEffect(() => {
    let totalOrders = [];
    let dateArrays = [];
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    axios
      .get(
        `http://103.116.105.48/api/performance/order-amount-by-day?start=${startDayGraph1}&end=${endDayGraph1}`,
        config
      )
      .then((res) => {
        totalOrders = res.data.amount;
        dateArrays = res.data.dates;
        const a = {
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
        };
        localStorage.setItem('dashboard', JSON.stringify(a));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const b = JSON.parse(localStorage.getItem('dashboard'));

  return (
    <Card>
      <CardHeader title="Total Order In Seven Days" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <Bar options={options} data={b} />
      </Box>
    </Card>
  );
}
