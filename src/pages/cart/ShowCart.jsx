import React, { useContext, useEffect, useState } from 'react';
import { database, auth } from '../../firebase/firebase';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Plus, Minus, X } from 'phosphor-react';
import Date from '../../context/Date';

export const ShowCart= ({ cartProduct, productIncrement, productDecrement, setCartProduct,pretProdus }) => {
    const [product, setProduct] = useState({});
    const { id } = cartProduct;
    const context = useContext(Date);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const productDocRef = doc(database, `Client/UID ${auth.currentUser.uid}/Produse cos`, id);
                const productDoc = await getDoc(productDocRef);
                if (productDoc.exists()) {
                    setProduct(productDoc.data());
                }
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchProductData();
    }, [id]);

    const marire = () => {
        productIncrement(cartProduct);
    }

    const scadere = () => {
        productDecrement(cartProduct);
    }

      const sterge = async (produsCos) => {
    try {
        await deleteDoc(doc(database, `Client/UID ${auth.currentUser.uid}/Produse cos`, produsCos.firestoreId));
        console.log('Sterge');
        setProduseCos(prevProduseCos => prevProduseCos.filter(item => item.firestoreId !== produsCos.firestoreId));
    } catch (error) {
        console.error('Error deleting product:', error);
    }
};

    const truncateTitle = (title) => {
        const words = title.split(' ');
        return words.length > 3 ? `${words.slice(0, 3).join(' ')}...` : title;
    };

    return (
        <tr className="text-center border-b">
            <td className="p-2 text-left">
                <Link to={`/produs/${id}`}>
                    <img
                        src={cartProduct.img1}
                        alt="img"
                        className="sm:h-38 sm:w-40 h-26 w-24 rounded-md object-contain object-center cursor-pointer"
                    />
                </Link>
            </td>
            <td className="p-2 no-underline">
                <h3 className="text-sm font-semibold text-black text-left">
                    <Link to={`/produs/${id}`} className="block sm:hidden">
                        {truncateTitle(cartProduct.nume)}
                    </Link>
                    <Link to={`/produs/${id}`} className="hidden sm:block text-left text-black no-underline;">
                        {cartProduct.nume}
                    </Link>
                </h3>
                <p className="text-sm text-gray-700 text-left">Marime {cartProduct.marime}</p>
            </td>
            <td className="p-2">
                <div className="flex items-center justify-center">
                    <div className="border-2 border-black">
                        <button onClick={scadere} type="button" className="h-7 w-7 pt-2">
                            <Minus size={20} />
                        </button>
                        <input
                            type="text"
                            className="mx-1 h-7 w-9 border text-center text-black"
                            value={cartProduct.cantitate}
                            readOnly
                        />
                        <button onClick={marire} type="button" className="h-7 w-7 pt-2">
                            <Plus size={20} />
                        </button>
                    </div>
                </div>
            </td>
            <td className="p-2">
                {cartProduct.pret} Lei
            </td>
            
            <td className="p-2">
                {cartProduct.pretTotal} Lei
            </td>
            <td className="p-2 text-left">
                <button onClick={sterge} type="button" className="flex items-center justify-center ml-2">
                    <X size={28} />
                </button>
            </td>
        </tr>
    );
};
