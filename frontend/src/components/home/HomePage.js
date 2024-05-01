import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { extractInfo } from './helpers'
import './HomePage.css'

const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [filter, setFilter] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleFilterChange = (e) => {
        setFilter(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // section format: { year, term, number, subject }
        const section = extractInfo(searchTerm)

        // Filter out null or undefined values
        const cleanSection = Object.fromEntries(
            Object.entries(section).filter(([key, value]) => value != null)
        )

        const queryParams = new URLSearchParams(cleanSection).toString()
        
        if (queryParams) {
            navigate(`/sections?${queryParams}`)
        } else {
            setError("No valid data to search. Please check your input and try again.")
        }
    }

    const handleRankingSubmit = async (e) => {
        e.preventDefault()

        const filters = new URLSearchParams(filter).toString()
        
        if (filters) {
            navigate(`/rankings?${filters}`)
        } else {
            setError("No valid data to search. Please check your input and try again.")
        }
    }

    return (
        <div>
            <div className="homepage-container">
                <form onSubmit={handleSubmit} className="homepage-form">
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Browse For Courses"
                        value={searchTerm}
                        onChange={handleSearchTermChange}
                        className="homepage-input"
                        aria-describedby="searchHelp"
                    />
                    <button type="submit" className="homepage-button">Search</button>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>
            <div className="rankings-container">
                <form onSubmit={handleRankingSubmit} className="homepage-form">
                    <input
                        type="text"
                        name="ranking"
                        id="ranking"
                        placeholder="Filter By ('GPA' or 'Rating')"
                        value={filter}
                        onChange={handleFilterChange}
                        className="homepage-input"
                        aria-describedby="searchHelp"
                    />
                    <button type="submit" className="homepage-button">See Best Courses</button>
                </form>
            </div>
        </div>
    )
}

export default HomePage