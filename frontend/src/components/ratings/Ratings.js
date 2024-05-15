import React, { useEffect, useState, useRef } from 'react'
import API_URLS from '../../config/config'
import { useLocation } from 'react-router-dom'
import './Ratings.css'

const Ratings = () => {
    const [userRating, setUserRating] = useState(null)
    const [otherRatings, setOtherRatings] = useState([])
    const [favorite, setFavorite] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [GPA, setGPA] = useState("Unknown")
    const netID = localStorage.getItem("netID")
    const ratingRef = useRef(null)
    const commentRef = useRef(null)
    const location = useLocation()
    const { Subject, Number, PrimaryInstructor } = location.state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(API_URLS.ratings, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ Subject, Number, PrimaryInstructor })
                })

                if (res.ok) {
                    const data = await res.json()
                    const foundUserRating = data.find(rating => rating.NetID === netID)
                    setUserRating(foundUserRating)
                    setOtherRatings(data.filter(rating => rating.NetID !== netID))
                } else {
                    throw new Error("Unable to fetch ratings data.")
                }

                const favoriteResponse = await fetch(API_URLS.favorites, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ netID })
                })
    
                if (favoriteResponse.ok) {
                    const favoriteData = await favoriteResponse.json()
                    // Check if the specific course is in the favorite data
                    for (let i = 0; i < favoriteData.length; i++) {
                        const course = favoriteData[i]
                        if (course.Subject === Subject && course.Number === Number && course.PrimaryInstructor === PrimaryInstructor) {
                            setFavorite(true)
                            break
                        }
                    }
                } else {
                    throw new Error("Unable to fetch favorite status.");
                }
                const GPAres = await fetch(API_URLS.getGPA, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        subject: Subject,
                        number: Number,
                        primaryInstructor: PrimaryInstructor
                    })
                })
                if (GPAres.ok) {
                    const GPAData = await GPAres.json()
                    if (GPAData.GPA >= 0) setGPA(GPAData.GPA)
                } else {
                    throw new Error("Failed to get GPA.")
                }
            } catch (err) {
                console.error(err)
            }
        }

        fetchData()
    }, [netID, Subject, Number, PrimaryInstructor])

    const handleSubmit = async () => {
        setError("")
        setSuccess("") // Clear previous success message

        if (!commentRef.current.value.trim()) {
            setError("Comments cannot be empty.")
            return
        }

        try {
            const res = await fetch(API_URLS.updateRating, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    netID,
                    subject: Subject,
                    number: Number,
                    primaryInstructor: PrimaryInstructor,
                    rating: ratingRef.current.value,
                    comments: commentRef.current.value,
                })
            })

            if (res.ok) {
                if (!userRating) {
                    setSuccess("Rating successfully added!")
                } else {
                    setSuccess("Rating successfully updated!")
                }
                const updatedUserRating = {
                    ...userRating,
                    Rating: ratingRef.current.value,
                    Comments: commentRef.current.value,
                }
                setUserRating(updatedUserRating)

                setOtherRatings(prevRatings => prevRatings.map(r =>
                    r.NetID === netID ? updatedUserRating : r
                ))
            } else {
                throw new Error("Failed to submit rating.")
            }
        } catch (err) {
            setError(err.message)
            console.error(err)
        }
    }

    const handleDelete = async () => {
        setError("")
        setSuccess("")
        try {
            const res = await fetch(API_URLS.deleteRating, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    netID,
                    subject: Subject,
                    number: Number,
                    primaryInstructor: PrimaryInstructor,
                })
            })

            if (res.ok) {
                setUserRating(null)
                setOtherRatings(prevRatings => prevRatings.filter(r => r.NetID !== netID))

                setSuccess("Rating successfully deleted!")
            } else {
                throw new Error("Failed to delete rating.")
            }
        } catch (err) {
            setError(err.message)
            console.error(err)
        }
    }

    // Function to handle like or unlike
    const handleLike = async () => {
        setFavorite(!favorite)
        try {
            const res = await fetch(!favorite ? API_URLS.addFavorite : API_URLS.deleteFavorite, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    netID,
                    subject: Subject,
                    number: Number,
                    primaryInstructor: PrimaryInstructor,
                })
            })

            if (!res.ok) {
                throw new Error("Failed to update favorites status.")
            }
        } catch (err) {
            setError(err.message)
            console.error(err)
            // Revert like status on error
            setFavorite(!favorite)
        }
    }

    return (
        <div className="ratings-container">
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <h2 className="course-title">{Subject} {Number} - {PrimaryInstructor}</h2>
            <button className={`favorite-button ${favorite ? 'liked' : 'not-liked'}`} onClick={handleLike}>
                {favorite ? 'Unlike' : 'Like'}
            </button>
            <h3>Average GPA: {GPA}</h3>
            {userRating && (
                <div className="user-rating">
                    <h3>Your Rating:</h3>
                    <select className="rating-select" ref={ratingRef} defaultValue={userRating.Rating}>
                        {[0, 1, 2, 3, 4, 5].map(value => (
                            <option key={value} value={value}>{value}</option>
                        ))}
                    </select>
                    <textarea className="comment-input" ref={commentRef} defaultValue={userRating.Comments} placeholder="Your comments"></textarea>
                    <button className="update-button" onClick={handleSubmit}>Update</button>
                    <button className="delete-button" onClick={handleDelete}>Delete</button>
                </div>
            )}
            {otherRatings.map((rating, index) => (
                <div className="rating-item" key={index}>
                    <h3>{`${rating.firstName} ${rating.lastName}`}'s Rating:</h3>
                    <p>Rating: {rating.Rating} - {rating.Comments}</p>
                </div>
            ))}
            {!userRating && (
                <div className="add-rating">
                    <h3>Add Your Rating:</h3>
                    <select className="rating-select" ref={ratingRef}>
                        {[0, 1, 2, 3, 4, 5].map(value => (
                            <option key={value} value={value}>{value}</option>
                        ))}
                    </select>
                    <textarea className="comment-input" ref={commentRef} placeholder="Enter your comments"></textarea>
                    <button className="submit-button" onClick={handleSubmit}>Submit</button>
                </div>
            )}
        </div>
    )
}

export default Ratings