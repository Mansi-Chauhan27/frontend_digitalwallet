import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
// import CSRFToken from './csrf';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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


export default function VerifyOtp() {

  const [islogin, setIslogin] = useState(false)
  const classes = useStyles();

  useEffect(()=>{
    const config = {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    };
    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = 'X-CSRFToken'
    axios.get('http://127.0.0.1:8000/client/getcustomers/',config)
      .then((response) => {
        console.log(response,'iuiuuuiui');
        console.log(response.data);

        // localStorage.setItem('token', response.data['token']);

        // setIslogin(true)

      }, (error) => {
        // console.log('Error', error.response.data, error.response.data['error']);
        toast.error('Incorrect OTP')
      });
  },[])

  function onSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    console.log('heyyyyy', formData, document.cookie)
    const config = {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    };
    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = 'X-CSRFToken'
    axios.post('http://127.0.0.1:8000/client/verifyotp/', formData,config)
      .then((response) => {
        console.log(response);
        console.log(response.data);

        // localStorage.setItem('token', response.data['token']);

        setIslogin(true)

      }, (error) => {
        // console.log('Error', error.response.data, error.response.data['error']);
        toast.error('Incorrect OTP')
      });
  }

  if (islogin) {
    console.log(islogin)
    toast.error('error')
    return <Redirect to="/dashboard" />
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={e => onSubmit(e)}>
          {/* <CSRFToken />
        {console.log(document.cookie)} */}
          
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="otp"
            label="OTP"
            name="otp"
            autoComplete="otp"
            autoFocus
          />
          
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          // onClick={onSubmit}
          >
            Verify
          </Button>
          <Grid container>
            {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
            <Grid item>
              <Link href="/login" variant="body2">
                {"Return to Log In"}
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