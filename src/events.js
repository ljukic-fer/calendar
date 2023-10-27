import moment from 'moment';

export const transformEvents = (events) => {
    return events
      .map((event) => ({
        id: event.date,
        title: event.event,
        start: moment(event.date + ' ' + event.time, 'YYYY-MM-DD h:mm A').toDate(), // Convert date and time
        end: moment(event.date + ' ' + event.time, 'YYYY-MM-DD h:mm A').toDate(),
      }))
  };
  