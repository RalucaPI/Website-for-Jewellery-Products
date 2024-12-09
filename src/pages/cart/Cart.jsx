import React, { useState, useContext, useEffect } from 'react';
import { ShowProducts } from './ShowProducts';
import Context from '../../context/Context';
import { database, auth } from '../../firebase/firebase';
import { collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { Card } from './Card';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

export const Cart = () => {
  const context = useContext(Context);
  const { produseCos, produsDec, produsInc, setProduseCos, nrProd, pretTotal, user, deliveryDetails, setDeliveryDetails } = context;
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  useEffect(() => {
    const fetchProduseCos = async () => {
      if (user) {
        try {
          const produseSnapshot = await getDocs(collection(database, `Client/UID ${user.uid}/Produse cos`));
          const produseList = produseSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setProduseCos(produseList);
        } catch (error) {
          console.error('Error fetching cart products:', error);
        }
      }
    };

    fetchProduseCos();
  }, [user, setProduseCos]);

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setShowPaymentMethods(true);
  };

  const handleCashPayment = async () => {
    try {
      await addDoc(collection(database, `Client/UID ${auth.currentUser.uid}/Comanda ramburs`), {
        ...deliveryDetails,
        pretTotal,
        nrProd,
        produseCos,
      });
      clearForm();
      alert('Comanda a fost finalizata cu succes!');
      await stergeProduseCos();
      navigate('/');
    } catch (error) {
      console.error('Eroare:', error);
    }
  };

  const clearForm = () => {
    setDeliveryDetails({
      nume: '',
      email: '',
      telefon: '',
      adresa: '',
      localitate: '',
      judet: ''
    });
  };

  const stergeProduseCos = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRefs = await getDocs(collection(database, `Client/UID ${auth.currentUser.uid}/Produse cos`));
      const deletePromises = docRefs.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Eroare la ștergerea produselor din coș:', error);
    }
  };

  const openModal = () => {
    console.log('Deschidere modal');
    setShowModal(true);
  };

  const closeModal = () => {
    console.log('Inchidere modal');
    setShowModal(false);
  };

  return (
    <>
      {produseCos.length > 0 ? (
        <>
          <div className="rounded-lg bg-[#ffffff] w-3/4 mx-auto my-6">
            <ShowProducts
              productsCart={produseCos}
              productIncrement={produsInc}
              productDecrement={produsDec}
              setCartProduct={setProduseCos}
            />
          </div>
          <div className="mx-auto max-w-6xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
            <div className="mt-6 h-full bg-[#ffffff] p-6 shadow-md md:mt-0 md:w-1/3">
              <div className="flex justify-between">
                <p className="text-gray-700">Total produse</p>
                <p className="text-gray-700">{nrProd}</p>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between mb-3">
                <p className="text-lg font-bold">Total</p>
                <div>
                  <p className="mb-1 text-lg font-bold">{pretTotal} Lei</p>
                </div>
              </div>
            </div>
          </div>
          <div className="form_cout mx-auto max-w-4xl justify-center px-6 md:space-x-6 xl:px-0">
            <div className="text_checkout border-b-2 border-black text-white">
              Date livrare
            </div>
            <form onSubmit={handleAddressSubmit} className="form_checkout justify-center border-transparent">
              <div className="form_row border-transparent">
                <div className="input_data border-transparent">
                  <input
                    type="text"
                    name="numeClient"
                    value={deliveryDetails.nume}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, nume: e.target.value })}
                    placeholder="Nume si prenume"
                    required
                    className="input_cout border-transparent"
                  />
                  <div className="underline"></div>
                </div>
              </div>
              <div className="form_row">
                <div className="input_data border-transparent">
                  <input
                    type="text"
                    name="telefon"
                    value={deliveryDetails.telefon}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, telefon: e.target.value })}
                    placeholder="Telefon"
                    required
                    className="input_cout border-transparent"
                  />
                  <div className="underline"></div>
                </div>
              </div>
              <div className="form_row">
                <div className="input_data">
                  <input
                    type="email"
                    name="email"
                    value={deliveryDetails.email}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, email: e.target.value })}
                    placeholder="Email"
                    required
                    className="input_cout"
                  />
                  <div className="underline"></div>
                </div>
              </div>
              <div className="form_row">
                <div className="input_data">
                  <input
                    type="text"
                    name="adresa"
                    value={deliveryDetails.adresa}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, adresa: e.target.value })}
                    placeholder="Adresa de livrare"
                    required
                    className="input_cout"
                  />
                  <div className="underline"></div>
                </div>
              </div>
              <div className="form_row">
                <div className="input_data">
                  <input
                    type="text"
                    name="localitate"
                    value={deliveryDetails.localitate}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, localitate: e.target.value })}
                    placeholder="Localitate"
                    required
                    className="input_cout"
                  />
                  <div className="underline"></div>
                </div>
              </div>
              <div className="form_row">
                <div className="input_data">
                  <input
                    type="text"
                    name="judet"
                    value={deliveryDetails.judet}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, judet: e.target.value })}
                    placeholder="Județ"
                    required
                    className="input_cout"
                  />
                  <div className="underline"></div>
                </div>
              </div>
              <div className="form_row submit_btn_cout text-center items-center">
                <div className="input_data">
                  <div className="inner items-center text-center"></div>
                  <button className="submit_bt" type="submit">Continua</button>
                </div>
              </div>
            </form>
          </div>
          <div className="payment-methods items-start mx-auto max-w-4xl mb-6 px-6 md:space-x-6 xl:px-0">
            {showPaymentMethods && (
              <div>
                <div className="text-left ml-12 met_plt text-3xl font-semibold border-b-2 border-black">Metoda de plata</div>
                <div className="payment-method pt-4 ml-6">
                  <input
                    type="checkbox"
                    id="cash"
                    name="paymentMethod"
                    value="cash"
                    checked={selectedPaymentMethod === 'cash'}
                    onChange={() => setSelectedPaymentMethod('cash')}
                    className="hidden"
                  />
                  <label htmlFor="cash" className="payment-method-label">
                    Ramburs la curier
                  </label>
                </div>
                <div className="payment-method ml-6">
                  <input
                    type="checkbox"
                    id="card"
                    name="paymentMethod"
                    value="card"
                    checked={selectedPaymentMethod === 'card'}
                    onChange={() => setSelectedPaymentMethod('card')}
                    className="hidden"
                  />
                  <label htmlFor="card" className="payment-method-label">
                    Plata online cu cardul
                  </label>
                </div>
              </div>
            )}
            {selectedPaymentMethod === 'cash' && (
              <button onClick={handleCashPayment} className=" ">
                <label htmlFor="card" className="payment-method-label">Comanda ramburs</label>
              </button>
            )}
            {selectedPaymentMethod === 'card' && (
              <button onClick={openModal} className="payment-method">
                <label htmlFor="card" className="payment-method-label">Comanda cu cardul</label>
              </button>
            )}
          </div>
          {showModal && <Card closeModal={closeModal} navigate={navigate} />}
        </>
      ) : (
        <div className="text-center mt-6">
          <p className="text-lg font-bold">Nu aveți niciun produs în coș</p>
        </div>
      )}
    </>
  );
};

export default Cart;
