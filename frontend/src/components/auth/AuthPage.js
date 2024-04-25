import React from 'react'
import Login from './Login'
import SignUp from './SignUp'
import './AuthPage.css'

const LoginPage = ({ showLogin }) => {
    return (
        <div className="container">
            <div className="left-box">
                <img src="/background.jpeg" alt="Course Explorer" />
            </div>
            <div className="right-box">
                
                {showLogin ? <Login /> : <SignUp />}
            </div>
        </div>
    )
}

export default LoginPage