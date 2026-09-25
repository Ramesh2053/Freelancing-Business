/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Save, User, MapPin, Eye, Settings, ShieldAlert, LogOut } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentUser, updateProfile, signOut } = useApp();

  if (!currentUser) return null;

  const [fullName, setFullName] = useState(currentUser.full_name);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [location, setLocation] = useState(currentUser.location || 'Kathmandu, Western Nepal');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) return;

    updateProfile({
      full_name: fullName,
      bio,
      location
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50/30 py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-2xl mx-auto bg-white p-8 border border-gray-150 rounded-2xl shadow-sm">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="text-center mb-8 border-b border-gray-50 pb-5">
            <span className="inline-flex h-7 bg-blue-50 text-primary-blue text-[11px] font-bold px-3 py-1 items-center rounded-xl space-x-1 justify-center mb-2">
              <Settings className="w-3.5 h-3.5 text-primary-blue" />
              <span>Personal configurations</span>
            </span>
            <h2 className="text-2xl font-black text-gray-950 heading-font mt-1">Manage Account Settings</h2>
            <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mt-0.5">Control your profile specifications</p>
          </div>

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold p-3.5 rounded-lg">
              🎉 Specifications saved, and real-time state updated and verified!
            </div>
          )}

          {/* User Email Info Indicator (Read Only) */}
          <div className="bg-yellow-50/20 p-4 border border-yellow-150 rounded-xl flex items-start space-x-3 text-xs leading-normal">
            <ShieldAlert className="w-5 h-5 text-secondary-orange shrink-0 mt-0.5" />
            <div>
              <span className="font-exrabold text-gray-700 block uppercase tracking-wider font-mono text-[10px]">Verified Credentials:</span>
              <p className="text-gray-500 font-medium">Logged in via verified email: <span className="font-extrabold text-blue-900">{currentUser.email}</span></p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase">Account Role: {currentUser.role}</p>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Full Account Name / Corporate Identity *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-300" />
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Sujata Paudel"
                className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition text-gray-800 font-medium"
              />
            </div>
          </div>

          {/* Bio / Description */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Expert Bio Summary</label>
            <textarea
              rows={4}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="State a summary of your professional expertise or client goals..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition resize-none text-gray-800 font-medium"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Headquarters Location / Timezone</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-300" />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Lalitpur, Nepal (GMT+5:45)"
                className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition text-gray-800 font-medium"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3.5 bg-primary-blue hover:bg-blue-950 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2 shadow-sm"
            >
              <Save className="w-4 h-4 text-white" />
              <span>Save Account Settings</span>
            </button>

            <button
              type="button"
              onClick={() => {
                signOut();
                window.location.hash = '#auth';
              }}
              className="py-3.5 px-6 border border-red-200 hover:bg-red-50 text-red-650 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 shrink-0"
            >
              <LogOut className="w-4 h-4 shrink-0 text-red-500" />
              <span>Sign Out</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
