import React from 'react'
import Login from './Login'
import './LoginPage.css'

const LoginPage = () => {
    return (
        <div className="container">
            <div className="left-box">
                <img src="/background.jpeg" alt="Course Explorer" />
            </div>
            <div className="right-box">
                {<Login />}
            </div>
        </div>
    )
}

export default LoginPage