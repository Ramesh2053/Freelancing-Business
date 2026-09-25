/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, Briefcase, DollarSign, Award, Users, 
  MessageSquare, PlusCircle, Inbox, ArrowRight, ExternalLink, ShieldAlert
} from 'lucide-react';

interface ClientDashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ onNavigate }) => {
  const { currentUser, currentClientDetail, jobs, freelanceDetails, users, transactions, applications } = useApp();

  if (!currentUser) return null;

  // Derive client metrics
  const clientJobs = jobs.filter(j => j.client_id === currentUser.user_id);
  const activeCount = clientJobs.filter(j => j.status === 'posted' || j.status === 'in-progress').length;
  
  // Pending payments: Sum budget of jobs that are 'in-progress' and have held escrow
  const inProgressJobs = clientJobs.filter(j => j.status === 'in-progress');
  const pendingEscrows = transactions.filter(t => t.client_id === currentUser.user_id && t.status === 'held');
  const pendingPaymentsSum = pendingEscrows.reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = currentClientDetail?.total_spent || 0;
  
  // Hired freelancers count: Unique freelancer IDs in accepted applications for this client's jobs
  const clientJobsIds = clientJobs.map(j => j.job_id);
  const hiredFreelanceIds = applications
    .filter(a => clientJobsIds.includes(a.job_id) && a.status === 'accepted')
    .map(a => a.freelancer_id);
  const hiredCount = new Set(hiredFreelanceIds).size;

  // Recommended freelancers (first 3 available freelancers)
  const recommendedFreelancers = freelanceDetails
    .filter(f => f.availability_status === 'Available')
    .slice(0, 3)
    .map(f => {
      const user = users.find(u => u.user_id === f.freelancer_id);
      return {
        ...f,
        name: user?.full_name || 'Expert Vetted',
        photo: user?.profile_photo_url || ''
      };
    });

  // Recent activity feed
  const clientApps = applications.filter(a => clientJobsIds.includes(a.job_id));
  const activities = [
    { text: `Verified enterprise identity via secure OTP registration.`, time: `Just now`, icon: `🛡️` },
    ...clientJobs.map(j => ({
      text: `Published public job requirement titled: "${j.title}".`,
      time: `2 days ago`,
      icon: `📢`
    })),
    ...clientApps.map(a => {
      const user = users.find(u => u.user_id === a.freelancer_id);
      const job = jobs.find(j => j.job_id === a.job_id);
      return {
        text: `Received cover-letter application from ${user?.full_name || 'Expert'} for "${job?.title || 'Job'}".`,
        time: `1 day ago`,
        icon: `✉️`
      };
    }),
    ...transactions.filter(t => t.client_id === currentUser.user_id).map(t => {
      const job = jobs.find(j => j.job_id === t.job_id);
      return {
        text: t.status === 'released' 
          ? `Released escrow funds of $${t.amount} to freelancer for completing "${job?.title}".`
          : `Secured escrow budget of $${t.amount} via ${t.payment_method} for "${job?.title}".`,
        time: `3 days ago`,
        icon: t.status === 'released' ? `🔓` : `🔒`
      };
    })
  ].slice(0, 5);

  return (
    <div className="bg-gray-50/30 min-h-screen py-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* WELCOME HEADER */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-8 rounded-2xl shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black heading-font flex items-center space-x-2">
              <span>Welcome back, {currentClientDetail?.company_name || currentUser.full_name}!</span>
              <span className="animate-bounce">💼</span>
            </h1>
            <p className="text-xs text-orange-200 uppercase tracking-widest font-mono mt-1">Client Command Dashboard</p>
            <p className="mt-2 text-sm text-blue-100 max-w-xl">
              Post fresh project outlines, manage your active escrow facilitates, interview applicants, or approve incoming deliverables.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('client_profile', { userId: currentUser.user_id })}
            className="mt-4 md:mt-0 px-5 py-2.5 bg-white text-primary-blue font-bold text-xs rounded-lg transition hover:bg-blue-50"
          >
            My Public Profile
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          {/* Card 1: Active Projects posted */}
          <div className="bg-white p-6 border border-gray-150 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">My Posted Projects</div>
              <div className="text-2xl font-black text-gray-900 mt-1 heading-font">{clientJobs.length}</div>
              <span className="text-[10px] text-gray-450 mt-1 block">{activeCount} Currently Active</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary-blue flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Pending Payments */}
          <div className="bg-white p-6 border border-gray-150 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Pending Payments</div>
              <div className="text-2xl font-black text-secondary-orange mt-1 heading-font">${pendingPaymentsSum}</div>
              <span className="text-[10px] text-gray-450 mt-1 block">Held safely in Escrow locks</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-secondary-orange flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Total Spent */}
          <div className="bg-white p-6 border border-gray-150 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Lifetime Spent</div>
              <div className="text-2xl font-black text-gray-900 mt-1 heading-font">${totalSpent}</div>
              <span className="text-[10px] text-gray-450 mt-1 block">Released upon approved work</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 text-[#10B981] flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Freelancers Hired */}
          <div className="bg-white p-6 border border-gray-150 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono font-sans">Freelancers Hired</div>
              <div className="text-2xl font-black text-gray-900 mt-1 heading-font">{hiredCount}</div>
              <span className="text-[10px] text-gray-450 mt-1 block">Contracted vetted team size</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* BODY LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMN 1 & 2: LISTINGS / ACTIONS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* MY COMMITTED JOBS */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm text-left">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-gray-950 heading-font">My Posted Positions</h3>
                <button 
                  onClick={() => onNavigate('post_job')} 
                  className="bg-primary-blue hover:bg-blue-950 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition shadow-sm flex items-center space-x-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Post Job</span>
                </button>
              </div>

              {clientJobs.length === 0 ? (
                <div className="py-12 text-center text-gray-400 space-y-2">
                  <Inbox className="w-10 h-10 mx-auto" />
                  <p className="text-sm font-semibold">No job requirements published yet</p>
                  <p className="text-xs text-gray-400">Launch a requirement card to receive cover letters from developers and designers immediately!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {clientJobs.map((job) => {
                    const applicants = applications.filter(a => a.job_id === job.job_id);
                    return (
                      <div key={job.job_id} className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50/50 transition">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-blue-50 text-primary-blue text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono">
                              {job.category}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                              job.status === 'posted' ? 'bg-green-50 text-green-700' :
                              job.status === 'in-progress' ? 'bg-yellow-50 text-yellow-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {job.status}
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-900 heading-font text-base mt-2">{job.title}</h4>
                          <span className="text-xs text-gray-450">Budget: ${job.budget} • applicants: {applicants.length}</span>
                        </div>

                        <div className="flex space-x-2 mt-4 sm:mt-0">
                          <button
                            onClick={() => onNavigate('job_details', { jobId: job.job_id })}
                            className="bg-gray-50 hover:bg-gray-100 border border-gray-200 font-bold text-xs px-3.5 py-2.5 rounded-lg transition text-gray-700 flex items-center space-x-1"
                          >
                            <span>Application Board</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RECENT FEED */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm text-left">
              <h3 className="text-lg font-bold text-gray-950 heading-font mb-5">Operational Activity Timeline</h3>
              <div className="space-y-4">
                {activities.map((act, index) => (
                  <div key={index} className="flex items-start space-x-3.5 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <span className="text-lg bg-gray-50 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-gray-100">
                      {act.icon}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 font-medium leading-relaxed">{act.text}</p>
                      <span className="text-[10px] text-gray-400 font-semibold font-mono">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* COLUMN 3: SIDEBAR OPTIONS */}
          <div className="space-y-6">
            
            {/* RECOMMENDED FREELANCERS CHIPS */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm text-left">
              <h3 className="text-lg font-bold text-gray-950 heading-font mb-4">Recommended Talent</h3>
              
              <div className="space-y-4">
                {recommendedFreelancers.map((f) => (
                  <div 
                    key={f.freelancer_id}
                    onClick={() => onNavigate('freelancer_profile', { userId: f.freelancer_id })}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-gray-50 hover:bg-blue-50/20 hover:border-blue-100 transition cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={f.photo}
                        alt={f.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 heading-font line-clamp-1">{f.name}</h4>
                        <p className="text-[10px] text-secondary-orange font-semibold tracking-wide line-clamp-1">{f.headline}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-extrabold text-primary-blue">${f.hourly_rate}/hr</div>
                      <div className="text-[10px] text-gray-400 font-semibold">★ {f.average_rating}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNavigate('browse_freelancers')}
                className="w-full text-center py-2.5 text-xs text-primary-blue font-bold tracking-normal uppercase bg-blue-50 hover:bg-blue-100 rounded-lg transition mt-4"
              >
                Search all talent databases
              </button>
            </div>

            {/* ESCROW SECURITY ADVISORY */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-6 text-left space-y-3 shadow-md border-r-4 border-secondary-orange">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-secondary-orange" />
              </div>
              <h4 className="text-sm font-bold heading-font">Client Escrow Advisory</h4>
              <p className="text-xs text-blue-200 leading-relaxed body-font">
                To guarantee production speed and satisfy our terms agreement, please secure funds up-front. Freelancers are immediately notified in-app once escrow deposit verifies.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
