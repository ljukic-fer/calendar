import React, { useState, useEffect, useRef } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './App.css';
import { transformEvents } from './events';

const localizer = momentLocalizer(moment);

function getDateFromURL() {
  const url = window.location.pathname;
  const parts = url.split('/');
  const dateString = parts[1];
  return dateString;
}

function App() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    fetch('/schedule.json')
      .then((response) => response.json())
      .then((data) => {
        const transformedEvents = transformEvents(data.events);
        setEvents(transformedEvents);
      });
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);  
  

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    if (selectedEvent && selectedEvent.id === event.id) {
      handleHideTooltip();
    } else {
      setSelectedEvent(event);

      // Tooltip position
      const eventBox = e.target.closest('.rbc-event');
      if (eventBox) {
        const rect = eventBox.getBoundingClientRect();
        setTooltipPosition({
          top: window.pageYOffset + rect.top - 80,
          left: rect.left,
        });
      }
    }
  };

  const handleHideTooltip = () => {
    setSelectedEvent(null);
    setTooltipPosition(null);
  };

  const handleDocumentClick = (e) => {
    // Click position check
    if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
      handleHideTooltip();
    }
  };

  const currentMonthEvents = events.filter((event) =>
    moment(event.start).isSame(date, 'month') &&
    moment(event.start).day() !== 0 &&
    moment(event.start).day() !== 6 
  );

  const dayPropGetter = (date) => {
    if (!moment(date).isSame(date, 'month')) {
      return {
        className: 'blank-cell',
      };
    }
    return {};
  };

  return (
    <div className="app">
      <h1 className="text-center">Calendar</h1>
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={currentMonthEvents}
          startAccessor="start"
          endAccessor="end"
          views={['month']}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          selectable={false}
          onSelectEvent={handleEventClick}
          onSelectSlot={handleHideTooltip}
          drilldownView={null}
          style={{ height: 500 }}
          dayPropGetter={dayPropGetter}
        />
        {selectedEvent && (
          <div
            ref={tooltipRef}
            className="event-tooltip"
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left,
            }}
          >
            <strong>{selectedEvent.title}</strong>
            <br />
            Event start: {moment(selectedEvent.start).format('HH:mm')}
          </div>
        )}
      </div>
      <p className="text-center">
        <span className="bold">Current Date:</span> {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}

export default App;
