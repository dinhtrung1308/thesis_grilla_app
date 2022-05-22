import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/material/styles';
import { Grid, Typography, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import backgroundimg from '../../assets/img/background.png';

import './LoginForm.css';

toast.configure();

// components
async function loginUser(credentials) {
  return fetch('http://103.116.105.48/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }).then((data) => data.json());
}
export default function LoginForm(setToken) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password
    });
    // setToken(token);'
    if ('access_token' in token) {
      sessionStorage.setItem('token', token.access_token);
      sessionStorage.setItem('account', token.username);
      sessionStorage.setItem('idUser', token.user.id);
      toast.success('Login Successful!', { autoClose: 1000 });
      navigate('/dashboard/app');
    } else {
      toast.error('Login Failed!', { autoClose: 1000 });
    }
  };
  return (
    // onSubmit={handleSubmit(onSubmit)}
    <form className="form" onSubmit={handleSubmit}>
      <Typography style={{ color: '#FFC349' }} variant="h3" component="h2">
        Login
      </Typography>
      <TextField
        style={{ marginTop: '3rem', marginBottom: '1rem' }}
        id="username"
        label="Username"
        variant="filled"
        fullWidth
        onChange={(e) => setUserName(e.target.value)}
      />
      <TextField
        style={{ marginBottom: '1rem' }}
        id="password"
        label="Password"
        type="password"
        variant="filled"
        fullWidth
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button style={{ backgroundColor: '#FFC349' }} variant="contained" type="submit">
        Submit
      </Button>
    </form>
  );
}
