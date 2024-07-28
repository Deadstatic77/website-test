import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Packages() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      const res = await axios.get('/packages');
      setPackages(res.data);
    };
    fetchPackages();
  }, []);

  const handlePurchase = async (packageId) => {
    await axios.post('/purchase', { packageId }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    alert('Package purchased successfully!');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Support Packages</h1>
      <div className="mt-4">
        <ul>
          {packages.map(pkg => (
            <li key={pkg._id} className="border p-2 mb-2">
              <h3 className="font-bold">{pkg.name}</h3>
              <p>{pkg.description}</p>
              <p>Price: ${pkg.price}</p>
              <button onClick={() => handlePurchase(pkg._id)} className="bg-blue-500 text-white px-4 py-2 rounded">Buy Now</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Packages;
