import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { extractInfo } from './helpers'

const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value)
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

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Browse For Sections"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    aria-describedby="searchHelp"
                />
                <button type="submit">Search</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    )
}

export default HomePage