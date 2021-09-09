import React, { useEffect } from 'react';
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
import { toast } from "react-toastify";
import { isIterableArray } from '../common/utils';
import TextField from '@material-ui/core/TextField';
import './style.css'
import Loader from '../common/loader';
import { CardFormatter } from '../common/cardFormatter';




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
    input: {
        borderRadius: '0px',
        height: '34px'
    }
}));

export default function TransferToConsumer(props) {


    const classes = useStyles();
    // const [expanded, setExpanded] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    // const [giftCArd, setGiftCard] = React.useState('');
    const [userCard, setUserCard] = React.useState('');
    const [userCardsList, setUserCardsList] = React.useState([]);
    const [customerCard, setCustomerCard] = React.useState('');
    const [customerCardsList, setCustomerCardsList] = React.useState([]);
    const [openModal, setOpenModal] = React.useState(false);
    const [openModalUser, setOpenModalUser] = React.useState(false);
    const [amount, setAmount] = React.useState(0);
    const [loader, setLoader] = React.useState(false);

    // const [giftCardList, setGiftCardList] = React.useState([]);


    useEffect(() => {
        setCustomerCardsList(props.customerCardsList);
        setUserCardsList(props.userCardsList);
        console.log(props.userCardsList);
        props.userCardsList.length===1 ? setUserCard(props.userCardsList[0]): setUserCard('');
        props.customerCardsList.length===1 ? setCustomerCard(props.customerCardsList[0]): setCustomerCard('')
    }, [props])

    // GET CARDS
    // useEffect(() => {
    //     agent.DigitalWallet.get_cards({ 'action': 'get_users_cards', 'userid': 65 }).then((res) => {
    //         console.log(res.data['data']);
    //         if (res && res.data) {
    //             console.log(res.data)
    //             setUserCardsList(res.data['data'])
    //         }
    //     });
    //     agent.DigitalWallet.get_cards({ 'action': 'get_other_users_cards', 'userid': 65 }).then((res) => {
    //         console.log(res.data);
    //         if (res && res.data) {
    //             console.log(res.data['customers'])
    //             setCustomerCardsList(res.data['customers'])
    //         }
    //     });
    // }, [])

    const handleChangeModal = (event) => {
        console.log(event.target.value)
        setCustomerCard(event.target.value);
    };

    const handleChangeModalUser = (event) => {
        console.log(event.target.value)
        setUserCard(event.target.value);
    };

    const handleCloseModalUSer = () => {
        setOpenModalUser(false);
    };

    const handleOpenModalUser = () => {
        setOpenModalUser(true);
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

    const handleChangeAmount = (event) => {
        setAmount(event.target.value);
    };

    // Transfer Money
    const onClickButton = () => {
        if (userCard && customerCard) {
            var transferData = {
                action: 'from_customer',
                from_card_id: userCard['id'],
                to_card_id: customerCard['id'],
                // to_card_id : 4,
                amount_to_be_transferred: amount
            }
            console.log(transferData)
            const t = agent.DigitalWallet.transfer_money(transferData)
            setLoader(true);
            t.then((res) => {
                setLoader(false);
                if (res && res.data && res.data['msg'] === 'Success') {
                    console.log(res);
                    props.setUpdateBalance(true);
                    toast.success('Money Transferred Succesfully');
                    handleClose();

                }
                else {
                    toast.success(res.data['msg']);
                }
                //    props.setUpdateHistory(true)
            }).catch(err => {
                setLoader(false);
                if (err.status === 405) {
                    toast.error('User Not verified To make Transaction, Please Verify')
                }
                else {
                    toast.error('Permission Denied')
                }
            })
            // console.log(props)


        }
        else {
            toast.error('Please Card')
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
                    title="Transfer Money"


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
                    <div className={classes.paper} style={{ display: 'inline-table' }}>
                        <h2 id="transition-modal-title">Transfer Money to Customer</h2>
                        <br />
                        {!loader ?
                            <div>
                                <Row xxs="2">
                                    {/* <Col>
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

                            </Col> */}
                                    <Col xs="12" md="6">
                                        {isIterableArray(userCardsList) && <FormControl className={classes.formControl} style={{ width: '100%' }}>
                                            <InputLabel id="demo-controlled-open-select-label1" className='label'>Select Your Card</InputLabel>

                                            <Select
                                                labelId="demo-controlled-open-select-label1"
                                                id="demo-controlled-open-select1"
                                                open={openModalUser}
                                                onClose={handleCloseModalUSer}
                                                onOpen={handleOpenModalUser}
                                                value={userCard}
                                                // defaultValue={userCardsList[0]['card_number']}
                                                onChange={handleChangeModalUser}
                                                defaultValue="" 

                                            >
                                                {/* <MenuItem value="Select Card">
                                            <em>None</em>
                                        </MenuItem> */}

                                                {isIterableArray(userCardsList) &&
                                                    userCardsList.map((user_card, index) => {
                                                        return (
                                                            <MenuItem key={index} value={user_card} style={{ cursor: 'pointer' }} >
                                                                {CardFormatter(user_card['card_number'].toString())}
                                                            </MenuItem>
                                                        )
                                                    }
                                                    )}
                                            </Select>


                                        </FormControl>
                                        }
                                    </Col>
                                    <Col xs="12" md="6">
                                        <FormControl className={classes.formControl} style={{ width: '100%' }}>
                                            <InputLabel id="demo-controlled-open-select-label2">To Card</InputLabel>

                                            <Select
                                                labelId="demo-controlled-open-select-label2"
                                                id="demo-controlled-open-select2"
                                                open={openModal}
                                                onClose={handleCloseModal}
                                                onOpen={handleOpenModal}
                                                value={customerCard}
                                                onChange={handleChangeModal}
                                                defaultValue="" 

                                            >
                                                <MenuItem value="Select Card">
                                                    <em>None</em>
                                                </MenuItem>
                                                {/* {console.log(customerCardsList)} */}
                                                {isIterableArray(customerCardsList) &&
                                                    customerCardsList.map((customer_card, index) => {
                                                        return (
                                                            <MenuItem key={index} value={customer_card} style={{ cursor: 'pointer' }} >
                                                                {CardFormatter(customer_card['card_number'].toString())}
                                                            </MenuItem>
                                                        )
                                                    }
                                                    )}
                                            </Select>


                                        </FormControl>

                                    </Col>

                                </Row>
                                <br />
                                <Row style={{ alignItems: 'center' }} xs="2">
                                    <Col xs="12" md="6">
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="amount"
                                            label="Amount"
                                            id="amount"
                                            autoComplete="amount"
                                            value={amount}
                                            onChange={handleChangeAmount}
                                            InputProps={{
                                                className: classes.input,
                                            }}

                                        />
                                    </Col>
                                    <Col xs="12" md="6">

                                        <Button
                                            // type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            // className={classes.submit}
                                            onClick={onClickButton}
                                        >
                                            Transfer
                                        </Button>

                                    </Col>

                                </Row>
                            </div>
                            :
                            <Loader />
                        }
                    </div>
                </Fade>

            </Modal>
        </div>
    );
}
