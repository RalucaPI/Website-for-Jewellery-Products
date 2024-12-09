import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Context from '../../../context/Context';
import Slider from 'rc-slider';
import { TiHeartOutline, TiHeart } from "react-icons/ti";
import 'rc-slider/assets/index.css';

export function Earrings() {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const cardRefs = useRef([]);
    const context = useContext(Context);

    const {
        productCercei, currentImages, setCurrentImages, setCautare, cautare,
        maxPretCercei, minPretCercei, rangeCercei, setRangeCercei, filteredProductCercei,
        reset, maxGramajCercei, minGramajCercei, favorite, handleAddToFavorites, handleAddToCart,
        rangeGramajCercei, setRangeGramajCercei, handleMaterialChange,
        handleColorChange,handleSizeChange, handleMouseLeave, handleMouseEnter,
    } = context;

    const materialValues = [...new Set(productCercei.map(product => product.material).filter(material => material))].sort();
    const colorValues = [...new Set(productCercei.map(product => product.culoare).filter(culoare => culoare))].sort();

    useEffect(() => {
        cardRefs.current.forEach((ref, index) => {
            if (ref) {
                console.log(`Card ${index} height: ${ref.offsetHeight}px`);
            }
        });
    }, [filteredProductCercei]);

  


  const sizeValues = [...new Set(productCercei.flatMap(product => 
    ['marime', 'marime2', 'marime3', 'marime4', 'marime5', 'marime6', 'marime7', 'marime8']
      .map(size => product[size])
      .filter(size => size)
  ))].sort((a, b) => parseFloat(a) - parseFloat(b));
    return (
        <>
            <div>
                <h1 className='text-4xl text-center mb-14 mt-8 font-bold'>Cercei</h1>
            </div>

            <div className="flex">
                <div className="w-1/5 p-4">
                    <div className="filter_container">
                        <input
                            type="text"
                            name="cautare"
                            value={cautare}
                            onChange={(e) => setCautare(e.target.value)}
                            id="cautare_c"
                            placeholder="Cauta aici"
                            className="px-4 py-2 w-full rounded-md text-sm my-2 bg-[#e4e4e4] text-black"
                        />
                        
                        Pret
                        <Slider
                            range
                            min={minPretCercei}
                            max={maxPretCercei}
                            value={rangeCercei}
                            onChange={setRangeCercei}
                            trackStyle={[{ backgroundColor: 'black' }]}
                            handleStyle={[{ borderColor: 'black' }, { borderColor: 'black' }]}
                            railStyle={{ backgroundColor: 'gray' }}
                        />
                        <div className="flex justify-between my-2">
                            <span>{rangeCercei[0]} Lei</span>
                            <span>{rangeCercei[1]} Lei</span>
                        </div>
                        Gramaj
                        <Slider
                            range
                            min={minGramajCercei}
                            max={maxGramajCercei}
                            value={rangeGramajCercei}
                            onChange={setRangeGramajCercei}
                            trackStyle={[{ backgroundColor: 'black' }]}
                            handleStyle={[{ borderColor: 'black' }, { borderColor: 'black' }]}
                            railStyle={{ backgroundColor: 'gray' }}
                        />
                        <div className="flex justify-between mt-2">
                            <span>{rangeGramajCercei[0]} g</span>
                            <span>{rangeGramajCercei[1]} g</span>
                        </div>
                      <div className="size-input-container my-4">
                        <div className="size-field">
                        <span>Marimi:</span>
                            <div className="flex flex-wrap mt-2">
                                {sizeValues.map((size, index) => (
                                <label key={index} className="flex items-center mr-4 mb-2">
                                    <input
                                    type="checkbox"
                                    value={size}
                                    onChange={handleSizeChange}
                                    className="mr-2"
                                    />
                                    {size}
                                </label>
                                ))}
                            </div>
                        </div>
                 </div>
                
                        <div className="material-input-container mt-4 items-start">
                            <div className="material-field">
                                <span>Materiale</span>
                                <div className="flex flex-col items-start mt-2">
                                    {materialValues.map((material, index) => (
                                        <label key={index} className="items-start mb-2">
                                            <input
                                                type="checkbox"
                                                value={material}
                                                onChange={handleMaterialChange}
                                                className="mr-2"
                                            />
                                            {material}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="color-input-container mt-4">
                            <div className="color-field">
                                <span>Coloare</span>
                                <div className="flex flex-col mt-2">
                                    {colorValues.map((color, index) => (
                                        <label key={index} className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                value={color}
                                                onChange={handleColorChange}
                                                className="mr-2"
                                            />
                                            {color}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button onClick={reset} className="px-8 py-2 my-2 w-full mb-4 bg-[#000000] hover:bg-[#454444] text-white text-sm font-medium rounded-md">
                            Sterge filtrarea
                        </button>
                    </div>
                </div>
                <div className="w-4/5 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProductCercei.map((product, index) => {
                            const { id, nume, img1, pret } = product;
                            const marimi = ['marime', 'marime2', 'marime3', 'marime4', 'marime5', 'marime6', 'marime7', 'marime8'];
                           
                            const isFavorite = favorite[id];

                            return (
                                <div
                                    key={index}
                                    className="border-2 hover:shadow-2xl hover:scale-105 transition-shadow duration-300 ease-in-out
                                     border-[#cdc8ff] border-opacity-60 rounded-2xl overflow-hidden flex flex-col justify-between min-h-[350px] max-h-[380px]"
                                    ref={el => cardRefs.current[index] = el}
                                >
                                    <div
                                        onMouseEnter={() => handleMouseEnter(index)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <div className="h-[190px] flex justify-center items-center  mb-4">
                                            <Link to={`/produs/${id}`}>
                                                <img
                                                    className="rounded-2xl w-full h-full object-cover mb-4 p-2 hover:scale-105 transition-transform duration-300 ease-in-out"
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
                                                    <option value="" disabled>Selectează mărimea</option>
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
                                                Adaugă în coș
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
