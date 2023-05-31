import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

interface GroceryItem {
    name: string;
}

export const getGroceryItems = async () => {
    return await axios.get(`${BASE_URL}/grocery_items/`);
}

export const createGroceryItem = (item: { name: string, quantity: number, user: string }) =>
    axios.post(`${BASE_URL}/grocery_items/`, item);

export const removeGroceryItem = (id: number) => {
    return axios.delete(`${BASE_URL}/grocery_items/${id}/`);
}

