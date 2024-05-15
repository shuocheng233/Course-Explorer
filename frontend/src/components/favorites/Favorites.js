import React, { useEffect, useState } from 'react'
import API_URLS from '../../config/config'
import FavoriteCard from '../common/FavoriteCard'
import './Favorites.css'

const Favorites = () => {
    const [courseList, setCourseList] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            const netID = localStorage.getItem('netID')

            try {
                const res = await fetch(API_URLS.favorites, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ netID })
                })

                if (res.ok) {
                    const data = await res.json()
                    setCourseList(data)
                } else {
                    throw new Error("Unable to fetch favorites data.")
                }
            } catch (err) {
                setError(err.message)
                console.error(err)
            }
        }

        fetchData()
        
    }, [])

    return (
        <div className="favorites-container">
            <h1 className="favorites-title">My Favorite Courses</h1>
            {error && <p className="errorMessage">{error}</p>}
            {courseList.length > 0 ? (
                <ul className="favorites-list">
                    {courseList.map((course, index) => (
                        <li key={index} className="favorites-listItem">
                            <FavoriteCard {...course} />
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-data">No data found</p>
            )}
        </div>
    )
}

export default Favorites