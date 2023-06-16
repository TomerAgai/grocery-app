import React, { useState } from 'react';
import { IonInput, IonButton, IonLabel, IonRouterLink, IonFab, IonFabButton } from '@ionic/react';
import { loginUser } from '../api'; // Import loginUser function
import { useHistory } from 'react-router-dom';
import './LoginForm.css';

interface LoginFormProps {
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const LoginForm: React.FC<LoginFormProps> = ({ setIsAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Add this line
    const history = useHistory();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await loginUser({ username: username, password: password });
            if (response.status === 200) {
                console.log(response.data.token);
                localStorage.setItem('token', response.data.token); // assuming the token is in the 'token' property of the response data
                setIsAuthenticated(true);  // <--- Set isAuthenticated state
                history.push('/home');
            } else {
                setError('Invalid username or password'); // set the error message
            }
        } catch (error) {
            setError('Invalid username or password'); // set the error message
        }
    };

    const goToRegister = () => { // Add this function
        history.push('/register');
    }

    return (
        <div className="login-form-container">
            <form onSubmit={handleSubmit}>
                <IonInput
                    value={username}
                    onIonChange={event => setUsername(event.detail.value!)}
                    placeholder="Enter Username"
                />
                <IonInput
                    value={password}
                    onIonChange={event => setPassword(event.detail.value!)}
                    placeholder="Enter Password"
                    type="password"
                />
                {error && <IonLabel color="danger">{error}</IonLabel>} {/* Display error message */}
                <IonButton color="primary" expand="full" type="submit">Login</IonButton>
                <p>
                    Don't have an account? <IonRouterLink className='register' onClick={goToRegister}>Register here</IonRouterLink>
                </p>
            </form>
        </div>
    );
}

export default LoginForm;
