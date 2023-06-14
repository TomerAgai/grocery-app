import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

interface GroceryItem {
    name: string;
}
// api.tsx
export const getGroceryItemsForList = async (listId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token');
    }
    return await axios.get(`${BASE_URL}/grocery_items/?list_id=${listId}`, {
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
        },
    });
};



export const createGroceryItem = (listId: number, item: { name: string, quantity: number, user: string }) =>
    axios.post(`${BASE_URL}/grocery_items/`, { ...item, list: listId }, {
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
    return axios.post(`${BASE_URL}/api/login/`, user)
        .then(response => {
            localStorage.setItem('token', response.data.token); // Store the token in localStorage
            return response;
        });
}

export const logoutUser = () => {
    return axios.post(`${BASE_URL}/api/logout/`, {})
        .then(() => {
            localStorage.removeItem('token'); // Remove the token from localStorage
        });
}



export const getGroceryLists = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token');
    }
    return await axios.get(`${BASE_URL}/grocery_lists/`, {
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

export const createGroceryList = async (list: { name: string }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token');
    }
    return await axios.post(`${BASE_URL}/grocery_lists/`, list, {
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};


export const shareGroceryList = (listId: number, username: string) => {
    return axios.post(
        `${BASE_URL}/grocery_lists/${listId}/share/`,
        { username: username },  // change user_id to username
        {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        }
    );
};


export const deleteGroceryList = (listId: number) => {
    return axios.delete(`${BASE_URL}/grocery_lists/${listId}/`, {
        headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.data);
};

export const comparePrices = (listId: number) => {
    return axios.post(
        `${BASE_URL}/compare_prices/`,
        { list_id: listId },
        {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        }
    );
};



