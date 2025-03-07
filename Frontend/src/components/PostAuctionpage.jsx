import React, { useState } from 'react';
import axios from 'axios';

function PostAuction() {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    startingBid: '',
    image: null
  });
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file
    }));
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.itemName || !formData.description || !formData.startingBid || !formData.image) {
      setMessage('Please fill in all fields including an image.');
      return;
    }

    const data = new FormData();
    data.append('itemName', formData.itemName);
    data.append('description', formData.description);
    data.append('startingBid', formData.startingBid);
    data.append('image', formData.image);

    try {
      const res = await axios.post('http://localhost:5001/auctions', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(res.data.message || 'Auction posted successfully!');
      setFormData({
        itemName: '',
        description: '',
        startingBid: '',
        image: null
      });
      setPreview(null);
    } catch (error) {
      setMessage('Error posting auction item.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-600 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Post New Auction Item
        </h2>
        {message && (
          <div className="mb-4 p-2 bg-indigo-100 text-indigo-700 rounded">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <div>
            <label
              htmlFor="itemName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Item Name
            </label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="Enter item name"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter item description"
              rows="4"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="startingBid"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Starting Bid ($)
            </label>
            <input
              type="number"
              id="startingBid"
              name="startingBid"
              value={formData.startingBid}
              onChange={handleChange}
              placeholder="Enter starting bid"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image Upload
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
              required
            />
          </div>
          {preview && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
          )}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Post Auction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostAuction;
