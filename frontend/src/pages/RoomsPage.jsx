import React, { useState, useEffect } from 'react';
import './../css/rooms.css';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRoom, setNewRoom] = useState({
    name: '',
    price: '',
    occupancy: '',
    amenityFeature: '',
    telephone: '',
    readyForCheckIn: false,
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [filters, setFilters] = useState({
    sort: '',
    price: '',
  });

  // Fetch rooms with filters applied
  const fetchRooms = async (query = '') => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:2020/rooms?${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      const data = await response.json();
      setRooms(data.data.rooms);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch without filters
  useEffect(() => {
    fetchRooms();
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

    // Check if there's a price filter
    if (filters.price) {
      queryParams.push(`price[lte]=${filters.price}`);
    }

    // Check if there's a sort filter
    if (filters.sort) {
      queryParams.push(`sort=${filters.sort}`);
    }

    // Join the query parameters and fetch rooms
    const queryString = queryParams.join('&');
    fetchRooms(queryString);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      sort: '',
      price: '',
    });
    fetchRooms(); // Fetch rooms without filters
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewRoom((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const response = await fetch('http://localhost:2020/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRoom),
      });
      if (!response.ok) {
        throw new Error('Failed to add new room');
      }
      const data = await response.json();
      setRooms((prevRooms) => [...prevRooms, data.data.room]);
      alert('Room added successfully.');
      setNewRoom({
        name: '',
        price: '',
        occupancy: '',
        amenityFeature: '',
        telephone: '',
        readyForCheckIn: false,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteRoom = async (roomId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:2020/rooms/${roomId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete room');
      }
      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
      alert('Room deleted successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteAllRooms = async () => {
    setActionLoading(true);
    try {
      const response = await fetch('http://localhost:2020/rooms', {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete all rooms');
      }
      setRooms([]);
      alert('All rooms deleted successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const fetchRoomById = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:2020/rooms/${roomId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch room');
      }
      const data = await response.json();
      alert(`Room details: ${JSON.stringify(data.data.room)}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="rooms-container">
      <h2>Room Management</h2>

      {/* Room Filter Form */}
      <div className="filter-section">
        <h3>Filter and Sort Rooms</h3>
        <select name="sort" value={filters.sort} onChange={handleFilterChange}>
          <option value="">Sort by</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
        </select>
        <input
          type="number"
          name="price"
          placeholder="Max Price"
          value={filters.price}
          onChange={handleFilterChange}
        />
        <button onClick={applyFilters} disabled={actionLoading}>
          Apply Filters
        </button>
        <button onClick={resetFilters} disabled={actionLoading}>
          Reset Filters
        </button>
      </div>

      <form onSubmit={handleSubmit} className="add-room-form">
        <h3>Add New Room</h3>
        <input
          type="text"
          name="name"
          placeholder="Room Name"
          value={newRoom.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newRoom.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="occupancy"
          placeholder="Occupancy"
          value={newRoom.occupancy}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="amenityFeature"
          placeholder="Amenities"
          value={newRoom.amenityFeature}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="telephone"
          placeholder="Telephone"
          value={newRoom.telephone}
          onChange={handleChange}
          required
        />
        <label>
          Ready for Check-In:
          <input
            type="checkbox"
            name="readyForCheckIn"
            checked={newRoom.readyForCheckIn}
            onChange={handleChange}
          />
        </label>
        <button type="submit" disabled={actionLoading}>
          {actionLoading ? 'Adding...' : 'Add Room'}
        </button>
      </form>

      <button onClick={deleteAllRooms} className="btn-delete-all"  style={{backgroundColor:"#AD8B3A"}} disabled={actionLoading}>
        {actionLoading ? 'Deleting...' : 'Delete All Rooms'}
      </button>

      <div className="rooms-grid">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div key={room._id} className="room-card">
              <h3>{room.name}</h3>
              <p><strong>Price:</strong> ${room.price}</p>
              <p><strong>Occupancy:</strong> {room.occupancy}</p>
              <p><strong>Amenities:</strong> {room.amenityFeature}</p>
              <p><strong>Telephone:</strong> {room.telephone}</p>
              <p><strong>Ready for Check-In:</strong> {room.readyForCheckIn ? "Yes" : "No"}</p>
              <button onClick={() => deleteRoom(room._id)} className="btn-delete" disabled={actionLoading}>
                {actionLoading ? 'Deleting...' : 'Delete Room'}
              </button>
              <button onClick={() => fetchRoomById(room._id)} className="btn-view">
                View Details
              </button>
            </div>
          ))
        ) : (
          <p>No rooms available.</p>
        )}
      </div>
    </div>
  );
};
  
export default RoomsPage;