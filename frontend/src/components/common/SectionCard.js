import React from 'react'
import { Link } from 'react-router-dom'
import './SectionCard.css'

const SectionCard = (section) => {
    const { Subject, Number, YearTerm, PrimaryInstructor } = section
    return (
        <Link to="/sectionInfo" state={{ section: { ...section }}} style={{ textDecoration: 'none' }}>
            <div className="section-card">
                <div className="section-code">{`${Subject} ${Number}`}</div>
                <div className="section-yearTerm">{YearTerm}</div>
                <div className="section-title">{PrimaryInstructor}</div>
            </div>
        </Link>
    )
}

export default SectionCard