/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building, MapPin, Globe, ExternalLink, Briefcase, 
  DollarSign, Users, Award, Inbox, ArrowLeft, ArrowRight
} from 'lucide-react';

interface ClientProfileViewProps {
  onNavigate: (page: string, params?: any) => void;
  userId: string;
}

export const ClientProfileView: React.FC<ClientProfileViewProps> = ({ onNavigate, userId }) => {
  const { users, clientDetails, jobs, applications } = useApp();

  const user = users.find(u => u.user_id === userId);
  const detail = clientDetails.find(c => c.client_id === userId);

  if (!user || !detail) {
    return (
      <div className="py-16 text-center space-y-4">
        <h3 className="text-xl font-bold">Client profile not found</h3>
        <button onClick={() => onNavigate('home')} className="px-4 py-2 bg-primary-blue text-white rounded-lg">Return Home</button>
      </div>
    );
  }

  // Derive client stats
  const clientJobs = jobs.filter(j => j.client_id === userId);
  const activeJobs = clientJobs.filter(j => j.status === 'posted');
  
  // Total hired count across this client's jobs
  const clientJobsIds = clientJobs.map(j => j.job_id);
  const hiredFreelanceIds = applications
    .filter(a => clientJobsIds.includes(a.job_id) && a.status === 'accepted')
    .map(a => a.freelancer_id);
  const totalHired = new Set(hiredFreelanceIds).size;

  return (
    <div className="bg-gray-50/30 min-h-screen pb-16 text-left">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 h-44 w-full relative">
        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={() => onNavigate('browse_jobs')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-lg transition backdrop-blur-md flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Search Positions</span>
          </button>
        </div>
      </div>

      {/* BODY WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMN 1: CORPORATE LOGO & STATS SUMMARY */}
          <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6">
            
            <div className="text-center">
              <img 
                src={user.profile_photo_url} 
                alt={detail.company_name} 
                className="w-24 h-24 rounded-2xl mx-auto object-cover border-4 border-white shadow-sm"
                referrerPolicy="no-referrer"
              />
              <h1 className="text-xl font-bold text-gray-950 heading-font mt-4">{detail.company_name}</h1>
              <p className="text-xs text-primary-blue font-bold uppercase tracking-wider font-mono mt-1">{detail.industry}</p>

              <div className="flex items-center justify-center space-x-1.5 mt-2.5 text-gray-500 text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5 text-secondary-orange" />
                <span>{detail.location}</span>
              </div>
            </div>

            <div className="h-[1px] bg-gray-100" />

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest font-mono">Marketplace Standing</h4>
              
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-lg">
                  <span className="block text-[10px] text-gray-400 uppercase font-mono font-bold">Posted</span>
                  <span className="text-sm font-black text-gray-800 font-sans">{clientJobs.length}</span>
                </div>
                <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-lg">
                  <span className="block text-[10px] text-gray-400 uppercase font-mono font-bold">Hired</span>
                  <span className="text-sm font-black text-gray-800 font-sans">{totalHired}</span>
                </div>
                <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-lg">
                  <span className="block text-[10px] text-primary-blue uppercase font-mono font-bold">Escrowed</span>
                  <span className="text-sm font-black text-primary-blue font-sans">${detail.total_spent}</span>
                </div>
              </div>
            </div>

            {/* DIRECT OFFICE MAIL INFO */}
            <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-2">
              <h5 className="text-[10px] uppercase tracking-wider font-bold text-gray-400 font-mono">Company Details:</h5>
              <div className="flex items-center space-x-2 text-xs text-gray-700">
                <Building className="w-4 h-4 text-gray-450" />
                <span className="font-semibold">{detail.industry} Sector</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-700">
                <MapPin className="w-4 h-4 text-gray-450" />
                <span className="font-semibold">{detail.location} HQ</span>
              </div>
            </div>

          </div>

          {/* COLUMN 2 & 3: COMPANY SPECIFICS & JOB DIRECTORY */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* COMPANY DESCRIPTION */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-950 heading-font mb-3">Enterprise Overview</h3>
              <p className="text-sm text-gray-500 leading-relaxed body-font">
                {detail.company_description || 'This registered client enterprise has not configured a custom description. Check out their active vacancy positions down below.'}
              </p>
            </div>

            {/* VACANCIES PLACEMENTS */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-950 heading-font mb-4">Open Opportunities ({activeJobs.length})</h3>

              {activeJobs.length === 0 ? (
                <div className="py-12 text-center text-gray-400 space-y-1">
                  <Inbox className="w-9 h-9 mx-auto text-gray-300" />
                  <p className="text-sm font-bold">No active positions published currently</p>
                  <p className="text-xs text-gray-400">All former requirements are currently contracted or fulfilled.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeJobs.map(job => (
                    <div 
                      key={job.job_id}
                      onClick={() => onNavigate('job_details', { jobId: job.job_id })}
                      className="border border-gray-100 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-blue-50/20 hover:border-blue-100 transition cursor-pointer"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="bg-orange-50 text-secondary-orange text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase border border-orange-100">
                            ${job.budget}
                          </span>
                          <span className="text-[10px] text-gray-450 font-semibold uppercase tracking-wider font-mono">
                            {job.budget_type}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 heading-font text-sm">{job.title}</h4>
                        <p className="text-xs text-gray-400 line-clamp-1 leading-relaxed mt-0.5">{job.description}</p>
                      </div>

                      <div className="mt-3.5 sm:mt-0 text-xs font-bold text-primary-blue flex items-center space-x-1 shrink-0">
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PREVIOUS COMPLETED DEEDS */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm text-left">
              <h3 className="text-lg font-bold text-gray-950 heading-font mb-3">Enterprise Track Record</h3>
              <p className="text-xs text-gray-450">All projects backed by our verified escrow security policy.</p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-left">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 font-mono">Overall Escrow Safety</span>
                  <span className="block text-xl font-bold text-primary-blue mt-1 heading-font">100% SECURE</span>
                  <span className="text-[10px] text-gray-450 block mt-0.5">Fully compliant with platform rules</span>
                </div>

                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-left">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 font-mono">Release Velocity</span>
                  <span className="block text-xl font-bold text-primary-blue mt-1 heading-font">FAST RELEASE</span>
                  <span className="text-[10px] text-gray-450 block mt-0.5">Prompt review of incoming milestones</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
