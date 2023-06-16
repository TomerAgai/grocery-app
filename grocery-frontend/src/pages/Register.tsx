import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton } from '@ionic/react';
import RegistrationForm from '../components/RegistrationForm';
import { useHistory } from 'react-router-dom';



const Register: React.FC = () => {
    const history = useHistory();

    const handleGoBack = () => {
        history.goBack();
    };
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
                    <IonButton expand="full" onClick={handleGoBack}>Go Back</IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Register;
