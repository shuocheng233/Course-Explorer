import React from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    const navigate = useNavigate()

    return (
        <button className="home-button" onClick={() => navigate('/users')} >Get Subject Info</button>
    )
}

export default HomePage