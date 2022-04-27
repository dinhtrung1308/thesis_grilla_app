import * as React from 'react';
import './HeaderBar.css'
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/img/logo_1.png';

export default function HeaderBar(){
    const navigate = useNavigate();
    const handleSignUp= () =>{
        navigate('signup')
    }
    return(
        <div className='header-bar'>
            <div className="logo-image">
                <img src={logoImg} alt="logo" height={80} />
            </div>
            <div className='navbar'>
                <Link
                    component="button"
                    variant="body2"
                    onClick={() => {
                        console.info("I'm a button.");
                    }}
                    >
                    Home
                </Link>
                <Link
                    component="button"
                    variant="body2"
                    onClick={() => {
                        console.info("I'm a button.");
                    }}
                    >
                    About
                </Link>
                <Link
                    component="button"
                    variant="body2"
                    onClick={() => {
                        console.info("I'm a button.");
                    }}
                    >
                    Contact
                </Link>
                <Link
                    component="button"
                    variant="body2"
                    onClick={handleSignUp}                    
                    >
                    Sign Up
                </Link>
            </div>
        </div>
    );
}