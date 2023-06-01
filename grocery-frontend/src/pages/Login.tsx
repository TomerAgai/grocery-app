import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage } from '@ionic/react';
import LoginForm from '../components/LoginForm';

const Login: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div slot="fixed">
                    <LoginForm />
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;
