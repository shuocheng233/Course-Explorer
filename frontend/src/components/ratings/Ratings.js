import React, { useEffect, useState, useRef } from 'react'
import API_URLS from '../../config/config'
import { useLocation } from 'react-router-dom'

const Ratings = () => {
    const [ratings, setRatings] = useState([])
    const [favorite, setFavorite] = useState(false)
    const [error, setError] = useState("")
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
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].NetID === netID) {
                            setFavorite(true)
                            break
                        }
                    }
                } else {
                    throw new Error("Unable to fetch ratings data.")
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
        <div>
            {error && <p>{error}</p>}
            <h2>{Subject} {Number} - {PrimaryInstructor}</h2>
            <button onClick={handleLike}>{favorite ? 'Unlike' : 'Like'}</button>
            {userRating && (
                <div key={userRating.NetID}>
                    <h3>Your Rating:</h3>
                    <input ref={ratingRef} defaultValue={userRating.Rating} type="number" placeholder="Your rating" />
                    <textarea ref={commentRef} defaultValue={userRating.Comments} placeholder="Your comments"></textarea>
                    <button onClick={() => handleSubmit()}>Update</button>
                    <button onClick={() => handleDelete()}>Delete</button>
                </div>
            )}
            {otherRatings.map(rating => (
                <div key={rating.id}>
                    <h3>{rating.PrimaryInstructor}'s Rating:</h3>
                    <p>Rating: {rating.Rating} - {rating.Comments}</p>
                </div>
            ))}
            {!userRating && (
                <div>
                    <h3>Add Your Rating:</h3>
                    <input type="number" ref={ratingRef} placeholder="Enter your rating" />
                    <textarea ref={commentRef} placeholder="Enter your comments"></textarea>
                    <button onClick={() => handleSubmit()}>Submit</button>
                </div>
            )}
        </div>
    )
}

export default Ratings