import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostAuction = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    sellerName: '',
    sellerEmail: '',
    category: '',
    description: '',
    startingBid: '',
    endTime: '',
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Added for error display
  const navigate = useNavigate();

  const categories = [
    'Antiques', 'Art', 'Automobiles', 'Watches', 'Jewelry',
    'Electronics', 'Fashion', 'Collectibles', 'Sports', 'Real Estate'
  ];

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif']
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: acceptedFiles => {
      console.log('Accepted files:', acceptedFiles); // Debug log
      setPreviewImages([...previewImages, ...acceptedFiles.map(file =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      )]);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...acceptedFiles]
      }));
    },
    onDropRejected: (rejectedFiles) => {
      console.log('Rejected files:', rejectedFiles); // Debug log
      const errors = rejectedFiles.map(file => {
        if (file.errors[0].code === 'file-too-large') {
          return 'File is too large. Maximum size is 10MB.';
        }
        if (file.errors[0].code === 'file-invalid-type') {
          return 'Invalid file type. Only JPG, PNG, and GIF files are allowed.';
        }
        return file.errors[0].message;
      });
      setErrorMessage(errors.join('\n'));
    }
  });

  const uploadImages = async (files) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
      
      console.log('Files to upload:', files); // Debug log
      
      const formdata = new FormData();
      files.forEach((file) => {
        console.log('Adding file to FormData:', file.name, file.type); // Debug log
        formdata.append("documents", file);
      });

      const response = await axios.post(
        "http://localhost:5000/upload",
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log('Upload response:', response.data); // Debug log

      if (response.status !== 200) throw new Error("Image upload failed");
      return response.data.fileUrls;
    } catch (error) {
      console.error("Image upload error:", error);
      setErrorMessage(error.response?.data?.message || error.message || "Failed to upload images");
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      // First upload the images
      const imageUrls = await uploadImages(formData.images);
      
      // Then create the auction with the image URLs
      const formDataToSend = {
        ...formData,
        documents: imageUrls // Send the image URLs in the documents field
      };

      console.log("Data sending:", formDataToSend);
      console.log("Token:", token);

      const response = await axios.post('http://localhost:5000/postAuction', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || error.message || 'Failed to post auction. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-12 px-4 pt-26 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight animate-fade-in">
            Create Your Auction
          </h1>
          <p className="mt-3 text-lg text-gray-600 animate-slide-up">
            List your item with these simple steps
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all hover:shadow-2xl hover:scale-105">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Item Details</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 transition duration-150 hover:text-blue-500">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition duration-150 shadow-sm hover:shadow-md p-3"
                    value={formData.itemName}
                    onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 transition duration-150 hover:text-blue-500">
                    Category *
                  </label>
                  <select
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition duration-150 shadow-sm hover:shadow-md p-3"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 transition duration-150 hover:text-blue-500">
                    Seller Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition duration-150 shadow-sm hover:shadow-md p-3"
                    value={formData.sellerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, sellerName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 transition duration-150 hover:text-blue-500">
                    Seller Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition duration-150 shadow-sm hover:shadow-md p-3"
                    value={formData.sellerEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, sellerEmail: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 transition duration-150 hover:text-blue-500">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition duration-150 shadow-sm hover:shadow-md p-3"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all hover:shadow-2xl hover:scale-105">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Auction Details</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 transition duration-150 hover:text-blue-500">
                  Starting Bid (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  className="mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition duration-150 shadow-sm hover:shadow-md p-3"
                  value={formData.startingBid}
                  onChange={(e) => setFormData(prev => ({ ...prev, startingBid: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 transition duration-150 hover:text-blue-500">
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition duration-150 shadow-sm hover:shadow-md p-3"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all hover:shadow-2xl hover:scale-105">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload Images</h2>
            <div {...getRootProps()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition duration-150 hover:bg-gray-50">
              <div className="space-y-2 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <input {...getInputProps()} />
                  <p className="pl-1">Drag & drop or click to upload images</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB (Max 5 images)</p>
              </div>
            </div>

            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {previewImages.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={file.preview}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-full object-cover rounded-lg transition duration-150 group-hover:opacity-75"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition duration-150"
                      onClick={() => {
                        setPreviewImages(prev => prev.filter((_, i) => i !== index));
                        setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index)
                        }));
                      }}
                    >
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-150 transform hover:scale-105"
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 transform hover:scale-105"
            >
              Post Auction
            </button>
          </div>
        </form>

        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-lg font-semibold text-green-600">Success!</h3>
              <p className="mt-2 text-gray-600">Auction posted successfully. Redirecting to home...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostAuction;
