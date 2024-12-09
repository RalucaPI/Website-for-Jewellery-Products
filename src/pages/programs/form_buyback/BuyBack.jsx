import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './buy.css'

export const BuyBack = () => {
  const [categorie, setCategorie] = useState('');
  const [gramaj, setGramaj] = useState('');
  const [karate, setKarate] = useState('');
  const [marimea, setMarimea] = useState('');
  const [material, setMaterial] = useState('');
  const [price, setPrice] = useState(null);
  const [bijuterie, setBijuterie] = useState('');
  const [bijuterieGramaj, setBijuterieGramaj] = useState('');

  const materialPrices = {
    aur: { '14k': 200, '18k': 250, '22k': 300 },
    'aur alb': { '14k': 210, '18k': 260, '22k': 310 },
    argint: { '999': 60, '950': 55, '925': 50, '900': 45, '800': 40 }
  };

  const bijuteriePrices = {
    diamant: 500,
    rubin: 400,
    smarald: 350,
    safir: 300,
    perla: 250,
    ametist: 200,
    topaz: 150,
    acvamarin: 100,
    granat: 80,
    opal: 70,
    turmalina: 60,
    citrin: 50,
    zirconiu: 40,
    cuart: 30,
    onix: 20
  };

  const calculatePrice = (e) => {
    e.preventDefault();

    const gramajValue = parseFloat(gramaj);
    const bijuterieGramajValue = parseFloat(bijuterieGramaj);

    if (material in materialPrices && karate in materialPrices[material]) {
      const basePrice = materialPrices[material][karate];
      let finalPrice = basePrice * gramajValue;

      if (bijuterie && bijuterieGramajValue) {
        const bijuteriePrice = bijuteriePrices[bijuterie] || 0;
        finalPrice += bijuteriePrice * bijuterieGramajValue;
      }

      setPrice(finalPrice.toFixed(2));
    } else {
      alert('Valori incorecte pentru material sau karat.');
    }
  };

  return (
    <div>
      <div className="buyback-info mx-auto max-w-4xl justify-center px-6 md:space-x-6 xl:px-0">
        <h2 className="text-4xl font-bold w-2/3 my-4 ml-12 border-b-2 border-black">Programul nostru de Buy-Back</h2>
        <p className="mb-4">
          Prin programul nostru de Buy-Back, puteți schimba bijuteriile vechi cu vouchere pe care le puteți folosi pentru a achiziționa produse noi din magazinul nostru. Completați formularul de mai jos pentru a primi o estimare a valorii bijuteriei dumneavoastră.
        </p>
      </div>
      <div className="form_cout mx-auto max-w-4xl justify-center px-6 md:space-x-6 xl:px-0">{/*container*/}
        <div className="text_checkout border-b-2 border-black">
          Completeaza formularul pentru a primi voucher-ul
        </div>
        <form className="form_checkout justify-center border-transparent" onSubmit={calculatePrice}>{/*form*/}
          <div className="form_row border-transparent">{/*form_row*/}
            <div className="input_data border-transparent text-gray-400">{/*input-data*/}
              <select
                name="categorie"
                required
                className="input_cout border-transparent"
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
                name="Gramaj"
                placeholder="Gramaj"
                required
                className="input_cout"
                value={gramaj}
                onChange={(e) => setGramaj(e.target.value)}
              />
              <div className="underline"></div>
            </div>
          </div>
          <div className="form_row">
            <div className="input_data">
              <input
                type="text"
                name="karate"
                placeholder="Karate/Tip argint"
                required
                className="input_cout"
                value={karate}
                onChange={(e) => setKarate(e.target.value)}
              />
              <div className="underline"></div>
            </div>
          </div>
          <div className="form_row">
            <div className="input_data">
              <input
                type="number"
                name="marimea"
                placeholder="Marimea"
                required
                className="input_cout"
                value={marimea}
                onChange={(e) => setMarimea(e.target.value)}
              />
              <div className="underline"></div>
            </div>
          </div>
          <div className="form_row">
            <div className="input_data border-transparent text-gray-400">
              <select
                name="material"
                required
                className="input_cout border-transparent"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              >
                <option value="">Selecteaza Materialul</option>
                <option value="aur">Aur</option>
                <option value="aur alb">Aur Alb</option>
                <option value="argint">Argint</option>
              </select>
              <div className="underline"></div>
            </div>
          </div>
           <div className="form_row border-transparent">{/*form_row*/}
            <div className="input_data border-transparent text-gray-400">{/*input-data*/}
              <select
                name="bijuterie"
                className="input_cout border-transparent"
                value={bijuterie}
                onChange={(e) => setBijuterie(e.target.value)}
              >
                <option value="">Selecteaza Numele Bijuteriei </option>
                <option value="diamant">Diamant</option>
                <option value="rubin">Rubin</option>
                <option value="smarald">Smarald</option>
                <option value="safir">Safir</option>
                <option value="perla">Perla</option>
                <option value="ametist">Ametist</option>
                <option value="topaz">Topaz</option>
                <option value="acvamarin">Acvamarin</option>
                <option value="granat">Granat</option>
                <option value="opal">Opal</option>
                <option value="turmalina">Turmalina</option>
                <option value="citrin">Citrin</option>
                <option value="zirconiu">Zirconiu</option>
                <option value="cuart">Cuart</option>
                <option value="onix">Onix</option>
              </select>
              <div className="underline"></div>
            </div>
          </div>
               <div className="form_row">
            <div className="input_data">
              <input
                type="number"
                name="bijuterieGramaj"
                placeholder="Gramaj Bijuterie "
                className="input_cout"
                value={bijuterieGramaj}
                onChange={(e) => setBijuterieGramaj(e.target.value)}
              />
              <div className="underline"></div>
            </div>
          </div>
          <div className="form_row submit_btn_cout text-center items-center">
            <div className="input_data">
              <div className="inner items-center text-center"></div>
              <button className="submit_bt" type="submit">Calculeaza pretul</button>
            </div>
          </div>
        </form>
        {price !== null && (
          <div className="text-center mt-6">
            <p className="text-lg font-bold">Prețul estimat: {price} Lei</p>
            <p className="mt-4 align-text-bottom">
              Pentru o calculare mai eficientă a prețului, puteți să faceți o programare <Link to="/programare" className="text-black ">aici</Link> pentru a aduce produsul să fie verificat cu acuratețe.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuyBack;
