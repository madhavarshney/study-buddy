import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import io from 'socket.io-client'
import useSWR from 'swr'
import { gapi } from 'gapi-script'

import { UserContext, SocketContext } from './utils/contexts'
import fetcher from './utils/fetcher'
import Home from './Components/Home'
import Queue from './Components/Queue'
import SignUp from './Components/SignUp'
import Settings from './Components/Classes'

const socket = io()

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [userId, setUserId] = useState(null)

  // TODO: handle error
  const { data: user, error } = useSWR(
    userId ? `/users/${userId}` : null,
    fetcher
  )

  const doLogin = async (profile) => {
    let { name, email, googleId, imageUrl } = profile

    try {
      const userData = await fetch(`/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          googleId,
          profilePicture: imageUrl,
        }),
      }).then((r) => r.json())

      const { user } = userData

      console.log(user)

      setUserId(user.id)
      // navigate('/home')
    } catch {
      console.log('Failed to Login into Google API.....')
    }
  }

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))

    gapi.load('client:auth2', () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_CLIENT_ID,
        scope: 'email profile',
      })

      const user = gapi.auth2.getAuthInstance().currentUser.get()

      if (user.profileObj) {
        // TODO: this doesn't actually work
        doLogin(user.profileObj)
      } else if (window.location.pathname !== '/') {
        window.location.pathname = '/'
      }
    })

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
                  <SignUp setUserId={setUserId} doLogin={doLogin} />
                )
              }
            />

            <Route
              path="/queue/:classCode"
              element={userId ? <Queue /> : <div />}
            />

            <Route path="/settings" element={userId ? <Settings /> : <div />} />
          </Routes>
        </Router>
      </SocketContext.Provider>
    </UserContext.Provider>
  )
}

export default App
