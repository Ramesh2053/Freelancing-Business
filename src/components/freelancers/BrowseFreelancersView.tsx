/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, Star, Award, Compass, Inbox, ArrowRight, UserCheck } from 'lucide-react';

const SKILL_SHORTCUTS = ['Figma', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Logo Design', 'Brand Identity', 'Copywriting'];

export const BrowseFreelancersView: React.FC = () => {
  const { freelanceDetails, users, onNavigate } = useApp();

  // Filter conditions
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [availability, setAvailability] = useState<string>('All');

  // Filtering Logic
  const filteredFreelancers = useMemo(() => {
    return freelanceDetails.filter(detail => {
      const user = users.find(u => u.user_id === detail.freelancer_id);
      if (!user) return false;

      const matchesSearch = 
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesSkill = selectedSkill === 'All' || detail.skills.includes(selectedSkill);
      const matchesRating = detail.average_rating >= minRating;
      const matchesAvailability = availability === 'All' || detail.availability_status === availability;

      return matchesSearch && matchesSkill && matchesRating && matchesAvailability;
    });
  }, [freelanceDetails, users, searchTerm, selectedSkill, minRating, availability]);

  return (
    <div className="bg-gray-50/30 min-h-screen py-10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 heading-font">Discover Expert Vetted Talent</h1>
          <p className="text-sm text-gray-500 mt-1 body-font">Hire responsive digital designers, developers, and administrators on our safe escrow workspace.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* FILTER OPTIONS PANEL */}
          <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm text-left lg:sticky lg:top-6 space-y-6">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-bold text-gray-900 uppercase font-mono tracking-wider">Talent Filters</h3>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSkill('All');
                  setMinRating(0);
                  setAvailability('All');
                }}
                className="text-[11px] font-bold text-secondary-orange hover:underline"
              >
                Clear Filters
              </button>
            </div>

            {/* Keyword search */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">Expert Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="e.g. Bishal, React, Illustrator"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition text-gray-800 font-medium"
                />
              </div>
            </div>

            {/* Skill shortcut select dropdown */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono font-sans text-left">Target Domain</label>
              <select
                value={selectedSkill}
                onChange={e => setSelectedSkill(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-blue/30 text-gray-750 font-semibold"
              >
                <option value="All">All Skill Specializations</option>
                {SKILL_SHORTCUTS.map(sk => (
                  <option key={sk} value={sk}>{sk}</option>
                ))}
              </select>
            </div>

            {/* Rating Filter Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">
                <span>Min rating</span>
                <span className="text-gray-700">★ {minRating}</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={minRating}
                onChange={e => setMinRating(parseFloat(e.target.value))}
                className="w-full accent-primary-blue cursor-pointer h-1 bg-gray-200 rounded-lg outline-none"
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">Crew Availability</label>
              <select
                value={availability}
                onChange={e => setAvailability(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-blue/30 text-gray-755 font-semibold"
              >
                <option value="All">All Availabilities</option>
                <option value="Available">Available Immediately</option>
                <option value="Busy">Currently Busy</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>

          </div>

          {/* GRID RESULTS */}
          <div className="lg:col-span-3 space-y-5">
            <div className="flex justify-between items-center bg-white border border-gray-150 px-5 py-3.5 rounded-xl shadow-sm text-xs">
              <span className="font-bold text-gray-555">We found <span className="text-secondary-orange font-extrabold">{filteredFreelancers.length}</span> active experts available</span>
              <span className="text-gray-405 font-bold font-mono">STATUS: HIGHLY ACTIVE HUB</span>
            </div>

            {filteredFreelancers.length === 0 ? (
              <div className="bg-white border border-gray-150 rounded-2xl py-20 px-4 text-center space-y-3 shadow-sm">
                <Inbox className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="text-lg font-bold text-gray-900 heading-font">No matching freelancers found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto body-font">
                  Try lowering your minimum rating selection or removing active keyword selectors to see more creatives.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredFreelancers.map(fDetail => {
                  const user = users.find(u => u.user_id === fDetail.freelancer_id);
                  if (!user) return null;

                  return (
                    <div 
                      key={fDetail.freelancer_id}
                      className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm hover:shadow transition duration-200 text-left flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        
                        {/* HEAD CARD ROW */}
                        <div className="flex items-center space-x-3.5">
                          <img 
                            src={user.profile_photo_url} 
                            alt={user.full_name} 
                            className="w-12 h-12 rounded-full object-cover border border-gray-150"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <h4 className="font-bold text-gray-950 heading-font text-sm">{user.full_name}</h4>
                              {fDetail.availability_status === 'Available' && (
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-secondary-orange font-bold font-mono line-clamp-1">{fDetail.headline}</p>
                          </div>
                        </div>

                        {/* BIO */}
                        <p className="text-xs text-gray-500 leading-normal body-font line-clamp-2">
                          {user.bio || 'Professional remote contractor holding expertise in custom design assets, scalable script codes, and virtual integrations.'}
                        </p>

                        {/* SKILLS */}
                        <div className="flex flex-wrap gap-1">
                          {fDetail.skills.slice(0, 4).map(skill => (
                            <span key={skill} className="bg-gray-50 text-gray-600 font-bold text-[10px] px-2 py-0.5 rounded border border-gray-100">
                              {skill}
                            </span>
                          ))}
                          {fDetail.skills.length > 4 && (
                            <span className="text-[9px] text-gray-400 font-bold self-center ml-1">+{fDetail.skills.length - 4} more</span>
                          )}
                        </div>

                      </div>

                      {/* BOTTOM ROW METRICS */}
                      <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                        
                        <div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase font-mono">Commission rate</div>
                          <div className="text-base font-black text-primary-blue heading-font">
                            ${fDetail.hourly_rate}
                            <span className="text-[9px] font-medium text-gray-450 uppercase"> / {fDetail.rate_type}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => onNavigate('freelancer_profile', { userId: fDetail.freelancer_id })}
                          className="px-4 py-2 bg-primary-blue hover:bg-blue-950 text-white font-bold text-xs rounded-lg transition shadow-sm flex items-center space-x-1"
                        >
                          <span>Review Crew</span>
                          <ArrowRight className="w-3 h-3 text-white" />
                        </button>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
