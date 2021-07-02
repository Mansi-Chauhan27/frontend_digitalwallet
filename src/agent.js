import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';


const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT_LOCAL = 'http://127.0.0.1:8000';
const API_ROOT = API_ROOT_LOCAL;
const responseBody = res => res.body;

let token = localStorage.getItem('token');
const tokenPlugin = req => {
console.log('safsf',req, localStorage.getItem('token'))
  if (token) {
    req.set('authorization', `Token ${token}`);
    console.log(req)
  }
};

const requests = {
  del: url =>
    superagent
      .del(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .then(responseBody),
  get: url =>
    superagent
      .get(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .then(responseBody),
  put: (url, body) =>
    superagent
      .put(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
  post: (url, body) =>
    superagent
      .post(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody)
};


const DigitalWallet = {
  get_cutomers: () => requests.get(`/client/customers`),
  delete_cutomers: (data) => requests.del(`/client/customers`, {data:data}),
  get_transaction: () => requests.get(`/transaction/transactiondetail`),
  make_transaction: (data) => requests.post(`/transaction/transactiondetail/`,{data:data}),

};

 // eslint-disable-next-line
export default {
  DigitalWallet,
  API_ROOT,
 
  setToken: _token => {
    token = _token;
    console.log(token,'wdafae')
  }
};
