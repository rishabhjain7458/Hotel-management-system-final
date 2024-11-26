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
  const [editRoom, setEditRoom] = useState(null); // State for room being edited
  const [actionLoading, setActionLoading] = useState(false);
  const [filters, setFilters] = useState({
    sort: '',
    price: '',
  });

  // Fetch rooms
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

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    const queryParams = [];
    if (filters.price) queryParams.push(`price[lte]=${filters.price}`);
    if (filters.sort) queryParams.push(`sort=${filters.sort}`);
    fetchRooms(queryParams.join('&'));
  };

  const resetFilters = () => {
    setFilters({ sort: '', price: '' });
    fetchRooms();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const stateUpdater = editRoom ? setEditRoom : setNewRoom; // Handle both create and edit forms
    stateUpdater((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editRoom ? `http://localhost:2020/rooms/${editRoom._id}` : 'http://localhost:2020/rooms';
    const method = editRoom ? 'PATCH' : 'POST';
    const body = JSON.stringify(editRoom || newRoom);

    setActionLoading(true);
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      if (!response.ok) throw new Error(`Failed to ${editRoom ? 'update' : 'add'} room`);
      const data = await response.json();

      if (editRoom) {
        // Update room in state
        setRooms((prevRooms) =>
          prevRooms.map((room) => (room._id === editRoom._id ? data.data.room : room))
        );
        alert('Room updated successfully.');
      } else {
        setRooms((prevRooms) => [...prevRooms, data.data.room]);
        alert('Room added successfully.');
      }

      setNewRoom({
        name: '',
        price: '',
        occupancy: '',
        amenityFeature: '',
        telephone: '',
        readyForCheckIn: false,
      });
      setEditRoom(null); // Reset edit state
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const startEditing = (room) => {
    setEditRoom(room); // Set the room to be edited
  };

  const cancelEditing = () => {
    setEditRoom(null); // Cancel editing
  };

  const deleteRoom = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setActionLoading(true);
      try {
        const response = await fetch(`http://localhost:2020/rooms/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete room');
        setRooms(rooms.filter((room) => room._id !== id)); // Remove room from state
        alert('Room deleted successfully.');
      } catch (err) {
        setError(err.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const deleteAllRooms = async () => {
    if (window.confirm('Are you sure you want to delete all rooms?')) {
      setActionLoading(true);
      try {
        const response = await fetch('http://localhost:2020/rooms', {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete all rooms');
        setRooms([]); // Clear all rooms from state
        alert('All rooms deleted successfully.');
      } catch (err) {
        setError(err.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="rooms-container">
      <h2>Room Management</h2>

      {/* Filter Section */}
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

      {/* Add or Edit Room Form */}
      <form onSubmit={handleSubmit} className="add-room-form">
        <h3>{editRoom ? 'Edit Room' : 'Add New Room'}</h3>
        <input
          type="number"
          name="name"
          placeholder="Room Number"
          value={editRoom?.name || newRoom.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price(per night)"
          value={editRoom?.price || newRoom.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="occupancy"
          placeholder="Occupancy(Max)"
          value={editRoom?.occupancy || newRoom.occupancy}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="amenityFeature"
          placeholder="Amenities"
          value={editRoom?.amenityFeature || newRoom.amenityFeature}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="telephone"
          placeholder="Telephone"
          value={editRoom?.telephone || newRoom.telephone}
          onChange={handleChange}
          required
        />
        <label>
          Ready for Check-In:
          <input
            type="checkbox"
            name="readyForCheckIn"
            checked={editRoom?.readyForCheckIn || newRoom.readyForCheckIn}
            onChange={handleChange}
          />
        </label>
        <button type="submit" disabled={actionLoading}>
          {actionLoading ? (editRoom ? 'Updating...' : 'Adding...') : editRoom ? 'Update Room' : 'Add Room'}
        </button>
        {editRoom && (
          <button type="button" onClick={cancelEditing} className="btn-cancel">
            Cancel
          </button>
        )}
      </form>

      {/* Room List */}
      <div className="rooms-grid">
        {rooms.map((room) => (
          <div key={room._id} className="room-card">
            <h3>{room.name}</h3>
            <p><strong>Price:</strong> ${room.price}</p>
            <p><strong>Occupancy:</strong> {room.occupancy}</p>
            <p><strong>Amenities:</strong> {room.amenityFeature}</p>
            <p><strong>Telephone:</strong> {room.telephone}</p>
            <p><strong>Ready for Check-In:</strong> {room.readyForCheckIn ? 'Yes' : 'No'}</p>
            <button onClick={() => startEditing(room)} className="btn-edit" disabled={actionLoading}>
              Edit Room
            </button>
            <button onClick={() => deleteRoom(room._id)} className="btn-delete" disabled={actionLoading}>
              Delete Room
            </button>
          </div>
        ))}
      </div>

      {/* Delete All Rooms Button */}
      <div className="delete-all">
        <button onClick={deleteAllRooms} disabled={actionLoading}>
          Delete All Rooms
        </button>
      </div>
    </div>
  );
};

export default RoomsPage;
