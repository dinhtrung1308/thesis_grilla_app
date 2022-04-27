import React, { useState } from 'react';
import PropTypes from 'prop-types';
// material
import { styled } from '@mui/styles';
import { Grid, Typography, Item } from '@mui/material';
// components
import HeaderBar from '../components/login/HeaderBar';
import backgroundimg from '../assets/img/background.png';
import Content from '../components/login/Content';
// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7)
  }
}));

// ----------------------------------------------------------------------

Login.propTypes = {};

export default function Login(props) {
  console.log(props);
  const [token, setToken] = useState();

  return (
    <div style={{ backgroundColor: '#fff', padding: 5 }}>
      <HeaderBar />
      <Content />
    </div>
  );
}
