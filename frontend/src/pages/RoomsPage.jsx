import React, { useState, useEffect } from "react";
import "./../css/rooms.css";

const apiUrl = process.env.REACT_APP_API_URL;
const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRoom, setNewRoom] = useState({
    name: "",
    price: "",
    occupancy: "",
    amenityFeature: "",
    telephone: "",
    readyForCheckIn: false,
  });
  const [editRoom, setEditRoom] = useState(null); // State for room being edited
  const [actionLoading, setActionLoading] = useState(false);
  const [filters, setFilters] = useState({
    sort: "",
    price: "",
  });
  const [roomImage, setRoomImage] = useState(null); // State for room image

  // Fetch rooms
  const fetchRooms = async (query = "") => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/rooms?${query}`);
      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
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
    fetchRooms(queryParams.join("&"));
  };

  const resetFilters = () => {
    setFilters({ sort: "", price: "" });
    fetchRooms();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const stateUpdater = editRoom ? setEditRoom : setNewRoom;
    stateUpdater((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setRoomImage(e.target.files[0]); // Set the selected image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editRoom
      ? `${apiUrl}/rooms/${editRoom._id}`
      : `${apiUrl}/rooms`;
    const method = editRoom ? "PATCH" : "POST";

    const formData = new FormData();
    formData.append("name", editRoom?.name || newRoom.name);
    formData.append("price", editRoom?.price || newRoom.price);
    formData.append("occupancy", editRoom?.occupancy || newRoom.occupancy);
    formData.append(
      "amenityFeature",
      editRoom?.amenityFeature || newRoom.amenityFeature
    );
    formData.append("telephone", editRoom?.telephone || newRoom.telephone);
    formData.append(
      "readyForCheckIn",
      editRoom?.readyForCheckIn || newRoom.readyForCheckIn
    );
    if (roomImage) formData.append("image", roomImage); // Add the image to the form data

    setActionLoading(true);
    try {
      const response = await fetch(url, {
        method,
        body: formData, // Send form data
      });
      if (!response.ok)
        throw new Error(`Failed to ${editRoom ? "update" : "add"} room`);
      const data = await response.json();

      if (editRoom) {
        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room._id === editRoom._id ? data.data.room : room
          )
        );
        alert("Room updated successfully.");
      } else {
        setRooms((prevRooms) => [...prevRooms, data.data.room]);
        alert("Room added successfully.");
      }

      setNewRoom({
        name: "",
        price: "",
        occupancy: "",
        amenityFeature: "",
        telephone: "",
        readyForCheckIn: false,
      });
      setEditRoom(null); // Reset edit state
      setRoomImage(null); // Reset image
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const startEditing = (room) => {
    setEditRoom(room);
  };

  const cancelEditing = () => {
    setEditRoom(null);
    setRoomImage(null);
  };

  const deleteRoom = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      setActionLoading(true);
      try {
        const response = await fetch(`${apiUrl}/rooms/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete room");
        setRooms((rooms) => rooms.filter((room) => room._id !== id));
        alert("Room deleted successfully.");
      } catch (err) {
        setError(err.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const deleteAllRooms = async () => {
    if (window.confirm("Are you sure you want to delete all rooms?")) {
      setActionLoading(true);
      try {
        const response = await fetch(`${apiUrl}/rooms`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete all rooms");
        setRooms([]);
        alert("All rooms deleted successfully.");
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
        <h3>{editRoom ? "Edit Room" : "Add New Room"}</h3>
        <input
          type="text"
          name="name"
          placeholder="Room Number"
          value={editRoom?.name || newRoom.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price (per night)"
          value={editRoom?.price || newRoom.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="occupancy"
          placeholder="Occupancy (Max)"
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
        <label>
          Room Image:
          <input type="file" name="image" onChange={handleImageChange} />
        </label>
        <button type="submit" disabled={actionLoading}>
          {actionLoading
            ? editRoom
              ? "Updating..."
              : "Adding..."
            : editRoom
            ? "Update Room"
            : "Add Room"}
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
            {room.image ? (
              <img
                src={`http://localhost:2020/${room.image}`}
                alt={`Room ${room.name}`}
                className="room-image"
              />
            ) : (
              <p>No image available</p>
            )}

            <p>
              <strong>Price:</strong> ${room.price}
            </p>
            <p>
              <strong>Occupancy:</strong> {room.occupancy}
            </p>
            <p>
              <strong>Amenities:</strong> {room.amenityFeature}
            </p>
            <p>
              <strong>Telephone:</strong> {room.telephone}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {room.readyForCheckIn ? "Ready" : "Not Ready"}
            </p>
            <button onClick={() => startEditing(room)} disabled={actionLoading}>
              Edit
            </button>
            <button
              onClick={() => deleteRoom(room._id)}
              disabled={actionLoading}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <button onClick={deleteAllRooms} disabled={actionLoading}>
        Delete All Rooms
      </button>
    </div>
  );
};

export default RoomsPage;
