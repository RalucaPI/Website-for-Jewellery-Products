import React, { useState, useEffect } from 'react';
import { database } from '../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import './Calendar.css';

const getWeekDays = (startDate) => {
  const days = [];
  for (let i = 0; i < 5; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    days.push(date);
  }
  return days;
};

const Calendar = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const currentDate = new Date();
    const day = currentDate.getDay();
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
    const startDate = new Date(currentDate.setDate(diff));
    setCurrentWeekStart(startDate);
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      const bookingsData = [];
      for (let i = 0; i < 5; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        const formattedDate = date.toLocaleDateString('ro-RO');
        console.log(`Fetching bookings for date: ${formattedDate}`);
        const bookingsRef = collection(database, `Programari/${formattedDate}/Ore`);
        const bookingsSnapshot = await getDocs(bookingsRef);
        bookingsSnapshot.forEach(doc => {
          console.log(`Found booking: ${doc.data()} at hour: ${doc.id}`);
          bookingsData.push({ ...doc.data(), date: formattedDate, hour: doc.id });
        });
      }
      setBookings(bookingsData);
      console.log('All fetched bookings:', bookingsData);
    };

    if (currentWeekStart) {
      fetchBookings();
    }
  }, [currentWeekStart]);

  const handlePreviousWeek = () => {
    const newStartDate = new Date(currentWeekStart);
    newStartDate.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newStartDate);
  };

  const handleNextWeek = () => {
    const newStartDate = new Date(currentWeekStart);
    newStartDate.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newStartDate);
  };

  const getMonthName = (date) => {
    return date.toLocaleString('ro-RO', { month: 'long' });
  };

  const days = getWeekDays(currentWeekStart);
  const times = Array.from({ length: 10 }, (_, i) => `${9 + i}:00`);

  const getColorClass = () => {
    const colors = ['color1', 'color2', 'color3', 'color4','color5', 'color6', 'color7', 'color8'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="calendar-container">
      <div className="calendar-controls">
        <button onClick={handlePreviousWeek}>Săptămâna anterioară</button>
        <h2 className="calendar-month">{getMonthName(currentWeekStart)}</h2>
        <button onClick={handleNextWeek}>Săptămâna următoare</button>
      </div>
      <div className="calendar">
        <div className="timeline">
          <div className="spacer"></div>
          {times.map((time, index) => (
            <div key={index} className="time-marker">{time}</div>
          ))}
        </div>
        <div className="days">
          {days.map((day, index) => (
            <div key={index} className="day">
              <div className="date">
                <p className="date-num">{day.getDate()}</p>
                <p className="date-day">{day.toLocaleString('ro-RO', { weekday: 'short' })}</p>
              </div>
              <div className="events">
                {bookings
                  .filter(booking => booking.date === day.toLocaleDateString('ro-RO'))
                  .map((booking, idx) => {
                    const startHour = parseInt(booking.hour.split(':')[0], 10);
                    const startIndex = startHour - 8; // Ora 9 începe la index 1
                    const endIndex = startIndex ;
                    return (
                      <div
                        key={idx}
                        className={`event start-${startIndex} end-${endIndex} ${getColorClass()}`}
                      >
                        <p className="title">{booking.nume}</p>
                        <p className="telefon_prog">{booking.telefon}</p>
                        <p className="time">{booking.hour}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
