import React, { useEffect, useState } from 'react'
import API_URLS from '../../config/config'
import { Link } from 'react-router-dom'

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
        <div>
            <h1>Favorite Courses</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {courseList.map((course, index) => {
                    return (
                        <li key={index}>
                            <Link to={'/ratings'}
                                state={{ ...course }}
                            >
                                {course.Subject} {course.Number} - {course.PrimaryInstructor}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}

export default Favorites