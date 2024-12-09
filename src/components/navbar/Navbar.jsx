import React, { Fragment, useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { PiShoppingCartBold } from "react-icons/pi";
import { RiAdminLine } from "react-icons/ri";
import { VscAccount } from "react-icons/vsc";
import { TiHeartOutline } from "react-icons/ti";
import { IoSearchSharp, IoMenuSharp, IoCloseSharp } from "react-icons/io5";
import { BsCalendarDay } from "react-icons/bs";
import Context from '../../context/Context';
import { collection, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from "firebase/auth";
import { auth, database } from '../../firebase/firebase';
import "./Navbar.css";

export const Navbar = () => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpen2, setDropdownOpen2] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dropdownTimeout = useRef(null);
    const dropdownTimeout2 = useRef(null);
    const context = useContext(Context);
    const { setCautare, cautare } = context;
    const [productsCart, setCartProduct] = useState(0);
    const [user] = useAuthState(auth);

    const handleSearchChange = (e) => {
        setCautare(e.target.value);
        navigate('/search'); 
    };

    const handleMouseEnter = () => {
        clearTimeout(dropdownTimeout.current);
        setDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        dropdownTimeout.current = setTimeout(() => {
            setDropdownOpen(false);
        }, 200); // 200ms delay before closing
    };

    const handleMouseEnter2 = () => {
        clearTimeout(dropdownTimeout2.current);
        setDropdownOpen2(true);
    };

    const handleMouseLeave2 = () => {
        dropdownTimeout2.current = setTimeout(() => {
            setDropdownOpen2(false);
        }, 200); // 200ms delay before closing
    };

    const signUserOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    useEffect(() => {
        if (user) {
            const cartRef = collection(database, `Client/UID ${auth.currentUser.uid}/Produse cos`);
            const unsubscribe = onSnapshot(cartRef, (snapshot) => {
                const cartItems = snapshot.docs.map((doc) => doc.data());
                const totalCantitate = cartItems.reduce((acc, item) => acc + item.cantitate, 0);
                setCartProduct(totalCantitate);
            });

            return () => {
                unsubscribe();
            };
        } else {
            setCartProduct(0);
        }
    }, [user]);

    return (
        <>
            <div className="sticky top-0 z-50">
                <header className="relative bg-[#e6e6e6]">
                    <nav aria-label="Top" className="px-4 sm:px-6 md:px-8 shadow-xl relative nav_wrapp">
                        <div className="nav_hero">
                            <div className="flex h-16 items-center justify-between">
                                <div className="flex items-center">
                                    <div className="md:hidden flex items-center">
                                        <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-700">
                                            <IoMenuSharp size={24} />
                                        </button>
                                    </div>
                                    <div className="ml-16 flex md:ml-0 mr-20 text-4xl z-10 font-dancing-script  italic">
                                        <button onClick={() => navigate('/')}>Glamour</button>
                                    </div>
                                </div>
                                <div className="ml-auto flex items-center menu">
                                    <div className="hidden md:flex md:flex-1 md:items-center md:justify-center text-l font-medium text-gray-700">
                                        <div className="menu-item menu-item-inele">
                                            <button onClick={() => navigate('/inele')}>Rings</button>
                                        </div>
                                        <div className="menu-item menu-item-verighete">
                                            <button onClick={() => navigate('/verighete')}>Engagement Rings</button>
                                        </div>
                                        <div className="menu-item menu-item-coliere">
                                            <button onClick={() => navigate('/coliere')}>Necklace</button>
                                        </div>
                                        <div className="menu-item menu-item-bratari">
                                            <button onClick={() => navigate('/bratari')}>Bracelets</button>
                                        </div>
                                        <div className="menu-item menu-item-cercei">
                                            <button onClick={() => navigate('/cercei')}>Earrings</button>
                                        </div>
                                        <div className="menu-item menu-item-pandantive">
                                            <button onClick={() => navigate('/pandantive')}>Pendants</button>
                                        </div>
                                        <div
                                            className="menu-item menu-item-buyback"
                                            onMouseEnter={handleMouseEnter}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            Programs
                                            {dropdownOpen && (
                                                <div className="dropdown-content">
                                                    <button onClick={() => navigate('/buyback')}>Buyback</button>
                                                    <button onClick={() => navigate('/personalizare')}>Personalization</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-auto flex items-center">
                                    <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:space-x-6 text-l">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="cautare"
                                                value={cautare}
                                                onChange={handleSearchChange}
                                                id="cautare"
                                                placeholder="Cauta"
                                                className="inp_nav px-6 py-2 pl-10 w-full rounded-md bg-violet-0 border-transparent outline-0 text-sm"
                                            />
                                            <IoSearchSharp size={22} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                        </div>
                                        {user && user.email === 'tester@gmail.com' && (
                                            <>
                                                <button onClick={() => navigate('/admin')}><RiAdminLine size={22} /></button>
                                            </>
                                        )}

                                        <button onClick={() => navigate('/programare')}><BsCalendarDay size={22} /></button>
                                        <div
                                            className="menu-item menu-item-account"
                                            onMouseEnter={handleMouseEnter2}
                                            onMouseLeave={handleMouseLeave2}
                                        >
                                            <VscAccount size={22} />
                                            {dropdownOpen2 && (
                                                <div className="dropdown-content">
                                                    <button onClick={() => navigate('/cont')}>Account</button>
                                                    {user ? (
                                                        <button onClick={signUserOut}>Log out</button>
                                                    ) : (
                                                        <>
                                                            <button onClick={() => navigate('/inregistrare')}>Sign in</button>
                                                            <button onClick={() => navigate('/conectare')}>Log in</button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={() => navigate('/favorite')}><TiHeartOutline size={22} /></button>

                                        <button onClick={() => navigate('/cos')} className='text-black relative'>
                                            <PiShoppingCartBold size={22} />
                                            <span className={productsCart > 0 ? 'cart-indicator show' : 'cart-indicator'}>
                                                {productsCart > 0 && productsCart}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </header>
            </div>

            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex z-40">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative max-w-xs w-full bg-white shadow-xl pb-12 flex flex-col overflow-y-auto">
                                <div className="px-4 pt-5 pb-2 flex">
                                    <button
                                        type="button"
                                        className="-m-2 p-2 mt-3 rounded-md inline-flex items-center justify-center text-gray-400"
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span className="sr-only">Close menu</span>
                                        <IoCloseSharp size={24} />
                                    </button>
                                </div>

                                <div className="mt-2">
                                    <nav className="flex flex-col space-y-2 px-4">
                                        <button onClick={() => { navigate('/inele'); setSidebarOpen(false); }}>Rings</button>
                                        <button onClick={() => { navigate('/verighete'); setSidebarOpen(false); }}>Engagement rings</button>
                                        <button onClick={() => { navigate('/coliere'); setSidebarOpen(false); }}>Necklace</button>
                                        <button onClick={() => { navigate('/bratari'); setSidebarOpen(false); }}>Bracelets</button>
                                        <button onClick={() => { navigate('/cercei'); setSidebarOpen(false); }}>Earrings</button>
                                        <button onClick={() => { navigate('/pandantive'); setSidebarOpen(false); }}>Pendants</button>
                                        <button onClick={() => { navigate('/buyback'); setSidebarOpen(false); }}>Buyback</button>
                                        <button onClick={() => { navigate('/personalizare'); setSidebarOpen(false); }}>Personalization</button>
                                        <button onClick={() => { navigate('/programare'); setSidebarOpen(false); }}><BsCalendarDay size={22} /></button>
                                        {user && user.email === 'alina_radu@gmail.com' && (
                                            <button onClick={() => { navigate('/admin'); setSidebarOpen(false); }}><RiAdminLine size={22} /></button>
                                        )}
                                        <button onClick={() => { navigate('/favorite'); setSidebarOpen(false); }}><TiHeartOutline size={22} /></button>
                                        <button onClick={() => { navigate('/cos'); setSidebarOpen(false); }} className='relative'>
                                            <PiShoppingCartBold size={22} /> 
                                            <span className={productsCart > 0 ? 'cart-indicator2 show' : 'cart-indicator2'}>
                                                {productsCart > 0 && productsCart}
                                            </span>
                                        </button>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="cautare"
                                                value={cautare}
                                                onChange={handleSearchChange}
                                                id="cautare"
                                                placeholder="Cauta"
                                                className="inp_nav px-6 py-2 pl-10 w-full rounded-md bg-violet-0 border-transparent outline-0 text-sm"
                                            />
                                            <IoSearchSharp size={22} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                        </div>
                                        <div className="menu-item-account">
                                            <button onClick={() => { navigate('/cont'); setSidebarOpen(false); }}><VscAccount size={22} /> Account</button>
                                            {user ? (
                                                <button onClick={() => { signUserOut(); setSidebarOpen(false); }}>Log out</button>
                                            ) : (
                                                <>
                                                    <button onClick={() => { navigate('/inregistrare'); setSidebarOpen(false); }}>Sign in</button>
                                                    <button onClick={() => { navigate('/conectare'); setSidebarOpen(false); }}>Log in</button>
                                                </>
                                            )}
                                        </div>
                                    </nav>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
};
