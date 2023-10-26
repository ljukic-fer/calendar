import React from 'react';

function EventTooltip({ event, top, left }) {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        zIndex: 1000,
        background: 'white',
        padding: '5px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
      }}
    >
      {event.title}
      <br />
      {event.start.toLocaleTimeString()}
    </div>
  );
}

export default EventTooltip;
