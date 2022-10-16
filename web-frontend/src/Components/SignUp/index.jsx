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
  const navigate = useNavigate();
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
    // event.preventDefault();
    setProfile(res.profileObj)
    let { 
      name,
      email,
      googleId
    } = res.profileObj;
    try {
      let userData = await fetch(`/userLogin/`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({name, email, googleId})
      })
      let userInfo = await userData.json();
      let { user } = userInfo;
      console.log(user)
      navigate({pathname: '/home',
        state: {
          ...user 
        } })
    }
    catch
    {
      console.log("Failed to Login into Google API.....");
    }
  }

  const Login = async () => {
    let { 
      name,
      email,
      googleId
    } = profile;
      let userData = await fetch(`/userLogin/`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({name, email, googleId})
      })
      let userInfo = await userData.json();
      let { user } = userInfo;
      console.log(user)
      navigate({pathname: '/home',
        state: {
          ...user 
        } })
  }

  const OnFailure = (err) => {
    console.log('failed to login :(', err)
  }

  if (!(Object.keys(profile).length == 0))
  {
    Login();
  }

  return (
    <>
        <GoogleLogin
          clientId={clientId}
          buttonText="Sign in with Google"
          onSuccess={OnSuccess}
          onFailure={OnFailure}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
        />
    </>
  )
}

export default SignUp
