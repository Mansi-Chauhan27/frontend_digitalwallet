import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Customers from './customers';
import agent from '../../agent';
import Owners from './owners';
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

export default function Dashboard() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [customerList, setCustomerList] = React.useState([]);
  const [ownerList, setOwnerList] = React.useState([]);
  // const [deviceList, setDeviceList] = React.useState([]);
  const [updateCustomers, setUpdateCustomers] = React.useState(false);
  const [updateOwners, setUpdateOwners] = React.useState(false);
  const [loader, setLoader] = React.useState(false);
  const [customerResponse, setCustomerResponse] = React.useState(null);
  const [customerOffset, setCustomerOffset] = React.useState(10);
  const [ownerOffset, setOwnerOffset] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // API CAll to get all the customers/owners list
  useEffect(() => {

    const t = agent.DigitalWallet.get_cutomers_list(6,customerOffset)
    setLoader(true)
    t.then((res) => {
      console.log(res)
      if (res && res.results) {
        setLoader(false)
        setCustomerList(res.results);
        setCustomerResponse(res);
      }
    }).catch(err => {
      setLoader(false);
      if (err.status === 405 || err.status === 403) {
        toast.error('Permission Denied to Access Customers')
      }
    });


  }, [updateCustomers, customerOffset])

  useEffect(() => {

    const y = agent.DigitalWallet.get_owners_list(6,ownerOffset)
    setLoader(true)
    y.then((res) => {
      if (res && res.results) {
        setLoader(false);
        setOwnerList(res.results);
      }
    }).catch(err => {
      setLoader(false);
      if (err.status === 405 || err.status === 403) {

        toast.error('Permission Denied to access Reatilers')
      }
    });

  }, [updateOwners,ownerOffset])

  return (
    <React.Fragment>
      <ButtonAppBar></ButtonAppBar>
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Customers" {...a11yProps(0)} />
          <Tab label="Retailers" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {!loader?
        <div>
        {customerList && customerResponse && <Customers customerList={customerList} setUpdate={setUpdateCustomers} customerResponse={customerResponse} setCustomerOffset={setCustomerOffset} />}
        </div>
        :
        <Loader/>
        }
      </TabPanel>

      <TabPanel value={value} index={1}>
        {!loader?
        <div>
        {ownerList && <Owners customerList={ownerList} setUpdate={setUpdateOwners} setOwnerOffset={setOwnerOffset} />}
        </div>:
        <Loader />
        }
      </TabPanel>
    </div>
    </React.Fragment>
  );
}
