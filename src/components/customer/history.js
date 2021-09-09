import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
// import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import agent from '../../agent';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { isIterableArray } from '../common/utils';
import { toast } from 'react-toastify';
import Loader from '../common/loader';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '90%',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function History(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [historyList, setHistoryList] = React.useState([]);
  const [openModalUser, setOpenModalUser] = React.useState(false);
  const [userCard, setUserCard] = React.useState('');
  const [userCardsList, setUserCardsList] = React.useState([]);
  const [loader, setLoader]  = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  
  // Set Users Card List
  useEffect(() => {
    setUserCardsList(props.userCardsList);
  }, [props.userCardsList])

  // Get History
  useEffect(() => {
    if (userCard !== '') {
      const t = agent.DigitalWallet.get_balance({ 'action': 'get_history', 'user_id': 65, 'card_id': userCard['id'] })
      setLoader(true);
      t.then((res) => {
        setLoader(false);
        console.log(res.data)
        if (res && res.data) {
          setHistoryList(res.data['data'])
        }
      }).catch(err=>{
        setLoader(false);
        if(err.status===404){
          toast.info('No Transaction Made')
        }
        else{
          toast.error('Something Went Wrong!');
        }
      });
    }
  }, [userCard])

  // Status Formatter for debit/credit status
  function statusFormatter(cell, row) {
    if (row.status==='Debit') {
      return (
        <span>
         Debited To
        </span>
      );
    }
  
    return (
      <span>
      Credited From
     </span>
    );
  }

  const columns = [
    {
      dataField: "amount",
      text: "Amount"
    },
    {
      dataField: "status",
      text: "Status",
      formatter: statusFormatter
    },
    {
      dataField: "source",
      text: "Source"
    },
    {
        dataField: "created_at",
        text: "Date Time"
    },
    // {
    //     dataField: "updated_at",
    //     text: "Date"
    // },

  ];

  const handleChangeModalUser = (event) => {
    setUserCard(event.target.value);
  };

  const handleCloseModalUSer = () => {
    setOpenModalUser(false);
  };

  const handleOpenModalUser = () => {
    setOpenModalUser(true);
  };

  return (
    <React.Fragment>
    <Card className={classes.root}>
      <CardHeader
        
        title="History"
      />

      <CardActions disableSpacing>
        
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <div style={{ padding: "20px" }}>
            <div>
              <FormControl className={classes.formControl} style={{ width: '50%' }}>
                <InputLabel id="demo-controlled-open-select-label1">Select Your Card</InputLabel>

                <Select
                  labelId="demo-controlled-open-select-label1"
                  id="demo-controlled-open-select1"
                  open={openModalUser}
                  onClose={handleCloseModalUSer}
                  onOpen={handleOpenModalUser}
                  // defaultValue={userCard}
                  value={userCard}
                  onChange={handleChangeModalUser}
                >
                  <MenuItem value="Select Your Card">
                    {/* <em>None</em> */}
                  </MenuItem>

                  {isIterableArray(userCardsList) &&
                    userCardsList.map((user_card, index) => {
                      return (
                        <option key={index} value={user_card} >
                          {user_card['card_number']}
                        </option>
                      )
                    }
                    )}
                </Select>


              </FormControl>
            </div>
            <br />
            {!loader?
            <div>
              <BootstrapTable
                keyField="id"
                data={historyList}
                columns={columns}
                bordered={ false }
                striped
                hover
                condensed
              />
            </div>
        :
        <Loader />
        }    
      </div>
        </CardContent>
      </Collapse>
    </Card>
    </React.Fragment>
  );
}
