

// NOT FINISHED YET





import React from 'react'

const Sections = () => {
    useEffect(() => {

    })

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
            <h1>Section Information</h1>
            {sectionData ? (
                <ul>
                    {sectionData.map((section, index) => (
                        <li key={index}>
                            Year: {section.year}, Term: {section.term}, Course Number: {section.number},
                            Subject: {section.subject}, Primary Instructor: {section.PrimaryInstructor}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No data found</p>
            )}
        </div>
    )
}

export default Sections