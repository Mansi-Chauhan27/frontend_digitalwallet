import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
// import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
// import CSRFToken from './csrf';
import { ToastContainer, toast } from "react-toastify";
import { Redirect } from 'react-router-dom';

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

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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


export default function Login() {

  const [islogin, setIslogin] = useState(false)
  const [usertype, setUsertype] = React.useState('customer');

  const classes = useStyles();

  function onSubmit(e) {
    e.preventDefault()

    // console.log()
    const formData = new FormData()
    console.log('heyyyyy', formData, e.target.password.value)
    formData.append('email',e.target.email.value);
    formData.append('first_name',e.target.firstname.value);
    formData.append('last_name',e.target.lastname.value);
    formData.append('password',e.target.password.value);
    formData.append('password2',e.target.password2.value)
    formData.append('is_admin',e.target.usertype.value==='admin'? true : false)
    formData.append('is_customer',e.target.usertype.value==='customer'? true : false)
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
    axios.post('http://127.0.0.1:8000/client/register/', formData)
      .then((response) => {
        console.log(response);
        console.log(response.data);

        localStorage.setItem('token', response.data['token']);
        // <Link to={{ pathname: `/dashboard` }}></Link>
        // window.location = '/dashboard';
        // return <Redirect to="/dashboard" />
        setIslogin(true)
      }, (error) => {
        console.log('Error', error.response.data, error.response.data['email']);
        console.log('email' in error.response.data)
        if('email' in error.response.data)
         toast.error('Email: '+error.response.data['email'][0]);
         else if ('password' in error.response.data)
         toast.error('Password: '+error.response.data['password'][0]);

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
          {/* <CSRFToken /> */}
          {console.log(document.cookie)}
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
          <FormControl >
            <FormLabel component="legend">User Type</FormLabel>
            <RadioGroup aria-label="usertype" name="usertype" value={usertype} onChange={handleChange}>
              <FormControlLabel value="customer" control={<Radio />} label="customer" />
              <FormControlLabel value="admin" control={<Radio />} label="admin" />
            </RadioGroup>
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