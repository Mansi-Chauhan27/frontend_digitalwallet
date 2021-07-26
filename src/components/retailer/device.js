import React, { useEffect } from "react";
// import ReactDOM from "react-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "./style.css";
import {
    UncontrolledDropdown, DropdownItem,
    DropdownMenu,
    DropdownToggle,
} from 'reactstrap'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BsThreeDots } from 'react-icons/bs';
// import axios from 'axios';
import agent from "../../agent";
import StatusFormatter from "../common/statusFormatter";
import AddDevice from "./addDevice";
import { toast } from "react-toastify";
import {
    Button,
    TextField,
    FormControl,
} from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Select from '@material-ui/core/Select';
import { Row, Col } from 'react-bootstrap';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { isIterableArray } from "../common/utils";
import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '90%',
        display: 'contents'
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

const Device = props => {

    const classes = useStyles();

    const [deviceList, setDeviceList] = React.useState([]);
    const [deviceIdToTransfer, setDeviceIdToTransfer] = React.useState([]);
    const [fromDeviceCardId, setDeviceCardId] = React.useState([]);
    const [customerCard, setCustomerCard] = React.useState('');
    const [customerCardsList, setCustomerCardsList] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const [amount, setAmount] = React.useState(0);


    // To Get All The Devices of the logged in Retailer from props
    useEffect(() => {
        console.log('props.deviceList', props.deviceList, props)
        setDeviceList(props.deviceList)
    }, [props])

    // To get cards of customers for refund transaction
    useEffect(() => {
        if (open) {

            const t = agent.DigitalWallet.get_cards({ 'action': 'get_users_cards_for_refund', 'userid': 65 })
            t.then((res) => {
                console.log(res.data);
                if (res && res.data) {
                    console.log(res.data['customers'])
                    setCustomerCardsList(res.data['customers'])
                }
            }).catch(err => {
                if (err.status === 403) { toast.error('Permission Deniesd') }
                else {
                    toast.error('Something Went Wrong')
                }
            });
        }

    }, [open])

    // To Deactivate Device
    function deactivateDevice(device_id) {
        console.log('deactivatee', device_id);
        if (device_id) {
            const t = agent.DigitalWallet.deactivate_device({ 'id': device_id })
            t.then((res) => {
                console.log(res.data)
                if (res || res.data) {
                    props.setUpdate(true);
                    toast.success('Deactivated Successfully')

                }
            }).catch(err => {
                toast.error('Something Went Wrong!')
            })
        }
    }

    // To generate Key for the device
    function generateKey(device_id) {
        console.log('deactivatee', device_id);
        if (device_id) {
            const t = agent.DigitalWallet.create_device_key({ 'device_id': device_id })
            t.then((res) => {
                console.log(res.data)
                if (res || res.data) {
                    props.setUpdate(true)
                    console.log(res.data['data'])
                    toast.success('Key generated Successfully ' + res.data['data'])
                }
            }).catch(err => {
                toast.error('Something Went Wrong!')
            })
        }
    }

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleOpen = (row) => {
        setDeviceCardId(row['card']);
        setDeviceIdToTransfer(row['id'])
        setOpen(true);

    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeModal = (event) => {
        setCustomerCard(event.target.value);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };


    const handleChangeAmount = (event) => {
        setAmount(event.target.value);
    };

    // Refund Transaction
    function onClickButton() {

        if (customerCard && fromDeviceCardId && deviceIdToTransfer) {
            var transferData = {
                action: 'from_device',
                device_id: deviceIdToTransfer,
                from_card_id: fromDeviceCardId,
                to_card_id: customerCard['id'],
                // to_card_id : 4,
                amount_to_be_transferred: amount
            }
            console.log(transferData)
            const t = agent.DigitalWallet.transfer_money(transferData)
            t.then((res) => {
                if (res && res.data && res.data['msg'] === 'Success') {
                    console.log(res);
                    // props.setUpdateBalance(true);
                    toast.success('Money added Succesfully');
                    handleClose();

                }
                else {
                    toast.success(res.data['msg']);
                }
                //    props.setUpdateHistory(true)
            }).catch(err => {
                toast.error('Something Went Wrong')
            })
            // console.log(props)


        }
        else {
            toast.error('Please Select Card')
        }

    }

    // Columns
    const columns = [

        {
            dataField: "name",
            text: "Device Name"
        },
        {
            dataField: 'active',
            text: 'Status',
            headerClasses: 'text-10 align-middle',
            classes: 'align-middle text-10 py-2',
            formatter: (row, { active }) => (<StatusFormatter status={active} component={'device'} />),
        },
        {
            dataField: '',
            text: 'Action',
            // hidden: prop.currentuser.type === 'standard',
            classes: 'border-left text-center align-middle',
            headerClasses: 'text-10 text-primary text-center',
            formatter: (dataField, row, { id }) => (
                // Control your row with this id
                <UncontrolledDropdown>
                    <DropdownToggle color="link" size="sm" className="text-600 btn-reveal" >
                        {/* <FontAwesomeIcon icon="ellipsis-h" className="fs--1" /> */}
                        <BsThreeDots />
                    </DropdownToggle>
                    <DropdownMenu right className="border p-0">
                        <DropdownItem className="text-10" onClick={() => { console.log('hiu'); handleOpen(row) }}>Refund Money</DropdownItem>
                        {row['api_keys'].length !== 0 ? <></> : <DropdownItem className="text-10" onClick={() => { console.log('hiu'); generateKey(row['id']); }} >Generate Key</DropdownItem>}
                        {!row['active'] ? <></> : <DropdownItem className="text-10" onClick={() => { console.log('hiu'); deactivateDevice(row['id']); }} >Deactivate</DropdownItem>}
                        {/* {row['total_targets'] === 0 ? <></> : <DropdownItem className="text-10" onClick={() => { setGroupDetails([{ id: row['id'], name: row['group_name'] }]); setRemoveAllUsersModal(true) }} >Remove All Users</DropdownItem>}
                    <DropdownItem className="text-10" onClick={() => { setGroupDetails([{ id: row['id'], name: row['group_name'] }]); setArchiveAllUsersModal(true) }} >Archive All Users</DropdownItem>
                    {row['type'] === 'Virtual' ? <DropdownItem className="text-10" onClick={() => { }} >Delete Group</DropdownItem> : <></>} */}
                    </DropdownMenu>
                </UncontrolledDropdown>
            ),
            csvExport: false,
        }
    ];

    return (
        <div style={{ padding: "20px" }}>
            <div>
                {/* <h1 className="h2">Devices</h1> */}
                <AddDevice setUpadte={props.setUpdate} />
            </div>

            <BootstrapTable keyField="id" data={deviceList} columns={columns} />


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
                        <Row>
                            <Col>
                                <FormControl className={classes.formControl} style={{ width: '50%' }}>
                                    <InputLabel id="demo-controlled-open-select-label2">To Card</InputLabel>

                                    <Select
                                        labelId="demo-controlled-open-select-label2"
                                        id="demo-controlled-open-select2"
                                        open={openModal}
                                        onClose={handleCloseModal}
                                        onOpen={handleOpenModal}
                                        value={customerCard}
                                        onChange={handleChangeModal}
                                    >
                                        <MenuItem value="Select Gift Card">
                                            <em>None</em>
                                        </MenuItem>
                                        {console.log(customerCardsList)}
                                        {isIterableArray(customerCardsList) &&
                                            customerCardsList.map((customer_card, index) => {
                                                return (
                                                    <option key={index} value={customer_card} >
                                                        {customer_card['card_number']}
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
    );
};

export default Device;
