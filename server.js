//import express 和 ws 套件
const express = require('express')
const app = express()
const cors = require('cors');
app.use(express.json())
app.use(cors());
const SocketServer = require('ws').Server
//指定開啟的 port
const PORT = process.env.PORT || '3000'

//創建 express 的物件，並綁定及監聽 3000 port ，且設定開啟後在 console 中提示
const server = app
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

// API
let host = {
    host: false
};
app.post('/host', (req, res) => {
    host.host = req.body.host
    res.send(JSON.stringify(host.host))
})
app.get('/checkhost', (req, res) => {
    res.send(JSON.stringify(host.host))
})
//ws
const wss = new SocketServer({ server })
let dataIns;
wss.on('connection', ws => {
  console.log('Client connected')

  //固定送最新時間給 Client
  const sendNowTime = setInterval(()=>{
      ws.send(JSON.stringify(dataIns))
  },1000)

  ws.on('message', data => {
      // ws.send(data)
      dataIns = JSON.parse(data)
  })

  ws.on('close', () => {
      //連線中斷時停止 setInterval
      clearInterval(sendNowTime)
      console.log('Close connected')
  })
})


module.exports = app