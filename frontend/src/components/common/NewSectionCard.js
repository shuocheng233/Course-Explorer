import React from 'react'
import './NewSectionCard.css'

const NewSectionCard = ({ Subject, Number, YearTerm, PrimaryInstructor, NumberOfFavorite, AverageRating }) => {
    return (
        <div className="new-section-card">
            <div className="new-section-info">
                <div className="new-section-code">{`${Subject} ${Number}`}</div>
                <div className="new-section-yearTerm">{YearTerm}</div>
            </div>
            <div className="new-section-details">
                <div className="new-section-title">Primary Instructor: {PrimaryInstructor}</div>
                <div className="new-section-favorites">Number of Favorites: {NumberOfFavorite}</div>
                <div className="new-section-rating">Average Rating: {AverageRating}</div>
            </div>
        </div>
    )
}

export default NewSectionCard