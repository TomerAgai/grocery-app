import React from 'react';
import { IonItem, IonLabel, IonButton } from '@ionic/react';
import { shareGroceryList, deleteGroceryList } from '../api';
import { Link } from 'react-router-dom';
import './GroceryList.css';

interface GroceryListProps {
    list: {
        id: number;
        name: string;
        creator: number;
        users: number[];
    };
    onListUpdated: () => void;
}

const GroceryList: React.FC<GroceryListProps> = ({ list, onListUpdated }) => {
    const handleShare = (event: React.MouseEvent) => {
        event.preventDefault();
        const username = window.prompt('Enter the username of the user to share this list with');
        if (username) {
            shareGroceryList(list.id, username).then(onListUpdated);
        }
    };


    const handleDelete = (event: React.MouseEvent) => {
        event.preventDefault();
        const isUserSure = window.confirm("Are you sure you want to delete this list?");
        if (isUserSure) {
            deleteGroceryList(list.id).then(response => {
                if (response.status === 'List removed from your view') {
                    alert('The list was removed from your view.');
                    onListUpdated();
                } else {
                    alert('The list was deleted for all users.');
                    onListUpdated();
                }
            });
        }
    };


    return (
        <IonItem lines="none">
            <IonLabel slot="start">
                <Link to={`/list/${list.id}`}>
                    {list.name}
                </Link>
            </IonLabel>
            <div id='button'>
                <IonButton slot="end" onClick={handleShare}>Share</IonButton>
                <IonButton slot="end" onClick={handleDelete}>Delete</IonButton>
            </div>
        </IonItem>
    );

};

export default GroceryList;