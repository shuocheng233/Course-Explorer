import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import API_URLS from '../../config/config'

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
        if (term) {
            obj.term = term
        }
        if (subject) {
            obj.subject = subject
        }
        if (year) {
            obj.year = year
        }
        if (number) {
            obj.nuber = number
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
        <div>
            <h1>Section Information</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {sectionData ? (
                <ul>
                    {sectionData.map((section, index) => (
                        <Link to={{
                            pathname: "/sectionInfo",
                            state: { section }
                        }} key={index}>
                            <li key={index}>
                                Year: {section.year}, Term: {section.term}, Course Number: {section.number},
                                Subject: {section.subject}, Primary Instructor: {section.primaryInstructor}
                            </li>
                        </Link>
                    ))}
                </ul>
            ) : (
                <p>No data found</p>
            )}
        </div>
    )
}

export default Sections