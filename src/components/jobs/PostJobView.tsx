/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Calendar, ClipboardList, CheckCircle } from 'lucide-react';

interface PostJobViewProps {
  onNavigate: (page: string, params?: any) => void;
  inviteFreelancerId?: string;
}

const CATEGORIES = [
  'Software Development', 'UI/UX Design', 'Logo Design', 
  'Brand Identity', 'Illustration', 'Copywriting & Content', 
  'SEO Writing', 'Virtual Assistant', 'Customer Support'
];

export const PostJobView: React.FC<PostJobViewProps> = ({ onNavigate, inviteFreelancerId }) => {
  const { currentUser, postJob, users } = useApp();

  if (!currentUser) {
    onNavigate('auth');
    return null;
  }

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [requiredSkills, setRequiredSkills] = useState('');
  const [budgetType, setBudgetType] = useState<'hourly' | 'fixed'>('fixed');
  const [budget, setBudget] = useState(150);
  const [deadline, setDeadline] = useState('2026-06-30');

  const [submitted, setSubmitted] = useState(false);
  const [newJobId, setNewJobId] = useState('');

  // Get invited freelancer details
  const invitedUser = inviteFreelancerId ? users.find(u => u.user_id === inviteFreelancerId) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !budget || !deadline) return;

    const skillsArray = requiredSkills
      ? requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
      : [category, 'Web Design'];

    try {
      const newJob = postJob({
        title,
        description,
        category,
        budget,
        budget_type: budgetType,
        deadline,
        skills_required: skillsArray,
        job_type: 'one-time',
        visibility: inviteFreelancerId ? 'invite-only' : 'public',
        attachments: [],
        invited_freelancers: inviteFreelancerId ? [inviteFreelancerId] : []
      });

      if (newJob && newJob.job_id) {
        setNewJobId(newJob.job_id);
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          onNavigate('job_details', { jobId: newJob.job_id });
        }, 1500);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to post job');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50/30 py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-2xl mx-auto bg-white p-8 border border-gray-150 rounded-2xl shadow-sm">
        
        {/* SUBMITTED SUCCESS BANNER */}
        {submitted ? (
          <div className="text-center py-10 space-y-4 animate-scaleUp">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />
            <h3 className="text-xl font-bold text-gray-900 heading-font">Job Published Intermittently!</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto body-font">
              Hooray! Freelancers can now view and submit applications on the exploration boards. Route to detail boards...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="text-center mb-8 border-b border-gray-50 pb-5">
              <span className="inline-flex h-7 bg-blue-50 text-primary-blue text-[11px] font-bold px-3 py-1 items-center rounded-xl space-x-1 justify-center mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Job Formulation form</span>
              </span>
              <h2 className="text-2xl font-black text-gray-950 heading-font mt-1">Publish New Project Specification</h2>
              <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mt-0.5">Recruit Himalayan Talent securely</p>
            </div>

            {/* Inivitaion alert banner */}
            {invitedUser && (
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                <p className="text-xs text-secondary-orange font-semibold">
                  🤝 You are pre-invitation hiring: <span className="font-exrabold text-blue-900">{invitedUser.full_name}</span>. This job will flag as pre-invited to expedite escrow locks directly.
                </p>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Job Position Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Modern Full Stack Developer to build Next.js Web App"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition text-gray-800"
              />
            </div>

            {/* Category dropdown */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Industry stream Classification *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition text-gray-800 font-semibold"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Comprehensive Requirements Details *</label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="List detailed objectives, scope of deliverables, functional milestones, deadlines, and project details here..."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition resize-none text-gray-800"
              />
            </div>

            {/* required skills input */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 font-mono">Required specialized skills *</label>
              <input
                type="text"
                value={requiredSkills}
                onChange={e => setRequiredSkills(e.target.value)}
                placeholder="e.g. React, Figma, SEO Optimization, API Integration (comma-separated)"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition text-gray-800"
              />
            </div>

            {/* pricing budget style toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Budget Style Type</label>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setBudgetType('fixed')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                      budgetType === 'fixed' ? 'bg-white text-primary-blue shadow-sm' : 'text-gray-500 hover:text-gray-850'
                    }`}
                  >
                    Fixed Price ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBudgetType('hourly')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                      budgetType === 'hourly' ? 'bg-white text-primary-blue shadow-sm' : 'text-gray-500 hover:text-gray-850'
                    }`}
                  >
                    Hourly Rate ($)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Value Amount ($) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-sm font-extrabold text-gray-400">$</span>
                  <input
                    type="number"
                    required
                    min={10}
                    value={budget}
                    onChange={e => setBudget(Math.max(10, parseInt(e.target.value) || 10))}
                    className="w-full pl-7 pr-3 py-3 rounded-lg border border-gray-200 text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition text-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* deadline input */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Milestone Target Deadline *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-gray-300" />
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition text-gray-800"
                />
              </div>
            </div>

            {/* POST BUTTON */}
            <button
              type="submit"
              className="w-full py-4 bg-primary-blue hover:bg-blue-950 font-bold text-white text-sm rounded-xl transition shadow flex items-center justify-center space-x-1"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Launch Job and Enable Escrow</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
