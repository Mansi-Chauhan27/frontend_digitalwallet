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
import { BsThreeDots } from 'react-icons/bs';
// import axios from 'axios';
import agent from "../../agent";
import StatusFormatter from "../common/statusFormatter";
import AddDevice from "./addDevice";


const Device = props => {

    const[deviceList,setDeviceList] = React.useState([]);
  

    useEffect(()=>{
        console.log('props.deviceList',props.deviceList, props)
        setDeviceList(props.deviceList)
      },[props])
    
      function deactivateDevice(device_id) {
        console.log('deactivatee', device_id);
        if (device_id) {
            agent.DigitalWallet.deactivate_device({ 'id': device_id }).then((res) => {
                console.log(res.data)
                // props.setUpdate(true)
            })
        }
    }

    function generateKey(device_id) {
        console.log('deactivatee', device_id);
        if (device_id) {
            agent.DigitalWallet.create_device_key({ 'device_id': device_id }).then((res) => {
                console.log(res.data)
                // props.setUpdate(true)
            })
        }
    }

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
                        {/* <DropdownItem className="text-10" onClick={() => { console.log('hiu') }}>View</DropdownItem> */}
                        {row['api_keys__id'] !== null ? <></> :<DropdownItem className="text-10" onClick={() => { console.log('hiu'); generateKey(row['id']); }} >Generate Key</DropdownItem>}
                        {!row['active']  ? <></> :<DropdownItem className="text-10" onClick={() => { console.log('hiu'); deactivateDevice(row['id']); }} >Deactivate</DropdownItem>}
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
            <AddDevice />
            </div>
            
            <BootstrapTable keyField="id" data={deviceList} columns={columns} />
        </div>
    );
};

export default Device;
