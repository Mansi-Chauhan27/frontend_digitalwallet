import React, { useEffect} from "react";
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
import { FaBeer } from 'react-icons/fa';
// import axios from 'axios';
import agent from "../../agent";

const products = [
    { id: 1, name: "Item 1", price: 100 },
    { id: 2, name: "Item 2", price: 102 }
];

const Dashboard = props => {

    useEffect(()=>{
        // const config = {
        //     headers: { Authorization: `Token ${localStorage.getItem('token')}` }
        // };
        agent.DigitalWallet.get_cutomers().then((res)=>console.log(res.data));
        // agent.Customer.delete_cutomers({'id':25}).then((res)=>console.log(res.data));
        agent.DigitalWallet.get_transaction().then((res)=>console.log(res.data));
        agent.DigitalWallet.make_transaction({'credit_amount':10,'debit_amount':0,'is_topup':false,'user_id':31}).then((res)=>console.log(res.data));

      },[])
    

    const columns = [
        {
            dataField: "id",
            text: "Product ID"
        },
        {
            dataField: "name",
            text: "Product Name"
        },
        {
            dataField: "price",
            text: "Product Price"
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
                        <FaBeer />
                    </DropdownToggle>
                    <DropdownMenu right className="border p-0">
                        <DropdownItem className="text-10" onClick={() => { console.log('hiu') }}>Edit Name</DropdownItem>
                        <DropdownItem className="text-10" onClick={() => { console.log('hiu') }} >Add Users</DropdownItem>
                        <DropdownItem className="text-10" onClick={() => { console.log('hiu') }} >Archive</DropdownItem>
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
            <h1 className="h2">Products</h1>
            <BootstrapTable keyField="id" data={products} columns={columns} />
        </div>
    );
};

export default Dashboard;
