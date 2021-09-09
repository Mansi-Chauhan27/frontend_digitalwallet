import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, AppBar, Tabs, Tab, Typography, Box } from '@material-ui/core';
import Device from './device';
import agent from '../../agent';
import { toast } from 'react-toastify';
import ButtonAppBar from '../common/buttonappbar';
import Loader from '../common/loader';

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
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Retailer() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [deviceList, setDeviceList] = React.useState([]);
  const [update, setUpdate] = React.useState(false);
  const [loader, setLoader] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // To Get All The Devices of the logged in Retailer
  useEffect(() => {
    const t = agent.DigitalWallet.get_devices();
    setLoader(true);
    t.then((res) => {
      setLoader(false);
      console.log(res.data);
      if (res && res.data) {
        setDeviceList(res.data['data']);
      }

    }).catch(err => {
      setLoader(false);
      console.log(err.status);
      if (err.status === 405 || err.status === 403) {
        toast.error('Permission Denied')
      }
    });

  }, [update])

  return (
    <React.Fragment>
      <ButtonAppBar />
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Devices" {...a11yProps(0)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {!loader ? deviceList && <Device deviceList={deviceList} setUpdate={setUpdate} />: <Loader/>}
      </TabPanel>
    </div>
    </React.Fragment>
  );
}
