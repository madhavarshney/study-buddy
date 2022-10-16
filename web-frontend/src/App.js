import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import io from 'socket.io-client'

import Home from './Components/Home'
import Queue from './Components/Queue'
import Login from './Components/Login'
import SignUp from './Components/SignUp'

const socket = io('http://localhost:3000')
const USER_ID = '805534814819352578'

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [userId, setUserId] = useState(USER_ID)

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))

    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<SignUp />} />
        <Route
          exact
          path="/home"
          element={<Home userId={userId} isConnected={isConnected} />}
        />
        <Route path="/queue/:classCode" element={<Queue />} />
      </Routes>
    </Router>
  )
}

export default App
