import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  makeStyles,
  Container
} from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Row, Col } from 'react-bootstrap';
import agent from '../../agent';
import ButtonAppBarStart from '../common/buttonappbarstart';

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
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const classes = useStyles();

  useEffect(() => {
    setTimeout(function () { setButtonDisabled(false) }, 3000);
  }, [])

  
  // API CAll to generate Otp
  function generateOtp() {
    console.log("otpppp")
    const t = agent.DigitalWallet.generate_otp()
    t.then((res) => {
      console.log(res)
      if (res) {
        toast.info(res['msg']);
      }
    }).catch(err=>{
      toast.error('Something went Wrong!!')
    })
  }

  // Submit Method
  function onSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    console.log('heyyyyy', formData, document.cookie)
    const config = {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    };
    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = 'X-CSRFToken'
    axios.post(agent.API_ROOT_LOCAL + '/client/verifyotp/', formData, config)
      .then((response) => {
        console.log(response);
        console.log(response.data);

        // localStorage.setItem('is_verified', true);
        // setTimeout(function(){ setButtonDisabled(false) }, 3000);
        setIslogin(true)

      }, (error) => {
        // console.log('Error', error.response.data, error.response.data['error']);
        toast.error('Incorrect OTP')
      });
  }

  if (islogin) {
    console.log(islogin)
    toast.success('Otp Verified Successfully')
    return <Redirect to="/dashboard" />
  }

  return (
    <React.Fragment>
      <ButtonAppBarStart />
    
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Verify Your Account
        </Typography>
        <form className={classes.form} noValidate onSubmit={e => onSubmit(e)}>

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
          <Row>
            <Col>
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
            </Col>
            <Col>
              <Button
                // type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={buttonDisabled}
                className={classes.submit}
                onClick={generateOtp}
              >
                Resend
              </Button>
            </Col>
          </Row>
          <Grid container>
            {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
            <Grid item>
              <Link href="/" variant="body2">
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
    </React.Fragment>
  );
}