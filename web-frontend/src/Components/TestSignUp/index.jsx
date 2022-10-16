import React, { useState, useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import blobSvg from './blob.svg';
import MyImage from './humaans2.png';


const TestSignUp = () => {
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        {/* <div style={{ display: 'flex' }}> */}
        <div style={{ position: "relative", paddingTop: "2rem", display: "relative" }}>
          <div>
            <img src={MyImage} />
          </div>
          <div>
            <h2 style={{ fontSize: "2rem", color: '#119bc0', fontWeight: 800 }} color='#119bc0'>Need Help <br />Finding a Study Group?</h2>
            <Button variant="contained" style={{ backgroundColor: "#119bc0" }}>Sign Up</Button>
          </div>
          <img style={{ position: "absolute", width: "40rem", top: "0px", left: "25%", zIndex: "-1", opacity: "0.1" }} src={blobSvg} alt="blob image" />
        </div>
      </div>
    </>
  )
}

export default TestSignUp
