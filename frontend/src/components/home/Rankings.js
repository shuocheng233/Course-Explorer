import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import NewSectionCard from '../common/NewSectionCard'
import './Rankings.css'
import API_URLS from '../../config/config'

const Rankings = () => {
    const { location } = useLocation()
    const filterParams = new URLSearchParams(window.location.search)
    const keys = Array.from(filterParams.keys())
    const [rankings, setRankings] = useState(null)
    const [error, setError] = useState('')

    const fetchData = async () => {
        const filters = keys[0]
        let obj = {}
        if (filters === 'GPA' || filters === 'Rating')
            obj = {"FilterBy": filters}

        try {
            console.log(obj)
            const res = await fetch(API_URLS.getRankings, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            })
            if (res.ok) {
                const data = await res.json()
                setRankings(data)
            } else {
                throw new Error('Failed to fetch data')
            }
        } catch (error) {
            setError(error.message)
        }
    }

    useEffect(() => {
        fetchData()
    }, [location])

    return (
        <div className="course-rankings-container">
            <h1 className="course-rankings-title">Course Rankings</h1>
            {error && <p className="error-message">{error}</p>}
            {rankings ? (
                <div className="course-rankings-list">
                    {rankings.map((section, index) => (
                        <NewSectionCard
                            key={index}
                            Subject={section.Subject}
                            Number={section.Number}
                            YearTerm={section.YearTerm}
                            PrimaryInstructor={section.PrimaryInstructor}
                            NumberOfFavorite={section.NumberOfFavorite}
                            AverageRating={section.AverageRating}
                        />
                    ))}
                </div>
            ) : (
                <p className="no-data-message">No data found</p>
            )}
        </div>
    )
}

export default Rankings