import React, { useContext } from 'react';
import Context from '../../context/Context';

function AddProd() {
    const context = useContext(Context);
    const { products, setProducts, addProduct } = context;

    return (
        <div>
            <div className='flex justify-center items-center min-h-fit'>
                <div className='bg-gray-800 px-10 py-5 rounded-xl'>
                    <div>
                        <h1 className='text-center text-white text-xl mb-4 font-bold'>Add Product</h1>
                    </div>
                    <div>
                        <input type="text"
                            onChange={(e) => setProducts({ ...products, nume: e.target.value })} value={products.nume || ''}
                            name='nume'
                            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product nume'
                        />
                    </div>
                    <div>
                        <input type="text"
                            name='pret'
                            onChange={(e) => setProducts({ ...products, pret: e.target.value })} value={products.pret || ''}
                            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product pret'
                        />
                    </div>
                    <div>
                        <input type="text"
                            name='img1'
                            onChange={(e) => setProducts({ ...products, img1: e.target.value })} value={products.img1 || ''}
                            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product img1'
                        />
                    </div>
                    <div>
                        <input type="text"
                            name='img2'
                            onChange={(e) => setProducts({ ...products, img2: e.target.value })} value={products.img2 || ''}
                            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product img2'
                        />
                    </div>
                    <div>
                        <input type="text"
                            name='img3'
                            onChange={(e) => setProducts({ ...products, img3: e.target.value })} value={products.img3 || ''}
                            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product img3'
                        />
                    </div>
                    <div>
                        <input type="text"
                            name='material'
                            onChange={(e) => setProducts({ ...products, material: e.target.value })} value={products.material || ''}
                            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product material'
                        />
                    </div>
                    <div>
                        <input type="text"
                            name='culoare'
                            onChange={(e) => setProducts({ ...products, culoare: e.target.value })} value={products.culoare || ''}
                            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product culoare'
                        />
                    </div>
                    <div>
                        <input type="text"
                            name='marime'
                            onChange={(e) => setProducts({ ...products, marime: e.target.value })} value={products.marime || ''}
                            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product marime'
                        />
                    </div>
                    <div className='flex justify-center mb-3'>
                        <button
                            onClick={addProduct}
                            className='bg-yellow-500 w-full text-black font-bold px-2 py-2 rounded-lg'>
                            Add Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProd;
