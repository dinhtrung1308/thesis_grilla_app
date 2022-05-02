import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { createStyles, makeStyles, Theme, styled } from '@mui/material/styles';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDining';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';

// materialimport React, { useState } from 'react';
import {
  Box,
  Grid,
  Container,
  Typography,
  Stack,
  Modal,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  Paper
} from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Iconify from '../components/Iconify';
import materialImage from '../assets/img/material.png';
// components
import Page from '../components/Page';

const PREFIX = 'Material';

const classes = {
  createIngredientStyle: `${PREFIX}-createIngredientStyle`,
  title: `${PREFIX}-title`,
  functionGroup: `${PREFIX}-functionGroup`
};

const StyledPage = styled(Page)({
  [`& .${classes.createIngredientStyle}`]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '10px 10px 10px 10px #f4f4f4',
    height: '30em',
    padding: '10px 20px 10px 20px',
    justifyContent: 'space-around'
  },
  [`& .${classes.title}`]: {
    color: '#212B36'
  },
  [`& .${classes.functionGroup}`]: {
    display: 'flex',
    justifyContent: 'space-between'
  }
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};
async function createIngredientFunction(obj) {
  const token = sessionStorage.getItem('token');

  return fetch('http://103.116.105.48/api/inventory/ingredient', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
async function orderFunction(obj) {
  const token = sessionStorage.getItem('token');
  return fetch('http://103.116.105.48/api/inventory/invoice', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  });
}
async function deleteIngredientFunction(obj) {
  const ID = localStorage.getItem('id');
  const token = sessionStorage.getItem('token');

  console.log(ID);
  return fetch(`http://103.116.105.48/api/inventory/ingredient/${ID}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  });
}
async function setSupplierFunction(obj) {
  const idSupplier = localStorage.getItem('idSupplier');
  const token = sessionStorage.getItem('token');

  return fetch(`http://103.116.105.48/api/inventory/ingredient/set-supplier/${idSupplier}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  });
}
export default function Material() {
  const [name, setName] = useState();
  const [stock, setStock] = useState();
  const [listSupplier, setListSupplier] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [openSupplier, setOpenSupplier] = React.useState(false);
  const [openOrderIngredient, setOpenOrderIngredient] = React.useState(false);
  const [priceEach, setPriceEach] = useState();
  const [unit, setUnit] = useState();
  const [supplierId, setSupplierId] = useState();
  const [invoicePrice, setInvoicePrice] = useState();
  const [amount, setAmount] = useState();
  const [activityRecord, setActivityRecord] = useState([]);
  const [ingredientId, setMaterial] = useState();
  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);
  const handleCloseSupplier = () => setOpenSupplier(false);
  const handleCloseOrderIngredient = () => {
    setOpenOrderIngredient(false);
    setInvoicePrice();
  };
  const [valueTabIndex, setValueTabIndex] = React.useState('1');

  const handleChangeTab = (event, newValue) => {
    setValueTabIndex(newValue);
  };
  const token = sessionStorage.getItem('token');
  const getIngredients = async () => {
    const response = await fetch('http://103.116.105.48/api/inventory/ingredient', {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
    const FinalData = await response.json();
    setIngredients(FinalData);
  };
  const getActivityRecord = async () => {
    const response = await fetch('http://103.116.105.48/api/inventory/stock-change', {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
    const FinalData = await response.json();
    setActivityRecord(FinalData);
  };
  useEffect(() => {
    if (ingredients.length && !refresh) {
      return;
    }
    getIngredients();
    getActivityRecord();
  }, [refresh]);
  const getSuppliers = async () => {
    const response = await fetch('http://103.116.105.48/api/supplier', {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
    const FinalData = await response.json();
    setListSupplier(FinalData);
  };
  useEffect(() => {
    if (ingredients.length && !refresh) {
      return;
    }
    getIngredients();
  }, [refresh]);
  useEffect(() => {
    if (listSupplier.length && !refresh) {
      return;
    }
    getSuppliers();
  }, [refresh]);
  useEffect(() => {
    if (refresh) {
      setTimeout(() => {
        setRefresh(false);
      }, 50);
    }
  }, [refresh]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const ingredientObject = await createIngredientFunction({
      name,
      stock,
      priceEach,
      unit
    });
    if (ingredientObject !== null) {
      toast.success('Create Successfully!', { autoClose: 1000 });
      setRefresh(true);
      setOpen(false);
    } else {
      toast.error('Create Unseccessfully!', { autoClose: 1000 });
    }
  };
  const handleSet = async (e) => {
    e.preventDefault();
    const changeObject = await setSupplierFunction({
      supplierId
    });
    if (changeObject !== null) {
      toast.success('Set Supplier Successfully!', { autoClose: 1000 });
      setRefresh(true);
      setOpenSupplier(false);
    } else {
      toast.error('Set Supplier Unseccessfully!', { autoClose: 1000 });
    }
  };
  const handleOrderIngredient = async (e) => {
    e.preventDefault();
    const id = localStorage.getItem('idIngredient');

    const invoiceObjc = await orderFunction({
      invoicePrice,
      amount,
      unit,
      ingredientId: id
    });
    if (invoiceObjc.ok) {
      toast.success('Set Supplier Successfully!', { autoClose: 1000 });
      setRefresh(true);
      setOpenOrderIngredient(false);
      setUnit();
    } else {
      toast.error('Please Set supplier before create', { autoClose: 1000 });
      setOpenOrderIngredient(false);
    }
  };
  const handleDelete = async (id) => {
    localStorage.setItem('id', id);
    const message = await deleteIngredientFunction({});
    if (message) {
      toast.success('Delete Successfully!', { autoClose: 1000 });
      setRefresh(true);
    } else {
      toast.error('Delete Unseccessfully!', { autoClose: 1000 });
    }
    localStorage.removeItem('id');
  };
  const handleClickOpenSetSupplier = (idIngredient) => {
    setOpenSupplier(true);
    localStorage.setItem('idSupplier', idIngredient);
  };
  const handleClickOpenOrderIngredient = (idIngredient) => {
    setOpenOrderIngredient(true);
    localStorage.setItem('idIngredient', idIngredient);
  };
  const calculateInvoice = () => {
    const id = localStorage.getItem('idIngredient');
    const found = ingredients.find((obj) => obj.id === id);
    let res = 0;
    res = (Number(amount) * Number(found.priceEach)).toFixed(2);
    setInvoicePrice(Number(res));
  };
  return (
    <StyledPage title="Material">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Ingredients
          </Typography>
          <Button
            variant="contained"
            // component={RouterLink}
            // to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpenModal}
          >
            New Ingredient
          </Button>
        </Stack>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={valueTabIndex}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                <Tab label="Ingredient List" value="1" />
                <Tab label="Activity History" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Grid container spacing={3}>
                {ingredients?.map((ingredient) => (
                  <Grid item xs={12} sm={6} md={3} key={ingredient.id}>
                    <Card sx={{ maxWidth: 345 }}>
                      <CardMedia component="img" height="140" image={materialImage} alt="tomato" />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          Name: {ingredient.name}
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div">
                          Stock: {ingredient.stock} {ingredient.unit}
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div">
                          Price per unit: {ingredient.priceEach} $
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            width: '100%'
                          }}
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            className="buttonOrder"
                            onClick={() => handleClickOpenOrderIngredient(ingredient.id)}
                          >
                            Order
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            className="buttonDelete"
                            color="secondary"
                            onClick={() => handleClickOpenSetSupplier(ingredient.id)}
                          >
                            Set Supplier
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            className="buttonDelete"
                            onClick={() => handleDelete(ingredient.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel value="2">
              <Box fullWidth>
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  {activityRecord?.map((item) => (
                    <div
                      style={{
                        marginTop: '20px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        width: '100%'
                      }}
                      key={item.id}
                    >
                      {item.note === 'accept invoice' ? (
                        <ShoppingCartCheckoutIcon style={{ color: '#f57842' }} />
                      ) : (
                        <TakeoutDiningIcon style={{ color: '#4296f5' }} />
                      )}

                      <Card sx={{ minWidth: 275, width: '90%' }}>
                        <CardContent
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            {moment(item.createdAt).format('DD/MM/YYYY')}
                            {'   '}
                            {moment(item.createdAt).format('h:mm:ss')}
                          </Typography>
                          <Typography variant="h5" component="div">
                            {item.note === 'accept invoice' ? 'Order' : 'Use'}
                          </Typography>
                          <Typography color="text.primary">
                            {item.amount} {item.ingredient.unit}
                          </Typography>
                          <Typography variant="body2">{item.ingredient.name}</Typography>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </Box>
            </TabPanel>
          </TabContext>
        </Box>

        <Modal
          open={open}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <form className={classes.createIngredientStyle} onSubmit={handleSubmit}>
              <Typography className={classes.title} variant="h4">
                Add new ingredient
              </Typography>
              <TextField
                id="outlined-helperText"
                label="Name of Ingredient"
                defaultValue=""
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                id="outlined-number"
                label="Quantity"
                type="number"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={(e) => setStock(e.target.value)}
              />
              <TextField
                id="outlined-number"
                label="Price"
                type="number"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={(e) => setPriceEach(e.target.value)}
              />
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">Unit</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <FormControlLabel value="Piece" control={<Radio />} label="Piece" />
                  <FormControlLabel value="Kg" control={<Radio />} label="Kg" />
                </RadioGroup>
              </FormControl>
              <Button variant="contained" type="submit">
                Create
              </Button>
              {/* <Button variant="contained" component="label">
                Upload File
                <input type="file" accept="image/*" />
              </Button> */}
            </form>
          </Box>
        </Modal>
        <Modal
          open={openSupplier}
          onClose={handleCloseSupplier}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <form className={classes.createIngredientStyle} onSubmit={handleSet}>
              <Typography className={classes.title} variant="h4">
                Set Supplier
              </Typography>

              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Supplier</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Supplier"
                  onChange={(e) => setSupplierId(e.target.value)}
                >
                  {listSupplier?.map((item) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button variant="contained" type="submit">
                Apply
              </Button>
              {/* <Button variant="contained" component="label">
                Upload File
                <input type="file" accept="image/*" />
              </Button> */}
            </form>
          </Box>
        </Modal>
        <Modal
          open={openOrderIngredient}
          onClose={handleCloseOrderIngredient}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <form className={classes.createIngredientStyle} onSubmit={handleOrderIngredient}>
              <Typography className={classes.title} variant="h4">
                Order Ingredient
              </Typography>
              <TextField
                id="outlined-number"
                label="Quantity"
                type="number"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={(e) => setAmount(e.target.value)}
              />

              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">Unit</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <FormControlLabel value="Piece" control={<Radio />} label="Piece" />
                  <FormControlLabel value="Kg" control={<Radio />} label="Kg" />
                </RadioGroup>
              </FormControl>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  width: '100%'
                }}
              >
                <Typography>Total Ingredient Price: </Typography>
                <Typography variant="h4" color="#fa9f16">
                  {invoicePrice} $
                </Typography>
                <IconButton aria-label="calculate" onClick={calculateInvoice} size="large">
                  <AutorenewIcon style={{ color: '#0000CD' }} />
                </IconButton>
              </div>
              <Button variant="contained" type="submit">
                Create
              </Button>
              {/* <Button variant="contained" component="label">
                Upload File
                <input type="file" accept="image/*" />
              </Button> */}
            </form>
          </Box>
        </Modal>
      </Container>
    </StyledPage>
  );
}
