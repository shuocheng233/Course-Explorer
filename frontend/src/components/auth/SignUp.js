import React, { useState, useRef } from 'react'
import API_URLS from '../../config/config'
import { useNavigate } from 'react-router-dom'
import './AuthPage.css'

const SignUp = () => {
    const firstNameRef = useRef(null)
    const lastNameRef = useRef(null)
    const netIDRef = useRef(null)
    const passwordRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const nameRegex = /^(?=.{1,20}$)[A-Za-z\s'-]+$/
    const netIDRegex = /^(?=.{3,50}$)[a-z]{2,}\d+$/
    const passwordRegex = /[A-Za-z\d!@#$%^&*()_+-=?]{3,100}/

    const handleSubmit = async(e) => {
        e.preventDefault()
        const firstName = firstNameRef.current.value.trim()
        const lastName = lastNameRef.current.value.trim()
        const netID = netIDRef.current.value
        const password = passwordRef.current.value

        if (!nameRegex.test(firstName.trim())) {
            setError("Invalid first name format.")
            return
        }
        
        if (!nameRegex.test(lastName.trim())) {
            setError("Invalid last name format.")
            return
        }

        if (!netIDRegex.test(netID)) {
            setError("Invalid NetID format.")
            return
        }

        if (!passwordRegex.test(password)) {
            setError("Invalid password format.")
            return
        }

        setLoading(true)

        try {
            const res = await fetch(API_URLS.signup, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ netID, password, firstName, lastName })
            })
            const data = await res.text()
            
            if (res.ok) {
                // assume the user has been added to the database successfully
                // store the user data in localStorage
                // navigate to the dashboard upon successful registration
                setError("")
                localStorage.setItem('netID', netID)
                localStorage.setItem('firstName', firstName)
                localStorage.setItem('lastName', lastName)
                navigate('/home')
            } else {
                setError(data.message)
            }
        } catch (error) {
            setError("Network error. Please check your connection and try again.")
        } finally {
            setLoading(false)
        }
    }

  return (
        <form className="signup-form" onSubmit={handleSubmit}>
            <h1>Welcome to Course Explorer :)</h1>
            <h2>Sign Up</h2>
            <div className="form-group">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    ref={firstNameRef}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    ref={lastNameRef}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="netID" className="form-label">NetID</label>
                <input
                    type="text"
                    id="netID"
                    name="netID"
                    ref={netIDRef}
                    required
                />
                <small>NetID can only include lowercase letters and digits.</small>
            </div>
            <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    ref={passwordRef}
                    required
                />
                <small>Password must be 3-100 characters long and can include special characters.</small>
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Processing...' : 'Sign Up'}
            </button>
        </form>
  )
}

export default SignUp