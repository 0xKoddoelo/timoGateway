var express = require('express')
var axios = require('axios');
var app = express()
const profile = {"status":1,"data":{"id":21183,"date_created":"2018-10-16T22:07:54-07:00","date_modified":"2018-11-05T03:19:42-08:00","username":"1BglxyyA0P8tg2o0jzmzwFYyV8U","email":"","name":"","phone":"","avatar":"","status":1,"verified":0,"card_id":"","card_verified":0,"reward_wallet_addresses":"","wallet_addresses":"[\"0x8D77817673B410C511900CccDD8a00492062e8c8\",\"15HSrL5d8PPWLiepqCmYfEsUSBLuYbKYXi\",\"qqh0e0xgwu69jewwmzcxy9ptkktdj8da0vc2hdhray\",\"rH5nY7W9Qj9B8rPoN4reJ1JoVzFZKNdY7J\"]","fcm_token":"fjosuJidxds:APA91bE6biF0x1ubgGz0BThKqvAQcWkj2OqZ8OSadIxzIHcNqHlTNwmkJHSoL_d7PPyX55m37HvmpCwg-p-zfbdJEF_v1PHAMbEaL0CuqqcKKQkwU-qBvahEUX7fri9_i0B3KV0Q5cUf","id_verified":0,"id_verification_level":0}};

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
app.get('/timo/bankList', (req, res) => {
  axios.get('https://my.timo.vn/contentManagement/bankList').then(({ data }) => res.send(data)).catch(err=>console.log(err));
});

const token = process.env.TOKEN || 'eyJraWQiOiI0YmRjNGE1Yi0yYTQyLTQ3ZjEtYmIxNS05MTViMDExOTliNGYiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhdXRoLmhlcmFjbGVzIiwic3ViIjoiand0LWF0bSIsImF1ZCI6ImludGVybmFsLmF1ZGllbmNlIiwiZXhwIjoxNTQxNzM3NzcyLCJqdGkiOiJZQUR5SDJ0azhsLVdZdzJ0d2RQQWNRIiwiaWF0IjoxNTQxNTU3NzcyLCJ1aWQiOiIwNTI5MzM1OS1mMGU0LTQ3Y2UtOTFkZi00ZGU1NzQxODMwYjcifQ.6-z8TvAsotl329wjul3Zt5o87G8cJW_cjU8DZfHevo4';
const timoDevice = process.env.DEVICE ? `${process.env.DEVICE}:WEB:WEB:76:safari` : 'e05s7hY2:WEB:WEB:76:safari';
console.log('TOKEN: ', token);
console.log('TIMO DEVICE :', timoDevice);
app.get('/timo/getBankInfo', (req, res) => {
  console.log(req.query);
  const data = req.query;
  axios({
    method: 'post',
    url: 'https://app.timo.vn/user/fastTransfer/getInfo',
    headers: {
      token,
      'x-timo-devicekey': timoDevice
    },
    data
  }).then(r => {
   console.log('success', r.data);
   res.send(r.data);
  }).catch(err => {
    console.log('error', err);
    res.send(null);
  });
}); 
app.listen(2203)
