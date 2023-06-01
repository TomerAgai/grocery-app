import React, { useState } from 'react';
import { IonInput, IonButton } from '@ionic/react';
import { registerUser } from '../api'; // Import registerUser function
import { useHistory } from 'react-router-dom';


interface RegistrationFormProps {
}

const RegistrationForm: React.FC<RegistrationFormProps> = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const history = useHistory();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        registerUser({ username: username, password: password }).then(() => {
            setUsername('');
            setPassword('');
            history.push('/login');
        }).catch(error => {
            console.log("fehfe");
        });
    };


    return (
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
            <IonButton expand="full" type="submit">Register</IonButton>
        </form>
    );
}

export default RegistrationForm;
