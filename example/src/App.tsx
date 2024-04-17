import React from 'react'
import ReactInstaChat from 'volkeno-react-messenger'
import 'volkeno-react-messenger/dist/index.css'
import { io } from 'socket.io-client'

const App = () => {
  const SocketUrl = ''
  const socket = io(SocketUrl)
  return (
    <ReactInstaChat
      socket={socket}
      user={{}}
      token={''}
      conversationsUser={[]}
      ApiBaseUrl={''}
      userList={[]}
    />
  )
}

export default App
