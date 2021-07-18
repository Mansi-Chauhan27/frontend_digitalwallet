import React from 'react';
import { BrowserRouter as Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));



export default function ButtonAppBar() {

  const classes = useStyles();
  console.log(window.location.href)
  const history = useHistory();
  function redirect(){
    console.log('here')
    return <Redirect to="/verifyotp" />
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Digital Wallet
          </Typography>
          {/* <Button color="inherit">Sign Up</Button> */}
          <div>
          {window.location.href=='http://localhost:3000/dashboard' ? <Button color="inherit" onClick={()=> history.push("/verifyotp")}>Verify</Button>  : <Link  id='1' href="#" className="btn btn-primary">Help</Link>}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
