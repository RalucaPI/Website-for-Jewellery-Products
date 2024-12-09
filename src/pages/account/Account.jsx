import React, { useEffect, useState } from 'react';
import { auth, database } from '../../firebase/firebase';
import { doc, getDoc, query, where, collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const Account = () => {
  const [userData, setUserData] = useState(null);
  const [personalizedOrders, setPersonalizedOrders] = useState([]);
  const [cashOnDeliveryOrders, setCashOnDeliveryOrders] = useState([]);
  const [paidOrders, setPaidOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = query(collection(database, 'Conturi'), where('uid', '==', user.uid));
          const userDocSnapshot = await getDocs(userDocRef);
          if (!userDocSnapshot.empty) {
            const userDoc = userDocSnapshot.docs[0];
            setUserData(userDoc.data());
          } else {
            console.log('No matching documents.');
          }

          // Fetch personalized orders
          const personalizedOrdersCollection = collection(database, `Client/UID ${user.uid}/Comenzi personalizate`);
          const personalizedOrdersSnapshot = await getDocs(personalizedOrdersCollection);
          setPersonalizedOrders(personalizedOrdersSnapshot.docs.map(doc => doc.data()));

          // Fetch cash on delivery orders
          const cashOnDeliveryOrdersCollection = collection(database, `Client/UID ${user.uid}/Comanda ramburs`);
          const cashOnDeliveryOrdersSnapshot = await getDocs(cashOnDeliveryOrdersCollection);
          setCashOnDeliveryOrders(cashOnDeliveryOrdersSnapshot.docs.map(doc => doc.data()));

          // Fetch paid orders
          const paidOrdersCollection = collection(database, `Client/UID ${user.uid}/Comanda platita`);
          const paidOrdersSnapshot = await getDocs(paidOrdersCollection);
          setPaidOrders(paidOrdersSnapshot.docs.map(doc => doc.data()));
        } catch (error) {
          console.error('Error getting documents: ', error);
        }
      } else {
        setUserData(null);
        setPersonalizedOrders([]);
        setCashOnDeliveryOrders([]);
        setPaidOrders([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Please log in to see your account details.</div>;
  }

  return (
    <div>
      <h2>Detaliile contului</h2>
      <p><strong>Nume:</strong> {userData.nume}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Telefon:</strong> {userData.telefon}</p>
      <p><strong>Adresa:</strong> {userData.adresa}</p>
      <p><strong>Localitate:</strong> {userData.localitate}</p>

      <h2>Comenzi Personalizate</h2>
      {personalizedOrders.length > 0 ? (
        <ul>
          {personalizedOrders.map((order, index) => (
            <li key={index}>
              <p><strong>Categorie:</strong> {order.categorie}</p>
              <p><strong>Marime:</strong> {order.marime}</p>
              <p><strong>Material:</strong> {order.material}</p>
              <p><strong>Pret:</strong> {order.pret} Lei</p>
              <p><strong>Descriere:</strong> {order.descriere}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nu ai comenzi personalizate.</p>
      )}

      <h2>Comenzi Ramburs</h2>
      {cashOnDeliveryOrders.length > 0 ? (
        <ul>
          {cashOnDeliveryOrders.map((order, index) => (
            <li key={index}>
              <p><strong>Produse:</strong> {order.produse}</p>
              <p><strong>Total:</strong> {order.total} Lei</p>
              <p><strong>Data:</strong> {order.data}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nu ai comenzi ramburs.</p>
      )}

      <h2>Comenzi Platite</h2>
      {paidOrders.length > 0 ? (
        <ul>
          {paidOrders.map((order, index) => (
            <li key={index}>
              <p><strong>Produse:</strong> {order.produseCos.map((produs, index) => (<>
                <li key={index}></li>
                <p>{produs.nume}</p>
              </>
              ))}
              </p>
              <p><strong>Total:</strong> {order.pretTotal} Lei</p>
              <p><strong>Numar produse</strong> {order.nrProd}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nu ai comenzi platite.</p>
      )}
    </div>
  );
};

export default Account;
