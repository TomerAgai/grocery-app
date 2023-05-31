// ItemList.tsx

import React from 'react';
import { IonList, IonItem, IonButton, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/react';
import { removeGroceryItem } from '../api';

interface Item {
    id: number;
    name: string;
}

interface ItemListProps {
    items: Item[];
    onItemRemoved: () => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onItemRemoved }) => {
    const handleRemove = (id: number) => {
        removeGroceryItem(id).then(() => {
            onItemRemoved();
        });
    }

    return (
        <IonList>
            {items.map(item => (
                <IonItemSliding key={item.id}>
                    <IonItem>
                        {item.name}
                    </IonItem>
                    <IonItemOptions side="end">
                        <IonItemOption onClick={() => handleRemove(item.id)} color="danger">
                            Delete
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
            ))}
        </IonList>
    );
}

export default ItemList;
