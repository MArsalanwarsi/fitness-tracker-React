import React, { useState, useRef } from 'react';
import { PencilIcon, CameraIcon, XMarkIcon,  } from '@heroicons/react/24/outline';
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slice/authSlice";

const WebsiteProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState({
    name: 'Arsalan Ahmed',
    email: 'arsalan@example.com',
    profession: 'Software Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arsalan'
  });

  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  const dispatch = useDispatch();
  function handleLogout() {
    dispatch(logout());
  }
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex justify-center items-center font-sans">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header/Cover Section */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600" />

        {/* Profile Info Section */}
        <div className="relative px-8 pb-8">
          
          {/* Profile Picture (Interactive) */}
          <div className="relative -top-12 flex justify-between items-end">
            <div className="group relative cursor-pointer" onClick={handleImageClick}>
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg bg-slate-200">
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" 
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CameraIcon className="h-8 w-8 text-white" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mb-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <PencilIcon className="h-4 w-4" />
              Edit Profile
            </button> 
            <button 
              onClick={handleLogout}
              className="mb-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <PencilIcon className="h-4 w-4" />
              Sign Out
            </button>
          </div>

          {/* User Details */}
          <div className="-mt-8 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">{user.name}</h1>
              <p className="text-slate-500 font-medium">{user.profession}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <p className="text-slate-700 font-medium mt-1">{user.email}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                <p className="text-slate-700 font-medium mt-1">••••••••••••</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Edit Details</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={user.name}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    defaultValue={user.email}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">New Password</label>
                  <input 
                    type="password" 
                    placeholder="Leave blank to keep current" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteProfile;