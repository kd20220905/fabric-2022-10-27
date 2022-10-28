//import express 和 ws 套件
const express = require('express')
// const SocketServer = require('ws').Server

// //指定開啟的 port
// const PORT = process.env.PORT || '3000'

// //創建 express 的物件，並綁定及監聽 3000 port ，且設定開啟後在 console 中提示
// const server = express()
//     .listen(PORT, () => console.log(`Listening on ${PORT}`))

// //將 express 交給 SocketServer 開啟 WebSocket 的服務
// const wss = new SocketServer({ server })
// let dataIns;
// //當 WebSocket 從外部連結時執行
// wss.on('connection', ws => {
//   console.log('Client connected')

//   //固定送最新時間給 Client
//   const sendNowTime = setInterval(()=>{
//       ws.send(JSON.stringify(dataIns))
//   },100)

//   ws.on('message', data => {
//       // ws.send(data)
//       dataIns = JSON.parse(data)
//   })

//   ws.on('close', () => {
//       //連線中斷時停止 setInterval
//       clearInterval(sendNowTime)
//       console.log('Close connected')
//   })
// })

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hesdfllo World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
module.exports = app