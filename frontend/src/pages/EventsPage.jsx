import React, { useState, useEffect } from 'react';
import './../css/events.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEvent, setNewEvent] = useState({
    name: '',
    hall: '',
    date: '',
    paidFor: false,
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [filters, setFilters] = useState({
    sort: '',
    date: '',
  });

  // Fetch events with filters applied
  const fetchEvents = async (query = '') => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:2020/events?${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data); // Directly set the events as the response is an array
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch without filters
  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    const queryParams = [];

    // Check if there's a date filter
    if (filters.date) {
      queryParams.push(`date[lte]=${filters.date}`);
    }

    // Check if there's a sort filter
    if (filters.sort) {
      queryParams.push(`sort=${filters.sort}`);
    }

    // Join the query parameters and fetch events
    const queryString = queryParams.join('&');
    fetchEvents(queryString);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      sort: '',
      date: '',
    });
    fetchEvents(); // Fetch events without filters
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    // Validate if the date is in a valid format
    if (isNaN(new Date(newEvent.date).getTime())) {
      alert('Please select a valid date');
      setActionLoading(false);
      return;
    }

    // Ensure the date is in the correct format (YYYY-MM-DD)
    const formattedDate = new Date(newEvent.date).toISOString().split('T')[0];  

    const updatedEvent = {
      ...newEvent,
      date: formattedDate,
    };

    try {
      const response = await fetch('http://localhost:2020/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) {
        throw new Error('Failed to add new event');
      }
      const data = await response.json();
      setEvents((prevEvents) => [...prevEvents, data]);
      alert('Event added successfully.');
      setNewEvent({
        name: '',
        hall: '',
        date: '',
        paidFor: false,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteEvent = async (eventId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:2020/events/${eventId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
      alert('Event deleted successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteAllEvents = async () => {
    setActionLoading(true);
    try {
      const response = await fetch('http://localhost:2020/events', {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete all events');
      }
      setEvents([]);
      alert('All events deleted successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const fetchEventById = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:2020/events/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }
      const data = await response.json();
      alert(`Event details: ${JSON.stringify(data)}`);
    } catch (err) {
      setError(err.message);
    }
  };

  // Sort upcoming events based on date
  const sortedUpcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())  // Filter future events
    .sort((a, b) => new Date(a.date) - new Date(b.date));   // Sort by event date

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div> Loading...
      </div>
    );
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="events-page">
      {/* <h2>Event Management</h2> */}

      <div className="main-content">
        {/* Event Filter Form */}
        <div className="filter-section">    
          <h3>Filter and Sort Events</h3>
          <select name="sort" value={filters.sort} onChange={handleFilterChange}>
            <option value="">Sort by</option>
            <option value="date">Date</option>
            <option value="name">Name</option>
          </select>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
          <button onClick={applyFilters} disabled={actionLoading}>
            Apply Filters
          </button>
          <button onClick={resetFilters} disabled={actionLoading}>
            Reset Filters
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-event-form">
          <h3>Add New Event</h3>
          <input
            type="text"
            name="name"
            placeholder="Event Name"
            value={newEvent.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="hall"
            placeholder="Hall"
            value={newEvent.hall}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            value={newEvent.date}
            onChange={handleChange}
            required
          />
          <label>
            Paid For:
            <input
              type="checkbox"
              name="paidFor"
              checked={newEvent.paidFor}
              onChange={handleChange}
            />
          </label>
          <button type="submit" disabled={actionLoading}>
            {actionLoading ? 'Adding...' : 'Add Event'}
          </button>
        </form>

        <button onClick={deleteAllEvents} className="btn-delete-all"  style={{backgroundColor:"#AD8B3A",marginLeft:"77vh"}} disabled={actionLoading}>
          {actionLoading ? 'Deleting...' : 'Delete All Events'}
        </button>

        <div className="events-grid">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event._id} className="event-card">
                <h3>{event.name}</h3>
                <p><strong>Hall:</strong> {event.hall}</p>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
                <p><strong>Paid:</strong> {event.paidFor ? "Yes" : "No"}</p>
                <button onClick={() => deleteEvent(event._id)} className="btn-delete" disabled={actionLoading}>
                  {actionLoading ? 'Deleting...' : 'Delete Event'}
                </button>
                <button onClick={() => fetchEventById(event._id)} className="btn-view">
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p>No events available.</p>
          )}
        </div>
      </div>

      {/* Sidebar with Widgets */}
      <div className="sidebar">
        <h3>Upcoming Events</h3>
        <ul>
          {sortedUpcomingEvents.length > 0 ? (
            sortedUpcomingEvents.slice(0, 5).map((event) => (
              <li key={event._id}>
                <p>{event.name}</p>
                <p>{new Date(event.date).toLocaleDateString()}</p>
              </li>
            ))
          ) : (
            <p>No upcoming events.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default EventsPage;
