import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
// import CardMedia from '@material-ui/core/CardMedia';
import { red } from '@material-ui/core/colors';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { Row, Col } from 'react-bootstrap';
import agent from '../../agent';
import {  toast } from "react-toastify";
import { isIterableArray } from '../common/utils';



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
    buttonroot: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(2, 4, 3),
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        // border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: '50%',
        bottom: '50%',
        width: '50%',
        height: '50%',
    },
}));

export default function Topup(props) {

    
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [giftCArd, setGiftCard] = React.useState('');
    const [openModal, setOpenModal] = React.useState(false);
    const [giftCardList, setGiftCardList] = React.useState([]);

    useEffect(()=>{
        agent.DigitalWallet.get_giftcard().then((res)=>{
            console.log(res.data['data']);
            if(res && res.data){
                setGiftCardList(res.data['data'])
            }
        });
    },[])

    const handleChangeModal = (event) => {
        setGiftCard(event.target.value);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onClickButton = () => {
        console.log('clickedd',giftCArd);
        if(giftCArd){
                console.log(giftCArd);
                var giftCardData = {
                    user_id:32,
                    gift_card_id:giftCArd['id'],
                    credit_amount:giftCArd['amount'],
                    debit_amount:0,
                    is_topup:true,
               }
               console.log(giftCardData)
               agent.DigitalWallet.redeem_giftcard(giftCardData).then((res)=>{
                   console.log(res)
                   props.setUpdateBalance(true)
                   props.setUpdateHistory(true)
               })
            console.log(props)
            
               handleClose()
              
        }
        else{
            toast.error('Please Select Gift Card')
        }
    }

    return (
        <div>
            <Card className={classes.root}>
                <CardHeader style={{ width: '90%' }}
                    action={
                        <div className={classes.buttonroot}>
                            <Fab color="primary" aria-label="add">
                                <AddIcon onClick={() => { console.log('dsff'); handleOpen() }} />
                            </Fab>

                        </div>
                    }
                    title="Add Money to Wallet"


                />

            </Card>
           
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <h2 id="transition-modal-title">Add Money</h2>
                        <br />
                        <Row>
                            <Col>
                                <FormControl className={classes.formControl} style={{ width: '50%' }}>
                                <InputLabel id="demo-controlled-open-select-label">Select Gift Card</InputLabel>

                                    <Select
                                        labelId="demo-controlled-open-select-label"
                                        id="demo-controlled-open-select"
                                        open={openModal}
                                        onClose={handleCloseModal}
                                        onOpen={handleOpenModal}
                                        value={giftCArd}
                                        onChange={handleChangeModal}
                                    >
                                        <MenuItem value="Select Gift Card">
                                            <em>None</em>
                                        </MenuItem>
                                        {/* <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem> */}
                                        {isIterableArray(giftCardList) &&
                                            giftCardList.map((gift_card, index) => {
                                                return (
                                                    <option key={index} value={gift_card} >
                                                        {gift_card['gift_card_no']}
                                                    </option>
                                                )
                                            }
                                            )}
                                    </Select>

                                   
                                </FormControl>

                            </Col>
                            <Col>

                                <Button
                                    // type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    // className={classes.submit}
                                    onClick={onClickButton}
                                >
                                    Redeem
                                </Button>

                            </Col>
                        </Row>

                    </div>
                </Fade>
               
            </Modal>
        </div>
    );
}
