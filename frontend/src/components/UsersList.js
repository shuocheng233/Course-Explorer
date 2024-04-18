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
                setLoading(false)
                setUsers(data.message)
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

    if (!users.length) {
        return (
            <div>Sorry, the cupboard is bare!</div>
        )
    } else {
        return (
            <div>
                <ul>
                    {users.map((user, index) => {
                      <li key={index}>{user.name}: {user.email}</li>
                    })}
                </ul>
            </div>
        )
    }
}

export default UsersList