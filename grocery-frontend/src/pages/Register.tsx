import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage } from '@ionic/react';
import RegistrationForm from '../components/RegistrationForm';

const Register: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Register</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div slot="fixed">
                    <RegistrationForm />
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Register;
