const baseURL = 'https://cs411-cs411114.uc.r.appspot.com/api'

const API_URLS = {
    login: `${baseURL}/login`, // Endpoint for user login requests
    signup: `${baseURL}/signup`, // Endpoint for user sign up requests
    logout: `${baseURL}/logout`, // Endpoint for user logout requests
    section: `${baseURL}/getSections`, // Endpoint for getting a specific section
    favorites: `${baseURL}/showFavorite`, // Endpoint for getting user favorite courses
    ratings: `${baseURL}/showRatings`, // body: JSON.stringify({ Subject, Number, PrimaryInstructor })
    updateRating: `${baseURL}/updateRating`, // Endpoint for updating a rating
    deleteRating: `${baseURL}/deleteRating`, // Endpoint for deleting a rating
    addFavorite: `${baseURL}/addFavorite`, // Endpoint for adding a favorite course
    deleteFavorite: `${baseURL}/deleteFavorite`, // Endpoint for deleting a favorite course
    getRankings: `${baseURL}/getRankings`, //Get course rankings using stored procedure
    getGPA: `${baseURL}/getGPA`
}

export default API_URLS