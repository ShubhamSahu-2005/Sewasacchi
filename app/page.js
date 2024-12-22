'use client'

import { useState } from 'react';

const CreateFundraiser = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalAmount: '',
    patientImage: '',
    patientName: '',
    medicalDocument: '',
    qrCode: '',
    category: '',
    beneficiary: '',
    deadline: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('jwt_token'); // Assuming token is stored in localStorage

    if (!token) {
      alert('You must be logged in to create a fundraiser.');
      return;
    }

    try {
      const response = await fetch('/api/fundraiser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include JWT in Authorization header
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Fundraiser created successfully!');
      } else {
        alert(`Error: ${data.error || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      {/* Add other form fields like goalAmount, patientImage, etc. */}
      <button type="submit">Create Fundraiser</button>
    </form>
  );
};

export default CreateFundraiser;
