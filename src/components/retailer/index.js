import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// import Customers from './customers';
import Device from './device';
import agent from '../../agent';
// import Owners from './owners';
import { toast } from 'react-toastify';

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
  // const [customerList, setCustomerList] = React.useState([]);
  // const [ownerList, setOwnerList] = React.useState([]);
  const [deviceList, setDeviceList] = React.useState([]);
  const [update, setUpdate] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {

    
    const t = agent.DigitalWallet.get_devices()
    t.then((res) => {
      console.log(res.data);
      if (res && res.data) {
        setDeviceList(res.data['data']);
        console.log(deviceList)
      }

    }).catch(err => {
      console.log(err.status);
      if (err.status === 405 || err.status === 403) {
        toast.error('Permission Denied')
      }
    });

  }, [update])

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Devices" {...a11yProps(0)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {deviceList && <Device deviceList={deviceList} setUpdate={setUpdate}/>}
      </TabPanel>
    </div>
  );
}
