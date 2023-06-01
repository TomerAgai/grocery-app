import React, { useEffect, useState } from 'react';
import { IonButton } from '@ionic/react';
import axios from 'axios';

// Define the expected structure of compareResult object
interface CompareResult {
    yochananof_total_price: number;
    shufersal_total_price: number;
    not_found_list_yochananof: string[];
    not_found_list_shufersal: string[];
}

const ComparePricesButton: React.FC = () => {
    // Use CompareResult interface when declaring state
    const [compareResult, setCompareResult] = useState<CompareResult | null>(null);

    const comparePrices = async () => {
        try {
            const response = await axios.get('http://localhost:8000/compare_prices/');
            //console.log(response.data);  // add this line
            setCompareResult(response.data);
        } catch (error) {
            console.error('Error during comparison:', error);
        }
    }



    return (
        <div>
            <IonButton onClick={comparePrices}>Compare Prices</IonButton>
            {
                compareResult &&
                <div>
                    <p>Yochananof total price: {compareResult.yochananof_total_price.toFixed(2) + ' ₪'}</p>
                    <p>Shufersal total price: {compareResult.shufersal_total_price.toFixed(2) + ' ₪'}</p>
                    <p>Not found in Yochananof: {compareResult != null ? compareResult.not_found_list_yochananof.join(', ') : []}</p>
                    <p>Not found in Shufersal: {compareResult != null ? compareResult.not_found_list_shufersal.join(', ') : []}</p>
                </div>
            }
        </div >
    );
}

export default ComparePricesButton;
