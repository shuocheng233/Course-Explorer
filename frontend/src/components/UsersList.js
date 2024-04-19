import React, { useEffect, useState } from 'react'

const UsersList = ({ url }) => {
    // state for users, loading status and errors
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const res = await fetch(url)
                const data = await res.json()
                console.log(data)
                setLoading(false)
                setUsers(data)
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        }

        fetchAllUsers()
    }, [url]) // refetch data when url changes

    // render loading, error or users data based on the state
    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    if (error) {
        return (
            <div>Error: {error}</div>
        )
    }

    // if (!users.length) {
    //     return (
    //         <div>Sorry, the cupboard is bare!</div>
    //     )
    // } else {
        return (
            <div>
                <ul>
                    {users.map((dict) => {
                      return <li>{dict["subject"]}, {dict["courses"]}, {dict["average"]}, {dict["favorite"]}</li>
                    })}
                </ul>
            </div>
        )
    // }
}

export default UsersList