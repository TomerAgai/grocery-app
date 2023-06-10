// ListPage.tsx
import React, { useEffect, useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton } from '@ionic/react';
import ItemList from '../components/ItemList';
import ItemForm from '../components/ItemForm';
import ComparePricesButton from '../components/ComparePrice';
import { getGroceryItemsForList } from '../api';
import { useParams, useHistory } from 'react-router-dom'; // <-- Import useHistory

interface Item {
    id: number;
    name: string;
}

const ListPage: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const { id } = useParams<{ id: string }>();
    const history = useHistory(); // <-- Initialize history

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        getGroceryItemsForList(parseInt(id)).then(response => setItems(response.data));
    };

    // Function to handle "Go Back" button click
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
            <IonContent>
                <div slot="fixed">
                    <ItemForm onItemAdded={fetchItems} listId={parseInt(id)} /> {/* Pass the listId here */}
                    <ItemList items={items} onItemRemoved={fetchItems} />
                    <ComparePricesButton listId={parseInt(id)} /> {/* Pass the listId here */}
                    <IonButton onClick={handleGoBack}>Go Back</IonButton> {/* Add the "Go Back" button */}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ListPage;
