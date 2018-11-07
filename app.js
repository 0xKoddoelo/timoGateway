var express = require('express')
var axios = require('axios');
var app = express()
const profile = {"status":1,"data":{"id":21183,"date_created":"2018-10-16T22:07:54-07:00","date_modified":"2018-11-05T03:19:42-08:00","username":"1BglxyyA0P8tg2o0jzmzwFYyV8U","email":"","name":"","phone":"","avatar":"","status":1,"verified":0,"card_id":"","card_verified":0,"reward_wallet_addresses":"","wallet_addresses":"[\"0x8D77817673B410C511900CccDD8a00492062e8c8\",\"15HSrL5d8PPWLiepqCmYfEsUSBLuYbKYXi\",\"qqh0e0xgwu69jewwmzcxy9ptkktdj8da0vc2hdhray\",\"rH5nY7W9Qj9B8rPoN4reJ1JoVzFZKNdY7J\"]","fcm_token":"fjosuJidxds:APA91bE6biF0x1ubgGz0BThKqvAQcWkj2OqZ8OSadIxzIHcNqHlTNwmkJHSoL_d7PPyX55m37HvmpCwg-p-zfbdJEF_v1PHAMbEaL0CuqqcKKQkwU-qBvahEUX7fri9_i0B3KV0Q5cUf","id_verified":0,"id_verification_level":0}};
const username = process.env.TIMO_USER || 'slam0212';
const password = process.env.TIMO_PASS || 'c2a6a46a422ba67a98d923c3fe9baabf6a95cb8a86ab882602ea48b213edf122ee153d22b0c247452c0b44c346433f934263dbc7eec60c1eba5c54ade683cb8e';
const bankAccount = process.env.TIMO_ID || '166999324';

const loginTimo = () => new Promise((resolve, reject) => {
  try {
    axios({
      method: 'post',
      url: 'https://app.timo.vn/login',
      headers: {
        'x-timo-devicereg': '3927830470:WEB:WEB:76:chrome'
      },
      data: {
        username,
        password
      }
    }).then(({ data }) => {
      
      console.log('login success', data);
      resolve(data);
    }).catch(err => {
      console.log('login failed', err);
      resolve(null);
    })
  } catch (err) {
     console.log('login failed', err);
     resolve(null);
  }  
});
const getAccountInfo = (token, timoDevice, data) => new Promise((resolve, reject) => {
  try {
    axios({
      method: 'post',
      url: 'https://app.timo.vn/user/fastTransfer/getInfo',
      headers: {
        token,
        'x-timo-devicekey': timoDevice
      },
      data
    }).then(r => {
     resolve(r.data);
    }).catch(err => {
      console.log('error', err);
      reject(null);
    });
  } catch(err) {
    console.log('getAccountInfo failed');
    reject(null);
  }
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

 
app.get('/', function (req, res) {
  res.send('Hello World')
});
app.get('/user/profile', (req, res) => {
  res.send(profile);
})
app.get('/timo/login', (req, res) => {
  loginTimo().then(r => res.send(r.data)).catch(err => res.send('err', err));
})
app.get('/timo/bankList', (req, res) => {
  axios.get('https://my.timo.vn/contentManagement/bankList').then(({ data }) => res.send(data)).catch(err=>console.log(err));
});


app.get('/timo/getBankInfo', (req, res) => {
  const TOKEN_ENV = process.env.TOKEN;
  const DEVICE_ENV = process.env.DEVICE;
  getAccountInfo(TOKEN_ENV, DEVICE_ENV, req.query).then(r => {
    console.log('success get account info', r);
    res.send(r);
  }).catch(err => {
    console.log('get Account Info failed');
    loginTimo().then(r => {
      console.log('login again value', r);
      const { token, timoDeviceId } = r.data;
      const deviceEnv = timoDeviceId + ':WEB:WEB:76:safari';
      process.env['TOKEN'] = token;
      process.env['DEVICE'] = deviceEnv;
      console.log('updated env TOKEN', process.env.TOKEN);
      console.log('updated env DEVICE', process.env.DEVICE);
      console.log('get Account Info again after gettoken');
      getAccountInfo(token, deviceEnv, req.query).then(r => res.send(r)).catch(err => res.send(false));
    }).catch(err => {
      console.log('failed here');
      res.send(null);
    });
  });
}) 
app.listen(2203)
