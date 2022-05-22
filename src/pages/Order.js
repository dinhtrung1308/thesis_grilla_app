import React, { useState, useEffect } from 'react';
import useInterval from 'use-interval';
import { Link as RouterLink } from 'react-router-dom';
import { createStyles, makeStyles, Theme, styled } from '@mui/material/styles';

// materialimport React, { useState } from 'react';
import {
  Box,
  Grid,
  Container,
  Typography,
  Stack,
  Modal,
  TextField,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { ToastContainer, toast } from 'react-toastify';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckIcon from '@mui/icons-material/Check';
import Button from '@mui/material/Button';
// components
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import moment from 'moment';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';
import Page from '../components/Page';
import Iconify from '../components/Iconify';

const PREFIX = 'Order';
localStorage.setItem('idDetails', '');
const classes = {
  statusOpen: `${PREFIX}-statusOpen`,
  statusClose: `${PREFIX}-statusClose`,
  statusFinished: `${PREFIX}-statusFinished`,
  createIngredientStyle: `${PREFIX}-createIngredientStyle`,
  title: `${PREFIX}-title`,
  ingredientGroup: `${PREFIX}-ingredientGroup`
};

const StyledPage = styled(Page)({
  [`& .${classes.statusOpen}`]: {
    color: '#007B55',
    fontWeight: 'bold'
  },
  [`& .${classes.statusClose}`]: {
    color: '#0DA2FF',
    fontWeight: 'bold'
  },
  [`& .${classes.statusFinished}`]: {
    color: '#f57842',
    fontWeight: 'bold'
  },
  [`& .${classes.createIngredientStyle}`]: {
    display: 'grid',
    gap: '40px',
    alignItems: 'center',
    boxShadow: '10px 10px 10px 10px #f4f4f4',
    height: 'max-content',
    padding: '10px 20px 10px 20px',
    justifyContent: 'space between',
    overflow: 'scroll',
    justifyItems: 'flex-start'
  },
  [`& .${classes.title}`]: {
    color: '#212B36'
  },
  [`& .${classes.ingredientGroup}`]: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around'
  }
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
const style = {
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: '100vh',
  overflow: 'scroll',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}
async function createOrderFunction(obj) {
  const TOKEN = sessionStorage.getItem('token');

  return fetch('http://103.116.105.48/api/order', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  });
}
async function deleteOrderFunction(obj) {
  const TOKEN = sessionStorage.getItem('token');

  const idOrder = localStorage.getItem('idOrder');
  return fetch(`http://103.116.105.48/api/order/${idOrder}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  });
}
async function updateStatusO2I(obj) {
  const idOrder = localStorage.getItem('idOrder');
  const TOKEN = sessionStorage.getItem('token');

  return fetch(`http://103.116.105.48/api/order/accept_order/${idOrder}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  });
}
async function updateStatusI2F(obj) {
  const idOrder = localStorage.getItem('idOrder');
  const TOKEN = sessionStorage.getItem('token');

  return fetch(`http://103.116.105.48/api/order/finish_order/${idOrder}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  });
}
function millisToMinutesAndSeconds(millis) {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
function getCurrentDate() {
  const d = new Date();
  const currentDate = String(d.getDate());
  const currentMonth = String(d.getMonth() + 1);
  const currentYear = String(d.getFullYear());
  const today = currentYear.concat('/', currentMonth, '/', currentDate);
  return today;
}
function getCurrentTime() {
  const d = new Date();
  return d;
}
function c() {
  const d = new Date('2022-4-27');

  return d;
}
function convertStringToMili(time) {
  const res = new Date(time);
  return res.getTime();
}
// ----------------------------------------------------------------------
export default function Order() {
  const [value, setValue] = React.useState(0);
  const [now, setNow] = useState(new Date());
  const [status, setStatus] = useState('');
  const [startDay, setStartDay] = useState(getCurrentDate);
  const [endDay, setEndDay] = useState(getCurrentDate);
  const [countUpStart, setCountUpStart] = useState();
  const [countUpEnd, setCountUpEnd] = useState();

  const [orderDishId, setOrderDishId] = useState('');
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
  const [index, setIndex] = useState(1);

  const [counts, setCounts] = useState([0]);
  const [expanded, setExpanded] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  //   function const
  const [name, setDishName] = useState('');
  const [valueI, setValueI] = useState({
    dishId: '',
    amount: 0
  });
  const [dishInfos, setArrayObjDish] = useState([]);
  const [listDish, setListDish] = useState([]);
  const [price, setPrice] = useState(0);
  const [orders, setOrders] = useState([]);
  const [ordersInProgress, setOrdersInProgress] = useState([]);
  const [ordersFinished, setOrdersFinished] = useState([]);
  const [dishIngredient, setDishIngredient] = useState([]);
  const [details, setDetails] = useState([]);
  const token = sessionStorage.getItem('token');
  const handleOpenCreateDish = () => setOpen(true);
  const handleCloseCreateDish = () => {
    setOpen(false);
    setArrayObjDish([]);
    setPrice(0);
    setIndex(1);
    setCounts([1]);
  };
  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setRefresh(true);
  };

  const handleExpandClick = (idDishIngredient) => {
    console.log(idDishIngredient);
    setExpanded(!expanded);
  };
  const getOrders = async () => {
    const response = await fetch('http://103.116.105.48/api/order?status=open', {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
    const FinalData = await response.json();
    setOrders(FinalData);
  };
  const getOrdersInProgress = async () => {
    const response = await fetch('http://103.116.105.48/api/order?status=processing', {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
    const FinalData = await response.json();
    setOrdersInProgress(FinalData);
  };
  const getOrdersFinished = async () => {
    const response = await fetch(
      `http://103.116.105.48/api/order?status=finished&start=${startDay}&end=${endDay}`,
      {
        method: 'GET',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      }
    );
    const FinalData = await response.json();
    setOrdersFinished(FinalData);
  };
  const getDetails = async () => {
    const idDetails = localStorage.getItem('idDetails');
    const response = await fetch(`http://103.116.105.48/api/order/${idDetails}`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
    const FinalData = await response.json();
    setDetails(FinalData);
  };
  // const getDishIngredigent = async () => {
  //   const id = localStorage.getItem('idIndex');
  //   const response = await fetch(`http://103.116.105.48/dish/${id}`, {
  //     method: 'GET',
  //     headers: new Headers({
  //       Authorization: `Bearer ${token}`,
  //       'Content-Type': 'application/json'
  //     })
  //   });

  //   const FinalData = await response.json();
  //   setDishIngredient(FinalData);
  // };
  const getListDish = async () => {
    const response = await fetch('http://103.116.105.48/api/dish', {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    });
    const FinalData = await response.json();
    setListDish(FinalData);
  };
  const handlePatchStartTime = async () => {
    const id = localStorage.getItem('orderDishId');
    const requestOptions = {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        time: moment(countUpStart).format('YYYY-MM-DDTHH:mm:ss')
      })
    };
    const response = await fetch(`http://103.116.105.48/api/order/start/${id}`, requestOptions);

    if (response.ok) {
      setRefresh(true);
      setOrderDishId('');
    } else {
      toast.error('Cannot Cook !', { autoClose: 1000 });
    }
  };
  const handlePatchEndTime = async () => {
    const id = localStorage.getItem('orderDishId');
    const requestOptions = {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        time: moment(countUpEnd).format('YYYY-MM-DDTHH:mm:ss')
      })
    };
    const response = await fetch(`http://103.116.105.48/api/order/end/${id}`, requestOptions);

    if (response.ok) {
      setRefresh(true);
      setOrderDishId('');
    } else {
      toast.error('Cannot Cook !', { autoClose: 1000 });
    }
  };
  useEffect(() => {
    if (orders.length && !refresh) {
      return;
    }
    getOrders();
    getOrdersInProgress();
    getOrdersFinished();
    getListDish();
    getDetails();
  }, [refresh]);
  useEffect(() => {
    if (refresh) {
      setTimeout(() => {
        setRefresh(false);
      }, 50);
    }
  }, [refresh]);
  useInterval(() => {
    // Your custom logic here
    setNow(getCurrentTime());
  }, 1000);
  //   const customInput = (counts) => {
  //     counts.map((a) => {
  //       <IngredientInputList key={a.index} item={a} />;
  //     });
  //   };
  // useEffect(() => {
  //   if (dishIngredient.length && !refresh) {
  //     return;
  //   }
  //   getDishIngredigent();
  // }, [refresh]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderObject = await createOrderFunction({
      // name,
      // retailPrice,
      price,
      // ingredientPrice,
      dishInfos
    });
    if (orderObject) {
      toast.success('Create Successfully!', { autoClose: 1000 });
      setRefresh(true);
      setOpen(false);
      setArrayObjDish([]);
    } else {
      toast.error('Create Unseccessfully!', { autoClose: 1000 });
    }
  };
  // Replace idDish => idOrder
  const handleDelete = async (idDish) => {
    localStorage.setItem('idDish', idDish);
    const message = await deleteOrderFunction({});
    if (message.ok) {
      toast.success('Delete Successfully!', { autoClose: 1000 });
      setRefresh(true);
    } else {
      toast.error('Delete Unseccessfully!', { autoClose: 1000 });
    }
    localStorage.removeItem('idDish');
  };
  const handleUpdateStatusO2I = async (idOrder) => {
    console.log(idOrder);
    localStorage.setItem('idOrder', idOrder);
    const message = await updateStatusO2I({});
    if (message.ok) {
      toast.success('Update Successfully!', { autoClose: 1000 });
      setRefresh(true);
    } else {
      toast.error('Update Unseccessfully!', { autoClose: 1000 });
    }
  };
  const handleUpdateStatusI2F = async (idOrder) => {
    console.log(idOrder);
    localStorage.setItem('idOrder', idOrder);
    const message = await updateStatusI2F({});
    if (message.ok) {
      toast.success('Update Successfully!', { autoClose: 1000 });
      setRefresh(true);
    } else {
      toast.error('Update Unseccessfully!', { autoClose: 1000 });
    }
  };

  function handleChangeIngredient(e) {
    const newdata = { ...valueI };
    if (e.target.id !== 'amount') {
      newdata.dishId = e.target.value;
    } else if (e.target.id === 'amount') {
      newdata.amount = +e.target.value;
    }
    console.log(newdata);
    setValueI(newdata);
  }

  const handleIncrease = () => {
    setIndex(index + 1);

    setCounts([...counts, index]);
    console.log(counts);
  };
  const handleInsert = () => {
    dishInfos.push(valueI);
    console.log(dishInfos);
  };
  const calculatePrice = () => {
    const indexArray = [];
    const amountArray = [];
    const priceArray = [];
    for (let i = 0; i < dishInfos.length; ) {
      indexArray[i] = dishInfos[i].dishId;
      i += 1;
    }
    for (let i = 0; i < dishInfos.length; ) {
      amountArray[i] = dishInfos[i].amount;
      i += 1;
    }
    const filteredArrayById = listDish.filter(({ id }) => indexArray.includes(id));
    for (let i = 0; i < filteredArrayById.length; ) {
      priceArray[i] = filteredArrayById[i].retailPrice;
      i += 1;
    }
    let result = 0;
    result = amountArray.reduce(function (r, a, i) {
      return r + a * priceArray[i];
    }, 0);
    let res = 0;
    res = result.toFixed(2);
    setPrice(Number(res));
  };
  return (
    <StyledPage title="Order">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Orders
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpenCreateDish}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Create Order
          </Button>
        </Stack>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChangeTab} aria-label="basic tabs example">
            <Tab label="Open Order" {...a11yProps(0)} />
            <Tab label="In Progress Order" {...a11yProps(1)} />
            <Tab label="Finished Order" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>No. Order</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Dish</TableCell>
                  <TableCell>Total Price</TableCell>

                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders?.map((order, index) => (
                  <TableRow
                    key={order.orderId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {moment(order.createdAt).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {moment(order.createdAt).format('h:mm:ss')}
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      <Button
                        onClick={(event) => {
                          localStorage.setItem('idDetails', order.orderId);
                          setDetailsOpen(true);
                          setRefresh(true);
                        }}
                      >
                        Details
                      </Button>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {order.orderPrice} $
                    </TableCell>

                    <TableCell
                      align="right"
                      className={order.status === 'OPEN' ? classes.statusOpen : classes.statusClose}
                    >
                      {order.status}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton aria-label="delete" size="large">
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        aria-label="update"
                        onClick={() => handleUpdateStatusO2I(order.orderId)}
                        size="large"
                      >
                        <CheckIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>No. Order</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Dish</TableCell>
                  <TableCell>Total Price</TableCell>

                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ordersInProgress?.map((order, index) => (
                  <TableRow
                    key={order.orderId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {moment(order.createdAt).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {moment(order.createdAt).format('h:mm:ss')}
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      <Button
                        onClick={(event) => {
                          localStorage.setItem('idDetails', order.orderId);
                          setDetailsOpen(true);
                          setRefresh(true);
                        }}
                      >
                        Details
                      </Button>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {order.orderPrice} $
                    </TableCell>

                    <TableCell
                      align="right"
                      className={order.status === 'OPEN' ? classes.statusOpen : classes.statusClose}
                    >
                      {order.status}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton aria-label="delete" size="large">
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        aria-label="update"
                        onClick={() => handleUpdateStatusI2F(order.orderId)}
                        size="large"
                      >
                        <CheckIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Stack direction="row-reverse" alignItems="center" justifyContent="flex-start" mb={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={endDay}
                onChange={(newValue) => {
                  setEndDay(moment(newValue).format('YYYY-MM-DD'));
                  setRefresh(true);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
              <Typography marginLeft={2} marginRight={5} variant="h5">
                To:
              </Typography>
              <DatePicker
                value={startDay}
                onChange={(newValue) => {
                  setStartDay(moment(newValue).format('YYYY-MM-DD'));
                  setRefresh(true);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
              <Typography marginRight={5} variant="h5">
                From:
              </Typography>
            </LocalizationProvider>
          </Stack>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>No. Order</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Dish</TableCell>
                  <TableCell>Total Price</TableCell>

                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ordersFinished?.map((order, index) => (
                  <TableRow
                    key={order.orderId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {moment(order.createdAt).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {moment(order.createdAt).format('h:mm:ss')}
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      <Button
                        onClick={(event) => {
                          localStorage.setItem('idDetails', order.orderId);
                          setDetailsOpen(true);
                          setRefresh(true);
                        }}
                      >
                        Details
                      </Button>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {order.orderPrice} $
                    </TableCell>

                    <TableCell align="right" className={classes.statusFinished}>
                      {order.status}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton aria-label="delete" size="large">
                        <DeleteIcon />
                      </IconButton>
                      {/* <IconButton
                        aria-label="update"
                        onClick={() => handleUpdateStatusO2I(order.orderId)}
                      >
                        <CheckIcon />
                      </IconButton> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <Modal
          open={open}
          onClose={handleCloseCreateDish}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div
              style={{
                display: 'flex',
                width: '100%',
                flexDirection: 'row-reverse'
              }}
            >
              <IconButton
                aria-label="close"
                onClick={handleCloseCreateDish}
                style={{ color: '#FE4018 ' }}
                size="large"
              >
                <CloseIcon style={{ fontWeight: '900', size: '30' }} />
              </IconButton>
            </div>
            {/* onSubmit={handleSubmit} */}
            <form className={classes.createIngredientStyle} onSubmit={handleSubmit}>
              <Typography className={classes.title} variant="h4">
                Add new order
              </Typography>

              {counts?.map((item, index) => (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'end',
                    gap: '40px',
                    width: '100%'
                  }}
                  key={index}
                >
                  <div>
                    <InputLabel id="demo-simple-select-helper-label">Dish</InputLabel>

                    <Select
                      id="dishId"
                      label="Dish"
                      defaultValue=""
                      onChange={(e) => handleChangeIngredient(e)}
                    >
                      {listDish?.map((dish) => (
                        <MenuItem key={dish.id} value={dish.id}>
                          {dish.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>

                  {/* <NumericInput
                    precision={1}
                    name="amount"
                    decimalChar="."
                    thousandChar=","
                    label="Quantity"
                    InputLabelProps={{
                      shrink: true
                    }}
                    variant="outlined"
                    onChange={(e) => handleChangeIngredient(e)}
                  /> */}
                  <TextField
                    inputProps={{ type: 'decimal' }}
                    label="Quantity"
                    id="amount"
                    InputLabelProps={{
                      shrink: true
                    }}
                    variant="outlined"
                    onChange={(e) => handleChangeIngredient(e)}
                  />
                  {/* <input
                    label="Quantity"
                    id="amount"
                    type="number"
                    step="0.01"
                    onChange={(e) => handleChangeIngredient(e)}
                  /> */}
                  <Checkbox onClick={handleInsert} />
                  <IconButton onClick={handleIncrease} size="large">
                    <AddIcon style={{ color: '#006400' }} />
                  </IconButton>
                  <IconButton onClick={() => setCounts(counts.splice(index, 1))} size="large">
                    <RemoveIcon style={{ color: '#FF4500' }} />
                  </IconButton>
                </div>
              ))}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'end',
                  gap: '50px',
                  width: '100%'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px'
                  }}
                >
                  <Typography>Total Order Price: </Typography>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%'
                    }}
                  >
                    <Typography>{price}</Typography>
                    <IconButton aria-label="calculate" onClick={calculatePrice} size="large">
                      <AutorenewIcon style={{ color: '#0000CD' }} />
                    </IconButton>
                  </div>
                </div>
                {/* <TextField
                  id="outlined-number"
                  label="Price"
                  type="number"
                  InputLabelProps={{
                    shrink: true
                  }}
                  onChange={(e) => setPrice(Number(e.target.value))}
                /> */}
              </div>
              <div style={{ width: '100%' }}>
                <Button
                  variant="contained"
                  type="submit"
                  style={{ display: 'block', margin: '0 auto', width: '25%' }}
                >
                  Create
                </Button>
                {/* <Button variant="contained" onClick={handleIncrease}>
                  Add ingredient
                </Button>
                <Button variant="contained" onClick={() => setCounts(counts.splice(1))}>
                  Delete ingredient
                </Button> */}
              </div>
              {/* <Button variant="contained" component="label">
                Upload File
                <input type="file" accept="image/*" />
              </Button> */}
            </form>
          </Box>
        </Modal>
        <Modal
          open={detailsOpen}
          onClose={handleCloseDetails}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'relative',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 800,
              height: '50vh',
              overflow: 'scroll',
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Order Details
            </Typography>
            {details.orderDishs?.map((item, index) => (
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="baseline"
                spacing={2}
                key={index}
              >
                <Grid item xs={4} sm={4} md={4}>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {index + 1}
                    {'.   '} {item.dish.name} {'               x '} {item.amount}
                  </Typography>
                </Grid>
                <Grid item xs={2} sm={2} md={2}>
                  <Typography>Cooking Time: </Typography>
                </Grid>
                <Grid item xs={2} sm={2} md={2}>
                  {(() => {
                    if (value === 1 && item.startCook !== null && item.finishCook === null) {
                      return (
                        <Typography>
                          {millisToMinutesAndSeconds(
                            now.getTime() - convertStringToMili(item.startCook)
                          )}
                        </Typography>
                      );
                    }
                    if (value === 1 && item.cookingTime) {
                      return <Typography>{item.cookingTime}</Typography>;
                    }
                  })()}
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                  {/* <Button onClick={() => console.log(String(item.orderDishId))}>Start</Button> */}
                  {(() => {
                    if (value === 1 && item.startCook === null) {
                      return (
                        <Button
                          onClick={() => {
                            setCountUpStart(new Date());
                            localStorage.setItem('orderDishId', item.orderDishId);
                            setOrderDishId(item.orderDishId);
                            handlePatchStartTime();
                          }}
                        >
                          Start
                        </Button>
                      );
                    }
                    if (value === 1 && item.finishCook === null && item.startCook !== null) {
                      return (
                        <Button
                          onClick={() => {
                            setCountUpEnd(new Date());
                            localStorage.setItem('orderDishId', item.orderDishId);
                            setOrderDishId(item.orderDishId);
                            handlePatchEndTime();
                          }}
                        >
                          End
                        </Button>
                      );
                    }
                  })()}
                </Grid>
              </Grid>
            ))}
          </Box>
        </Modal>
      </Container>
    </StyledPage>
  );
}
