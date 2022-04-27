import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box } from '@mui/material';

import Logo2 from '../assets/img/logo_2.png';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  return (
    <RouterLink to="/">
      <Box component="img" src={Logo2} sx={{ width: 80, height: 40, ...sx }} />
    </RouterLink>
  );
}
