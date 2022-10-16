import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import io from 'socket.io-client'

import { UserContext } from './utils/contexts'
import Home from './Components/Home'
import Queue from './Components/Queue'
import Login from './Components/Login'
import SignUp from './Components/SignUp'

const socket = io()

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))

    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [])

  return (
    <UserContext.Provider value={userId}>
      <Router>
        <Routes>
          {/* <Route exact path="/" element={<SignUp setUserId={setUserId} />} /> */}
          {/* <Route
            exact
            path="/home"
            element={<Home userId={userId} isConnected={isConnected} />}
          /> */}

          <Route
            exact
            path="/"
            // TODO: figure out whether it is okay to do this
            element={
              userId ? (
                <Home userId={userId} isConnected={isConnected} />
              ) : (
                <SignUp setUserId={setUserId} />
              )
            }
          />
          <Route
            path="/queue/:classCode"
            element={<Queue userId={userId} socket={socket} />}
          />
        </Routes>
      </Router>
    </UserContext.Provider>
  )
}

export default App
