import React, { useEffect, useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton } from '@ionic/react';
import { getGroceryLists, createGroceryList } from '../api';
import GroceryList from '../components/ GroceryList';

interface List {
  id: number;
  name: string;
  creator: number;
  users: number[];
}

const Home: React.FC = () => {
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = () => {
    getGroceryLists().then(response => setLists(response.data));
  };

  const handleCreateList = () => {
    const listName = window.prompt('Enter the name for the new list');
    if (listName) {
      createGroceryList({ name: listName }).then(fetchLists);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Grocery Lists</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div slot="fixed">
          <IonButton onClick={handleCreateList}>Create New List</IonButton>
          {lists.map(list => (
            <GroceryList list={list} key={list.id} onListUpdated={fetchLists} />
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
