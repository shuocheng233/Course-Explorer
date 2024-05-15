import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import './SectionInfo.css'

const getFullTermName = (termCode) => {
    switch (termCode) {
        case 'fa': return 'Fall';
        case 'sp': return 'Spring';
        case 'su': return 'Summer';
        case 'wi': return 'Winter';
        default: return termCode;
    }
}

const SectionInfo = () => {
    const location = useLocation()
    const { section } = location.state
    const [year, termCode] = section.YearTerm.split('-')
    const fullTermName = getFullTermName(termCode)

    return (
        <div className='section-info-container'>
            <div className='section-header'>
                <h1>{section.Subject + ' ' + section.Number} - {section.CourseTitle}</h1>
                <h3>{year + ' ' + fullTermName}</h3>
            </div>
            <div className="section-details">
                <div className='left-box'>
                    <p><span className="label">Description</span><span className="value">{section.Description}</span></p>
                    <p><span className='label'>Credit Hours</span><span className="value">{section.CreditHours}</span></p>
                    <p><span className="label">CRN</span><span className="value">{section.CRN}</span></p>
                    <p><span className="label">Type</span><span className="value">{section.Type}</span></p>
                    <p><span className="label">Section</span><span className="value">{section.Section}</span></p>
                    
                </div>
                <div className='right-box'>
                    <p><span className="label">Section Info</span><span className="value">{section.SectionInfo}</span></p>
                    <p><span className="label">Primary Instructor</span><Link to="/ratings" state={{ ...section }} className="value">
                    {section.PrimaryInstructor} </Link></p>
                    <p><span className="label">Enrollment Status</span><span className="value">{section.EnrollmentStatus}</span></p>
                    <p><span className="label">Part of Term</span><span className="value">{section.PartofTerm}</span></p>
                    
                    <p><span className="label">Time</span><span className="value">{section.StartTime} {section.EndTime ? `- ${section.EndTime}` : ''}</span></p>
                    <p><span className="label">Days</span><span className="value">{section.DaysofWeek ? section.DaysofWeek : 'N/A'}</span></p>
                    <p className="location-flex"><span className="label">Location</span><span className="value">{section.Room ? `${section.Room}, ${section.Building}` : 'N/A'}</span></p>
                </div>
            </div>
        </div>
    )
}

export default SectionInfo