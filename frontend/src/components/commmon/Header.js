import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = () => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [username, setUsername] = useState("");

    let content
    useEffect(() => {
        const firstName = localStorage.getItem('firstName');
        const lastName = localStorage.getItem('lastName');
        if (firstName && lastName) {
            setUsername(`${firstName} ${lastName}`);
        }
    }, []);

    const toggleDropdown = () => {
        setIsDropdownVisible(prev => !prev);
    };

    return (
        <header className='header'>
            <h2 className='title'>Course Explorer</h2>
            <button className='user' onClick={toggleDropdown} aria-expanded={isDropdownVisible}>
                <FontAwesomeIcon icon={faUser} /> {username || 'Guest'}
                {isDropdownVisible && (
                    <div className='dropdown'>
                        <button>My Favorite Courses</button>
                        <button>Logout</button>
                    </div>
                )}
            </button>
        </header>
    );
}

export default Header;