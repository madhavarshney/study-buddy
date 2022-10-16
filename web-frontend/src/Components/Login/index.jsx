import React, {  useState, useEffect } from 'react';

const Login = () => {
    const [userName, setUsername] = useState("username");
    const [password, setPassword] = useState("password");
    return ( 
    <>
       <p>{userName}</p>
       <p>{password}</p> 
    </> );
}
 
export default Login;
