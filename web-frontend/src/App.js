import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import io from 'socket.io-client'
import useSWR from 'swr'

import { UserContext, SocketContext } from './utils/contexts'
import fetcher from './utils/fetcher'
import Home from './Components/Home'
import Queue from './Components/Queue'
import SignUp from './Components/SignUp'

const socket = io()

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [userId, setUserId] = useState(null)

  // TODO: handle error
  const { data: user, error } = useSWR(
    userId ? `/users/${userId}` : null,
    fetcher
  )

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))

    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [])

  return (
    <UserContext.Provider value={user}>
      <SocketContext.Provider value={socket}>
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
                  <Home isConnected={isConnected} />
                ) : (
                  <SignUp setUserId={setUserId} />
                )
              }
            />
            <Route path="/queue/:classCode" element={<Queue />} />
          </Routes>
        </Router>
      </SocketContext.Provider>
    </UserContext.Provider>
  )
}

export default App
