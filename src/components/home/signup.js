import React, { useState } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Link,
  Grid,
  Box,
  Typography,
  makeStyles,
  Container
} from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import { Redirect } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import agent from '../../agent';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// Styles
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


export default function Signup() {

  const [islogin, setIslogin] = useState(false)
  const [usertype, setUsertype] = React.useState('customer');

  const classes = useStyles();

  // Submit Method
  function onSubmit(e) {
    e.preventDefault()

    // console.log()
    const formData = new FormData()
    formData.append('email', e.target.email.value);
    formData.append('first_name', e.target.firstname.value);
    formData.append('last_name', e.target.lastname.value);
    formData.append('password', e.target.password.value);
    formData.append('password2', e.target.password2.value)
    formData.append('is_admin', e.target.usertype.value === 'admin' ? 'True' : 'False')
    formData.append('is_customer', e.target.usertype.value === 'customer' ? 'True' : 'False')
    formData.append('is_owner', e.target.usertype.value === 'retailer' ? 'True' : 'False')
    // formData.append('is_admin', true)
    // formData.append('is_customer', false)
    // formData.append('is_owner', false)
    // formData={
    //   'email': e.target.email.value,
    //   'first_name':e.target.firstname.value,
    //   'last_name':e.target.lastname.value,
    //   'password':e.target.password.value,
    //   'password2':e.target.password2.value,
    //   // 'is_admin':e.target.admin.value,
    //   // 'is_customer':e.target.customer.value
    // }

    console.log(formData)

    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = 'X-CSRFToken'
    axios.post(agent.API_ROOT_LOCAL + '/client/register/', formData)
      .then((response) => {
        console.log(response);
        console.log(response.data, 'REGISTERR');

        localStorage.setItem('token', response.data['token']);
        localStorage.setItem('token', response.data['token']);
        localStorage.setItem('is_admin', response.data['is_admin']);
        localStorage.setItem('user_type', response.data['user_type']);

        // <Link to={{ pathname: `/dashboard` }}></Link>
        // window.location = '/dashboard';
        // return <Redirect to="/dashboard" />
        setIslogin(true)
      }, (error) => {
        console.log('Error', error.response.data, error.response.data['email']);
        console.log('email' in error.response.data)
        if ('email' in error.response.data)
          toast.error('Email: ' + error.response.data['email'][0]);
        else if ('password' in error.response.data)
          toast.error('Password: ' + error.response.data['password'][0]);

      });
  }

  if (islogin) {
    console.log(islogin)
    return <Redirect to="/verifyotp" />
  }


  const handleChange = (event) => {
    setUsertype(event.target.value);
  };


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form className={classes.form} noValidate onSubmit={e => onSubmit(e)}>
          {console.log(document.cookie)}
          <Row>
            <Col>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="firstname"
                label="Firstname"
                name="firstname"
                autoComplete="firstname"
                autoFocus
              />
            </Col>

            <Col>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="lastname"
                label="Lastname"
                name="lastname"
                autoComplete="lastname"
                autoFocus
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />

            </Col>
          </Row>

          <Row>
            <Col>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Col>
            <Col>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password2"
                label="Confirm Password"
                type="password"
                id="password2"
                autoComplete="current-password"
              />
            </Col>
          </Row>


          <FormControl >
            <FormLabel component="legend">User Type</FormLabel>
            <Row>

              <RadioGroup aria-label="usertype" name="usertype" value={usertype} onChange={handleChange} row>
                <Col> <FormControlLabel value="customer" control={<Radio />} label="customer" /> </Col>
                {/* <Col>  <FormControlLabel value="admin" control={<Radio />} label="admin" /> </Col> */}
                <Col>  <FormControlLabel value="retailer" control={<Radio />} label="retailer" /> </Col>
              </RadioGroup>


            </Row>

          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          // onClick={onSubmit}
          >
            Sign Up
          </Button>
          <Grid container>
            {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
            <Grid item>
              <Link href="/" variant="body2">
                {"Already a member? Log in"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <ToastContainer />
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}