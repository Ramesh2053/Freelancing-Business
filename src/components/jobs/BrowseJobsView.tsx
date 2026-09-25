/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, SlidersHorizontal, MapPin, DollarSign, Calendar, Inbox, ArrowRight } from 'lucide-react';

export const BrowseJobsView: React.FC = () => {
  const { jobs, users, onNavigate } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [minBudget, setMinBudget] = useState<number>(0);
  const [maxBudget, setMaxBudget] = useState<number>(10000);
  const [showFilters, setShowFilters] = useState(false);

  // Derive list of unique categories
  const categories = useMemo(() => {
    const list = jobs.map(j => j.category);
    return ['All', ...Array.from(new Set(list))];
  }, [jobs]);

  // Filtering Logic
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Only show open 'posted' jobs here
      if (job.status !== 'posted') return false;

      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.required_skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
      
      const matchesType = selectedType === 'All' || job.budget_type === selectedType;

      const matchesMinBudget = job.budget >= minBudget;
      const matchesMaxBudget = job.budget <= maxBudget;

      return matchesSearch && matchesCategory && matchesType && matchesMinBudget && matchesMaxBudget;
    });
  }, [jobs, searchTerm, selectedCategory, selectedType, minBudget, maxBudget]);

  return (
    <div className="bg-gray-50/30 min-h-screen py-10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BRIEF BANNER */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 heading-font">Explore Contract Opportunities</h1>
          <p className="text-sm text-gray-500 mt-1 body-font">Discover real gigs protected under our strict secure escrow terms.</p>
        </div>

        {/* SEARCH & TOGGLE FILTERS BAR */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* SEARCH FILTERS COLUMN */}
          <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm text-left lg:sticky lg:top-6 space-y-6">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-bold text-gray-900 uppercase font-mono tracking-wider">Search Filters</h3>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedType('All');
                  setMinBudget(0);
                  setMaxBudget(10000);
                }}
                className="text-[11px] font-bold text-secondary-orange hover:underline"
              >
                Reset Filters
              </button>
            </div>

            {/* Keyword */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">Keyword text</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="e.g. Logos, React, Figma"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition text-gray-800 font-medium"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">Industry Stream</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-blue/30 text-gray-700 font-semibold"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Job Budget Type */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">Pricing Style</label>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSelectedType('All')}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition ${
                    selectedType === 'All' ? 'bg-white text-primary-blue shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  All Gigs
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType('fixed')}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition ${
                    selectedType === 'fixed' ? 'bg-white text-primary-blue shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Fixed
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType('hourly')}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition ${
                    selectedType === 'hourly' ? 'bg-white text-primary-blue shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Hourly
                </button>
              </div>
            </div>

            {/* Budget range inputs */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5 font-mono">Budget Range ($)</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-gray-450 block mb-1">Min ($)</span>
                  <input
                    type="number"
                    value={minBudget}
                    onChange={e => setMinBudget(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-750"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-450 block mb-1">Max ($)</span>
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={e => setMaxBudget(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-750"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* RESULTS GRID COLUMN */}
          <div className="lg:col-span-3 space-y-5">
            <div className="flex justify-between items-center bg-white border border-gray-150 px-5 py-3.5 rounded-xl shadow-sm text-xs">
              <span className="font-bold text-gray-555">We found <span className="text-primary-blue font-extrabold">{filteredJobs.length}</span> positions match your scope</span>
              <span className="text-gray-400 font-bold font-mono">STATUS: ACTIVE INTAKES DEBT</span>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="bg-white border border-gray-150 rounded-2xl py-20 px-4 text-center space-y-3 shadow-sm">
                <Inbox className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="text-lg font-bold text-gray-900 heading-font">No such listings fit these constraints</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto body-font">
                  Try lowering your minimum budget requirement or searching under broad keywords to capture more client openings.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map(job => {
                  const client = users.find(u => u.user_id === job.client_id);
                  return (
                    <div 
                      key={job.job_id}
                      className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm hover:shadow transition duration-200 text-left flex flex-col justify-between"
                    >
                      <div className="space-y-3.5">
                        <div className="flex flex-wrap justify-between items-start gap-2.5">
                          <div>
                            <span className="bg-blue-50 text-primary-blue text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wide border border-blue-100">
                              {job.category}
                            </span>
                            <span className="text-[10px] text-gray-450 font-bold font-mono uppercase tracking-wide ml-2">
                              {job.budget_type} Budget
                            </span>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-xs text-gray-400 font-semibold flex items-center space-x-1 font-mono">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{job.deadline}</span>
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 
                            onClick={() => onNavigate('job_details', { jobId: job.job_id })}
                            className="text-lg font-bold text-gray-950 heading-font hover:text-primary-blue cursor-pointer transition line-clamp-1"
                          >
                            {job.title}
                          </h4>
                          
                          {client && (
                            <span className="text-xs font-semibold text-gray-400 mt-1 block">
                              Published by: <span className="text-gray-650 font-bold">{client.full_name}</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-450 leading-relaxed body-font line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {job.required_skills.map(badge => (
                            <span key={badge} className="bg-gray-50 border border-gray-100 text-gray-600 font-bold text-[10px] px-2.5 py-1 rounded">
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-5 mt-5 border-t border-gray-50 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono font-bold block">Proposed compensation</span>
                          <span className="text-lg font-black text-[#10B981] heading-font">${job.budget}</span>
                        </div>

                        <button 
                          onClick={() => onNavigate('job_details', { jobId: job.job_id })}
                          className="px-5 py-2.5 bg-primary-blue hover:bg-blue-950 text-white font-bold text-xs rounded-lg transition shadow-sm flex items-center space-x-1"
                        >
                          <span>Review Gigs Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
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
