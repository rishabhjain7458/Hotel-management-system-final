const Event = require('../Models/eventModel.js');  // Adjust path as necessary

// 1. Book an Event
exports.bookEvent = async (req, res) => {
    try {
        const { name, hall, date, paidFor } = req.body;
        const event = new Event({ name, hall, date, paidFor });
        await event.save();
        res.status(201).json({ message: 'Event booked successfully', event });
    } catch (error) {
        res.status(400).json({ message: 'Error booking event', error });
    }
};

// 2. Delete an Event by ID
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await Event.findByIdAndDelete(id);
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting event', error });
    }
};

// 3. Get All Events
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error });
    }
};

// 4. Delete All Events
exports.deleteAllEvents = async (req, res) => {
    try {
        await Event.deleteMany();
        res.status(200).json({ message: 'All events deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting all events', error });
    }
}

// Example function to create and save an event
// Create a new event
exports.createEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                event: event
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

