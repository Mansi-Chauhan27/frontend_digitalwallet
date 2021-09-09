import React from 'react';
import { BrowserRouter as Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
// import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import agent from '../../agent';
import { toast } from 'react-toastify';
// import API_ROOT_LOCAL from '../../agent';

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



export default function ButtonAppBarStart() {

  const classes = useStyles();
  console.log(window.location.href)
  const history = useHistory();
  console.log(window.location.href.indexOf('dashboard'))
  
  function logout(){
    const t = agent.DigitalWallet.logout()
    t.then(res=>{
      history.push("/")
    }).catch(err=>{
      toast.error('Something went Wrong!!')
    })
    
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
          {window.location.href.indexOf('dashboard')>0 ? <Button color="inherit" onClick={()=> history.push("/verifyotp")}>Verify</Button>  : <Link  id='1' href="#" className="btn btn-primary">Help</Link>}
          {window.location.href.indexOf('dashboard')>0 ? <Button color="inherit" onClick={()=> logout()}>Logout</Button>  : <> </>}

          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
