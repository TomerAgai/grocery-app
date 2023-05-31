import React, { useEffect, useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage } from '@ionic/react';
import ItemList from '../components/ItemList';
import ItemForm from '../components/ItemForm';
import { getGroceryItems } from '../api';

interface Item {
  id: number;
  name: string;
}

const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    getGroceryItems().then(response => setItems(response.data));
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
          <ItemForm onItemAdded={fetchItems} />
          <ItemList items={items} onItemRemoved={fetchItems} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
