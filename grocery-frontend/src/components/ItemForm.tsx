import React, { useState } from 'react';
import { IonInput, IonButton } from '@ionic/react';
import { createGroceryItem } from '../api';

interface ItemFormProps {
    onItemAdded: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ onItemAdded }) => {
    const [name, setName] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        createGroceryItem({ name: name, quantity: 1, user: 'your_username' }).then(() => {
            setName('');
            onItemAdded();
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <IonInput
                value={name}
                onIonChange={event => setName(event.detail.value!)}
                placeholder="Enter Item"
            />
            <IonButton expand="full" type="submit">Add Item</IonButton>
        </form>
    );
}

export default ItemForm;