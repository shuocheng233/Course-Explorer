import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URLS from '../../config/config'

const Login = () => {
    const [netID, setNetID] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("") // state to hold login errors
    const navigate = useNavigate()

    // update netID state on user input
    const handleNetIDChange = (e) => {
        setNetID(e.target.value)
    }

    // update password state on user input
    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    // handle form submission for login
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch(API_URLS.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ netID, password })
            })

            if (res.ok) {
                setError("")
                const data = await res.json()
                console.log(data)
                // store data in localStorage
                localStorage.setItem('netID', netID)
                localStorage.setItem('firstName', data.firstName)
                localStorage.setItem('lastName', data.lastName)
                navigate('/home') // navigate to home page on successful login

            } else {
                if (res.status === 401) {
                    setError("Incorrect username or password. Please try again.")
                } else {
                    setError("An error occurred. Please try again later.")
                }
            }
        } catch (error) {
            setError("Network error. Please check your connection and try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <div className="welcome-message">
                <h2>Welcome to Course Explorer :)</h2>
                <p>Please log in to continue.</p>
            </div>
            <div className="form-group">
                <label htmlFor="netID" className="form-label">NetID</label>
                <input
                    type="text"
                    id="netID"
                    name="netID"
                    value={netID}
                    onChange={handleNetIDChange}
                    placeholder="Enter your NetID"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                    required
                />
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
            </button>
            <div className="signup-prompt">
                <span>Haven't got an account? Click </span>
                <a href="/signup">here</a>
                <span> to sign up.</span>
            </div>
        </form>
    )
}

export default Login