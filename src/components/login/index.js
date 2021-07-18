import React, {useEffect} from "react";
import Dashboard from "../dashboard";
import Customer from "../customer";
import Retailer from "../retailer";


export default function Index() {

    const[comp,setComp] = React.useState(null);

    
    useEffect(()=>{
        var user_type = localStorage.getItem('user_type')
        setComp(user_type)
        // setComp(localStorage.getItem('user_type')==='admin'?Dashboard:localStorage.getItem('user_type')==='owner'?Retailer :Customer
        // )
    },[comp])

    return(<React.Fragment>
        <div style={{height:'100%'}}>
        {/* {comp==='admin'?<Dashboard/>:comp==='owner'?<Retailer/> :<Customer/>} */}
        {comp==='admin'? <Dashboard/> : <></>}
        {comp==='customer'? <Customer/> : <></>}
        {comp==='owner'? <Retailer/> : <></>}
        </div>
    </React.Fragment>)
    

}
