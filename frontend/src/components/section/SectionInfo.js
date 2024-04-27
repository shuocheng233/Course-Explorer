import React from 'react'
import { useLocation } from 'react-router-dom'
import './SectionInfo.css'

const SectionInfo = ({ section }) => {
    return (
        <div className='section-info-container'>
            <div className='section-header'>
                <h1>{section.Subject + ' ' + section.number} - {section.CourseTitle}</h1>
                <h3>{section.YearTerm}</h3>
            </div>
            <div className="section-details">
                <div className='left-box'>
                    <p><span className='label'>Credit Hours</span><span className="value">{section.CreditHours}</span></p>
                    <p><span className="label">Description</span><span className="value">{section.Description}</span></p>
                    <p><span className="label">Part of Term</span><span className="value">{section.PartofTerm}</span></p>
                    <p><span className="label">Enrollment Status</span><span className="value">{section.EnrollmentStatus}</span></p>
                    <p><span className="label">Primary Instructor</span><span className="value"><a href={`mailto:${section.PrimaryInstructorEmail}`}>{section.PrimaryInstructor}</a></span></p>
                </div>
                <div className="right-box">
                    <p><span className="label">Section Info</span><span className="value">{section.SectionInfo}</span></p>
                    <p><span className="label">Degree Attributes</span><span className="value">{section.DegreeAttributes}</span></p>
                    <p><span className="label">Schedule Information</span><span className="value">{section.ScheduleInformation}</span></p>
                    <p><span className="label">Time</span><span className="value">{section.StartTime} - {section.EndTime}</span></p>
                    <p><span className="label">Days</span><span className="value">{section.DaysofWeek}</span></p>
                    <p><span className="label">Location</span><span className="value">{section.Room}, {section.Building}</span></p>
                </div>
            </div>
        </div>
    )
}

export default SectionInfo