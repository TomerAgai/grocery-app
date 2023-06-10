import React, { useEffect, useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton } from '@ionic/react';
import { getGroceryLists, createGroceryList, logoutUser } from '../api';  // <-- Import logoutUser
import GroceryList from '../components/ GroceryList';
import { useHistory } from 'react-router-dom';  // <-- Import useHistory

interface List {
  id: number;
  name: string;
  creator: number;
  users: number[];
}
interface HomeProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
}


const Home: React.FC<HomeProps> = ({ setIsAuthenticated }) => {
  const [lists, setLists] = useState<List[]>([]);
  const history = useHistory();  // <-- Initialize history

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

  const handleLogout = () => {
    logoutUser().then(() => {
      localStorage.removeItem('token');  // Remove the token from local storage
      setIsAuthenticated(false);  // Set isAuthenticated state to false
      history.push('/login');
    });
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
          <IonButton onClick={handleLogout}>Logout</IonButton>  {/* <-- Add logout button */}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
