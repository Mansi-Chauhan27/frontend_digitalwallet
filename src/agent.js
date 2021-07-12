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
      .then(responseBody)
      .catch(),
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
  get_cutomers: () => requests.get(`/client/customers/`),
  update_cutomers: (data) => requests.put(`/client/customers/`, {data:data}),
  delete_cutomers: (data) => requests.del(`/client/customers/`, {data:data}),
  get_transaction: () => requests.get(`/transaction/transactiondetail/`),
  make_transaction: (data) => requests.post(`/transaction/transactiondetail/`,{data:data}),
  get_devices: () => requests.get(`/devices/devices/`),
  create_device: (data) => requests.post(`/devices/devices/`,{data:data}),
  deactivate_device: (data) => requests.put(`/devices/devices/`,{data:data}),
  create_device_key: (data) => requests.post(`/devices/devicekey/`,{data:data}),
  redeem_giftcard: (data) => requests.post(`/transaction/giftcardredeem/`,{data:data}),
  add_giftcard: (data) => requests.post(`/transaction/giftcard/`,{data:data}),
  get_giftcard: () => requests.get(`/transaction/giftcard/`),
  get_balance: (data) => requests.post(`/transaction/getbalance/`,{data:data}),
  generate_card: (data) => requests.post(`/transaction/generatecard/`,{data:data}),
  generate_otp: (data) => requests.post(`/client/generateotp/`,{data:data}),
  transfer_money: (data) => requests.post(`/transaction/transfermoney/`,{data:data}),
  get_cards: (data) => requests.post(`/transaction/getcards/`,{data:data}),
  login_using_token: (data) => requests.post(`/api-token-auth/`,{data:data}),
  get_owners: () => requests.get(`/client/owners/`),

};

 // eslint-disable-next-line
export default {
  DigitalWallet,
  API_ROOT,
 API_ROOT_LOCAL,
  setToken: _token => {
    token = _token;
    console.log(token,'wdafae')
  }
};
