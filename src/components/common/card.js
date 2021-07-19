import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';
// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { FcComboChart } from "react-icons/fc";
// import MoreVertIcon from '@material-ui/icons/MoreVert';
// import { BsFillGiftFill } from "react-icons/BsFillGiftFill";
const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    background: 'linear-gradient(to right, #0F2027, #203A43, #2C5364)',
    borderRadius: 20,

  },
});

export default function ImgMediaCard() {
  const classes = useStyles();

  return (
    <div style={{ padding: '24px' }}>
      <Card className={classes.root} style={{ background: 'linear-gradient(to right, #0F2027, #203A43, #2C5364)' }}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              M
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              {/* <MoreVertIcon /> */}
            </IconButton>
          }
          title="Wallet"
        // subheader="September 14, 2016"
        />
        <CardActionArea>
          {/* <CardMedia
          component="img"
          alt="Contemplative Reptile"
          height="140"
          image="/static/images/cards/contemplative-reptile.jpg"
          title="Contemplative Reptile"
        /> */}
          <CardContent>
          <div style={{ float: 'right' }}>
              <FcComboChart />
            </div>
            <Typography gutterBottom variant="h5" component="h2">
              Mansi Chauhan
            </Typography>
           
            <Typography variant="body2" color="textSecondary" component="p" style={{ color: 'silver' }}>
              Card No: 2343-2323-3232-3232
            </Typography>

          </CardContent>
        </CardActionArea>
        <CardActions>
          {/* <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button> */}
        </CardActions>
      </Card>
    </div>
  );
}
