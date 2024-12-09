import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { database } from '../../firebase/firebase';
import { collection, doc, getDocs, setDoc, getDoc } from 'firebase/firestore';
import './Programare.css';

export const Appointment = () => {
    const [date, setDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedHour, setSelectedHour] = useState(null);
    const [formData, setFormData] = useState({
        nume: '',
        email: '',
        telefon: '',
        descriere: ''
    });
    const [availableHours, setAvailableHours] = useState([]);
    const [bookings, setBookings] = useState([]);
    
    const onChange = (newDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dayOfWeek = newDate.getDay();
        if (newDate < today || newDate.toDateString() === today.toDateString()) {
            setErrorMessage('Va rugam sa selectati o alta data disponibila. ');
            setShowError(true);
            setShowModal(false);
        } else if (dayOfWeek === 0 || dayOfWeek === 6) {
            setErrorMessage(' Va rugam sa selectati o alta data din timpul saptamanii.');
            setShowError(true);
            setShowModal(false);
        } else {
            setDate(newDate);
            setShowModal(true);
            setShowError(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const hours = Array.from({ length: 10 }, (_, i) => `${9 + i}:00`);

    useEffect(() => {
        if (date) {
            fetchBookings(date);
        }
    }, [date]);

    const fetchBookings = async (selectedDate) => {
        const formattedDate = selectedDate.toLocaleDateString('ro-RO');
        const bookingsRef = collection(database, `Programari/${formattedDate}/Ore`);
        const bookingsSnapshot = await getDocs(bookingsRef);
        const bookedHours = bookingsSnapshot.docs.map(doc => doc.id);
        setAvailableHours(hours.filter(hour => !bookedHours.includes(hour)));
        setBookings(bookingsSnapshot.docs.map(doc => doc.data()));
    };

    const handleHourClick = (hour) => {
        setSelectedHour(hour);
        setShowModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedDate = date.toLocaleDateString('ro-RO');
        const bookingRef = doc(database, `Programari/${formattedDate}/Ore`, selectedHour);

        try {
            const bookingSnapshot = await getDoc(bookingRef);
            if (bookingSnapshot.exists()) {
                setErrorMessage('Această oră este deja rezervată. Vă rugăm să selectați o altă oră.');
                setShowError(true);
                return;
            }

            await setDoc(bookingRef, {
                ...formData,
                data: formattedDate,
                ora: selectedHour
            });

            setShowModal(false);
            fetchBookings(date);
            setFormData({ nume: '', email: '', telefon: '', descriere: '' });
            setSelectedHour(null);
            alert('Programarea a fost realizată cu succes!');
        } catch (error) {
            console.error('Eroare la realizarea programării:', error);
        }
    };

    return (
        <>
            <div className='p_body'>
                <div className='prog_body'>
                    <div className="calendar_container">
                        <h1 className="text-center text-2xl font-bold mb-4 prog_t">Programare</h1>
                        <Calendar
                            onChange={onChange}
                            value={date}
                            className="mx-auto custom-calendar"
                        />
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="modal_ora">
                    <div className="modal_content">
                        <span className="close_ora" onClick={closeModal}>&times;</span>
                        <h2 className='ora_h'>Selectează o oră</h2>
                        <ul className="time_list">
                            {availableHours.map(hour => (
                                <li key={hour} className="time_item" onClick={() => handleHourClick(hour)}>{hour}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {selectedHour && (
            <div className="modal_ora">
                <div className="modal_content">
                    <span className="close_ora" onClick={() => setSelectedHour(null)}>&times;</span>
                    <h2 className='ora_h'>Completează detaliile</h2>
                    <form onSubmit={handleSubmit} className='form_form'>
                        <label className='label_form'>
                            Nume complet:
                            <input className='input_form'
                                type="text"
                                name="nume"
                                value={formData.nume}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label className='label_form'>
                            Email:
                            <input className='input_form'
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label className='label_form'>
                            Telefon:
                            <input className='input_form'
                                type="tel"
                                name="telefon"
                                value={formData.telefon}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label className='label_form'>
                            Descriere:
                            <textarea className='input_form'
                                name="descriere"
                                value={formData.descriere}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <button type="submit" className='buton_form'>Programează</button>
                    </form>
                </div>
            </div>
            )}
            {showError && (
                <div className="modal_ora">
                    <div className="modal_content">
                        <span className="close_ora" onClick={() => setShowError(false)}>&times;</span>
                        <h2 className='ora_h'>Această zi nu este disponibilă</h2>
                        <p className='mes_h'>{errorMessage}</p>
                    </div>
                </div>
            )}
        </>
    );
};
