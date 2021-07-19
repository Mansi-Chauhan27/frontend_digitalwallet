import React,{useState,useEffect} from 'react';
import Balance from './balance';
import History from './history';
import agent from '../../agent';
import TransferToConsumer from './transferToConsumer';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';


const Customer = () => {
    const[updateBalance,setUpdateBalance] = useState(false);
    const[balance,setBalance] = useState([]);
    const[updateHistory,setUpdateHistory] = useState(false);
    const[userCardsList,setUserCardsList] = useState([]);
    const[customerCardsList,setCustomerCardsList] = useState([]);
    const[valid,setValid] = useState(false);
    const[res,setRes] = useState(false);


    console.log(updateHistory);

    // Get Balance
    useEffect(()=>{
        console.log(updateBalance);
        const x = agent.DigitalWallet.get_balance({'action':'get_balance','user_id':65},2);
        x.then(res=>{
            console.log(res.data)
            if(res && res.data){
                setBalance(res.data['data'])
            }
        }).catch(error=>{
            if(error.status===403){
                toast.error('Permission Denied')
                setValid(true)
            }
        })
        if(x.error){
            console.log('sf')
        }
       
    },[updateBalance])

    // GEt cards
    useEffect(() => {
        const r = agent.DigitalWallet.get_cards({ 'action': 'get_users_cards', 'userid': 65 });
        r.then((res) => {
            console.log(res.data['data']);
            if (res && res.data) {
                console.log(res.data)
                setUserCardsList(res.data['data']);
                
            }
        }).catch(er=>{
            setValid(true);
            toast.error('permission Denied');
        });
        const c = agent.DigitalWallet.get_cards({ 'action': 'get_other_users_cards', 'userid': 65 })
        c.then((res) => {
            console.log(res.data);
            if (res && res.data) {
                console.log(res.data['customers'])
                setCustomerCardsList(res.data['customers']);
                setRes(true);
            }
        }).catch(er=>{
            setValid(true);
            toast.error('permission Denied');
        });
    }, [])

    if(valid){
        return <Redirect to="/" />
    }

    return (
        <React.Fragment>
            <div style={{ background:'linear-gradient(45deg, black, transparent)', height:'100%'}}> 
            <div style={{ paddingLeft: '8%'}}>
            {balance.length>0 && <Balance balance={balance} />}
            </div>
            <br />

            <div style={{ paddingLeft:'8%' }}>
                <TransferToConsumer  customerCardsList={customerCardsList} userCardsList ={userCardsList} setUpdateBalance={setUpdateBalance} setBalance={setUpdateHistory}  />
            </div>
            <br />
           
            <div style={{ paddingLeft:'8%' }}>
                {res && <History userCardsList={userCardsList} />}
            </div>
            </div>
        </React.Fragment>
    )
}


export default Customer;