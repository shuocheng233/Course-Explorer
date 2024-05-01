import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import API_URLS from '../../config/config'
import './Header.css'

const Header = () => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false)
    const [username, setUsername] = useState("Guest")
    const navigate = useNavigate()

    let content
    useEffect(() => {
        const firstName = localStorage.getItem('firstName')
        const lastName = localStorage.getItem('lastName')
        if (firstName && lastName) {
            setUsername(`${firstName} ${lastName}`)
        }
    }, [])

    const toggleDropdown = () => {
        setIsDropdownVisible(prev => !prev)
    }

    const logout = () => {
        localStorage.removeItem('netID')
        localStorage.removeItem('firstName')
        localStorage.removeItem('lastName')
        fetch(API_URLS.logout)
        navigate('/login')
    }

    return (
        <header className='header'>
            <a href="/home" className='title'>Course Explorer</a>
            <button className='user' onClick={toggleDropdown} aria-expanded={isDropdownVisible}>
                <FontAwesomeIcon icon={faUser} /> {username || 'Guest'}
                {isDropdownVisible && (
                    <div className='dropdown'>
                        <button onClick={() => navigate('/favorites')}>My Favorite Courses</button>
                        <button onClick={logout}>Logout</button>
                    </div>
                )}
            </button>
        </header>
    )
}

export default Header