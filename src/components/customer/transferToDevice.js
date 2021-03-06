import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
// import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FloatingActionButtons from '../common/floatingActionButtons';
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
import { ToastContainer, toast } from "react-toastify";
import { isIterableArray } from '../common/utils';
import TextField from '@material-ui/core/TextField';



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

export default function TransferToDevice(props) {


    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [giftCArd, setGiftCard] = React.useState('');
    const [userCard, setUserCard] = React.useState('');
    const [userCardsList, setUserCardsList] = React.useState([]);
    const [deviceCard, setDeviceCard] = React.useState('');
    const [deviceCardsList, setDeviceCardsList] = React.useState([]);
    const [openModal, setOpenModal] = React.useState(false);
    const [openModalUser, setOpenModalUser] = React.useState(false);
    const [amount, setAmount] = React.useState(0);

    const [giftCardList, setGiftCardList] = React.useState([]);

    // useEffect(() => {
    //     agent.DigitalWallet.get_giftcard().then((res) => {
    //         console.log(res.data['data']);
    //         if (res && res.data) {
    //             setGiftCardList(res.data['data'])
    //         }
    //     });
    // }, [])


    // useEffect(() => {
    //     agent.DigitalWallet.get_cards({ 'action': 'get_users_cards', 'userid': 65 }).then((res) => {
    //         console.log(res.data['data']);
    //         if (res && res.data) {
    //             console.log(res.data)
    //             setUserCardsList(res.data['data'])
    //         }
    //     });
    //     agent.DigitalWallet.get_cards({ 'action': 'get_other_users_cards', 'userid': 65 }).then((res) => {
    //         console.log(res.data['data']);
    //         if (res && res.data) {
    //             console.log(res.data['devices'])
    //             setDeviceCardsList(res.data['devices'])
    //         }
    //     });
    // }, [])

    const handleChangeModal = (event) => {
        setDeviceCard(event.target.value);
    };

    const handleChangeModalUser = (event) => {
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
    const onClickButton = () => {
        console.log('clickedd', userCard);
        console.log('clickedd', deviceCard, amount);
        if (userCard && deviceCard) {
            var transferData = {
                from_card_id: userCard['id'],
                // to_card_id: deviceCard['id'],
                to_card_id: 6,
                amount_to_be_transferred: amount
            }
            console.log(transferData)
            agent.DigitalWallet.transfer_money(transferData).then((res) => {
                if (res && res.data) {
                    console.log(res)
                    props.setUpdateBalance(true)
                    toast.success('Money Transferred Succesfully');
                    handleClose()
                }
               else{
                toast.error('Error Transferring Money');
               }
            })
            // console.log(props)

           

        }
        else {
            toast.error('Please Select Gift Card')
        }
    }

    return (
        <React.Fragment>
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
                        title="Transfer Money to Retailer"


                    />

                </Card>
            </div>
            <div>
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
                            <h2 id="transition-modal-title">Transfer Money to Retailer</h2>
                            <br />
                            <Row>
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
                                <Col>
                                    <FormControl className={classes.formControl} style={{ width: '50%' }}>
                                        <InputLabel id="demo-controlled-open-select-label1">Select Your Card</InputLabel>

                                        <Select
                                            labelId="demo-controlled-open-select-label1"
                                            id="demo-controlled-open-select1"
                                            open={openModalUser}
                                            onClose={handleCloseModalUSer}
                                            onOpen={handleOpenModalUser}
                                            value={userCard}
                                            onChange={handleChangeModalUser}
                                        >
                                            <MenuItem value="Select Gift Card">
                                                <em>None</em>
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

                                </Col>
                                <Col>
                                    <FormControl className={classes.formControl} style={{ width: '50%' }}>
                                        <InputLabel id="demo-controlled-open-select-label2">To Retailer</InputLabel>

                                        <Select
                                            labelId="demo-controlled-open-select-label2"
                                            id="demo-controlled-open-select2"
                                            open={openModal}
                                            onClose={handleCloseModal}
                                            onOpen={handleOpenModal}
                                            value={deviceCard}
                                            onChange={handleChangeModal}
                                        >
                                            <MenuItem value="Select Gift Card">
                                                <em>None</em>
                                            </MenuItem>
                                            {console.log(deviceCardsList)}
                                            {isIterableArray(deviceCardsList) &&
                                                deviceCardsList.map((device_card, index) => {
                                                    return (
                                                        <option key={index} value={device_card} >
                                                            {device_card['name']}
                                                        </option>
                                                    )
                                                }
                                                )}
                                        </Select>


                                    </FormControl>

                                </Col>

                            </Row>
                            <br />
                            <Row style={{ alignItems: 'center' }}>
                                <Col>
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
                                    />
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
                                        Transfer
                                    </Button>

                                </Col>

                            </Row>

                        </div>
                    </Fade>

                </Modal>

            </div>

        </React.Fragment>
    );
}
