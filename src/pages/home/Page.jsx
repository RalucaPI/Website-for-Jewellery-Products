import React, { useState, useEffect, useContext } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { database } from '../../firebase/firebase';
import { Link } from 'react-router-dom';
import { TiHeartOutline, TiHeart } from "react-icons/ti"; // Adaugă și iconița TiHeart
import Context from '../../context/Context';

export function Page() {
    const {prodrand, favorite,
        handleMouseLeave, handleMouseEnter,
        handleAddToCart, handleAddToFavorites } = useContext(Context);
    
    return (
        <div className=" p-4">
            
            <h1 className='text-4xl text-center mb-14 mt-8 font-bold'>Products</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1 mx-2">
                        {prodrand.map((product, index) => {
                            const { id, nume, img1, pret } = product;
                            const marimi = ['marime', 'marime2', 'marime3', 'marime4', 'marime5', 'marime6', 'marime7', 'marime8'];
                           
                            const isFavorite = favorite[id];

                            return (
                                <div
                                    key={index}
                                    className="border-2 hover:shadow-2xl hover:scale-105 transition-shadow duration-300 ease-in-out
                                     border-[#cdc8ff] border-opacity-60  overflow-hidden flex flex-col justify-between min-h-[350px] max-h-[380px]"
                                    
                                >
                                    <div
                                        onMouseEnter={() => handleMouseEnter(index)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <div className="h-[190px] flex justify-center items-center  mb-4">
                                            <Link to={`/produs/${id}`}>
                                                <img
                                                    className=" w-full h-full object-cover mb-4 p-2 hover:scale-105 transition-transform duration-300 ease-in-out"
                                                    src={img1}
                                                    alt={nume}
                                                />
                                            </Link>
                                        </div>
                                       

                                        <div className="leading-relaxed  mx-2">
                                             <div className="title-font text-lg font-medium text-gray-900 truncate text-center p-2 mt-6">
                                            <Link to={`/produs/${id}`} className="no-underline text-black">
                                                {nume}
                                            </Link>
                                            </div>
                                              <select className=" rounded-md p-2"
                                                    defaultValue=""
                                                    onChange={(e) => product.selectedSize = e.target.value}
                                                >
                                                    <option value="" disabled>Select a size</option>
                                                    {marimi.map((sizeField, idx) => {
                                                        const sizeValue = product[sizeField];
                                                        return (
                                                            sizeValue && <option key={idx} value={sizeValue}>{sizeValue}</option>
                                                        );
                                                    })}
                                                </select>
                                            <div className="flex justify-between items-center">
                                                <div className="tracking-widest text-s title-font font-small mb-1 ml-4">
                                                    {pret} Lei
                                                </div>
                                                <div className="">
                                                    <button
                                                        className='fas fa-heart'
                                                        onClick={() => handleAddToFavorites(product)}
                                                    >
                                                        {isFavorite ? <TiHeart size={30} color="red" /> : <TiHeartOutline size={30} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="leading-relaxed mb-3 mx-2 mt-auto">
                                        <div className="flex justify-between items-center ">
                                            <button
                                                type="button"
                                                onClick={() => handleAddToCart(product, product.selectedSize)}
                                                className="focus:outline-none text-black bg-[#dfccff] hover:bg-[#ce99ff] focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm w-full py-2 px-4"
                                            >
                                                Add to cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
    );
}
