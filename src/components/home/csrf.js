import React , {useEffect,useState} from 'react';
// import jQuery from 'jquery'; 
import axios from 'axios';




const CSRFToken = () => {
    console.log('csrffff')

    const[csrftoken, setCsrftoken] = useState('')

    const getCookie =(name)=> {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            console.log('???')
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        console.log('cookieValue',cookieValue)
        return cookieValue;
      }

      useEffect(()=>{
          const fetchData = async ()=>{
              console.log('efw')
                await axios.get('http://127.0.0.1:8000/getcsrf/');    
                console.log('document.cookie',document.cookie)
          }

          fetchData()
          setCsrftoken(getCookie('csrftoken'))
          console.log(getCookie('csrftoken'))
      },[]);

    console.log(csrftoken,document.cookie ,'ihiuhiuhiu')
    return (
        <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
    );
};
export default CSRFToken;