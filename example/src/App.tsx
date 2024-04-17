import React from 'react'
import ReactInstaChat from 'volkeno-react-messenger'
import 'volkeno-react-messenger/dist/index.css'

import { io } from 'socket.io-client'
import axios from 'axios'

const token ='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImRldkB2b2xrZW5vLmNvbSIsImV4cCI6MTk1NDMyMjM3OSwiZW1haWwiOiJkZXZAdm9sa2Vuby5jb20iLCJvcmlnX2lhdCI6MTY5NTEyMjM3OX0.hRkniFxpbFI33T8Df21zKKyDRoCIzzhwATsLKAGG0zk' /* provide the token */
// const token ='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImRldkB2b2xrZW5vLmNvbSIsImV4cCI6MTk3MTg2ODE1NCwiZW1haWwiOiJkZXZAdm9sa2Vuby5jb20iLCJvcmlnX2lhdCI6MTcxMjY2ODE1NH0.0aWxx1HDpTcdtkqijMR7DY3rY8yH414PHTOS0NarpgQ' /* provide the token */
// const SOCKET_URL = '164.92.136.142:4026'
// const SOCKET_URL = 'https://yaay-ak-doom-socket.withvolkeno.com'
// const SOCKET_URL = 'socket.io.volkeno.com'
// const SOCKET_URL = 'www.socket.io.volkeno.com/'
// const SOCKET_URL = 'wss://echo.websocket.org'
const SOCKET_URL = 'https://www.medsain-socket.withvolkeno.com'
const ApiBaseUrl = 'https://yaay-ak-doom-api.volkeno-engineering.click'
// const ApiBaseUrl = 'https://medsain-api.withvolkeno.com'

const App = () => {
  // const { user, token } = useAppSelector((state) => state.user)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  // console.log({ user })
  const socket = io(SOCKET_URL)
  // const { user, token } = useAppSelector((state) => state.user);
  const [user, setUser] = React.useState(null)
  const [conversationsUser, setConversationsUser] = React.useState(null)
  const [userList, setUserList] = React.useState(null)

  React.useEffect(() => {
    axios
      .get(ApiBaseUrl + '/api/auth/me', config)
      .then((response) => {
        const userData = response.data.data
        setUser(userData)
        socket.emit('newUser', {
          userName: userData?.prenom + ' ' + userData?.nom,
          socketID: socket.id,
        })
        console.log('newUser', socket.id)

        if (userData) {
          axios
            .get(
              ApiBaseUrl + `/api/user/${userData.slug}/conversations/`,
              config
            )
            .then((response) => {
              const conversationsData = response.data.results
              setConversationsUser(conversationsData)
            })
            .catch((error) => {
              console.error('Error:', error)
            })
        }
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }, [socket])
  React.useEffect(() => {
    axios
      .get(ApiBaseUrl + '/api/medecins/?limit=1000', config)
      .then((response) => {
        const listUserData = response.data.results
        setUserList(listUserData)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }, [config])
  console.log({ conversationsUser })
  return (
    <ReactInstaChat
      socketUrl={SOCKET_URL}
      user={user}
      token={token}
      conversationsUser={conversationsUser}
      ApiBaseUrl={ApiBaseUrl}
      userList={userList}
      // socketUrl={}
      // user={{}}
      // token={''}
      // conversationsUser={[]}
      // ApiBaseUrl={''}
      // userList={[]}
    />
  )
}

export default App
