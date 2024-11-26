import React, { useState, useEffect } from "react";
import "./../css/bookings.css";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newBooking, setNewBooking] = useState({
    bookedAt: "",
    roomBooked: "",
    customerName: "",
    checkoutDate: "",
    paymentStatus: "",
  });
  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    fetchBookings();
    fetchAvailableRooms();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:2020/bookings");
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();
      setBookings(data.data.bookings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const response = await fetch("http://localhost:2020/rooms");
      if (!response.ok) throw new Error("Failed to fetch rooms");
      const data = await response.json();
      const roomsReadyForCheckIn = data.data.rooms.filter(
        (room) => room.readyForCheckIn
      );
      setAvailableRooms(roomsReadyForCheckIn);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking((prevBooking) => ({
      ...prevBooking,
      [name]: value,
    }));
  };

  const addBooking = async (e) => {
    e.preventDefault();
    console.log("New Booking Data:", newBooking); // Log the new booking data
    try {
      const response = await fetch("http://localhost:2020/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBooking),
      });

      if (!response.ok) throw new Error("Failed to add booking");

      setNewBooking({
        bookedAt: "",
        roomBooked: "",
        customerName: "",
        checkoutDate: "",
        paymentStatus: "",
      });
      fetchBookings();
      alert("Booking added successfully.");
    } catch (err) {
      setError(err.message);
      console.error("Booking error:", err); // Log the error
    }
  };

  const deleteBooking = async (bookingId) => {
    try {
      const response = await fetch(
        `http://localhost:2020/bookings/${bookingId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete booking");
      fetchBookings(); // Refresh the bookings list after deletion
      alert("Booking deleted successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteAllBookings = async () => {
    try {
      const response = await fetch("http://localhost:2020/bookings", {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete bookings");
      fetchBookings();
      alert("All bookings deleted successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bookings-container">
      <h2>Booking Management</h2>
      <form onSubmit={addBooking} className="booking-form">
        <label>Select Booking Date and Time:</label>
        <input
          type="datetime-local"
          name="bookedAt"
          value={newBooking.bookedAt}
          onChange={handleInputChange}
          required
        />
        <label>Select Checkout Date (12pm)</label>
        <input
          type="date"
          name="checkoutDate"
          value={newBooking.checkoutDate}
          onChange={handleInputChange}
          required
        />
        <select
          name="roomBooked"
          value={newBooking.roomBooked}
          onChange={handleInputChange}
          required
        >
          <option value="">Choose Room</option>
          {availableRooms.map((room) => (
            <option key={room._id} value={room.name}>
              {room.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="customerName"
          value={newBooking.customerName}
          onChange={handleInputChange}
          placeholder="Enter Customer Name"
          required
        />
        <select
          name="paymentStatus"
          value={newBooking.paymentStatus}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Payment Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
        <button type="submit" className="btn-add">
          Add Booking
        </button>
      </form>
      <button
        onClick={deleteAllBookings}
        className="btn-delete-all"
        style={{ backgroundColor: "#AD8B3A" }}
      >
        Delete All Bookings
      </button>
      {bookings.length === 0 ? (
        <div>No bookings available</div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <h3>{booking.roomBooked}</h3>
              <p>
                <strong>Booked At:</strong>{" "}
                {new Date(booking.bookedAt).toLocaleString()}
              </p>
              <p>
                <strong>Customer Name:</strong> {booking.customerName}
              </p>
              <p>
                <strong>Checkout Date:</strong>{" "}
                {new Date(booking.checkoutDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Payment Status:</strong> {booking.paymentStatus}
              </p>
              <button
                onClick={() => deleteBooking(booking._id)}
                className="btn-delete"
                style={{ backgroundColor: "#AD8B3A" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
