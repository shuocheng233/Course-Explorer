import React from 'react'
import { Link } from 'react-router-dom'
import './SectionCard.css'

const FavoriteCard = ({ Subject, Number, PrimaryInstructor }) => {
    return (
        <Link to="/ratings" state={{ Subject, Number, PrimaryInstructor }} style={{ textDecoration: 'none' }}>
            <div className="section-card">
                <div className="section-code">{`${Subject} ${Number}`}</div>
                <div className="section-title">{PrimaryInstructor}</div>
            </div>
        </Link>
    )
}

export default FavoriteCard