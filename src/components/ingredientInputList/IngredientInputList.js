import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

export default function IngredientInputList() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
      <TextField
        id="outlined-helperText"
        label="Name of Ingredient"
        defaultValue=""
        // onChange={(e) => setName(e.target.value)}
      />
      <TextField
        id="outlined-helperText"
        label="Name of Ingredient"
        defaultValue=""
        // onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}
