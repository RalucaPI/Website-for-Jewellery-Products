import React, { useEffect, useState } from 'react';
import Context from './Context';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { collection, query, onSnapshot, getDocs, setDoc, deleteDoc, doc,getDoc, where,addDoc,updateDoc } from 'firebase/firestore';
import { auth, database } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

function Date(props) {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState({});
    const [product, setProduct] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [produse, setProduse] = useState([]);
    const [currentImages, setCurrentImages] = useState([]);
    const [productInele, setProductInele] = useState([]);
    const [productVerighete, setProductVerighete] = useState([]);
    const [productColiere, setProductColiere] = useState([]);
    const [productCercei, setProductCercei] = useState([]);
    const [productBratari, setProductBratari] = useState([]);
    const [productPandantive, setProductPandantive] = useState([]);
    const [produsePersonalizate, setProdusePersonalizate] = useState([]);
    const [produseFavorite, setProductFavorite] = useState([]);
    const [mainImage, setMainImage] = useState('');
    const [secondaryImages, setSecondaryImages] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [users, setUsers] = useState([]);
    const [cont, setCont] = useState([]);
    const { id } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userAf, setUserAf] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUserAf(currentUser);
                getUserData(currentUser.uid);
            } else {
                setUserAf(null);
                setUsers(null);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const getUserData = async () => {
        setLoading(true);
        try {
            const result = await getDocs(collection(database, "Conturi"));
            const usersArray = [];
            result.forEach((doc) => {
                usersArray.push({ ...doc.data(), uid: doc.data().uid });
            });
            setUsers(usersArray);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    const login = () => {
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.clear('users');
    };

    const [user] = useAuthState(auth);

    useEffect(() => {
        const fetchUserData = () => {
            auth.onAuthStateChanged((users) => {
                setUsers(users);
            });
        };

        fetchUserData();
    }, []);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const addProduct = async () => {
        if (!products.nume || !products.pret || !products.img1 || !products.img2 || !products.img3 || !products.material || !products.culoare || !products.marime) {
            return toast.error("all fields are required");
        }

        setLoading(true);

        try {
            const productRef = collection(database, 'Inele');
            await addDoc(productRef, products);
            toast.success("Add product successfully");
            setTimeout(() => {
                window.location.href = '/home';
            }, 800);
            getProductData();
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const getProductData = async () => {
        if (!dataLoaded) {
            setLoading(true);

            try {
                const queries = [
                    query(collection(database, 'Inele')),
                    query(collection(database, 'Verighete')),
                    query(collection(database, 'Coliere')),
                    query(collection(database, 'Bratari')),
                    query(collection(database, 'Cercei')),
                    query(collection(database, 'Pandantive')),
                    query(collection(database, 'Personalizate')),
                ];

                const dataPromises = queries.map((q, index) => {
                    return new Promise((resolve, reject) => {
                        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                            const productObject = {};
                            const productArray = [];
                            QuerySnapshot.forEach((doc) => {
                                const productData = { ...doc.data(), id: doc.id };
                                productObject[doc.id] = productData;
                                productArray.push(productData);
                                setMainImage(productData.img1);
                                setSecondaryImages([productData.img2, productData.img3].filter(Boolean));
                            });
                            resolve({ index, productArray, productObject });
                        }, reject);
                    });
                });

                const dataResults = await Promise.all(dataPromises);

                dataResults.forEach(({ index, productArray, productObject }) => {
                    switch (index) {
                        case 0:
                            setProductInele(Object.values(productObject));
                            setCurrentImages(productArray.map(() => 0));
                            break;
                        case 1:
                            setProductVerighete(Object.values(productObject));
                            setCurrentImages(productArray.map(() => 0));
                            break;
                        case 2:
                            setProductColiere(Object.values(productObject));
                            setCurrentImages(productArray.map(() => 0));
                            break;
                        case 3:
                            setProductBratari(Object.values(productObject));
                            setCurrentImages(productArray.map(() => 0));
                            break;
                        case 4:
                            setProductCercei(Object.values(productObject));
                            setCurrentImages(productArray.map(() => 0));
                            break;
                        case 5:
                            setProductPandantive(Object.values(productObject));
                            setCurrentImages(productArray.map(() => 0));
                            break;
                        case 6:
                            setProdusePersonalizate(Object.values(productObject));
                            setCurrentImages(productArray.map(() => 0));
                            break;
                        default:
                            break;
                    }
                });

                setDataLoaded(true);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        getProductData();
    }, [id]);

    const toateProdusele = [...productBratari, ...productCercei, ...productColiere,
        ...productInele, ...productPandantive, ...productVerighete, ...produsePersonalizate
    ];
    const prodrand = [...productBratari.slice(0, 5), ...productCercei.slice(0, 5),
        ...productColiere.slice(0, 5), ...productInele.slice(0, 5),
        ...productPandantive.slice(0, 5), ...productVerighete.slice(0, 5)
    ];

    const edithandle = (item) => {
        setProducts(item);
    };

    const updateProduct = async () => {
        setLoading(true);
        try {
            await setDoc(doc(database, 'Inele', products.id), products);
            toast.success("Product Updated successfully");
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 800);
            getProductData();
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const deleteProduct = async (item) => {
        setLoading(true);
        try {
            await deleteDoc(doc(database, 'Inele', item.id));
            toast.success('Product Deleted successfully');
            getProductData();
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const [comenzi, setComenzi] = useState([]);

    const handleMouseEnter = (index) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    const handleImageChange = (index) => {
        setCurrentImages((prev) => {
            const newImages = [...prev];
            const products = toateProdusele[index];
            const images = [products.img1, products.img2, products.img3].filter(Boolean);
            if (images.length > 1) {
                newImages[index] = (newImages[index] + 1) % images.length;
            }
            return newImages;
        });
    };

    const handleImageClick = (img, index) => {
        const newSecondaryImages = [...secondaryImages];
        newSecondaryImages[index] = mainImage;
        setMainImage(img);
        setSecondaryImages(newSecondaryImages);
    };

    const getOrderData = async () => {
        setLoading(true);
        try {
            const result = await getDocs(collection(database, "Comenzi"));
            const ordersArray = [];
            result.forEach((doc) => {
                ordersArray.push(doc.data());
                setLoading(false);
            });
            setComenzi(ordersArray);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };


////////////////////////////////        Cos         //////////////////////////////////////////////
const [deliveryDetails, setDeliveryDetails] = useState({
    nume: '',
    email: '',
    telefon: '',
    adresa: '',
    localitate: '',
    judet: ''
  });

    const [produseCos, setProduseCos] = useState([]);
    useEffect(() => {
        const fetchProduseCos = async () => {
            if (user) {
                const produseSnapshot = await getDocs(collection(database, `Client/UID ${user.uid}/Produse cos`));
                const produseList = produseSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProduseCos(produseList);
            }
        };

        fetchProduseCos();
    }, [user]);

    const parsePret = (pret) => parseFloat(pret.toString().replace(/\./g, '').replace(/,/g, '.'));

    const produsInc = (produsCos) => {
    const updatedCartProducts = produseCos.map((product) => {
        if (product.firestoreId === produsCos.firestoreId) {
            const updatedProdus = { ...product };
            updatedProdus.cantitate += 1;
            updatedProdus.pretTotal = updatedProdus.cantitate * parsePret(updatedProdus.pret);
            return updatedProdus;
        }
        return product;
    });

    setProduseCos(updatedCartProducts);

    if (user) {
        updateDoc(doc(database, `Client/UID ${auth.currentUser.uid}/Produse cos`, produsCos.firestoreId), {
            cantitate: produsCos.cantitate + 1,
            pretTotal: (produsCos.cantitate + 1) * parsePret(produsCos.pret),
        }).then(() => {
            console.log('Marire');
        }).catch((error) => {
            console.error('Error updating product:', error);
        });
    } else {
        console.log('Nu sunteti conectat');
    }
};


    const produsDec = (produsCos) => {
    if (produsCos.cantitate > 1) {
        const updatedCartProducts = produseCos.map((product) => {
            if (product.firestoreId === produsCos.firestoreId) {
                const updatedProdus = { ...product };
                updatedProdus.cantitate -= 1;
                updatedProdus.pretTotal = updatedProdus.cantitate * parsePret(updatedProdus.pret);
                return updatedProdus;
            }
            return product;
        });

        setProduseCos(updatedCartProducts);

        if (user) {
            updateDoc(doc(database, `Client/UID ${auth.currentUser.uid}/Produse cos`, produsCos.firestoreId), {
                cantitate: produsCos.cantitate - 1,
                pretTotal: (produsCos.cantitate - 1) * parsePret(produsCos.pret),
            }).then(() => {
                console.log('Micsorare');
            }).catch((error) => {
                console.error('Eroare:', error);
            });
        } else {
            console.log('Nu sunteti conectat');
        }
    } else {
        sterge(produsCos);
    }
};


   const sterge = async (produsCos) => {
    try {
        await deleteDoc(doc(database, `Client/UID ${auth.currentUser.uid}/Produse cos`, produsCos.firestoreId));
        console.log('Sterge');
        setProduseCos(prevProduseCos => prevProduseCos.filter(item => item.firestoreId !== produsCos.firestoreId));
    } catch (error) {
        console.error('Error deleting product:', error);
    }
};


    const pretTotal = produseCos.reduce((total, product) => total + (product.cantitate * parsePret(product.pret)), 0).toFixed(2);
    const nrProd = produseCos.reduce((total, product) => total + product.cantitate, 0);



    ////////////////////////////////////////////       Adaugare in cos         /////////////////////////////////////////
  const adaugareInCos = async (product) => {
    if (!user) {
        setShowAlert(true);
    } else {
        const uid = auth.currentUser?.uid;

        if (uid !== null) {
            const cartRef = collection(database, `Client/UID ${auth.currentUser.uid}/Produse cos`);
            const cartQuery = query(cartRef, where("id", "==", product.id), where("marime", "==", product.selectedSize || ""));

            const cartSnapshot = await getDocs(cartQuery);

            const productToSave = {
                id: product.id,
                img1: product.img1,
                nume: product.nume,
                pret: product.pret,
                material: product.material,
                cantitate: 1,
                pretTotal: product.pret,
                ...(product.selectedSize && { marime: product.selectedSize })
            };

            if (!cartSnapshot.empty) {
                const cartDoc = cartSnapshot.docs[0];
                const cartProduct = cartDoc.data();
                const updatedCant = cartProduct.cantitate + 1;

                await updateDoc(cartDoc.ref, {
                    cantitate: updatedCant,
                    pretTotal: updatedCant * cartProduct.pret,
                });
            } else {
                try {
                    const docRef = await addDoc(cartRef, productToSave);
                    // Stocăm ID-ul unic generat de Firestore în produs pentru referințe ulterioare
                    setProduseCos((prevProduseCos) => [
                        ...prevProduseCos,
                        { ...productToSave, firestoreId: docRef.id }
                    ]);
                } catch (error) {
                    console.error('Eroare:', error);
                }
            }
        }
    }
};


const handleAddToCart = (product, selectedSize) => {
    const hasSizes = ['marime', 'marime2', 'marime3', 'marime4', 'marime5', 'marime6', 'marime7', 'marime8'].some(sizeField => product[sizeField]);

    if (hasSizes && !selectedSize) {
        alert("Vă rugăm să selectați o mărime!");
        return;
    }

    adaugareInCos({ ...product, selectedSize });
};

    
    
    
    
    
    
    

    /////////////////////////////////////      Favorite         ////////////////////////////////////////////////



    const [favorite, setFavorite] = useState({});
    const [productId, setProductId] = useState(null);

    useEffect(() => {
        if (user) {
            actualizareFav(user.uid);
        }
    }, [user]);

    const actualizareFav = async (uid) => {
        if (!uid) return;
        const favoriteRef = collection(database, `Client/UID ${uid}/Produse favorite`);
        const snapshot = await getDocs(favoriteRef);
        const favoriteData = snapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = doc.data();
            return acc;
        }, {});
        setFavorite(favoriteData);
    };

    const eInFav = !!favorite[productId];
    const heart = eInFav ? 'text-red-500' : 'text-black';

    const adaugaInFavorite = async (product) => {
        const uid = auth.currentUser?.uid;

        if (!uid || !product || !product.id) {
            console.error('User ID, Product, or Product ID is missing', uid, product, product.id);
            return;
        }

        const favoriteRef = doc(database, `Client/UID ${uid}/Produse favorite`, product.id);
        const favoriteSnapshot = await getDoc(favoriteRef);

        if (favoriteSnapshot.exists()) {
            await deleteDoc(favoriteRef);
            setFavorite((prev) => {
                const updatedFavorites = { ...prev };
                delete updatedFavorites[product.id];
                return updatedFavorites;
            });
        } else {
            await setDoc(favoriteRef, product);
            setFavorite((prev) => ({ ...prev, [product.id]: product }));
        }
        actualizareFav(uid);
    };

    useEffect(() => {
        if (products && products.id) {
            setProductId(products.id);
        }
    }, [products]);

    const handleAddToFavorites = (product) => {
        adaugaInFavorite(product);
    };

    const [showAlert, setShowAlert] = useState(false);
///////////////////////////////////////      Filtrare       /////////////////////////////////////////////////



    const [cautare, setCautare] = useState('');
    const [filtruTip, setFiltruTip] = useState('');
    const [filtruPret, setFiltruPret] = useState('');
    const [filtruGrame, setFiltruGrame] = useState('');
    const [maxPret, setMaxPret] = useState(null);
    const [minPret, setMinPret] = useState(null);
    const [rangePret, setRangePret] = useState([0, 0]);

    const [maxGramajColiere, setMaxGramajColiere] = useState(null);
    const [minGramajColiere, setMinGramajColiere] = useState(null);
    const [rangeGramajColiere, setRangeGramajColiere] = useState([0, 0]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);

    useEffect(() => {
        if (productColiere.length > 0) {
            const preturi = productColiere.map(produs => {
                const pret = parseFloat(produs.pret.toString().replace(/\./g, ""));
                return isNaN(pret) ? null : pret;
            }).filter(pret => pret !== null);

            if (preturi.length > 0) {
                const maxPret = Math.max(...preturi);
                const minPret = Math.min(...preturi);
                setMaxPret(maxPret);
                setMinPret(minPret);
                setRangePret([minPret, maxPret]);
            }
        }
    }, [productColiere]);

    useEffect(() => {
        if (productColiere.length > 0) {
            const gramajeColiere = productColiere.map(produs => {
                const gramaj = parseFloat(produs.gramaj.toString());
                return isNaN(gramaj) ? null : gramaj;
            }).filter(gramaj => gramaj !== null);

            if (gramajeColiere.length > 0) {
                const maxGramajColiere = Math.max(...gramajeColiere);
                const minGramajColiere = Math.min(...gramajeColiere);
                setMaxGramajColiere(maxGramajColiere);
                setMinGramajColiere(minGramajColiere);
                setRangeGramajColiere([minGramajColiere, maxGramajColiere]);
            }
        }
    }, [productColiere]);

    const filterProducts = (products) => {
        return products.filter((obj) => {
            const pret = obj.pret ? parseFloat(obj.pret.toString().replace(/\./g, "")) : null;
            const gramaj = obj.gramaj ? parseFloat(obj.gramaj.toString()) : null;
            const sizes = ['marime', 'marime2', 'marime3', 'marime4', 'marime5', 'marime6', 'marime7', 'marime8'];
            const hasSelectedSize = selectedSizes.length === 0 || sizes.some(size => selectedSizes.includes(obj[size]));
            const hasSelectedMaterial = selectedMaterials.length === 0 || selectedMaterials.includes(obj.material);
            const hasSelectedColor = selectedColors.length === 0 || selectedColors.includes(obj.culoare);

            return (
                (obj.nume.toLowerCase().includes(cautare.toLowerCase()) ||
                obj.material.toLowerCase().includes(cautare.toLowerCase())) &&
                (pret === null || (pret >= rangePret[0] && pret <= rangePret[1])) &&
                (gramaj === null || (gramaj >= rangeGramajColiere[0] && gramaj <= rangeGramajColiere[1])) &&
                hasSelectedSize &&
                hasSelectedMaterial &&
                hasSelectedColor
            );
        });
    };

    const sortProductsByPrice = (products) => {
        return products.slice().sort((a, b) => {
            const pretA = a.pret ? parseFloat(a.pret.toString().replace(/\./g, "")) : 0;
            const pretB = b.pret ? parseFloat(b.pret.toString().replace(/\./g, "")) : 0;
            return pretA - pretB;
        });
    };

    const sortProductsByGramaj = (products) => {
        return products.slice().sort((a, b) => {
            const gramajA = a.gramaj ? parseFloat(a.gramaj.toString()) : 0;
            const gramajB = b.gramaj ? parseFloat(b.gramaj.toString()) : 0;
            return gramajA - gramajB;
        });
    };

    const sortedProductColiere = sortProductsByPrice(productColiere);
    const filteredProductColiere = filterProducts(sortedProductColiere);

    const [maxPretInele, setMaxPretInele] = useState(null);
    const [minPretInele, setMinPretInele] = useState(null);
    const [rangeInele, setRangeInele] = useState([0, 0]);
    const [maxGramajInele, setMaxGramajInele] = useState(null);
    const [minGramajInele, setMinGramajInele] = useState(null);
    const [rangeGramajInele, setRangeGramajInele] = useState([0, 0]);

    useEffect(() => {
        if (productInele.length > 0) {
            const preturiInele = productInele.map(produs => {
                const pretInele = produs.pret ? parseFloat(produs.pret.toString().replace(/\./g, "")) : null;
                return isNaN(pretInele) ? null : pretInele;
            }).filter(pretInele => pretInele !== null);

            if (preturiInele.length > 0) {
                const maxPretInele = Math.max(...preturiInele);
                const minPretInele = Math.min(...preturiInele);
                setMaxPretInele(maxPretInele);
                setMinPretInele(minPretInele);
                setRangeInele([minPretInele, maxPretInele]);
            }

            const gramajeInele = productInele.map(produs => {
                const gramaj = produs.gramaj ? parseFloat(produs.gramaj.toString()) : null;
                return isNaN(gramaj) ? null : gramaj;
            }).filter(gramaj => gramaj !== null);

            if (gramajeInele.length > 0) {
                const maxGramajInele = Math.max(...gramajeInele);
                const minGramajInele = Math.min(...gramajeInele);
                setMaxGramajInele(maxGramajInele);
                setMinGramajInele(minGramajInele);
                setRangeGramajInele([minGramajInele, maxGramajInele]);
            }
        }
    }, [productInele]);

    const filterProductsInele = (products) => {
        return products.filter((obj) => {
            const pret = obj.pret ? parseFloat(obj.pret.toString().replace(/\./g, "")) : null;
            const gramaj = obj.gramaj ? parseFloat(obj.gramaj.toString()) : null;
            const sizes = ['marime', 'marime2', 'marime3', 'marime4', 'marime5', 'marime6', 'marime7', 'marime8'];
            const hasSelectedSize = selectedSizes.length === 0 || sizes.some(size => selectedSizes.includes(obj[size]));
            const hasSelectedMaterial = selectedMaterials.length === 0 || selectedMaterials.includes(obj.material);
            const hasSelectedColor = selectedColors.length === 0 || selectedColors.includes(obj.culoare);

            return (
                (obj.nume.toLowerCase().includes(cautare.toLowerCase()) ||
                obj.material.toLowerCase().includes(cautare.toLowerCase())) &&
                (pret === null || (pret >= rangeInele[0] && pret <= rangeInele[1])) &&
                (gramaj === null || (gramaj >= rangeGramajInele[0] && gramaj <= rangeGramajInele[1])) &&
                hasSelectedSize &&
                hasSelectedMaterial &&
                hasSelectedColor
            );
        });
    };

    const sortedProductInele = sortProductsByPrice(productInele);
    const filteredProductInele = filterProductsInele(sortedProductInele);

    const [maxPretVerighete, setMaxPretVerighete] = useState(null);
    const [minPretVerighete, setMinPretVerighete] = useState(null);
    const [rangeVerighete, setRangeVerighete] = useState([0, 0]);
    const [maxGramajVerighete, setMaxGramajVerighete] = useState(null);
    const [minGramajVerighete, setMinGramajVerighete] = useState(null);
    const [rangeGramajVerighete, setRangeGramajVerighete] = useState([0, 0]);

    useEffect(() => {
        if (productVerighete.length > 0) {
            const preturiVerighete = productVerighete.map(produs => {
                const pretVerighete = parseFloat(produs.pret.toString().replace(/\./g, ""));
                return isNaN(pretVerighete) ? null : pretVerighete;
            }).filter(pretVerighete => pretVerighete !== null);

            if (preturiVerighete.length > 0) {
                const maxPretVerighete = Math.max(...preturiVerighete);
                const minPretVerighete = Math.min(...preturiVerighete);
                setMaxPretVerighete(maxPretVerighete);
                setMinPretVerighete(minPretVerighete);
                setRangeVerighete([minPretVerighete, maxPretVerighete]);
            }

            const gramajeVerighete = productVerighete.map(produs => {
                const gramaj = produs.gramaj ? parseFloat(produs.gramaj.toString()) : null;
                return isNaN(gramaj) ? null : gramaj;
            }).filter(gramaj => gramaj !== null);

            if (gramajeVerighete.length > 0) {
                const maxGramajVerighete = Math.max(...gramajeVerighete);
                const minGramajVerighete = Math.min(...gramajeVerighete);
                setMaxGramajVerighete(maxGramajVerighete);
                setMinGramajVerighete(minGramajVerighete);
                setRangeGramajVerighete([minGramajVerighete, maxGramajVerighete]);
            }
        }
    }, [productVerighete]);

    const filterProductsV = (products) => {
        return products.filter((obj) => {
            const pret = obj.pret ? parseFloat(obj.pret.toString().replace(/\./g, "")) : null;
            const gramaj = obj.gramaj ? parseFloat(obj.gramaj.toString()) : null;
            const sizes = ['marime', 'marime2', 'marime3', 'marime4', 'marime5', 'marime6', 'marime7', 'marime8'];
            const hasSelectedSize = selectedSizes.length === 0 || sizes.some(size => selectedSizes.includes(obj[size]));
            const hasSelectedMaterial = selectedMaterials.length === 0 || selectedMaterials.includes(obj.material);
            const hasSelectedColor = selectedColors.length === 0 || selectedColors.includes(obj.culoare);

            return (
                (obj.nume.toLowerCase().includes(cautare.toLowerCase()) ||
                obj.material.toLowerCase().includes(cautare.toLowerCase())) &&
                (pret === null || (pret >= rangeVerighete[0] && pret <= rangeVerighete[1])) &&
                (gramaj === null || (gramaj >= rangeGramajVerighete[0] && gramaj <= rangeGramajVerighete[1])) &&
                hasSelectedSize &&
                hasSelectedMaterial &&
                hasSelectedColor
            );
        });
    };

    const sortedProductVerighete = sortProductsByPrice(productVerighete);
    const filteredProductVerighete = filterProductsV(sortedProductVerighete);

    const [maxPretCercei, setMaxPretCercei] = useState(null);
    const [minPretCercei, setMinPretCercei] = useState(null);
    const [rangeCercei, setRangeCercei] = useState([0, 0]);
    const [maxGramajCercei, setMaxGramajCercei] = useState(null);
    const [minGramajCercei, setMinGramajCercei] = useState(null);
    const [rangeGramajCercei, setRangeGramajCercei] = useState([0, 0]);

    useEffect(() => {
        if (productCercei.length > 0) {
            const preturiCercei = productCercei.map(produs => {
                const pretCercei = parseFloat(produs.pret.toString().replace(/\./g, ""));
                return isNaN(pretCercei) ? null : pretCercei;
            }).filter(pretCercei => pretCercei !== null);

            if (preturiCercei.length > 0) {
                const maxPretCercei = Math.max(...preturiCercei);
                const minPretCercei = Math.min(...preturiCercei);
                setMaxPretCercei(maxPretCercei);
                setMinPretCercei(minPretCercei);
                setRangeCercei([minPretCercei, maxPretCercei]);
            }

            const gramajeCercei = productCercei.map(produs => {
                const gramaj = produs.gramaj ? parseFloat(produs.gramaj.toString()) : null;
                return isNaN(gramaj) ? null : gramaj;
            }).filter(gramaj => gramaj !== null);

            if (gramajeCercei.length > 0) {
                const maxGramajCercei = Math.max(...gramajeCercei);
                const minGramajCercei = Math.min(...gramajeCercei);
                setMaxGramajCercei(maxGramajCercei);
                setMinGramajCercei(minGramajCercei);
                setRangeGramajCercei([minGramajCercei, maxGramajCercei]);
            }
        }
    }, [productCercei]);

    const filterProductsC = (products) => {
        return products.filter((obj) => {
            const pret = obj.pret ? parseFloat(obj.pret.toString().replace(/\./g, "")) : null;
            const gramaj = obj.gramaj ? parseFloat(obj.gramaj.toString()) : null;
            const sizes = ['marime', 'marime2', 'marime3', 'marime4', 'marime5', 'marime6', 'marime7', 'marime8'];
            const hasSelectedSize = selectedSizes.length === 0 || sizes.some(size => selectedSizes.includes(obj[size]));
            const hasSelectedMaterial = selectedMaterials.length === 0 || selectedMaterials.includes(obj.material);
            const hasSelectedColor = selectedColors.length === 0 || selectedColors.includes(obj.culoare);

            return (
                (obj.nume.toLowerCase().includes(cautare.toLowerCase()) ||
                obj.material.toLowerCase().includes(cautare.toLowerCase())) &&
                (pret === null || (pret >= rangeCercei[0] && pret <= rangeCercei[1])) &&
                (gramaj === null || (gramaj >= rangeGramajCercei[0] && gramaj <= rangeGramajCercei[1])) &&
                hasSelectedSize &&
                hasSelectedMaterial &&
                hasSelectedColor
            );
        });
    };

    const sortedProductCercei = sortProductsByPrice(productCercei);
    const filteredProductCercei = filterProductsC(sortedProductCercei);

    const [maxPretBratari, setMaxPretBratari] = useState(null);
    const [minPretBratari, setMinPretBratari] = useState(null);
    const [rangeBratari, setRangeBratari] = useState([0, 0]);
    const [maxGramajBratari, setMaxGramajBratari] = useState(null);
    const [minGramajBratari, setMinGramajBratari] = useState(null);
    const [rangeGramajBratari, setRangeGramajBratari] = useState([0, 0]);

    useEffect(() => {
        if (productBratari.length > 0) {
            const preturiBratari = productBratari.map(produs => {
                const pretBratari = parseFloat(produs.pret.toString().replace(/\./g, ""));
                return isNaN(pretBratari) ? null : pretBratari;
            }).filter(pretBratari => pretBratari !== null);

            if (preturiBratari.length > 0) {
                const maxPretBratari = Math.max(...preturiBratari);
                const minPretBratari = Math.min(...preturiBratari);
                setMaxPretBratari(maxPretBratari);
                setMinPretBratari(minPretBratari);
                setRangeBratari([minPretBratari, maxPretBratari]);
            }

            const gramajeBratari = productBratari.map(produs => {
                const gramaj = produs.gramaj ? parseFloat(produs.gramaj.toString()) : null;
                return isNaN(gramaj) ? null : gramaj;
            }).filter(gramaj => gramaj !== null);

            if (gramajeBratari.length > 0) {
                const maxGramajBratari = Math.max(...gramajeBratari);
                const minGramajBratari = Math.min(...gramajeBratari);
                setMaxGramajBratari(maxGramajBratari);
                setMinGramajBratari(minGramajBratari);
                setRangeGramajBratari([minGramajBratari, maxGramajBratari]);
            }
        }
    }, [productBratari]);

    const filterProductsB = (products) => {
        return products.filter((obj) => {
            const pret = obj.pret ? parseFloat(obj.pret.toString().replace(/\./g, "")) : null;
            const gramaj = obj.gramaj ? parseFloat(obj.gramaj.toString()) : null;
            const sizes = ['marime', 'marime2', 'marime3', 'marime4', 'marime5', 'marime6', 'marime7', 'marime8'];
            const hasSelectedSize = selectedSizes.length === 0 || sizes.some(size => selectedSizes.includes(obj[size]));
            const hasSelectedMaterial = selectedMaterials.length === 0 || selectedMaterials.includes(obj.material);
            const hasSelectedColor = selectedColors.length === 0 || selectedColors.includes(obj.culoare);

            return (
                (obj.nume.toLowerCase().includes(cautare.toLowerCase()) ||
                obj.material.toLowerCase().includes(cautare.toLowerCase())) &&
                (pret === null || (pret >= rangeBratari[0] && pret <= rangeBratari[1])) &&
                (gramaj === null || (gramaj >= rangeGramajBratari[0] && gramaj <= rangeGramajBratari[1])) &&
                hasSelectedSize &&
                hasSelectedMaterial &&
                hasSelectedColor
            );
        });
    };

    const sortedProductBratari = sortProductsByPrice(productBratari);
    const filteredProductBratari = filterProductsB(sortedProductBratari);

    const [maxPretPandantive, setMaxPretPandantive] = useState(null);
    const [minPretPandantive, setMinPretPandantive] = useState(null);
    const [rangePandantive, setRangePandantive] = useState([0, 0]);
    const [maxGramajPandantive, setMaxGramajPandantive] = useState(null);
    const [minGramajPandantive, setMinGramajPandantive] = useState(null);
    const [rangeGramajPandantive, setRangeGramajPandantive] = useState([0, 0]);

    useEffect(() => {
        if (productPandantive.length > 0) {
            const preturiPandantive = productPandantive.map(produs => {
                const pretPandantive = parseFloat(produs.pret.toString().replace(/\./g, ""));
                return isNaN(pretPandantive) ? null : pretPandantive;
            }).filter(pretPandantive => pretPandantive !== null);

            if (preturiPandantive.length > 0) {
                const maxPretPandantive = Math.max(...preturiPandantive);
                const minPretPandantive = Math.min(...preturiPandantive);
                setMaxPretPandantive(maxPretPandantive);
                setMinPretPandantive(minPretPandantive);
                setRangePandantive([minPretPandantive, maxPretPandantive]);
            }

            const gramajePandantive = productPandantive.map(produs => {
                const gramaj = produs.gramaj ? parseFloat(produs.gramaj.toString()) : null;
                return isNaN(gramaj) ? null : gramaj;
            }).filter(gramaj => gramaj !== null);

            if (gramajePandantive.length > 0) {
                const maxGramajPandantive = Math.max(...gramajePandantive);
                const minGramajPandantive = Math.min(...gramajePandantive);
                setMaxGramajPandantive(maxGramajPandantive);
                setMinGramajPandantive(minGramajPandantive);
                setRangeGramajPandantive([minGramajPandantive, maxGramajPandantive]);
            }
        }
    }, [productPandantive]);

    const filterProductsP = (products) => {
        return products.filter((obj) => {
            const pret = obj.pret ? parseFloat(obj.pret.toString().replace(/\./g, "")) : null;
            const gramaj = obj.gramaj ? parseFloat(obj.gramaj.toString()) : null;
            const sizes = ['marime', 'marime2', 'marime3', 'marime4', 'marime5', 'marime6', 'marime7', 'marime8'];
            const hasSelectedSize = selectedSizes.length === 0 || sizes.some(size => selectedSizes.includes(obj[size]));
            const hasSelectedMaterial = selectedMaterials.length === 0 || selectedMaterials.includes(obj.material);
            const hasSelectedColor = selectedColors.length === 0 || selectedColors.includes(obj.culoare);

            return (
                (obj.nume.toLowerCase().includes(cautare.toLowerCase()) ||
                obj.material.toLowerCase().includes(cautare.toLowerCase())) &&
                (pret === null || (pret >= rangePandantive[0] && pret <= rangePandantive[1])) &&
                (gramaj === null || (gramaj >= rangeGramajPandantive[0] && gramaj <= rangeGramajPandantive[1])) &&
                hasSelectedSize &&
                hasSelectedMaterial &&
                hasSelectedColor
            );
        });
    };

    const sortedProductPandantive = sortProductsByPrice(productPandantive);
    const filteredProductPandantive = filterProductsP(sortedProductPandantive);

    const handleSizeChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedSizes([...selectedSizes, value]);
        } else {
            setSelectedSizes(selectedSizes.filter(size => size !== value));
        }
    };

    const handleMaterialChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedMaterials([...selectedMaterials, value]);
        } else {
            setSelectedMaterials(selectedMaterials.filter(material => material !== value));
        }
    };

    const handleColorChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedColors([...selectedColors, value]);
        } else {
            setSelectedColors(selectedColors.filter(color => color !== value));
        }
    };

    const reset = () => {
        setCautare('');
        setFiltruPret('');
        setFiltruGrame('');
        setRangeInele([minPretInele, maxPretInele]);
        setRangeGramajInele([minGramajInele, maxGramajInele]);
        setSelectedSizes([]);
        setSelectedMaterials([]);
        setSelectedColors([]);
        setRangeVerighete([minPretVerighete, maxPretVerighete]);
        setRangeGramajVerighete([minGramajVerighete, maxGramajVerighete]);
        setRangePret([minPret, maxPret]);
        setRangeGramajColiere([minGramajColiere, maxGramajColiere]);
        setRangeCercei([minPretCercei, maxPretCercei]);
        setRangeGramajCercei([minGramajCercei, maxGramajCercei]);
        setRangeBratari([minPretBratari, maxPretBratari]);
        setRangeGramajBratari([minGramajBratari, maxGramajBratari]);
        setRangePandantive([minPretPandantive, maxPretPandantive]);
        setRangeGramajPandantive([minGramajPandantive, maxGramajPandantive]);
    };

    return (
        <Context.Provider value={{
            loading, setLoading, users, setUsers, isLoggedIn, logout, setIsLoggedIn, getUserData, setUserAf, userAf,
            filtruTip, filtruGrame, filtruPret, setFiltruGrame, setFiltruPret, setFiltruTip, cautare, setCautare,
            products, setProducts, addProduct, product, currentImages, setCurrentImages, secondaryImages, setSecondaryImages, mainImage, setMainImage,
            edithandle, updateProduct, deleteProduct, comenzi, id, cont, getProductData, productInele, productBratari, productCercei, productColiere,
            productPandantive, productVerighete, toateProdusele, produseFavorite, produsePersonalizate,
            filteredProductColiere, reset, minPret, maxPret, setRangePret, rangePret, setMaxPret, setMinPret,
            minGramajColiere, maxGramajColiere, setRangeGramajColiere, rangeGramajColiere, selectedSizes, setSelectedSizes, selectedMaterials, setSelectedMaterials,
            selectedColors, setSelectedColors, handleImageClick, handleImageChange, handleMouseLeave, handleMouseEnter, setHoveredIndex,
            handleAddToCart, prodrand, handleSizeChange, handleMaterialChange, handleColorChange,
            maxPretInele, minPretInele, rangeInele, setRangeInele, filteredProductInele,
            maxGramajInele, setMaxGramajInele, minGramajInele, setMinGramajInele, rangeGramajInele, setRangeGramajInele,
            maxPretVerighete, minPretVerighete, rangeVerighete, setRangeVerighete, filteredProductVerighete,
            maxGramajVerighete, setMaxGramajVerighete, minGramajVerighete, setMinGramajVerighete, rangeGramajVerighete, setRangeGramajVerighete,
            maxPretCercei, minPretCercei, rangeCercei, setRangeCercei, filteredProductCercei,
            maxGramajCercei, setMaxGramajCercei, minGramajCercei, setMinGramajCercei, rangeGramajCercei, setRangeGramajCercei,
            maxPretPandantive, minPretPandantive, rangePandantive, setRangePandantive, filteredProductPandantive,
            maxGramajPandantive, setMaxGramajPandantive, minGramajPandantive, setMinGramajPandantive, rangeGramajPandantive, setRangeGramajPandantive,
            maxPretBratari, minPretBratari, rangeBratari, setRangeBratari, filteredProductBratari,
            maxGramajBratari, setMaxGramajBratari, minGramajBratari, setMinGramajBratari, rangeGramajBratari, setRangeGramajBratari,
            adaugareInCos, adaugaInFavorite, heart, favorite, user, handleAddToFavorites,
            produseCos, produsDec, produsInc, setProduseCos, nrProd, pretTotal, sterge,deliveryDetails,setDeliveryDetails
        }}>
            {props.children}
        </Context.Provider>
    );
}

export default Date;
