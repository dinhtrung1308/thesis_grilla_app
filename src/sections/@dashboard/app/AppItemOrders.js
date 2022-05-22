// material
import React, { useState, useEffect } from 'react';

import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
//
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.warning.darker,
  backgroundColor: theme.palette.warning.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.warning.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.warning.dark, 0)} 0%, ${alpha(
    theme.palette.warning.dark,
    0.24
  )} 100%)`
}));
function getCurrentDate() {
  const d = new Date();
  const currentDate = String(d.getDate());
  const currentMonth = String(d.getMonth() + 1);
  const currentYear = String(d.getFullYear());
  const today = currentYear.concat('/', currentMonth, '/', currentDate);
  return today;
}
// ----------------------------------------------------------------------

const TOTAL = 1723315;

export default function AppItemOrders() {
  const [data, setData] = useState({});
  const [startDay, setStartDay] = useState(getCurrentDate);

  const token = sessionStorage.getItem('token');
  const [refresh, setRefresh] = useState(false);
  const getData = async () => {
    const response = await fetch(`http://103.116.105.48/api/performance/order?start=${startDay}`, {
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
    <RootStyle>
      <IconWrapperStyle>
        <Iconify icon="icons8:buy" width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(data.ingredientPrice)} $</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Expense
      </Typography>
    </RootStyle>
  );
}
