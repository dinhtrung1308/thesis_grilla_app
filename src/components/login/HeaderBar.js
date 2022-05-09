import * as React from 'react';
import './HeaderBar.css';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import logoImg from '../../assets/img/logo_1.png';

export default function HeaderBar() {
  const navigate = useNavigate();
  const handleSignUp = () => {
    navigate('signup');
  };
  return (
    <div className="header-bar">
      <div className="logo-image">
        <img src={logoImg} alt="logo" height={80} />
      </div>
      <div className="navbar">
        <Link component="button" variant="body2" onClick={handleSignUp}>
          <Button variant="contained">Register</Button>
        </Link>
      </div>
    </div>
  );
}
