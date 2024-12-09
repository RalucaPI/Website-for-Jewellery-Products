import React from 'react';
import { ShowCart } from './ShowCart';

export const ShowProducts = ({ productsCart, productIncrement, productDecrement, setCartProduct }) => {
    return (
        <div className="relative overflow-x-auto">
            <table className="w-full table-fixed">
                <thead className="border-b-2 border-black bg-white">
                    <tr>
                        <th scope="col" className="text-xl font-normal p-2 text-left">Produs</th>
                        <th scope="col" className="text-xl font-normal p-2">Nume</th>
                        <th scope="col" className="text-xl font-normal p-2">Cantitate</th>
                        <th scope="col" className="text-xl font-normal p-2">Pret</th>
                        <th scope="col" className="text-xl font-normal p-2">Pret total</th>
                        <th scope="col" className="text-xl font-normal p-2 text-left">Sterge</th>
                    </tr>
                </thead>
                <tbody>
                    {productsCart && productsCart.length > 0 ? (
                        productsCart.map((cartProduct) => (
                            <ShowCart
                                key={cartProduct.id}
                                cartProduct={cartProduct}
                                productIncrement={productIncrement}
                                productDecrement={productDecrement}
                                setCartProduct={setCartProduct}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">No products in cart.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
