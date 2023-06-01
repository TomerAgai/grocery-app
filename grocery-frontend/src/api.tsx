import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

interface GroceryItem {
    name: string;
}

export const getGroceryItems = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token');
    }
    return await axios.get(`${BASE_URL}/grocery_items/`, {
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    });
}

export const createGroceryItem = (item: { name: string, quantity: number, user: string }) =>
    axios.post(`${BASE_URL}/grocery_items/`, item, {
        headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });

export const removeGroceryItem = (id: number) => {
    return axios.delete(`${BASE_URL}/grocery_items/${id}/`, {
        headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });
}


export const registerUser = (user: { username: string, password: string }) => {
    return axios.post(`${BASE_URL}/api/register/`, user);
}

export const loginUser = (user: { username: string, password: string }) => {
    return axios.post(`${BASE_URL}/api/login/`, user);
}
