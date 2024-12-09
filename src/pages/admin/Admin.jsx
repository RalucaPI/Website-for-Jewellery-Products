import React, { useState, useContext, useEffect } from 'react';
import Context from '../../context/Context';
import { collection, getDocs } from 'firebase/firestore';
import { database, auth } from '../../firebase/firebase';
import './Admin.css'; // Poți crea acest fișier CSS pentru stilizare
import Calendar from './Calendar';

export const Admin = () => {
  const context = useContext(Context);
  const { users, toateProdusele, user } = context;
  const [view, setView] = useState('produse');
  const [comenziRamburs, setComenziRamburs] = useState([]);
  const [comenziPlatite, setComenziPlatite] = useState([]);
  const [comenziPersonalizate, setComenziPersonalizate] = useState([]);

  useEffect(() => {
    if (user) {
      fetchComenzi('Comanda ramburs', setComenziRamburs);
      fetchComenzi('Comanda platita', setComenziPlatite);
      fetchComenzi('Comenzi personalizate', setComenziPersonalizate);
    }
  }, [user]);

  const fetchComenzi = async (type, setState) => {
    const result = await getDocs(collection(database, `Client/UID ${auth.currentUser.uid}/${type}`));
    const comenziArray = result.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setState(comenziArray);
  };

  const renderTable = () => {
    switch (view) {
      case 'produse':
        return renderProduseTable();
      case 'conturi':
        return renderConturiTable();
      case 'comenziRamburs':
        return renderComenziTable(comenziRamburs);
      case 'comenziPlatite':
        return renderComenziTable(comenziPlatite);
      case 'comenziPersonalizate':
        return renderComenziPersonalizateTable();
      case 'programari':
        return renderProgramari();
      default:
        return null;
    }
  };
  const renderProgramari = () => (
    <>
    
      <Calendar />
    </>
  )
  const renderProduseTable = () => (
    <table>
      <thead>
        <tr>
          <th>Nr.</th>
          <th>Imagine</th>
          <th>Nume</th>
          <th>Tip</th>
          <th>Pret</th>
          <th>Material</th>
          <th>Gramaj</th>
        </tr>
      </thead>
      <tbody>
        {toateProdusele.map((produs, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td><img src={produs.img1} alt={produs.nume} width="50" /></td>
            <td>{produs.nume}</td>
            <td>{produs.tip}</td>
            <td>{produs.pret}</td>
            <td>{produs.material}</td>
            <td>{produs.gramaj}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderConturiTable = () => (
    <table>
      <thead>
        <tr>
          <th>Nr</th>
          <th>UID</th>
          <th>Nume</th>
          <th>Telefon</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{user.uid}</td>
            <td>{user.nume}</td>
            <td>{user.telefon}</td>
            <td>{user.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderComenziTable = (comenzi) => (
    <table>
      <thead>
        <tr>
          <th>Nr</th>
          <th>Nume</th>
          <th>Email</th>
          <th>Telefon</th>
          <th>Adresa</th>
          <th>Localitate</th>
          <th>Pret</th>
          <th>Nume Produse</th>
          <th>Marimea Produse</th>
        </tr>
      </thead>
      <tbody>
        {comenzi.map((comanda, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{comanda.nume}</td>
            <td>{comanda.email}</td>
            <td>{comanda.telefon}</td>
            <td>{comanda.adresa}</td>
            <td>{comanda.localitate}</td>
            <td>{comanda.pretTotal}</td>
            <td>{comanda.produseCos.map((produs) => produs.nume).join(', ')}</td>
            <td>{comanda.produseCos.map((produs) => produs.marime).join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderComenziPersonalizateTable = () => (
    <table>
      <thead>
        <tr>
          <th>Nr</th>
          <th>Telefon</th>
          <th>Categorie</th>
          <th>Marime</th>
          <th>Material</th>
          <th>Talisman</th>
          <th>Gravura Text</th>
          <th>Font</th>
          <th>Bijuterie</th>
          <th>Culoare Bijuterie</th>
          <th>Descriere</th>
          <th>Img1</th>
          <th>Pret</th>
        </tr>
      </thead>
      <tbody>
        {comenziPersonalizate.map((comanda, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{comanda.telefon}</td>
            <td>{comanda.categorie}</td>
            <td>{comanda.marime}</td>
            <td>{comanda.material}</td>
            <td>{comanda.talisman}</td>
            <td>{comanda.gravuraText}</td>
            <td>{comanda.font}</td>
            <td>{comanda.bijuterie}</td>
            <td>{comanda.culoareBijuterie}</td>
            <td>{comanda.descriere}</td>
            <td><img src={comanda.img1} alt={comanda.nume} width="50" /></td>
            <td>{comanda.pret}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="admin-container">
      <div className="sidebar">
        <button onClick={() => setView('produse')}>Produse</button>
        <button onClick={() => setView('conturi')}>Conturi</button>
        <button onClick={() => setView('comenziRamburs')}>Comenzi Ramburs</button>
        <button onClick={() => setView('comenziPlatite')}>Comenzi Platite</button>
        <button onClick={() => setView('comenziPersonalizate')}>Comenzi Personalizate</button>
        <button onClick={() => setView('programari')}>Programari</button>
      </div>
      <div className="table-container">
        {renderTable()}
      </div>
    </div>
  );
};

export default Admin;
