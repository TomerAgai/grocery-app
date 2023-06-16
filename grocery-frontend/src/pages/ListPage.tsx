import React, { useEffect, useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton, IonCard, IonCardContent } from '@ionic/react';
import ItemList from '../components/ItemList';
import ItemForm from '../components/ItemForm';
import ComparePricesButton from '../components/ComparePrice';
import { getGroceryItemsForList } from '../api';
import { useParams, useHistory } from 'react-router-dom';
import './ListPage.css'

interface Item {
    id: number;
    name: string;
}

const ListPage: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const { id } = useParams<{ id: string }>();
    const history = useHistory();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        getGroceryItemsForList(parseInt(id)).then(response => setItems(response.data));
    };

    const handleGoBack = () => {
        history.goBack();
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Grocery List</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="listPage-ion-content">
                <div className='div' slot="fixed">
                    <IonButton className="IonButton" expand="full" onClick={handleGoBack}>Go Back</IonButton>
                    <ItemForm onItemAdded={fetchItems} listId={parseInt(id)} />
                    <ItemList items={items} onItemRemoved={fetchItems} />
                    <ComparePricesButton listId={parseInt(id)} />
                    <IonButton className="IonButton" expand="full" onClick={handleGoBack}>Go Back</IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ListPage;
