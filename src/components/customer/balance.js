import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
// import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
// import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
// import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
// import FavoriteIcon from '@material-ui/icons/Favorite';
// import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

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

export default function Balance(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [balance, setBalance] = React.useState([]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
 
    useEffect(()=>{
        console.log(props.balance)
        setBalance(props.balance);
    },[props.balance])
  
  const columns = [
    {
        dataField: "card_number",
        text: "Card Number"
    },
    {
        dataField: "balance",
        text: "Balance"
    },
    // {
    //     dataField: "credit_to",
    //     text: "credit_to"
    // },
    // {
    //     dataField: "device__name",
    //     text: "Device"
    // },
    // {
    //     dataField: "updated_at",
    //     text: "Date"
    // },
   
];

  return (
    <React.Fragment>
    <Card className={classes.root}>
      <CardHeader
        title="Balance"
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
            {/* <h1 className="h2">Products</h1> */}
            <BootstrapTable keyField="id" data={balance} columns={columns} />
        </div>
        </CardContent>
      </Collapse>
    </Card>
    </React.Fragment>
  );
}
