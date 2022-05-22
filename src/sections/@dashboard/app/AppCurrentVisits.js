import React, { useState, useEffect } from 'react';

import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader, Paper, Typography, Grid } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../../components/charts';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

// ----------------------------------------------------------------------

const CHART_DATA = [4344, 5435, 1443, 4443];
function getCurrentDate() {
  const d = new Date();
  const currentDate = String(d.getDate());
  const currentMonth = String(d.getMonth() + 1);
  const currentYear = String(d.getFullYear());
  const today = currentYear.concat('/', currentMonth, '/', currentDate);
  return today;
}
export default function AppCurrentVisits() {
  const [data, setData] = useState({});
  const [startDay, setStartDay] = useState(getCurrentDate);

  const token = sessionStorage.getItem('token');
  const [refresh, setRefresh] = useState(false);
  const getData = async () => {
    const response = await fetch(`http://103.116.105.48/api/performance/top5?start=${startDay}`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
    const FinalData = await response.json();
    setData(FinalData);
  };
  useEffect(() => {
    // if (data && !refresh) {
    //   return;
    // }
    getData();
  }, [refresh]);
  useEffect(() => {
    if (refresh) {
      setTimeout(() => {
        setRefresh(false);
      }, 50);
    }
  }, [refresh]);

  return (
    <Card>
      <CardHeader title="Top 5 best-seller dishes" style={{ backgroundColor: '#FA9A82' }} />
      <ChartWrapperStyle dir="ltr" style={{ backgroundColor: '#F9FBFF' }}>
        {data.dishs?.map((item, index) => (
          <Grid container spacing={3} key={index}>
            <Grid item xs={1} sm={1} md={1}>
              {' '}
            </Grid>
            <Grid item xs={3} sm={3} md={3}>
              <Typography variant="h6" style={{ color: '#FFA701' }}>
                {index + 1}.
              </Typography>
            </Grid>
            <Grid item xs={8} sm={8} md={8}>
              <Typography variant="h6" style={{ color: '#FFA701' }}>
                {item.dish.name}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </ChartWrapperStyle>
    </Card>
  );
}
