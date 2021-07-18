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
import StatusFormatter  from "../common/statusFormatter";



const Owners = props => {

    const [customerList, setCustomerList] = React.useState([])
    useEffect(() => {
        console.log('props.customerList', props.customerList)
        setCustomerList(props.customerList)
    }, [])

    // useEffect(() => {
    //     agent.DigitalWallet.update_cutomers({ id: 32 }).then((res) => {
    //         console.log(res)
    //     })
    // }, [])

    const useStyles = makeStyles((theme) => ({
        paper: {
          marginTop: theme.spacing(8),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
        avatar: {
          margin: theme.spacing(1),
          backgroundColor: theme.palette.secondary.main,
        },
        form: {
          width: '100%', // Fix IE 11 issue.
          marginTop: theme.spacing(1),
        },
        submit: {
          margin: theme.spacing(3, 0, 2),
        },
        tab:{
            tableLayout:'auto !important'
        }
      }));

    function deavtivateUser(user_id) {
        console.log('deactivatee', user_id);
        if (user_id) {
            agent.DigitalWallet.update_cutomers({ 'id': user_id }).then((res) => {
                console.log(res.data)
                props.setUpdate(true)
            })
        }
    }

    // function generateCard(user_id) {
    //     console.log('generateCard', user_id);
    //     if (user_id) {
    //         agent.DigitalWallet.generate_card({ 'id': user_id }).then((res) => {
    //             console.log(res.data)
    //             props.setUpdate(true)
    //         })
    //     }
    // }

    const columns = [
        {
            dataField: "first_name",
            text: "First Name"
        },
        {
            dataField: "last_name",
            text: "Last name"
        },
        {
            dataField: "email",
            text: "Email",
            classes: 'py-2 text-10 text-center align-middle',
            headerClasses: 'text-10 text-primary text-center',
        },
        {
            dataField: "is_active",
            text: "Status",
            formatter: (row, { is_active }) => (<StatusFormatter status={is_active} component={'device'} />),
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
                    <DropdownToggle color="link" size="sm" className="text-600 btn-reveal" disabled={row['is_active'] === 'false'?true : false } >
                        {/* <FontAwesomeIcon icon="ellipsis-h" className="fs--1" /> */}
                        <BsThreeDots />
                    </DropdownToggle>
                    <DropdownMenu right className="border p-0">
                        {/* <DropdownItem className="text-10" onClick={() => { console.log('hiu') }}>View</DropdownItem> */}
                        {/* <DropdownItem className="text-10" onClick={() => { console.log('hiu') }} >Add Device</DropdownItem> */}
                        {!row['is_active']  ? <></> :<DropdownItem className="text-10" onClick={() => { console.log('hiu', row['id']); deavtivateUser(row['id']) }} >Deactivate</DropdownItem>}
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
            <h1 className="h2">Retailers</h1>
            <div>
            <BootstrapTable
            keyField="id" 
            data={customerList} 
            columns={columns}
            striped
            hover
            bootstrap4
            condensed
            // .wrapperClasses="table-responsive"
            classes={classes.tab}

            headerClasses="bg-200 text-900 border-y border-200"
            />
            </div>
        </div>
        </React.Fragment>
    );
};

export default Owners;
