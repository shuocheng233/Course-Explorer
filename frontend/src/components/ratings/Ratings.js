


// Not Finished Yet




import React, { useEffect, useRef, useState } from 'react'
import API_URLS from '../../config/config'

const Ratings = ({ Subject, Number, PrimaryInstructor }) => {
    const [ratings, setRatings] = useState([])
    const [error, setError] = useState("")
    const commentRef = useRef(null)
    const ratingRef = useRef(null)
    const netID = localStorage.getItem('netID')

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
            } catch (err) {
                setError(err.message)
                console.error(err)
            }
        }

        fetchData()
    }, [Subject, Number, PrimaryInstructor])
    return (
        <div>
        {error && <p>{error}</p>}
        <h2>{Subject} {Number} - {PrimaryInstructor}</h2>
        {ratings.map(rating => (
            <div key={rating.id}>
                <h3>{rating.NetID === netID ? "Your Rating:" : `${rating.PrimaryInstructor}'s Rating:`}</h3>
                {rating.NetID === netID ? (
                    <>
                        <div>
                            <label>
                                Your Rating:
                                <input
                                    type="number"
                                    min="0"
                                    max="5"
                                    ref={ratingRef} // Attach the ref to the input
                                    defaultValue={rating.Rating}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Your Comments:
                                <textarea
                                    ref={commentRef} // Attach the ref to the textarea
                                    defaultValue={rating.Comments}
                                />
                            </label>
                        </div>
                        <button onClick={() => handleSubmit(rating.id)}>
                            Submit Changes
                        </button>
                    </>
                ) : (
                    <p>Rating: {rating.Rating} - {rating.Comments}</p>
                )}
            </div>
        ))}
    </div>
);
};

export default Ratings