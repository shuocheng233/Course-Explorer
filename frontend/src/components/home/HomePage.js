import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URLS from '../../config/config'

const HomePage = () => {
    const [sections, setSections] = useState([])
    const [selectedSubjects, setSelectedSubjects] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await fetch(API_URLS.getAllSubjects)
                if (res.ok) {
                    const data = await res.json()
                    setSubjects(data)
                    setSelectedSubjects(data)
                } else {
                    throw new Error("Unable to fetch subjects data.")
                }
            } catch (err) {
                setError(err.message)
                console.error(err)
            }
        }

        // select distinct subject
        // suppose the returned list if of the form [[],[],[],...]
        fetchSubjects()
    }, [])

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value)
    }

    // function for handling form submission
    // on submission, filter the result from subjects array
    // store the result in selectedSubjects
    const handleSubmit = (e) => {
        e.preventDefault()

        let arr  = []
        const keyword = searchTerm.trim().toLowerCase()
        for (let i = 0; i < subjects.length; i++) {
            const subject = subjects[i][0].trim().toLowerCase()
            const number = subjects[i][1].trim().toLowerCase()
            const title = subjects[i][2].trim().toLowerCase()
            const code = subject + number
            const codeSpaced = subject + ' ' + number
            
            if (subject.includes(keyword) || number.includes(keyword) || title.includes(keyword) ||
                code.includes(keyword) || codeSpaced.includes(keyword)) {
                arr.push(subjects[i])
            }
        }
        setSelectedSubjects(arr)
    }
    return (
        <div>
            <input
                type="text"
                name="search"
                id="search"
                placeholder="Browse Subjects"
            
            />
        </div>
    )
}

export default HomePage