import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import SectionCard from '../common/SectionCard'
import API_URLS from '../../config/config'
import './Sections.css'

const Sections = () => {
    const { search } = useLocation()
    const searchParams = new URLSearchParams(search)
    const [sectionData, setSectionData] = useState(null)
    const [error, setError] = useState('')

    const fetchData = async () => {
        const term = searchParams.get('term')
        const subject = searchParams.get('subject')
        const year = parseInt(searchParams.get('year'), 10)
        const number = parseInt(searchParams.get('number'), 10)
        const obj = {}
        let count = 0
        if (term) {
            obj.term = term
            count++
        }
        if (subject) {
            obj.subject = subject
            count++
        }
        if (year) {
            obj.year = year
            count++
        }
        if (number) {
            obj.number = number
            count++
        }

        if (count < 2) {
            setError("Please enter at least two of term, year, subject and subject number")
            return
        }

        try {
            const res = await fetch(API_URLS.section, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            })
            if (res.ok) {
                const data = await res.json()
                setSectionData(data)
            } else {
                throw new Error('Failed to fetch data')
            }
        } catch (error) {
            setError(error.message)
        }
    }

    useEffect(() => {
        fetchData()
    }, [search])

    return (
        <div className="sections-container">
            <h1 className="sections-title">Section Information</h1>
            {error && <p className="error-message">{error}</p>}
            {sectionData ? (
                <ul className="sections-list">
                    {sectionData.map((section, index) => (
                        <li key={index} className="sections-list-item">
                            <SectionCard {...section} />
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-data">No data found</p>
            )}
        </div>
    )
}

export default Sections