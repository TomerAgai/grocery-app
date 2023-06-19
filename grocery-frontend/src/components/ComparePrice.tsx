import { IonButton, IonCol, IonGrid, IonRow, IonText, IonLoading } from '@ionic/react';
import { useEffect, useState } from 'react';
import { comparePrices } from '../api';
import './ComparePrice.css';

interface Product {
    name: string;
    price: number;
}
interface CompareResult {
    [key: string]: number | string[] | Product[];
}


interface CompareResult {
    yochananof_total_price: number;
    shufersal_total_price: number;
    carrefour_total_price: number;
    not_found_list_yochananof: string[];
    not_found_list_shufersal: string[];
    not_found_list_carrefour: string[];
    yochananof_products: Product[];
    shufersal_products: Product[];
    carrefour_products: Product[];
}

const ComparePricesButton: React.FC<ComparePricesButtonProps> = ({ listId }) => {
    const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
    const [isLoading, setIsLoading] = useState(false); // new state for loading

    const handleComparePrices = async () => {
        setIsLoading(true); // start loading
        try {
            const response = await comparePrices(listId);
            setCompareResult(response.data);
        } catch (error) {
            console.error('Error during comparison:', error);
        } finally {
            setIsLoading(false); // stop loading
        }
    }


    const renderNotFound = (store: string) => {
        const notFoundList = compareResult ? (compareResult[`not_found_list_${store}`] as string[]) : [];
        return notFoundList.length ? <IonRow>Not found in {store}: {notFoundList.join(', ')}</IonRow> : null;
    }

    const renderProducts = (store: string) => {
        const products = compareResult ? (compareResult[`${store}_products`] as Product[]) : [];
        return products.length ? (
            <>
                <IonText>{store} Found Products</IonText>
                <IonGrid className="compare-grid">
                    <IonRow className="compare-row">
                        <IonCol className="compare-col">Product Name</IonCol>
                        <IonCol className="compare-col">Price</IonCol>
                    </IonRow>
                    {
                        products.map((product, index) =>
                            <IonRow className="compare-row" key={index}>
                                <IonCol className="compare-col">{product.name}</IonCol>
                                <IonCol className="compare-col">{typeof product.price === "number" ? product.price.toFixed(2) + ' ₪' : product.price}</IonCol>
                            </IonRow>
                        )
                    }
                </IonGrid>
            </>
        ) : null;
    }

    return (
        <>
            <IonButton className="compare-button" onClick={handleComparePrices}>Compare Prices</IonButton>
            <IonLoading isOpen={isLoading} message={'Please wait...'} />
            {
                compareResult && (
                    <div className="compare-results">
                        <>
                            <IonRow>Yochananof total price: {compareResult.yochananof_total_price.toFixed(2) + ' ₪'}</IonRow>
                            <IonRow>Shufersal total price: {compareResult.shufersal_total_price.toFixed(2) + ' ₪'}</IonRow>
                            <IonRow>Carrefour total price: {compareResult.carrefour_total_price.toFixed(2) + ' ₪'}</IonRow>
                            {renderNotFound('yochananof')}
                            {renderNotFound('shufersal')}
                            {renderNotFound('carrefour')}
                            {renderProducts('yochananof')}
                            {renderProducts('shufersal')}
                            {renderProducts('carrefour')}
                        </>
                    </div>
                )
            }
        </>
    );
}

export default ComparePricesButton;
