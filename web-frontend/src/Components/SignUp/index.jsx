import React, { useState, useEffect } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login'
// import { useNavigate } from 'react-router-dom'
import { gapi } from 'gapi-script'
// import { Button } from '@mui/material'

import blobSvg from './blob.svg'
import MyImage from './humaans2.png'

/* <GoogleLogout
  clientId={clientId}
  buttonText="Log out"
  onLogoutSuccess={logOut}
/> */

const SignUp = ({ setUserId }) => {
  // const navigate = useNavigate()
  const clientId = process.env.REACT_APP_CLIENT_ID
  // const [profile, setProfile] = useState({})

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: '',
      })
    }
    gapi.load('client:auth2', initClient)
  }, [clientId])

  const onSuccess = async (res) => {
    // event.preventDefault();
    // setProfile(res.profileObj)

    let { name, email, googleId, imageUrl } = res.profileObj

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

  // const login = async () => {
  //   let { name, email, googleId } = profile
  //   let userData = await fetch(`/users/login`, {
  //     method: 'post',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //     },
  //     body: JSON.stringify({ name, email, googleId }),
  //   })

  //   let userInfo = await userData.json()
  //   let { user } = userInfo

  //   console.log(user)

  //   navigate({
  //     pathname: '/home',
  //     state: {
  //       ...user,
  //     },
  //   })
  // }

  const onFailure = (err) => {
    console.log('failed to login :(', err)
  }

  // if (Object.keys(profile).length > 0) {
  //   login()
  // }

  return (
    <div style={{ textAlign: 'center' }}>
      {/* <div style={{ display: 'flex' }}> */}
      <div
        style={{
          position: 'relative',
          paddingTop: '2rem',
          width: '30rem',
          maxWidth: '90vw',
          margin: '0 auto',
          display: 'relative',
        }}
      >
        <div>
          <img src={MyImage} style={{ maxWidth: '100%' }} />
        </div>
        <div>
          <h2
            style={{ fontSize: '2rem', color: '#119bc0', fontWeight: 800 }}
            color="#119bc0"
          >
            Need Help <br />
            Finding a Study Group?
          </h2>
          <div
            style={{
              // width: '6rem',
              margin: '0 auto',
              marginBottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <GoogleLogin
              clientId={clientId}
              buttonText="Sign in with Google"
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={'single_host_origin'}
              isSignedIn={true}
            />
            {/* <Button variant="outlined">Login</Button>
              <Button
                variant="contained"
                style={{ backgroundColor: '#119bc0' }}
              >
                Signup
              </Button> */}
          </div>
        </div>
        <img
          style={{
            position: 'absolute',
            width: '40rem',
            top: '0px',
            left: '-4rem',
            zIndex: '-1',
            opacity: '0.1',
          }}
          src={blobSvg}
          alt="graphic 1"
        />
      </div>
    </div>
  )
}

export default SignUp
