const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express();
const PORT = 8000; // You can change this to another port if needed

// MongoDB Connection URI
const URI = "mongodb+srv://perurisaivasanth04:sai123sai@info.flklk7h.mongodb.net/ticket-management?retryWrites=true&w=majority&appName=info";

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(URI)
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1); // Exit the application if MongoDB connection fails
    });

// Ticket Schema
const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    from: { type: String, required: true },  
    to: { type: String, required: true },    
    status: { type: String, default: 'open' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Ticket Model
const Ticket = mongoose.model('Ticket', ticketSchema);

// Routes

// Create a new ticket
app.post('/tickets', async (req, res) => {
    try {
        const ticket = new Ticket(req.body);
        await ticket.save();
        res.status(201).send(ticket);
    } catch (error) {
        console.error("Error creating ticket:", error);
        res.status(400).send(error.message || "Bad Request");
    }
});

// Get all tickets
app.get('/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.status(200).send(tickets);
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).send(error.message || "Internal Server Error");
    }
});

// Update a ticket by ID
app.put('/tickets/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!ticket) return res.status(404).send("Ticket not found");
        res.send(ticket);
    } catch (error) {
        console.error("Error updating ticket:", error);
        res.status(400).send(error.message || "Bad Request");
    }
});

// Delete a ticket by ID
app.delete('/tickets/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);
        if (!ticket) return res.status(404).send("Ticket not found");
        res.send(ticket);
    } catch (error) {
        console.error("Error deleting ticket:", error);
        res.status(500).send(error.message || "Internal Server Error");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please choose a different port.`);
        process.exit(1); // Exit the application if the port is already in use
    } else {
        console.error("An error occurred while starting the server:", err);
        process.exit(1); // Exit the application for other errors
    }
});