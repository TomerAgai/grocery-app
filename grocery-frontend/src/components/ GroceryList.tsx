import React from 'react';
import { IonItem, IonLabel, IonButton } from '@ionic/react';
import { shareGroceryList, deleteGroceryList } from '../api';
import { Link } from 'react-router-dom';

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
        <IonItem>
            <IonLabel>
                <Link to={`/list/${list.id}`}>
                    {list.name}
                </Link>
            </IonLabel>
            <IonButton onClick={handleShare}>Share</IonButton>
            <IonButton onClick={handleDelete}>Delete</IonButton>
        </IonItem>
    );
};

export default GroceryList;
