import React, { useEffect, useState, useRef } from 'react'
import API_URLS from '../../config/config'
import { useLocation } from 'react-router-dom'
import './Ratings.css'

const Ratings = () => {
    const [ratings, setRatings] = useState([])
    const [favorite, setFavorite] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [deleteSuccess, setDeleteSuccess] = useState("")
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
                    setRatings(data)
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
            } catch (err) {
                setError(err.message)
                console.error(err)
            }
        }

        fetchData()
    }, [Subject, Number, PrimaryInstructor])

    // Function to handle user rating submission or update
    const handleSubmit = async () => {
        setError("")
        setSuccess("") // Clear previous success message
        setDeleteSuccess("") // Clear previous success message
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
                setRatings(ratings.map(rating =>
                    rating.NetID === netID ? {
                        ...rating,
                        Rating: ratingRef.current.value,
                        Comments: commentRef.current.value,
                    } : rating
                ))
                setSuccess("Rating successfully added or updated!")
            } else {
                throw new Error("Failed to submit rating.")
            }
        } catch (err) {
            setError(err.message)
            console.error(err)
        }
    }

    // Function to handle deletion of a rating
    const handleDelete = async () => {
        setError("")
        setSuccess("")
        setDeleteSuccess("")
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
                const remainingRatings = ratings.filter(rating => rating.NetID !== netID)
                setRatings(remainingRatings)
                setDeleteSuccess("Rating successfully deleted!")
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

    const userRating = ratings.find(rating => rating.NetID === netID)
    const otherRatings = ratings.filter(rating => rating.NetID !== netID)

    return (
        <div className="ratings-container">
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            {deleteSuccess && <p className="delete-success">{deleteSuccess}</p>}
            <h2 className="course-title">{Subject} {Number} - {PrimaryInstructor}</h2>
            <button className={`favorite-button ${favorite ? 'liked' : 'not-liked'}`} onClick={handleLike}>
                {favorite ? 'Unlike' : 'Like'}
            </button>
            {userRating && (
                <div className="user-rating">
                    <h3>Your Rating:</h3>
                    <select className="rating-select" ref={ratingRef} defaultValue={userRating.Rating}>
                        {[...Array(6).keys()].map(value => (
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
                        {[...Array(6).keys()].map(value => (
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