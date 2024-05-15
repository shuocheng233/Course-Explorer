import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SectionCard from '../common/SectionCard'
import API_URLS from '../../config/config'
import './Sections.css'

const Sections = () => {
    const { search } = useLocation()
    const searchParams = new URLSearchParams(search)
    const [sectionData, setSectionData] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const term = searchParams.get('term')
    const subject = searchParams.get('subject')
    const year = parseInt(searchParams.get('year'), 10)
    const number = parseInt(searchParams.get('number'), 10)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            let obj = { term, subject, year, number }
            Object.keys(obj).forEach(key => {
                if (!obj[key]) delete obj[key]
            })
    
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
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [term, subject, year, number])

    return (
        <div className="sections-container">
            <h1 className="sections-title">Section Information</h1>
            {loading ? (
                <p className="loading-message">Loading...</p>
            ) : (
                <>
                    {error && <p className="error-message">{error}</p>}
                    {sectionData && sectionData.length > 0 ? (
                        <ul className="sections-list">
                            {sectionData.map((section, index) => (
                                <li key={index} className="sections-list-item">
                                    <SectionCard {...section} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        !error && <p className="no-data">No data found</p>
                    )}
                </>
            )}
        </div>
    )
}

export default Sections