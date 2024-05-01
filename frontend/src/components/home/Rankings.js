import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
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
        <div>
            <h1>Course Rankings</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {rankings ? (
                <ul>
                    {rankings.map((section, index) => (
                        <li key={index}>
                            Primary Instructor: {section.PrimaryInstructor},
                            Subject: {section.Subject}, Course Number: {section.Number}, Number Of Favorites: {section.NumberOfFavorite},
                Average Rating: {section.AverageRating}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No data found</p>
            )}
        </div>
    )
}

export default Rankings