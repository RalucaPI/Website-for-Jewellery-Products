import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, getDocs, setDoc, getDoc } from 'firebase/firestore';
import { database, auth } from '../../firebase/firebase';
import { FaRegStar, FaStar } from "react-icons/fa";
import { TiHeartOutline, TiHeart } from "react-icons/ti";
import Context from '../../context/Context';
import './Afisare.css';

export const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [secondaryImages, setSecondaryImages] = useState([]);
    const [selectedSize, setSelectedSize] = useState('');
    const context = useContext(Context);
    const { loading, setLoading, adaugareInCos, adaugaInFavorite, heart, favorite, user, handleAddToFavorites, } = context;

    const [selectedTab, setSelectedTab] = useState('descriere'); // New state for tab selection

    useEffect(() => {
        console.log(`Product ID in AfisareProdus: ${id}`);
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const collections = ['Inele', 'Verighete', 'Coliere', 'Cercei', 'Bratari', 'Pandantive', 'Personalizate'];
                let productData = null;

                for (let collectionName of collections) {
                    const productDoc = await getDoc(doc(database, collectionName, id));
                    if (productDoc.exists()) {
                        productData = { id: productDoc.id, ...productDoc.data() };
                        break;
                    }
                }

                if (productData) {
                    setProduct(productData);
                    setMainImage(productData.img1);
                    setSecondaryImages([productData.img2, productData.img3].filter(Boolean));
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.log("Error getting document:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [id, setLoading]);

    const handleImageClick = (img, index) => {
        const newSecondaryImages = [...secondaryImages];
        newSecondaryImages[index] = mainImage;
        setMainImage(img);
        setSecondaryImages(newSecondaryImages);
    };

    const handleSizeChange = (event) => {
        setSelectedSize(event.target.value);
    };

   const handleAddToCart = (product, selectedSize) => {
        if (['marime', 'marime2', 'marime3', 'marime4', 'marime5', 'marime6', 'marime7', 'marime8'].some(sizeField => product[sizeField])) {
            if (!selectedSize) {
                alert("Vă rugăm să selectați o mărime!");
                return;
            }
        }
        adaugareInCos({ ...product, selectedSize });
    };

    const isFavorite = favorite[product?.id];

    const [recenzieText, setRecenzieText] = useState('');
    const [numeClient, setNumeClient] = useState('');
    const [recenzii, setRecenzii] = useState([]);
    const [rating, setRating] = useState(0);
    const [error, setError] = useState('');

    const adaugaRecenzie = async () => {
        if (!user) {
            alert("Trebuie să fii autentificat pentru a adăuga o recenzie.");
        } else if (!numeClient || !recenzieText || rating === 0) {
            setError("Toate câmpurile sunt obligatorii.");
        } else {
            try {
                const uid = auth.currentUser.uid;
                const recenzieRef = doc(database, `Recenzii produse/Produs ${id}/Recenzii/${uid}`);
                await setDoc(recenzieRef, {
                    text: recenzieText,
                    rating: rating,
                    idClient: uid,
                    numeClient: numeClient,
                    idProdus: id,
                });
                setRecenzieText('');
                setRating(0);
                setNumeClient('');
                setError('');
                getRecenzii();
            } catch (error) {
                console.log("Error adding or updating review:", error);
            }
        }
    };

    const getRecenzii = async () => {
        setLoading(true);
        try {
            const recenziiRef = collection(database, `Recenzii produse/Produs ${id}/Recenzii`);
            const snapshot = await getDocs(recenziiRef);
            const date = snapshot.docs.map((doc) => doc.data());
            setRecenzii(date);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            getRecenzii();
        }
    }, [id]);

    const notaProdusului = async (starRating) => {
        setRating(starRating);
    };

    const Stele = ({ rating, onClick }) => {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, index) => {
                    const starRating = index + 1;
                    return (
                        <FaStar
                            key={index}
                            size={24}
                            className={(starRating <= rating) ? "text-yellow-500" : "text-black"}
                            onClick={() => onClick(starRating)}
                        />
                    );
                })}
            </div>
        );
    };

    const marimiExistente = ['marime', 'marime2', 'marime3', 'marime4', 'marime5', 'marime6', 'marime7', 'marime8'].some(sizeField => product?.[sizeField]);

    return (
        <div className="flex flex-col items-center font-serif overflow-hidden">
            {product && (
                <>
                    <div className="mt-12 flex flex-row items-start">
                        <div className="flex flex-col items-center mr-5">
                            <div className="flex flex-col mt-5">
                                {secondaryImages.map((img, index) => (
                                    <img
                                        key={index}
                                        className="w-24 h-auto my-2 cursor-pointer"
                                        src={img}
                                        alt={`${product.nume} img${index + 2}`}
                                        onClick={() => handleImageClick(img, index)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center items-center flex-1 mx-5">
                            <img className="w-96 h-96" src={mainImage} alt={product.nume} />
                        </div>
                        <div className="flex flex-col items-start bg-[#fcefff] m-1 w-96 p-4">
                            <div className="text-xl m-2 border-b-2 border-black">{product.nume}</div>
                            <p>Gramaj {product.gramaj}</p>
                            <p> {product.material}</p>
                            <div>
                                <Stele rating={rating} onClick={() => setSelectedTab('recenzii')} />
                            </div>
                            <div className="flex justify-between items-center w-full mt-4">
                                <p> {product.pret} lei</p>
                                <button className={`fa-heart ${heart}`} onClick={() => handleAddToFavorites(product)}>
                                    {isFavorite ? <TiHeart size={30} color="red" /> : <TiHeartOutline size={30} />}
                                </button>
                            </div>
                            {marimiExistente && (
                                <form className='marimi_select'>
                                    <fieldset className="flex flex-col items-start border-none">
                                        <legend>Selectati marimea</legend>
                                        <div className="flex flex-row flex-wrap">
                                            {['marime', 'marime2', 'marime3', 'marime4', 'marime5', 'marime6', 'marime7', 'marime8'].map((sizeField, index) => (
                                                product[sizeField] && (
                                                    <label key={index} className="custom-checkbox relative m-1">
                                                        
                                                        <input
                                                            type="radio"
                                                            name="size"
                                                            value={product[sizeField]}
                                                            checked={selectedSize === product[sizeField]}
                                                            onChange={handleSizeChange}
                                                            className="opacity-0 absolute cursor-pointer h-0 w-0 mt-2"
                                                        />
                                                        <span className={`w-12 h-8 border flex justify-center items-center text-base ${selectedSize === product[sizeField] ? 'bg-black text-white font-bold' : 'bg-white text-black border-gray-400'}`}>
                                                            {product[sizeField]}
                                                        </span>
                                                    </label>
                                                )
                                            ))}
                                        </div>
                                    </fieldset>
                                </form>
                            )}
                            <button
                                type="button"
                                onClick={() => handleAddToCart(product, selectedSize)}
                                className="focus:outline-none text-white bg-black hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 font-medium text-sm w-full py-2 px-4 mt-4"
                            >
                                Adaugă în coș
                            </button>
                        </div>
                    </div>

                    <div className="mt-5 flex justify-center w-1/2 border-b-2 border-black">
                        <button
                            className={`flex-1 py-2 px-4 mx-1  text-black text-lg ${selectedTab === 'descriere' ? 'font-bold' : ''}`}
                            onClick={() => setSelectedTab('descriere')}
                        >
                            Descriere
                        </button>
                        <button
                            className={`flex-1 py-2 px-4 mx-1  text-black text-lg ${selectedTab === 'recenzii' ? 'font-bold' : ''}`}
                            onClick={() => setSelectedTab('recenzii')}
                        >
                            Recenzii
                        </button>
                    </div>

                    {selectedTab === 'descriere' && (
                        <div className="w-2/3 flex flex-col items-start mt-5 ml-20 mr-16">
                          
                            <p>{product.descriere}</p>
                        </div>
                    )}

                    {selectedTab === 'recenzii' && (
                        <div className="w-2/3 flex flex-col items-start mt-5 ml-20">
                            <h2>Adauga o recenzie</h2>
                            <div className="w-full flex flex-col items-start ">
                                <div className="mb-4 w-1/4">
                                    <input
                                        type="text"
                                        className="w-full bg-gray-100  border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 h-10 px-4 mr-2"
                                        required
                                        placeholder="Numele tău"
                                        value={numeClient}
                                        onChange={(e) => setNumeClient(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4 w-full">
                                    <Stele rating={rating} onClick={notaProdusului} />
                                </div>
                                <div className="mb-4 w-1/3">
                                    <textarea
                                        className="w-full bg-gray-100  border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 h-32 px-4 py-2 mr-2 resize-none"
                                        placeholder="Scrie o recenzie..."
                                        value={recenzieText}
                                        onChange={(e) => setRecenzieText(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                {error && <p className="text-red-500">{error}</p>}
                                <button onClick={adaugaRecenzie} className="text-white bg-black py-2 px-6 focus:outline-none hover:bg-[#313131]">Submit</button>
                            </div>
                            <div className="mt-6 w-1/3">
                                {loading ? (
                                    <p>Se încarcă recenziile...</p>
                                ) : (
                                    <div className="mt-6 w-full">
                                        {recenzii.map((review, index) => (
                                            <div key={index} className="border border-gray-100  p-4 mb-4 w-full">
                                                <p className="font-medium">Utilizator: {review.numeClient}</p>
                                                <p>Descriere: {review.text}</p>
                                                <div className="flex items-center mt-1">
                                                    <Stele rating={review.rating} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
