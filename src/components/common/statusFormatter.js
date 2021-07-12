import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Badge,
  CardHeader
} from 'reactstrap';
import Flex from './flex';
// import 'font-awesome/css/font-awesome.min.css';
const StatusFormatter = ({ status, component }) => {
    console.log(status,component)
    let color = '';
    let text = '';
    let icon = '';
    switch (status) {
        
        case true:
            color = 'success';
            text = 'Active';
            // icon = 'check';
            break;
        default:
            color = 'secondary';
            text = 'In Active';
            // icon = 'ban';
    }
    return (
        <div>
            {component === 'timeline' ? <CardHeader className={`border-bottom p-3 bg-soft-${color}`}>
                <Flex justify={'between'} className="font-weight-bold fs--1" >
                    <div className={`text-${color}`}>
                        {text}
                    </div>
                    <div className={`text-${color}`}>
                        {/* {endDate} */}
                    </div>
                </Flex>
            </CardHeader> : component === 'device'
                ? <Badge color={`soft-${color}`} className="rounded-capsule">
                    {icon ? <FontAwesomeIcon icon={icon} transform="shrink-2" className="ml-1" /> : <></>}&nbsp;&nbsp;
            {text}
                </Badge> : <Badge color={`soft-${color}`} className="fs--2" >{text}</Badge>
            }
        </div>
    );
};

export default StatusFormatter;