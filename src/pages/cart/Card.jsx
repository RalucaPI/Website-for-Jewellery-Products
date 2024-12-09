import React, { useContext, useState } from 'react';
import { addDoc, collection, deleteDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { database, auth } from '../../firebase/firebase';
import Context from '../../context/Context';
import './Card.css';

export const Card = ({ closeModal }) => {
  const context = useContext(Context);
  const { pretTotal, nrProd, produseCos, deliveryDetails, setDeliveryDetails } = context;
  const [cardDetails, setCardDetails] = useState({
    numarCard: '',
    dataExpirare: '',
    codSecuritate: '',
  });
  const navigate = useNavigate();

  const stergeProduseCard = async (user) => {
    console.log('Sterge produse din coș');
    if (!user) {
      console.log('Utilizatorul nu este autentificat');
      return;
    }
    try {
      const docRefs = await getDocs(collection(database, `Client/UID ${auth.currentUser.uid}/Produse cos`));
      const deletePromises = docRefs.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log('Produsele au fost șterse cu succes');
    } catch (error) {
      console.error('Eroare la ștergerea produselor din coș:', error);
    }
  };

  const finalizarePlataCard = async (e) => {
    e.preventDefault();
    console.log('Plata card inițiată');
    const user = auth.currentUser;

    const [luna, an] = cardDetails.dataExpirare.split('/');
    const dataExpirareCard = new Date(`20${an}`, luna - 1);

    if (dataExpirareCard < new Date()) {
      alert('Data expirării cardului este în trecut. Vă rugăm introduceți o dată validă.');
      return;
    }

    if (
      cardDetails.numarCard.replace(/\s/g, '').length !== 16 ||
      !/^\d+$/.test(cardDetails.numarCard.replace(/\s/g, '')) ||
      cardDetails.dataExpirare.length !== 5 ||
      !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.dataExpirare) ||
      cardDetails.codSecuritate.length !== 3 ||
      !/^\d+$/.test(cardDetails.codSecuritate)
    ) {
      alert('Introduceți detaliile cardului corecte!');
      return;
    }

    try {
      await addDoc(collection(database, `Client/UID ${auth.currentUser.uid}/Comanda platita`), {
        ...deliveryDetails,
        pretTotal,
        nrProd,
        produseCos,
      });
      setDeliveryDetails({
        nume: '',
        email: '',
        telefon: '',
        adresa: '',
        localitate: '',
        judet: ''
      });
      await stergeProduseCard(user);
      alert('Plata cu cardul a fost finalizată cu succes!');
      closeModal();
      navigate('/');
    } catch (error) {
      console.error('Eroare la efectuarea plății cu cardul:', error);
    }
  };

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    console.log('Card detail changed:', name, value);
    if (name === 'numarCard') {
      const newValue = value.replace(/\s/g, '');
      const formattedValue = newValue.replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim();
      setCardDetails((prevDetails) => ({
        ...prevDetails,
        [name]: formattedValue,
      }));
    } else if (name === 'dataExpirare') {
      const newValue = value.replace(/[^0-9/]/g, '');
      if (newValue.length <= 5) {
        let formattedValue = newValue;
        if (newValue.length === 3 && !newValue.endsWith('/')) {
          formattedValue = `${newValue.substr(0, 2)}/${newValue.substr(2)}`;
        }
        setCardDetails((prevDetails) => ({
          ...prevDetails,
          [name]: formattedValue,
        }));
      }
    } else if (name === 'codSecuritate') {
      const newValueCVV = value.replace(/[^0-9/]/g, '');
      if (newValueCVV.length <= 3) {
        setCardDetails((prevDetails) => ({
          ...prevDetails,
          [name]: newValueCVV,
        }));
      }
    } else {
      setCardDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  return (
    <div className="modal_card">
      <div className="modal-content_card">
        <span className="close_card" onClick={closeModal}>&times;</span>
        <div id="form-container">
          <div id="card-front">
            <div id="shadow"></div>
            <div id="image-container">
              <span id="amount">Total: <strong>{pretTotal} Lei</strong></span>
              <span id="card-image">
                <i className="fa fa-credit-card"></i>
              </span>
            </div>
            <label htmlFor="card-number" className='lbl_card'>Numar card</label>
            <input
              className='inp_card'
              type="text"
              id="card-number"
              name="numarCard"
              value={cardDetails.numarCard}
              onChange={handleCardDetailsChange}
              placeholder="1234 5678 9101 1112"
              maxLength={19}
              pattern="[0-9]*"
              required
            />
            <div id="cardholder-container">
              <label htmlFor="card-holder" className='lbl_card'>Nume titular</label>
              <input
                className='inp_card'
                type="text"
                id="card-holder"
                name="nume"
                value={deliveryDetails.nume}
                onChange={(e) => setDeliveryDetails({ ...deliveryDetails, nume: e.target.value })}
                placeholder="e.g. Radu Alina"
                required
              />
            </div>
            <div id="exp-container">
              <label htmlFor="card-exp" className='lbl_card'>Data expirarii: </label>
              <input
                className='inp_card'
                id="card-month"
                type="text"
                name="dataExpirare"
                value={cardDetails.dataExpirare}
                onChange={handleCardDetailsChange}
                placeholder="MM/YY"
                maxLength={5}
                pattern="\d{2}/\d{2}"
                required
              />
            </div>
            <div id="cvc-container">
              <label htmlFor="card-cvc" className='lbl_card'>CVC/CVV</label>
              <input
                className='inp_card'
                id="card-cvc"
                name="codSecuritate"
                value={cardDetails.codSecuritate}
                onChange={handleCardDetailsChange}
                placeholder="XXX"
                maxLength={3}
                required
              />
              <p>Cod securitate</p>
            </div>
          </div>
          <div id="card-back">
            <div id="card-stripe"></div>
          </div>
          <button type="button" id="card-btn" onClick={finalizarePlataCard}>Plaseaza comanda</button>
        </div>
      </div>
    </div>
  );
};

export default Card;
