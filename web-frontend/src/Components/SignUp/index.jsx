import React, { useState, useEffect } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { gapi } from 'gapi-script'

{/* <GoogleLogout
  clientId={clientId}
  buttonText="Log out"
  onLogoutSuccess={logOut}
/> */}

const SignUp = () => {
  const [profile, setProfile] = useState({})
  const clientId = process.env.REACT_APP_CLIENT_ID

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: '',
      })
    }
    gapi.load('client:auth2', initClient)
  })

  const OnSuccess = async (res) => {
    setProfile(res.profileObj)

    try {
      let userData = await fetch(`/userLogin/${res.profileObj.googleId}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })

      let user = await userData.json();
      Navigate('/home', {
        state: {
          user
        }
      })
    }
    catch
    {
      console.log("Failed to fetch.....");
    }
  }

  const OnFailure = (err) => {
    console.log('failed to login :(', err)
  }

  return (
    <>
      <h2>Google Login</h2>
      {(Object.keys(profile).length == 0) ? (
        <GoogleLogin
          clientId={clientId}
          buttonText="Sign in with Google"
          onSuccess={OnSuccess}
          onFailure={OnFailure}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
        />
      ) : ""}
    </>
  )
}

export default SignUp
