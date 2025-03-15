import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/tickets";

export default function TicketApp() {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    from: "",   // Added from location
    to: ""      // Added to location
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(API_URL);
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const createTicket = async () => {
    try {
      await axios.post(API_URL, newTicket);
      setNewTicket({ title: "", description: "", from: "", to: "" });
      fetchTickets();
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const updateTicket = async (id, updatedStatus) => {
    try {
      await axios.put(`${API_URL}/${id}`, { status: updatedStatus });
      fetchTickets();
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  const deleteTicket = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTickets();
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ticket Management</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={newTicket.title}
          onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={newTicket.description}
          onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="From"
          value={newTicket.from}
          onChange={(e) => setNewTicket({ ...newTicket, from: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="To"
          value={newTicket.to}
          onChange={(e) => setNewTicket({ ...newTicket, to: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={createTicket} className="bg-blue-500 text-white p-2">Add Ticket</button>
      </div>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket._id} className="border p-2 mb-2 flex justify-between">
            <div>
              <h3 className="font-bold">{ticket.title}</h3>
              <p>{ticket.description}</p>
              <p>From: {ticket.from}</p>
              <p>To: {ticket.to}</p>
              <p>Status: {ticket.status}</p>
            </div>
            <div>
              <button onClick={() => updateTicket(ticket._id, "closed")} className="bg-yellow-500 text-white p-1 mx-1">Close</button>
              <button onClick={() => deleteTicket(ticket._id)} className="bg-red-500 text-white p-1">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
