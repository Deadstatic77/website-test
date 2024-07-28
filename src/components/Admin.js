import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await axios.get('/tickets', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setTickets(res.data);
    };
    fetchTickets();
  }, []);

  const handleStatusChange = async (ticketId, status) => {
    await axios.put(`/tickets/${ticketId}`, { status }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setTickets(tickets.map(ticket => ticket._id === ticketId ? { ...ticket, status } : ticket));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Tickets</h2>
        <ul>
          {tickets.map(ticket => (
            <li key={ticket._id} className="border p-2 mb-2">
              <h3 className="font-bold">{ticket.title}</h3>
              <p>{ticket.description}</p>
              <p>Status: {ticket.status}</p>
              <button onClick={() => handleStatusChange(ticket._id, 'closed')} className="bg-red-500 text-white px-4 py-2 rounded">Close</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Admin;