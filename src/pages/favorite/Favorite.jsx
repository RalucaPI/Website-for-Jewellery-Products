import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TiHeartOutline, TiHeart } from "react-icons/ti";
import Context from '../../context/Context';
import { database, auth } from '../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

export function Favorite() {
    const {
        adaugareInCos,
        adaugaInFavorite,
        favorite,handleAddToFavorites

    } = useContext(Context);

    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [user, setUser] = useState(null);

    const handleAddToCart = (product, selectedSize) => {
        if (!selectedSize) {
            alert("Vă rugăm să selectați o mărime!");
            return;
        }
        adaugareInCos({ ...product, selectedSize });
    };

   
    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = () => {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    console.log('User logged in:', user);
                    setUser(user);
                } else {
                    console.log('No user logged in');
                }
            });
        };

        fetchUserData();
    }, []);

    // Fetch favorite products when user state changes
    useEffect(() => {
        const fetchFavoriteProducts = async () => {
            if (user) {
                const uid = user.uid;
                try {
                    const favoriteProductsRef = collection(database, `Client/UID ${uid}/Produse favorite`);
                    const favoriteProductsSnapshot = await getDocs(favoriteProductsRef);
                    const favoriteProductsData = favoriteProductsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                    console.log('Fetched favorite products:', favoriteProductsData);
                    setFavoriteProducts(favoriteProductsData);
                } catch (error) {
                    console.error('Error fetching favorite products:', error);
                }
            }
        };

        fetchFavoriteProducts();
    }, [user]);

    return (
        <div>
            <h1 className='text-4xl text-center mb-14 mt-8 font-bold'>Produse favorite</h1>
            <div className="card_f">
                <div className='button_heart'>
                    <div className='container_produs_h flex flex-wrap -m-4 my-4 mx-4'>
                        {favoriteProducts.map((product, index) => {
                            const { id, nume, img1, pret, marime, marime2, marime3, marime4, marime5, marime6, marime7, marime8 } = product;
                            const marimi = [marime, marime2, marime3, marime4, marime5, marime6, marime7, marime8].filter(Boolean);
                            const isFavorite = favorite[id];

                            return (
                                <div
                                    key={id}
                                    className="p-4 md:w-1/3 lg:w-1/4 xl:w-1/5 md:h-auto drop-shadow-lg"
                                >
                                    <div className="h-full border-2 hover:shadow-[#d4d4d4] hover:shadow-2xl hover:scale-105 transition-shadow duration-300 ease-in-out border-[#cdc8ff] border-opacity-60 rounded-2xl overflow-hidden">
                                        <div className="image_container">
                                            <Link to={`/produs/${id}`}>
                                                <div className='img_prod'>
                                                    <img
                                                        className="rounded-2xl w-full h-50 p-2 hover:scale-105 transition-transform duration-300 ease-in-out"
                                                        src={img1}
                                                        alt={nume}
                                                    />
                                                </div>
                                            </Link>
                                        </div>
                                        <h3 className="title-font text-lg font-medium ml-4 text-gray-900 mb-1 truncate">
                                            <Link to={`/produs/${id}`} className="no-underline text-black">
                                                {nume}
                                            </Link>
                                        </h3>
                                        <div className="tracking-widest text-s title-font font-small mb-1 ml-4">
                                            {pret} Lei
                                        </div>

                                        <div className="leading-relaxed mb-3 mx-2">
                                            <div className="flex justify-between items-center ml-2">
                                                <select className="rounded-md p-2"
                                                    defaultValue=""
                                                    onChange={(e) => product.selectedSize = e.target.value}
                                                >
                                                    <option value="" disabled>Selectează mărimea</option>
                                                    {marimi.map((sizeValue, idx) => (
                                                        <option key={idx} value={sizeValue}>{sizeValue}</option>
                                                    ))}
                                                </select>
                                                <div>
                                                    <button
                                                        className='fas fa-heart'
                                                        onClick={() => handleAddToFavorites(product)}
                                                    >
                                                        {isFavorite ? <TiHeart size={30} color="red" /> : <TiHeartOutline size={30} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="leading-relaxed mb-3 mx-2">
                                            <div className="flex justify-between items-center ml-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddToCart(product, product.selectedSize)}
                                                    className="focus:outline-none text-black bg-[#dfccff] hover:bg-[#ce99ff] focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm w-full py-2 px-4"
                                                >
                                                    Adaugă în coș
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
