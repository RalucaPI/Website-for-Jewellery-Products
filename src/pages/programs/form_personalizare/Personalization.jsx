import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Context from '../../../context/Context';
import { TiHeartOutline, TiHeart } from "react-icons/ti";
import { auth, database } from '../../../firebase/firebase'; // Asigură-te că ai configurat Firebase corect
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc } from 'firebase/firestore'; // Importă funcțiile Firestore
import './formPers.css';

export function Personalization() {
    const context = useContext(Context);

    const { produsePersonalizate, favorite, handleAddToFavorites } = context;

    const [categorie, setCategorie] = useState('');
    const [marime, setMarime] = useState('');
    const [material, setMaterial] = useState('');
    const [telefon, setTelefon] = useState('');
    const [talisman, setTalisman] = useState('');
    const [bijuterie, setBijuterie] = useState('');
    const [culoareBijuterie, setCuloareBijuterie] = useState('');
    const [gravuraText, setGravuraText] = useState('');
    const [font, setFont] = useState('');
    const [descriere, setDescriere] = useState('');
    const [imagine, setImagine] = useState(null);
    const [price, setPrice] = useState(0);
    const [showMessage, setShowMessage] = useState(false);
    const [user] = useAuthState(auth);

    const bijuterieOptions = {
        diamant: ['alb', 'galben', 'roz'],
        rubin: ['rosu'],
        smarald: ['verde'],
        safir: ['albastru'],
        perla: ['alb', 'negru', 'roz'],
        ametist: ['mov'],
        topaz: ['galben', 'albastru'],
        acvamarin: ['albastru'],
        granat: ['rosu', 'portocaliu'],
        opal: ['alb', 'negru'],
        turmalina: ['roz', 'verde', 'negru'],
        citrin: ['galben'],
        zirconiu: ['alb'],
        cuart: ['roz', 'alb'],
        onix: ['negru']
    };

    const fontOptions = [
        { name: 'Font 1 - Dancing Script', fontFamily: 'Dancing Script' },
        { name: 'Font 2 - Pacifico', fontFamily: 'Pacifico' },
        { name: 'Font 3 - Indie Flower', fontFamily: 'Indie Flower' },
        { name: 'Font 4 - Caveat', fontFamily: 'Caveat' },
        { name: 'Font 5 - Satisfy', fontFamily: 'Satisfy' },
    ];

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImagine(e.target.files[0]);
        }
    };

    const resetForm = () => {
        setCategorie('');
        setMarime('');
        setMaterial('');
        setTelefon('');
        setTalisman('');
        setBijuterie('');
        setCuloareBijuterie('');
        setGravuraText('');
        setFont('');
        setDescriere('');
        setImagine(null);
    };

    const countCharacters = (text) => {
        return text.replace(/\s/g, '').length;
    };

    const calculatePrice = () => {
        const basePrices = {
            aur: 100,
            'aur alb': 110,
            argint: 50
        };

        const bijuteriePrices = {
            diamant: 200,
            rubin: 150,
            smarald: 180,
            safir: 170,
            perla: 130,
            ametist: 90,
            topaz: 100,
            acvamarin: 120,
            granat: 80,
            opal: 140,
            turmalina: 160,
            citrin: 110,
            zirconiu: 70,
            cuart: 60,
            onix: 50
        };

        let price = 0;

        if (material in basePrices) {
            price += basePrices[material];
        }

        if (bijuterie in bijuteriePrices) {
            price += bijuteriePrices[bijuterie];
        }

        const gravuraPricePerChar = 5; // Prețul pe caracter
        price += countCharacters(gravuraText) * gravuraPricePerChar;

        return price;
    };

    useEffect(() => {
        setPrice(calculatePrice());
    }, [categorie, marime, material, talisman, bijuterie, culoareBijuterie, gravuraText, font, descriere]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            console.log('Utilizatorul nu este autentificat.');
            return;
        }

        const customOrder = {
            categorie,
            marime,
            material,
            telefon,
            talisman,
            bijuterie,
            culoareBijuterie,
            gravuraText,
            font,
            descriere,
            img1: imagine ? URL.createObjectURL(imagine) : null,
            pret: price,
            userId: user.uid
        };

        try {
            const userOrdersCollection = collection(database, `Client/UID ${auth.currentUser.uid}/Comenzi personalizate`);
            await addDoc(userOrdersCollection, customOrder);
            console.log('Comanda a fost adăugată cu succes în Firestore.');
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);
            alert("Comanda a fost adăugată cu succes! În scurt timp veți fi contactat de un angajat de-al nostru!")
        } catch (error) {
            console.error('Eroare la adăugarea comenzii în Firestore:', error);
        }

        resetForm();
    };

    return (
        <>
            <div>
                <h1 className='text-4xl text-center mb-14 mt-8 font-bold'>Exemple de modele</h1>
            </div>

            <div className="flex justify-center">
                <div className="card_f p-4">
                    <div className='button_heart'>
                        <div className='container_produs_h flex flex-wrap -m-4 my-4 mx-4'>
                            {produsePersonalizate.map((product, index) => {
                                const { id, nume, img1, pret } = product;
                                const isFavorite = favorite[id];

                                return (
                                    <div
                                        key={index}
                                        className="p-4 md:w-1/3 lg:w-1/4 md:h-auto drop-shadow-lg"
                                    >
                                        <div className={`h-full border-2 hover:shadow-[#d4d4d4] hover:shadow-2xl hover:scale-105 transition-shadow duration-300 ease-in-out
                                     border-[#cdc8ff] border-opacity-60 rounded-2xl overflow-hidden `}
                                        >
                                            <div className="image_container">
                                                <Link to={`/produs/${id}`}>
                                                    <div className='img_prod'>
                                                        <img
                                                            className={`rounded-2xl w-full h-50 p-2 hover:scale-105 transition-transform duration-300 ease-in-out `}
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

                                            <div className="leading-relaxed mb-3 mx-2">
                                                <div className="flex justify-between items-center ml-2">
                                                    <div className="tracking-widest text-s title-font font-small mb-1 ">
                                                        {pret} Lei
                                                    </div>
                                                    <button className='fas fa-heart' onClick={() => handleAddToFavorites(product)}>
                                                        {isFavorite ? <TiHeart size={30} color="red" /> : <TiHeartOutline size={30} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="leading-relaxed mb-3 mx-2">
                                                <div className="flex justify-between items-center ml-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => adaugareInCos(product, product.selectedSize)}
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
            {showMessage && (
                <div className="fixed top-0 left-0 right-0 bg-green-500 text-black text-center py-2">
                    Comanda a fost adăugată cu succes! În scurt timp veți fi contactat de un angajat de-al nostru!
                </div>
            )}
            <div className="custom-order-form mx-auto max-w-3xl">
                <h2 className="text-4xl font-bold my-4 border-b-2 border-black">Formular Comandă Personalizată</h2>
                <form onSubmit={handleSubmit} className="form_checkout">
                    <div className="form_row">
                        <div className="input_data">
                            <select
                                name="categorie"
                                required
                                className="input_cout"
                                value={categorie}
                                onChange={(e) => setCategorie(e.target.value)}
                            >
                                <option value="">Selecteaza Categoria</option>
                                <option value="bratara">Bratara</option>
                                <option value="colier">Colier</option>
                                <option value="inel">Inel</option>
                                <option value="pandantiv">Pandantiv</option>
                                <option value="cercei">Cercei</option>
                                <option value="verigheta">Verigheta</option>
                            </select>
                            <div className="underline"></div>
                        </div>
                    </div>

                    <div className="form_row">
                        <div className="input_data">
                            <input
                                type="number"
                                name="marime"
                                placeholder="Marimea"
                                required
                                className="input_cout"
                                value={marime}
                                onChange={(e) => setMarime(e.target.value)}
                            />
                            <div className="underline"></div>
                        </div>
                    </div>
                    <div className="form_row">
                        <div className="input_data">
                            <input
                                type="number"
                                name="telefon"
                                placeholder="Numar de telefon"
                                required
                                className="input_cout"
                                value={telefon}
                                onChange={(e) => setTelefon(e.target.value)}
                            />
                            <div className="underline"></div>
                        </div>
                    </div>

                    <div className="form_row">
                        <div className="input_data">
                            <select
                                name="material"
                                required
                                className="input_cout"
                                value={material}
                                onChange={(e) => setMaterial(e.target.value)}
                            >
                                <option value="">Selecteaza Materialul</option>
                                <option value="aur">Aur</option>
                                <option value="aur alb">Aur Alb</option>
                                <option value="argint">Argint 925</option>
                            </select>
                            <div className="underline"></div>
                        </div>
                    </div>

                    <div className="form_row">
                        <div className="input_data">
                            <input
                                type="text"
                                name="talisman"
                                placeholder="Talisman (optional)"
                                className="input_cout"
                                value={talisman}
                                onChange={(e) => setTalisman(e.target.value)}
                            />
                            <div className="underline"></div>
                        </div>
                    </div>

                    <div className="form_row">
                        <div className="input_data">
                            <select
                                name="bijuterie"
                                className="input_cout"
                                value={bijuterie}
                                onChange={(e) => setBijuterie(e.target.value)}
                            >
                                <option value="">Selecteaza Numele Bijuteriei (optional)</option>
                                {Object.keys(bijuterieOptions).map((option) => (
                                    <option key={option} value={option}>
                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <div className="underline"></div>
                        </div>
                    </div>
                    {bijuterie && (
                        <div className="form_row">
                            <div className="input_data">
                                <select
                                    name="culoareBijuterie"
                                    className="input_cout"
                                    value={culoareBijuterie}
                                    onChange={(e) => setCuloareBijuterie(e.target.value)}
                                >
                                    <option value="">Selecteaza Culoarea Bijuteriei (optional)</option>
                                    {bijuterieOptions[bijuterie].map((color) => (
                                        <option key={color} value={color}>
                                            {color.charAt(0).toUpperCase() + color.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <div className="underline"></div>
                            </div>
                        </div>
                    )}

                    <div className="form_row">
                        <div className="input_data">
                            <input
                                type="text"
                                name="gravuraText"
                                placeholder="Gravura Text/Simbol (optional)"
                                className="input_cout"
                                value={gravuraText}
                                onChange={(e) => setGravuraText(e.target.value)}
                            />
                            <div className="underline"></div>
                        </div>
                    </div>

                    <div className="form_row">
                        <div className="input_data">
                            <select
                                name="font"
                                className="input_cout"
                                value={font}
                                onChange={(e) => setFont(e.target.value)}
                            >
                                <option value="">Selecteaza Fontul (optional)</option>
                                {fontOptions.map((option, index) => (
                                    <option key={index} value={option.name} style={{ fontFamily: option.fontFamily }}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                            <div className="underline"></div>
                        </div>
                    </div>

                    <div className="form_row">
                        <div className="input_data">
                            <input
                                type="text"
                                name="descriere"
                                placeholder="Descriere (optional)"
                                className="input_cout"
                                value={descriere}
                                onChange={(e) => setDescriere(e.target.value)}
                            />
                            <div className="underline"></div>
                        </div>
                    </div>

                    <div className="form_row">
                        <div className="input_data">
                            <input
                                type="file"
                                name="imagine"
                                accept="image/*"
                                className="input_cout"
                                onChange={handleImageChange}
                            />
                            <div className="underline"></div>
                        </div>
                    </div>
                    <div className="text-center mt-6">
                        <p className="text-lg font-bold">Prețul estimat: {price} Lei</p>
                    </div>

                    <div className="form_row submit_btn_cout text-center items-center">
                        <div className="input_data">
                            <div className="inner items-center text-center"></div>
                            <button className="submit_bt" type="submit">
                                Plaseaza comanda
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Personalization;
