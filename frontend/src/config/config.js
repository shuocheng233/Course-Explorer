const API_URLS = {
    login: 'http://127.0.0.1:5000/login', // Endpoint for user login requests
    signup: 'http://127.0.0.1:5000/signup', // Endpoint for user sign up requests
    logout: 'http://127.0.0.1:5000/logout', // Endpoint for user logout requests
    section: 'http://127.0.0.1:5000/getSections', // Endpoint for getting a specific section
    favorites: 'http://127.0.0.1:5000/showFavorite', // Endpoint for getting user favorite courses
    ratings: 'http://127.0.0.1:5000/showRatings', // body: JSON.stringify({ Subject, Number, PrimaryInstructor })
    updateRating: 'http://127.0.0.1:5000/updateRating', // Endpoint for updating a rating
    deleteRating: 'http://127.0.0.1:5000/deleteRating', // Endpoint for deleting a rating
    addFavorite: 'http://127.0.0.1:5000/addFavorite', // Endpoint for adding a favorite course
    deleteFavorite: 'http://127.0.0.1:5000/deleteFavorite', // Endpoint for deleting a favorite course
    getRankings: 'http://127.0.0.1:5000/getRankings', //Get course rankings using stored procedure
}

export default API_URLS