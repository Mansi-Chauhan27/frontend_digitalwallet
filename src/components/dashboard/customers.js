import React, { useEffect } from "react";
// import ReactDOM from "react-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "./style.css";
import { makeStyles } from '@material-ui/core/styles';
import {
    UncontrolledDropdown, DropdownItem,
    DropdownMenu,
    DropdownToggle,
} from 'reactstrap'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BsThreeDots } from 'react-icons/bs';
// import axios from 'axios';
import agent from "../../agent";
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { Row, Col } from 'react-bootstrap';
import { toast } from "react-toastify";
import { isIterableArray } from '../common/utils';
import TextField from '@material-ui/core/TextField';
import { red } from '@material-ui/core/colors';
import StatusFormatter from "../common/statusFormatter";
import './style.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
// import filterFactory, { selectFilter } from 'react-bootstrap-table2-filter';



const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '90%',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    tab: {
        tableLayout: 'auto !important'
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

const Customers = props => {

    const [customerList, setCustomerList] = React.useState([]);
    const [userCard, setUserCard] = React.useState('');
    const [userCardsList, setUserCardsList] = React.useState([]);
    const [customerCard, setCustomerCard] = React.useState('');
    const [customerCardsList, setCustomerCardsList] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const [openModalUser, setOpenModalUser] = React.useState(false);
    const [amount, setAmount] = React.useState(0);
    const [selctedUserId, setSelectedUseriD] = React.useState(null);

    // Set Customer's List
    useEffect(() => {
        setCustomerList(props.customerList)
    }, [props.customerList])

   

    useEffect(() => {
        if(open){

        
        const r = agent.DigitalWallet.get_cards({ 'action': 'get_users_cards', 'userid': 65 });
        r.then((res) => {
            if (res && res.data) {
                setUserCardsList(res.data['data'])
                // setRes(true);
            }
        }).catch(er => {
        });
        const x = agent.DigitalWallet.get_cards({ 'action': 'get_users_cards_by_id', 'userid': selctedUserId })
        x.then((res) => {
            if (res && res.data) {
                setCustomerCardsList(res.data['data'])
            }
        }).catch(er => {
            if(er.status===403 || er.status === 405){
                toast.error('Permission Denied');
            }
            else{
                toast.error('Something Went Wrong');
            }
        });

    }
    }, [open,selctedUserId])


    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleOpen = (userid) => {
        setSelectedUseriD(userid);
        setOpen(true);
        console.log(userid,'userid');
        
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeAmount = (event) => {
        setAmount(event.target.value);
    };

    const handleChangeModal = (event) => {
        setCustomerCard(event.target.value);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
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

    
    // Transfer Money
    const onClickButton = () => {
        if (userCard && customerCard) {
            var transferData = {
                action:'from_customer',
                from_card_id: userCard['id'],
                to_card_id: customerCard['id'],
                // to_card_id : 4,
                amount_to_be_transferred: amount
            }
            console.log(transferData)
            const t = agent.DigitalWallet.transfer_money(transferData)
            t.then((res) => {
                if (res && res.data && res.data['msg'] === 'Success') {
                    console.log(res);
                    toast.success('Money added Succesfully');
                    handleClose();

                }
                else {
                    toast.error(res.data['msg']);
                }
            }).catch(err=>{
                toast.error('Permission Denied');
            })

        }
        else {
            toast.error('Please Select Card')
        }
    }

    // Deactivate User
    function deavtivateUser(user_id) {
        if (user_id) {
            agent.DigitalWallet.update_cutomers({ 'id': user_id }).then((res) => {
                console.log(res.data)
                props.setUpdate(true)
            })
        }
    }

    const { SearchBar } = Search;

    // const selectOptions = {
    //     0: 'Active',
    //     1: 'In Active',
    //   };

    // Columns
    const columns = [
        {
            dataField: "first_name",
            text: "First Name",
            classes: 'tr-row'
        },
        {
            dataField: "last_name",
            text: "Last name",
            classes: 'tr-row',
            // style: {
            //     fontWeight: 'bold',
            //     fontSize: '18px'
            //   }
        },
        {
            dataField: "email",
            text: "Email",
            classes: 'py-2 text-10 text-center align-middle tr-row',
            // classes:'tr-row',
            headerClasses: 'text-10 text-primary text-center',
        },
        {
            dataField: "is_active",
            text: "Status",
            classes: 'py-2 text-10 text-center align-middle tr-row',
            formatter: (cell, { is_active }) => (<StatusFormatter status={is_active} component={'device'} />),
            // filter: selectFilter({
            //     options: selectOptions
            //   })
        },
        {
            dataField: '',
            text: 'Action',
            // hidden: prop.currentuser.type === 'standard',
            classes: 'border-left text-center align-middle',
            headerClasses: 'text-10 text-primary text-center',
            formatter: (dataField, row, { id, email }) => (
                // Control your row with this id
                <UncontrolledDropdown>
                    <DropdownToggle color="link" size="sm" className="text-600 btn-reveal" >
                        {/* <FontAwesomeIcon icon="ellipsis-h" className="fs--1" /> */}
                        <BsThreeDots />
                    </DropdownToggle>
                    <DropdownMenu right className="border p-0">
                        <DropdownItem className="text-10" onClick={() => { console.log('hiu'); handleOpen(row['id']) }}>AddMoney</DropdownItem>
                        {/* {row['carddetails__id'] !== null ? <></> : <DropdownItem className="text-10" onClick={() => { console.log('hiu'); generateCard(row['id'])  }} >Generate Card</DropdownItem>} */}
                        {!row['is_active'] ? <></> : <DropdownItem className="text-10" onClick={() => { console.log('hiu', row['id']); deavtivateUser(row['id']) }} >Deactivate</DropdownItem>}
                        {/* {row['total_targets'] === 0 ? <></> : <DropdownItem className="text-10" onClick={() => { setGroupDetails([{ id: row['id'], name: row['group_name'] }]); setRemoveAllUsersModal(true) }} >Remove All Users</DropdownItem>}
                    <DropdownItem className="text-10" onClick={() => { setGroupDetails([{ id: row['id'], name: row['group_name'] }]); setArchiveAllUsersModal(true) }} >Archive All Users</DropdownItem>
                    {row['type'] === 'Virtual' ? <DropdownItem className="text-10" onClick={() => { }} >Delete Group</DropdownItem> : <></>} */}
                    </DropdownMenu>
                </UncontrolledDropdown>
            ),
            csvExport: false,
        }
    ];

    

    const classes = useStyles();
    return (
        <React.Fragment>
            <div style={{ padding: "20px;" }} className='col-sm-12'>
                <h1 className="h2">Customers</h1>
                <div>
                    <ToolkitProvider
                       keyField="id"
                       data={customerList}
                       columns={columns}
                       search={ { searchFormatted: true } }
                     
                    >
                        {
                            props => (
                                <div>
                                   
                                    <div style={{float:'right'}}>
                                    <SearchBar { ...props.searchProps } />
                                    </div>
                                    <hr />
                                    <BootstrapTable
                                        { ...props.baseProps }
                                        striped
                                        hover
                                        bootstrap4
                                        condensed
                                        wrapperClasses="table-responsive"
                                        classes={classes.tab}
                                        headerClasses="bg-200 text-900 border-y border-200"
                                        pagination={paginationFactory()}
                                        // filter={ filterFactory()}
                                        
                                    />
                                </div>
                            )
                        }
                    </ToolkitProvider>
                </div>
            </div>

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

        </React.Fragment>
    );
};

export default Customers;
