// src/services/socket.js
import { io, Socket } from 'socket.io-client'

export default class WebSocketService {
  socket: Socket
  constructor() {
    // 连接到 WebSocket 服务器
    this.socket = io('http://localhost:4001') // WebSocket 服务器地址

    this.socket.on('connect', () => {
      console.log('', this.socket.connected) // true
    })

    // 监听服务器返回的消息
    this.socket.on('response', (data) => {
      console.log('Received response from server:', data)
    })
  }

  // 发送问题给服务器
  askQuestion(questionJson: string) {
    this.socket.emit('ask_question', { json: questionJson })
  }

  // 断开连接
  disconnect() {
    this.socket.disconnect()
  }
}
