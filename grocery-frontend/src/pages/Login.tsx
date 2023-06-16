import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage } from '@ionic/react';
import LoginForm from '../components/LoginForm';
import './Login.css'

interface LoginProps {
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Grocery App</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding login-ion-content">
                <div slot="fixed">
                    <LoginForm setIsAuthenticated={setIsAuthenticated} />
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;
