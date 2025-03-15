const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8000;
const URI = "mongodb+srv://perurisaivasanth04:sai123sai@info.flklk7h.mongodb.net/?retryWrites=true&w=majority&appName=info"; 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB successfully");
    })
    .catch((error) => {
        console.log("Failed to connect to MongoDB:", error);
    });
const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, default: 'open' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const Ticket = mongoose.model('Ticket', ticketSchema);
app.post('/tickets', async (req, res) => {
    try {
        const ticket = new Ticket(req.body);
        await ticket.save();
        res.status(201).send(ticket);
    } catch (error) {
        res.status(400).send(error);
    }
});
app.get('/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.status(200).send(tickets);
    } catch (error) {
        res.status(500).send(error);
    }
});
app.put('/tickets/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!ticket) {
            return res.status(404).send();
        }
        res.send(ticket);
    } catch (error) {
        res.status(400).send(error);
    }
});
app.delete('/tickets/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);
        if (!ticket) {
            return res.status(404).send();
        }
        res.send(ticket);
    } catch (error) {
        res.status(500).send(error);
    }
});
app.listen(PORT, (error) => {
    if (error) {
        console.log("Failed to connect server");
    } else {
        console.log(`Server started and Server running on ${PORT}`);
    }
});