import React from 'react';
import {
    Button,
    Card,
    UncontrolledTooltip,
    InputGroup,
    InputGroupAddon,
    Input,
    InputGroupText,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Col,
    ButtonGroup
} from 'reactstrap';
import FalconCardHeader from '../../../../common/FalconCardHeader';
import ButtonIcon from '../../../../common/ButtonIcon';
import paginationFactory, { PaginationProvider } from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import Flex from '../../../../common/Flex';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Loader from '../../../../common/Loader';
import agent from '../../../../../agent';
import NoData from '../../../../common/NoData';
import { toast } from 'react-toastify';
import CampaignStatusFormatter from '../../../../common/CampaignStatusFormatter';

const MyExportCSV = (props) => {
    const handleClick = () => {
        props.onExport();
    };
    return (
        <ButtonIcon icon="external-link-alt" transform="shrink-3 down-2" color="primary" size="sm" onClick={handleClick} className="text-10 ml-3">
            Export CSV
        </ButtonIcon>
    );
};
const pageButtonRenderer = ({
    page,
    active,
    onPageChange
}) => {
    const handleClick = (e) => {
        e.preventDefault();
        onPageChange(page);
    };
    return (
        <Button
            color={active ? 'primary' : 'falcon-default'}
            size="sm"
            className="ml-2 mt-2"
            onClick={handleClick}
            key={page}>
            <div className="text-10"> {page}</div>
        </Button>
    );
};

const Groups = (prop) => {
    let table = React.createRef();
    const [groupsList, setGroupsList] = React.useState([]);
    const [groupsListStatusWise, setGroupsListStatusWise] = React.useState([]);
    const [hasData, setHasData] = React.useState(false);
    const [archiveGroupModal, setArchiveGroupModal] = React.useState(false);
    const [editGroupModal, setEditGroupModal] = React.useState(false);
    const [bulkArchiveGroupModal, setBulkArchiveGroupModal] = React.useState(false);
    const [removeAllUsersModal, setRemoveAllUsersModal] = React.useState(false);
    const [archiveAllUsersModal, setArchiveAllUsersModal] = React.useState(false);
    const [groupDetails, setGroupDetails] = React.useState({});
    const [selectedGroupForBulkAction, setSelectedGroupForBulkAction] = React.useState([]);
    const [selectedGroupNamesForNotiMsg, setSelectedGroupNamesForNotiMsg] = React.useState([]);
    const [eventDisabled, setEventDisabled] = React.useState(false);
    const [doRefresh, setDoRefresh] = React.useState(false);
    const [groupType, setGroupType] = React.useState('all');
    const [groupName, setGroupName] = React.useState('');
    const [tooltipDescription, setTooltipDesciption] = React.useState('List of all Groups added in Product Dashboard to Target with Phishing Simulation Including Departments and Virtual Groups')


    React.useEffect(() => {
        let isActive = true;
        if (isActive) {
            setHasData(false);
            const formdata = {
                currentuser: prop.currentuser,
                formdata: {},
                action: 'groups_in_manage'
            }
            agent.Phishing.create_group(formdata).then((res) => {
                if (res.groupData) {
                    setGroupsList(res.groupData.groupsTable);
                    setHasData(true);
                }
                else {
                    toast.error(<React.Fragment>
                        Some Error Occurred<br />
                     Please Try Again!.
                       </React.Fragment>)
                    setDoRefresh(true)

                }
            });
        }
        return () => {
            isActive = false;
        };
        // eslint-disable-next-line
    }, [doRefresh]);
    React.useEffect(() => {
        let isActive = true;
        if (isActive) {
            //   let status;
            if (groupType === 'all') {
                setGroupsListStatusWise(groupsList);
            }
            else if (groupType === 'department') {
                setGroupsListStatusWise(groupsList.filter(r => r.type === 'Department').map(r => r))
            }
            else {
                setGroupsListStatusWise(groupsList.filter(r => r.type === groupType).map(r => r));
            }
        }
        return () => {
            isActive = false;
        }
    }, [groupType, groupsList]);

    const customTotal = (from, to, size) => (
        <span className="react-bootstrap-table-pagination-total text-10 pl-3">
            Showing { from} to { to} of { size} Results
        </span>
    );
    let options = {
        // custom: true,
        sizePerPage: 15,
        paginationSize: 4,
        pageStartIndex: 1,
        alwaysShowAllBtns: true, // Always show next and previous button
        withFirstAndLast: false, // Hide the going to First and Last page button
        hideSizePerPage: true, // Hide the sizePerPage dropdown always
        hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
        firstPageText: 'First',
        lastPageText: 'Last',
        nextPageTitle: 'First page',
        prePageTitle: 'Pre page',
        firstPageTitle: 'Next page',
        lastPageTitle: 'Last page',
        pageButtonRenderer,
        disablePageTitle: true,
        totalSize: groupsListStatusWise.length,
        paginationTotalRenderer: customTotal,
        showTotal: true
    };
    const columns = [
        {
            dataField: 'group_name',
            text: 'Name',
            headerClasses: 'text-10 text-primary pl-2',
            classes: 'py-2 text-10 align-middle pl-2',
            formatter: (dataField, row, { id }) => (
                <div>
                    {row['status'] === 'archive' ? <><div className="d-none">{row['group_name']}</div>
                        <OverlayTrigger
                            key={row['id']}
                            placement="top"
                            overlay={
                                <Tooltip id={row['id']}>
                                    <div className="text-10">No Information for Archived Group.</div>
                                </Tooltip>
                            }
                        ><div className="text-10 text-primary cursor-pointer">{row['group_name']}</div>
                        </OverlayTrigger></>
                        : <>  <div className="d-none">{row['group_name']}</div>
                            <OverlayTrigger
                                key={row['id']}
                                placement="top"
                                overlay={
                                    <Tooltip id={row['id']}>
                                        <div className="text-10">Click to Know More</div>
                                    </Tooltip>
                                }
                            ><Link id={row['id']} className={"mb-0 text-10 text-primary text-decoration-none"} to={{ pathname: `/paa/phishing/group/${row['id']}`, state: { id: row['id'], location: 'manage' } }}>{row['group_name']}</Link>
                            </OverlayTrigger></>}
                    {/* <>  <div className="d-none">{row['group_name']}</div>
                        <OverlayTrigger
                            key={row['id']}
                            placement="top"
                            overlay={
                                <Tooltip id={row['id']}>
                                    <div className="text-10">Click to Know More</div>
                                </Tooltip>
                            }
                        ><Link id={row['id']} className={"mb-0 text-10 text-primary text-decoration-none"} to={{ pathname: `/paa/phishing/group/${row['id']}`, state: { id: row['id'], location: 'manage' } }}>{row['group_name']}</Link>
                        </OverlayTrigger></> */}
                </div>
            ),
            sort: true
        },
        {
            dataField: 'created_on',
            text: 'Created On',
            headerClasses: 'text-10 text-primary ',
            classes: 'py-2 text-10 align-middle',
            sort: true
        },
        {
            dataField: 'type',
            text: 'Type',
            headerClasses: 'text-10 text-primary ',
            classes: 'py-2 text-10 align-middle',
            sort: true
        },
        // {
        //     dataField: 'risk_score',
        //     text: 'Risk Score   ',
        //     classes: 'py-2 text-10 text-center align-middle',
        //     headerClasses: 'text-10 text-primary text-center',
        //     sort: true,
        // },
        {
            dataField: 'total_targets',
            text: 'Total Users',
            classes: 'py-2 text-10 text-center align-middle',
            headerClasses: 'text-10 text-primary text-center',
            sort: true
        },
        {
            dataField: 'status',
            text: 'Status',
            classes: 'py-2 text-center align-middle',
            headerClasses: 'text-10 text-primary text-center',
            formatter: (row, { status }) => (<CampaignStatusFormatter status={status} component={'group'} />),
            sort: true
        },
        {
            dataField: '',
            text: 'Action',
            hidden: prop.currentuser.type === 'standard',
            classes: 'border-left text-center align-middle',
            headerClasses: 'text-10 text-primary text-center',
            formatter: (dataField, row, { id }) => (
                // Control your row with this id
                <UncontrolledDropdown>
                    <DropdownToggle color="link" size="sm" className="text-600 btn-reveal" disabled={row['status'] === 'archive'}>
                        <FontAwesomeIcon icon="ellipsis-h" className="fs--1" />
                    </DropdownToggle>
                    <DropdownMenu right className="border p-0">
                        <DropdownItem className="text-10" onClick={() => { setGroupDetails([{ id: row['id'], name: row['group_name'] }]); setEditGroupModal(true); setGroupName(row['group_name']) }}>Edit Name</DropdownItem>
                        <DropdownItem className="text-10" tag={Link} to={{ pathname: '/paa/manage/group-action/edit', state: { name: row['group_name'], id: row['id'], action: 'edit', type: row['type'] } }} >Add Users</DropdownItem>
                        <DropdownItem className="text-10" onClick={() => { setGroupDetails([{ id: row['id'], name: row['group_name'] }]); setArchiveGroupModal(true) }} >Archive</DropdownItem>
                        {row['total_targets'] === 0 ? <></> : <DropdownItem className="text-10" onClick={() => { setGroupDetails([{ id: row['id'], name: row['group_name'] }]); setRemoveAllUsersModal(true) }} >Remove All Users</DropdownItem>}
                        <DropdownItem className="text-10" onClick={() => { setGroupDetails([{ id: row['id'], name: row['group_name'] }]); setArchiveAllUsersModal(true) }} >Archive All Users</DropdownItem>
                        {row['type'] === 'Virtual' ? <DropdownItem className="text-10" onClick={() => { }} >Delete Group</DropdownItem> : <></>}
                    </DropdownMenu>
                </UncontrolledDropdown>
            ),
            csvExport: false,
        }
    ];
    // On Row Select
    function onRowSelect(row, isSelected) {
        let newArray = [...selectedGroupForBulkAction, row['id']];
        let newArrayName = [...selectedGroupNamesForNotiMsg, row['group_name']]
        if (selectedGroupForBulkAction.includes(row['id'])) {
            newArray = newArray.filter(day => day !== row['id']);
        }
        if (selectedGroupNamesForNotiMsg.includes(row['group_name'])) {
            newArrayName = newArrayName.filter(day => day !== row['group_name']);
        }
        setSelectedGroupForBulkAction(newArray);
        setSelectedGroupNamesForNotiMsg(newArrayName);
    }
    // All Rows Selection
    function handleOnSelectAll(isSelect, rows) {
        setSelectedGroupForBulkAction([])
        if (isSelect) {
            rows.forEach(element => {
                if (selectedGroupForBulkAction.includes(element['id'])) {

                }
                else {
                    selectedGroupForBulkAction.push(element['id'])
                }
            });
            setSelectedGroupForBulkAction(selectedGroupForBulkAction)
        }
    }
    // Select Row 
    const selectRow = {
        mode: 'checkbox',
        selectColumnStyle: { paddingTop: '15px' },
        nonSelectable: groupsListStatusWise.filter(r => r.status === 'archive').map(r => r.id),
        onSelect: onRowSelect,
        onSelectAll: handleOnSelectAll,
        hideSelectColumn: prop.currentuser.type === 'standard',
    };
    // Search Functions
    const MySearch = (props) => {
        const handleClick = () => {
            var x = document.getElementById("fname");
            props.onSearch(x.value.toLowerCase())
        };
        return (
            <div>
                <InputGroup>
                    <Input placeholder="Search" className="text-10 table-search-box" onKeyUp={handleClick} id="fname" />
                    <InputGroupAddon addonType="append">
                        <InputGroupText><FontAwesomeIcon icon={faSearch} className="text-10" /></InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
            </div>
        );
    };
    // Bulk Archive Groups
    function BulkArchiveGroups() {
        setEventDisabled(true)
        let unique = selectedGroupForBulkAction.filter((item, i, ar) => ar.indexOf(item) === i);
        let uniqueNames = selectedGroupNamesForNotiMsg.filter((item, i, ar) => ar.indexOf(item) === i);
        const formdata = {
            currentuser: prop.currentuser,
            formdata:  { 'id_list': unique, 'noti_msg': `${prop.currentuser.first_name + ' ' + prop.currentuser.last_name} has Archived ${uniqueNames} groups` },
            action: 'make_group_archive'
        }
        agent.Phishing.create_group(formdata).then((res) => {
            if (res.status === 200) {
                toast(res.message, {
                    position: "top-right",
                    type: 'success',
                    newestOnTop: true
                });
                setBulkArchiveGroupModal(false);
                setDoRefresh(true);
                setEventDisabled(false);
            }
            else if (res.status === 400) {
                toast(res.message, {
                    position: "top-right",
                    type: 'error',
                    newestOnTop: true
                });
                setBulkArchiveGroupModal(false);
                setEventDisabled(false);
            }
            else {
                toast('There is some error please try again later!', {
                    position: "top-right",
                    type: 'error',
                    newestOnTop: true
                });
                setBulkArchiveGroupModal(false);
                setEventDisabled(false);
            }
        })
    }
    // Single Archive Group
    function ArchiveGroup(id, name) {
        setEventDisabled(true);
        const formdata = {
            currentuser: prop.currentuser,
            formdata:  { 'id_list': [id], 'noti_msg': `${prop.currentuser.first_name + ' ' + prop.currentuser.last_name} has Archived ${name} group` },
            action: 'make_group_archive'
        }
        agent.Phishing.create_group(formdata).then((res) => {
            if (res.status === 200) {
                toast(res.message, {
                    position: "top-right",
                    type: 'success',
                    newestOnTop: true
                });
                setArchiveGroupModal(false);
                setDoRefresh(true);
                setEventDisabled(false);
            }
            else if (res.status === 400) {
                toast(res.message, {
                    position: "top-right",
                    type: 'error',
                    newestOnTop: true
                });
                setArchiveGroupModal(false);
                setEventDisabled(false);
            }
            else {
                toast('There is some error please try again later!', {
                    position: "top-right",
                    type: 'error',
                    newestOnTop: true
                });
                setArchiveGroupModal(false);
                setEventDisabled(false);
            }
        })
    }
    // Remove All Users
    function RemoveAllUsers(id) {
        setEventDisabled(true);
        const formdata = {
            currentuser: prop.currentuser,
            formdata:  { 'id': id, 'noti_msg': `${prop.currentuser.first_name + ' ' + prop.currentuser.last_name} has removed all users in ${groupDetails[0].name} group` },
            action: 'remove_all_users'
        }
        agent.Phishing.create_group(formdata).then((res) => {
            if (res.status === 200) {
                toast(res.message, {
                    position: "top-right",
                    type: 'success',
                    newestOnTop: true
                });
                setRemoveAllUsersModal(false);
                setDoRefresh(true);
                setEventDisabled(false);
            }
            else if (res.status === 400) {
                toast(res.message, {
                    position: "top-right",
                    type: 'error',
                    newestOnTop: true
                });
                setRemoveAllUsersModal(false);
                setEventDisabled(false);
            }
            else {
                toast('There is some error please try again later!', {
                    position: "top-right",
                    type: 'error',
                    newestOnTop: true
                });
                setRemoveAllUsersModal(false);
                setEventDisabled(false);
            }
        })
    }
    // Archive All Users
    function ArchiveAllUsers(id) {
        setEventDisabled(true);
        const formdata = {
            currentuser: prop.currentuser,
            formdata:  { 'id': id,'noti_msg': `${prop.currentuser.first_name + ' ' + prop.currentuser.last_name} has archived all users in  ${groupDetails[0].name} group.` }, 
            action: 'make_all_users_in_group_archive'
        }
        agent.Phishing.create_group(formdata).then((res) => {
            if (res.status === 200) {
                toast(res.message, {
                    position: "top-right",
                    type: 'success',
                    newestOnTop: true
                });
                setArchiveAllUsersModal(false);
                setDoRefresh(true);
                setEventDisabled(false);
            }
            else if (res.status === 400) {
                toast(res.message, {
                    position: "top-right",
                    type: 'error',
                    newestOnTop: true
                });
                setArchiveAllUsersModal(false);
                setEventDisabled(false);
            }
            else {
                toast('There is some error please try again later!', {
                    position: "top-right",
                    type: 'error',
                    newestOnTop: true
                });
                setArchiveAllUsersModal(false);
                setEventDisabled(false);
            }
        })
    }
    // Edit Group Name
    // To make different API
    function EditGroup() {
        setDoRefresh(true);
        setEventDisabled(true);
        var groupform = {
            gname: groupName,
            groupId: groupDetails[0].id,
            targetsEmp: [],
        }
        const formdata = {
            currentuser: prop.currentuser,
            formdata: { 'data': groupform, 'noti_msg': `${prop.currentuser.first_name + ' ' + prop.currentuser.last_name} has edited group name of ${groupDetails[0].name} to ${groupName}` }, 
            action: 'edit_group_and_add_employees'
        }
        agent.Phishing.create_group(formdata).then((res) => {
            if (res.status === 200) {
                toast(res.message, {
                    position: "top-right",
                    type: 'success',
                    newestOnTop: true
                });
                setEditGroupModal(false);
                setEventDisabled(false);
            }
            else if (res.status === 400) {
                toast(res.message.status, {
                    position: "top-right",
                    type: 'error',
                    newestOnTop: true
                });
                setEditGroupModal(false);
                setEventDisabled(false);
            }
            else {
                toast('There is some error please try again later!', {
                    position: "top-right",
                    type: 'error',
                    newestOnTop: true
                });
                setEditGroupModal(false);
                setEventDisabled(false);
            }
        })
    }
    return (
        <React.Fragment>
            {/* Edit Group Modal  */}
            <Modal isOpen={editGroupModal} toggle={() => setEditGroupModal(!editGroupModal)} size="sm" centered >
                <ModalHeader >
                    <Flex justify={'between'}>
                        <div className="fs--2">
                            Edit {groupDetails[0] ? groupDetails[0].name : ''}
                        </div>
                        <button className="close float-none" type="button" aria-label="Close" onClick={() => setEditGroupModal(!editGroupModal)} >
                            <span aria-hidden="true">×</span>
                        </button>
                    </Flex>
                </ModalHeader>
                <ModalBody>
                    <Input type="text" className="fs--1" value={groupName} onChange={({ target }) => { setGroupName(target.value); setEventDisabled(false) }} />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" outline onClick={() => setEditGroupModal(!editGroupModal)} className="text-10">Cancel</Button>{' '}
                    <Button color="danger" className="text-10" onClick={() => EditGroup()} disabled={eventDisabled || groupName === ""}>Edit</Button>
                </ModalFooter>
            </Modal>
            {/* Archive Group Modal  */}
            <Modal isOpen={archiveGroupModal} toggle={() => setArchiveGroupModal(!archiveGroupModal)} size="sm" centered >
                <ModalHeader >
                    <Flex justify={'between'}>
                        <div className="fs--2">
                            Archive {groupDetails[0] ? groupDetails[0].name : ''}
                        </div>
                        <button className="close float-none" type="button" aria-label="Close" onClick={() => setArchiveGroupModal(!archiveGroupModal)} >
                            <span aria-hidden="true">×</span>
                        </button>
                    </Flex>
                </ModalHeader>
                <ModalBody>
                    <div className="fs--2">Are You Sure You Want To Archive {groupDetails[0] ? groupDetails[0].name : ''}?</div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" outline onClick={() => setArchiveGroupModal(!archiveGroupModal)} className="text-10">Cancel</Button>{' '}
                    <Button color="danger" className="text-10" onClick={() => { ArchiveGroup(groupDetails[0].id, groupDetails[0].name) }} disabled={eventDisabled}>Archive</Button>
                </ModalFooter>
            </Modal>
            {/* Bulk Archive Group  Modal */}
            <Modal isOpen={bulkArchiveGroupModal} toggle={() => setBulkArchiveGroupModal(!bulkArchiveGroupModal)} size="sm" centered >
                <ModalHeader >
                    <Flex justify={'between'}>
                        <div className="fs--2">
                            Archive All
                                 </div>
                        <button className="close float-none" type="button" aria-label="Close" onClick={() => setBulkArchiveGroupModal(!bulkArchiveGroupModal)} >
                            <span aria-hidden="true">×</span>
                        </button>
                    </Flex>
                </ModalHeader>
                <ModalBody>
                    <div className="fs--2">Are You Sure You Want To Archive All Groups?</div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" outline onClick={() => setBulkArchiveGroupModal(!bulkArchiveGroupModal)} className="text-10">Cancel</Button>{' '}
                    <Button color="danger" className="text-10" onClick={() => BulkArchiveGroups()} disabled={eventDisabled}>ARCHIVE</Button>
                </ModalFooter>
            </Modal>
            {/*Remove All Users  */}
            <Modal isOpen={removeAllUsersModal} toggle={() => setRemoveAllUsersModal(!removeAllUsersModal)} size="sm" centered >
                <ModalHeader >
                    <Flex justify={'between'}>
                        <div className="fs--2">
                            Remove All Users
                                 </div>
                        <button className="close float-none" type="button" aria-label="Close" onClick={() => setRemoveAllUsersModal(!removeAllUsersModal)} >
                            <span aria-hidden="true">×</span>
                        </button>
                    </Flex>
                </ModalHeader>
                <ModalBody>
                    <div className="fs--2">Are You Sure You Want To Remove All Users?</div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" outline onClick={() => setRemoveAllUsersModal(!removeAllUsersModal)} className="text-10">Cancel</Button>{' '}
                    <Button color="danger" className="text-10" onClick={() => RemoveAllUsers(groupDetails[0].id)} disabled={eventDisabled}>Remove</Button>
                </ModalFooter>
            </Modal>
            {/*Archive All Users */}
            <Modal isOpen={archiveAllUsersModal} toggle={() => setArchiveAllUsersModal(!archiveAllUsersModal)} size="sm" centered >
                <ModalHeader >
                    <Flex justify={'between'}>
                        <div className="fs--2">
                            Archive All Users
                                 </div>
                        <button className="close float-none" type="button" aria-label="Close" onClick={() => setArchiveAllUsersModal(!archiveAllUsersModal)} >
                            <span aria-hidden="true">×</span>
                        </button>
                    </Flex>
                </ModalHeader>
                <ModalBody>
                    <div className="fs--2">Are You Sure You Want To Archive All Users?</div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" outline onClick={() => setArchiveAllUsersModal(!archiveAllUsersModal)} className="text-10">Cancel</Button>{' '}
                    <Button color="danger" className="text-10" onClick={() => ArchiveAllUsers(groupDetails[0].id)} disabled={eventDisabled}>Archive</Button>
                </ModalFooter>
            </Modal>
            {hasData ?
                <Card className="border rounded-top-0">
                    <Row noGutters>
                        <Col lg={6} md={6} xs={12} className="ml-1 my-2">
                            <ButtonGroup>
                                <Button active={groupType === 'all'} color="primary" outline onClick={() => { setGroupType('all'); setTooltipDesciption('List of all Groups added in Product Dashboard to Target with Phishing Simulation Including Departments and Virtual Groups') }} className="text-10">
                                    All
                                </Button>
                                <Button active={groupType === 'department'} color="primary" outline onClick={() => { setGroupType('department'); setTooltipDesciption('List of all Departments added in Product Dashboard to Target with Phishing Simulation') }} className="text-10">
                                    Department
                                </Button>
                                {/* Hidden */}
                                {/* <Button active={groupType === 'virtual'} color="primary" outline onClick={() => { setGroupType('virtual'); setTooltipDesciption('List of all Virtual Groups added in Product Dashboard to Target with Phishing Simulation') }} className="text-10">
                                            Virtual
                                </Button> */}
                            </ButtonGroup>
                        </Col>
                    </Row>

                    <PaginationProvider pagination={paginationFactory(options)}>
                        {({ paginationTableProps }) => {
                            return (
                                <React.Fragment>
                                    <ToolkitProvider
                                        keyField="id"
                                        columns={columns}
                                        data={groupsListStatusWise}
                                        exportCSV={{ fileName: 'Overall Total Groups.csv' }}
                                        search>
                                        {props => (
                                            <div>
                                                <FalconCardHeader title={
                                                    <React.Fragment>
                                                        Groups&nbsp;
                                                        <FontAwesomeIcon
                                                            icon={['far', 'question-circle']}
                                                            transform="shrink-1"
                                                            className={"text-400" + (prop.isDark ? ' text-white' : ' text-black')}
                                                            id="groups_table" />
                                                        <UncontrolledTooltip placement="bottom" target="groups_table">
                                                            <div className="text-10">{tooltipDescription}</div>
                                                        </UncontrolledTooltip>
                                                    </React.Fragment>
                                                } titleTag="h6">
                                                    <Flex>
                                                        <MySearch {...props.searchProps} />
                                                        {prop.currentuser.type === 'standard' ? <></> : <>  <Button color="primary" size="sm" outline className="text-10 ml-3" onClick={() => {
                                                            selectedGroupForBulkAction.length === 0 ? toast('Atleast One Group is Required!', {
                                                                position: "top-right",
                                                                type: 'warning',
                                                                newestOnTop: true
                                                            }) : setBulkArchiveGroupModal(true)
                                                        }} >Bulk Archive</Button>
                                                            <ButtonIcon icon={faPlus} tag={Link} to={{ pathname: "/paa/manage/group-action/add", state: { action: 'new' } }} color="primary" size="sm" transform="shrink-3 down-2" className="text-10 ml-3 pt-1">New Group</ButtonIcon>
                                                        </>}
                                                        <MyExportCSV {...props.csvProps} />
                                                    </Flex>
                                                </FalconCardHeader>
                                                <div className="scrollbar">
                                                    <BootstrapTable
                                                        {...props.baseProps}
                                                        ref={table}
                                                        bootstrap4
                                                        keyField="id"
                                                        data={groupsListStatusWise}
                                                        columns={columns}
                                                        noDataIndication={<NoData height={'100vh'} />}
                                                        {...paginationTableProps}
                                                        classes={"table-dashboard fs--1 border-bottom border-200 mb-0 table-dashboard " + (prop.isDark ? "text-white" : "text-black")}
                                                        headerClasses="bg-200 text-900 border-y border-200"
                                                        filterPosition="top"
                                                        selectRow={selectRow}
                                                        striped
                                                        condensed
                                                        hover
                                                        wrapperClasses="standard_table_height"
                                                    />
                                                </div>
                                            </div>
                                        )
                                        }
                                    </ToolkitProvider>
                                </React.Fragment>
                            );
                        }}
                    </PaginationProvider>
                </Card>
                : <Loader height={'500px'} />}
        </React.Fragment>
    );
};

export default Groups;
