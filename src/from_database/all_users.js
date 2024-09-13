import axios from 'axios';

export const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('userToken'); // Get the token from localStorage

    // Make the API request with the Authorization header including the Bearer prefix
    const response = await axios.get('http://127.0.0.1:5000/users-data', {
      headers: {
        Authorization: `Bearer ${token}`  // Add 'Bearer ' before the token
      }
    });

    return response.data;
  } catch (err) {
    console.error('Error in fetchUsers:', err);  // Add this to catch any errors
    throw new Error('Failed to fetch users');
  }
};