//import express 和 ws 套件
const express = require('express')
const expressWs = require('express-ws')
const app = express()
const cors = require('cors');
app.use(express.json())
app.use(cors());
// const SocketServer = require('ws').Server
expressWs(app);
//指定開啟的 port
const PORT = process.env.PORT || '3000'

//創建 express 的物件，並綁定及監聽 3000 port ，且設定開啟後在 console 中提示
const server = app
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

// API
// rooms 所有資料
let rooms = []

// 房主畫方-創建房間
app.post('/newRoom', (req,res) => {
    req.params.massage = "成功創建"
    req.params.states = "200"
    req.params.data = req.body
    rooms.push(req.body)
    res.send(req.params)
})
// 猜方-進入房間
app.post('/inRoom', (req, res) => {
    let id = req.body.roomId;
    let { data } = req.params
    if (rooms.length === 0) {
        req.params.massage = "沒有人要開房間"
        req.params.states = 1002
        req.params.data = req.body
    } else {
        rooms.find(room => {
            if(room.roomId === id) {
                req.params.massage = "進入房間";
                req.params.states = 200;
                req.params.data = req.body;
                room.members.push(req.body)
            } else {
                req.params.massage = "查無房間";
                req.params.states = 1001;
                req.params.data = req.body;
            }
        });
    }
    res.send(JSON.stringify(req.params));
})
app.get('/checkRoom/:id', (req, res) => {
    let { id } = req.params
    if (rooms.length === 0) {
        req.params.massage = "沒有人要開房間"
        req.params.states = 1002
    } else {
      rooms.find(room => {
        if(room.roomId === id) {
          req.params.massage = "進入房間";
          req.params.states = 200;
          req.params.data = room;
        } else {
          req.params.massage = "無此房間";
          req.params.states = 1001;
          req.params.data = {};
        }
      })
    }
    res.send(JSON.stringify(req.params));
})
app.post('/roomChat/:id', (req, res) => {
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].roomId === parseInt(req.params.id)) {
        rooms[i].chat.push(req.body)
        if(rooms[i].answer === req.body.chat) {
          rooms[i].chat.push({
            chat: req.body.member + "玩家 恭喜答對",
            member: "房間公告",
          })
          rooms[i].hasAnswer = false
          rooms[i].answer = ""
          console.log(rooms[i])
        }
      }
    }
    res.send(rooms)
})
app.post('/roomAnswer/:id', (req, res) => {
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].roomId === parseInt(req.params.id)) {
      rooms[i].hasAnswer = req.body.hasAnswer
      rooms[i].answer = req.body.answer
    }
  }
  res.send(rooms)
})
//ws
app.ws('/gameRoom/:id', (ws, req, res) => {
    console.log(rooms)
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].roomId === parseInt(req.params.id)) {
        // 送出的資料
        let sendNowTime = setInterval(()=>{
            ws.send(JSON.stringify(rooms[i]));
          },800)
        // 拿到的資料
          ws.on('message', data => {
            rooms[i].svg = JSON.parse(data).svg
        })
        ws.on('close', () => {
          console.log('Close connected');
          clearInterval(sendNowTime);
          sendNowTime = undefined;
        })
      }
    }

})

module.exports = app