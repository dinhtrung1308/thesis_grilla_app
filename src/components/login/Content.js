import { styled } from '@mui/material/styles';
import { Grid, Typography, Item } from '@mui/material';
import backgroundimg from '../../assets/img/background.png';

import './Content.css'
import LoginForm  from './LoginForm';

// components

export default function Content(){
    return(
    <div className='content'>
        <Grid 
        direction="row"
        justifyContent="center"
        alignItems="center"
        container
        >
          <Grid item xs={8} >
            <img src={backgroundimg} alt="background" height={500}/>
          </Grid>
          <Grid item xs={4} >
            <LoginForm/>       
          </Grid>
        </Grid>
    </div>
    );
}