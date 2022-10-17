import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import io from 'socket.io-client'
import useSWR from 'swr'
import { gapi } from 'gapi-script'
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material'

import { UserContext, SocketContext } from './utils/contexts'
import fetcher from './utils/fetcher'
import Home from './Components/Home'
import Queue from './Components/Queue'
import SignUp from './Components/SignUp'
import Settings from './Components/Settings'

const socket = io()
const theme = createTheme({
  typography: {
    fontFamily: [
      'Source Sans Pro',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
})

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

      gapi.auth2.getAuthInstance().isSignedIn.listen((signedIn) => {
        if (signedIn) {
          // TODO: this doesn't actually work on load
          doLogin(gapi.auth2.getAuthInstance().currentUser.get().profileObj)
        } else {
          setUserId(null)

          if (window.location.pathname !== '/') {
            window.location.pathname = '/'
          }
        }
      })
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <UserContext.Provider value={user}>
        <SocketContext.Provider value={socket}>
          <Router>
            <Routes>
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

              <Route
                path="/settings"
                element={userId ? <Settings /> : <div />}
              />
            </Routes>
          </Router>
        </SocketContext.Provider>
      </UserContext.Provider>
    </ThemeProvider>
  )
}

export default App
