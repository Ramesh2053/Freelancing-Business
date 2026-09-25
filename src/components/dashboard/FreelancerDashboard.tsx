/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, Briefcase, DollarSign, Award, Star, 
  MessageSquare, Bell, UserCheck, Inbox, ArrowRight, ExternalLink, Calendar
} from 'lucide-react';

interface FreelancerDashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export const FreelancerDashboard: React.FC<FreelancerDashboardProps> = ({ onNavigate }) => {
  const { currentUser, currentFreelancerDetail, jobs, applications, transactions, reviews } = useApp();

  if (!currentUser) return null;

  // Derive stats
  const freelancerApps = applications.filter(a => a.freelancer_id === currentUser.user_id);
  const activeAppsJobsId = freelancerApps.filter(a => a.status === 'accepted').map(a => a.job_id);
  
  // Active jobs are those where application was accepted and job is 'in-progress' or work is submitted
  const activeProjects = jobs.filter(j => activeAppsJobsId.includes(j.job_id) && (j.status === 'in-progress'));
  
  // Pending Escrow Earnings: Sum budget of active projects where escrow transaction is "held"
  const pendingTransactions = transactions.filter(t => t.freelancer_id === currentUser.user_id && t.status === 'held');
  const pendingEscrowAmount = pendingTransactions.reduce((sum, t) => sum + t.amount, 0);

  const totalEarned = currentFreelancerDetail?.total_earned || 0;
  const averageRating = currentFreelancerDetail?.average_rating || 5.0;
  const reviewCount = currentFreelancerDetail?.total_reviews || 0;

  // Simulated activity feed
  const activities = [
    { text: `Verified account email via secure OTP.`, time: `Just now`, icon: `🛡️` },
    ...freelancerApps.map(a => {
      const job = jobs.find(j => j.job_id === a.job_id);
      return {
        text: `Submitted cover letter application for "${job?.title || 'Open Assignment'}".`,
        time: `1 day ago`,
        icon: `📝`
      };
    }),
    ...transactions.filter(t => t.freelancer_id === currentUser.user_id).map(t => {
      const job = jobs.find(j => j.job_id === t.job_id);
      return {
        text: t.status === 'held' 
          ? `Capital of $${t.amount} secured in Escrow for "${job?.title}". Work is authorized!`
          : `Escrow release of $${t.amount} credited to your account balance for "${job?.title}".`,
        time: t.status === 'held' ? `2 days ago` : `4 days ago`,
        icon: t.status === 'held' ? `🔒` : `💰`
      };
    })
  ].slice(0, 5);

  return (
    <div className="bg-gray-50/30 min-h-screen py-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* WELCOME BANNER */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-8 rounded-2xl shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black heading-font flex items-center space-x-2">
              <span>Welcome back, {currentUser.full_name}!</span>
              <span className="animate-bounce">👋</span>
            </h1>
            <p className="text-xs text-blue-200 uppercase tracking-widest font-mono mt-1">Freelancer Control Dashboard</p>
            <p className="mt-2 text-sm text-blue-100 max-w-xl">
              Check out matches inside the browse tab, manage current client deliverables, or claim released escrow balances.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('freelancer_profile', { userId: currentUser.user_id })}
            className="mt-4 md:mt-0 px-5 py-2.5 bg-white text-primary-blue font-bold text-xs rounded-lg transition hover:bg-blue-50"
          >
            Preview Public Profile
          </button>
        </div>

        {/* QUICK STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          {/* Card 1: Active Projects */}
          <div className="bg-white p-6 border border-gray-150 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">My Active Projects</div>
              <div className="text-2xl font-black text-gray-900 mt-1 heading-font">{activeProjects.length}</div>
              <button 
                onClick={() => onNavigate('browse_jobs')} 
                className="text-xs text-primary-blue font-semibold hover:underline mt-2 inline-flex items-center space-x-1"
              >
                <span>Navigate to details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary-blue flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Pending Earnings */}
          <div className="bg-white p-6 border border-gray-150 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">In Escrow Hold</div>
              <div className="text-2xl font-black text-[#10B981] mt-1 heading-font">${pendingEscrowAmount}</div>
              <span className="text-[10px] text-gray-450 mt-1 block">Awaiting delivery approval</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 text-[#10B981] flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Total Earned */}
          <div className="bg-white p-6 border border-gray-150 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Lifetime Earnings</div>
              <div className="text-2xl font-black text-gray-900 mt-1 heading-font">${totalEarned}</div>
              <span className="text-[10px] text-gray-450 mt-1 block">Successfully released funds</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-secondary-orange flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Rating */}
          <div className="bg-white p-6 border border-gray-150 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Average Rating</div>
              <div className="text-2xl font-black text-gray-900 mt-1 heading-font flex items-center">
                <span>{averageRating}</span>
                <Star className="w-5 h-5 text-[#FBBF24] fill-current ml-1" />
              </div>
              <span className="text-[10px] text-gray-450 mt-1 block">Based on {reviewCount} reviews</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* QUICK ACTIONS LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMN 1 & 2: RECENT PROJECT LISTINGS & ACTIVITY */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* ACTIVE PROJECTS GRID */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm text-left">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-gray-950 heading-font">Active Projects</h3>
                <button 
                  onClick={() => onNavigate('browse_jobs')} 
                  className="text-xs font-bold text-primary-blue hover:underline"
                >
                  Browse open listings
                </button>
              </div>

              {activeProjects.length === 0 ? (
                <div className="py-12 text-center text-gray-400 space-y-2">
                  <Inbox className="w-10 h-10 mx-auto" />
                  <p className="text-sm font-semibold">No active projects assigned</p>
                  <p className="text-xs text-gray-400">Search for jobs, submit applications, and ask clients to initiate escrow!</p>
                  <button
                    onClick={() => onNavigate('browse_jobs')}
                    className="mt-2 px-4 py-2 bg-primary-blue text-white font-bold text-xs rounded-lg transition hover:bg-blue-950 inline-block"
                  >
                    Browse Jobs Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeProjects.map((job) => {
                    const hasSubmitted = !!job.work_submission_notes;
                    return (
                      <div key={job.job_id} className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50/50 transition">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono">
                              {job.category}
                            </span>
                            {hasSubmitted ? (
                              <span className="bg-yellow-50 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-200">
                                Pending Client Approval
                              </span>
                            ) : (
                              <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded border border-green-200">
                                In Production
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-gray-900 heading-font text-base mt-2">{job.title}</h4>
                          <span className="text-xs text-gray-450">Secured rate: ${job.budget} ({job.budget_type})</span>
                        </div>

                        <div className="flex space-x-2 mt-4 sm:mt-0">
                          <button
                            onClick={() => onNavigate('job_details', { jobId: job.job_id })}
                            className="bg-gray-50 hover:bg-gray-100 border border-gray-200 font-bold text-xs px-3.5 py-2 rounded-lg transition text-gray-700 flex items-center space-x-1"
                          >
                            <span>Details</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onNavigate('work_submission', { jobId: job.job_id })}
                            className="bg-primary-blue hover:bg-blue-950 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition shadow-sm"
                          >
                            {hasSubmitted ? 'Modify Assets' : 'Submit Deliverables'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* LIVE SYSTEM ACTIVITY FEED */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm text-left">
              <h3 className="text-lg font-bold text-gray-950 heading-font mb-5">Recent Activity Feed</h3>
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

          {/* COLUMN 3: SIDE CO-ACTIONS & OUTSTANDING DEADLINES */}
          <div className="space-y-6">
            
            {/* QUICK ACTIONS BUTTON HUB */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm text-left">
              <h3 className="text-lg font-bold text-gray-950 heading-font mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('browse_jobs')}
                  className="w-full py-3 bg-primary-blue hover:bg-blue-950 text-white font-bold text-sm rounded-xl transition flex items-center justify-center space-x-2"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Browse Open Jobs</span>
                </button>
                
                <button
                  onClick={() => onNavigate('chat')}
                  className="w-full py-3 border border-gray-250 hover:bg-gray-50 text-gray-700 font-bold text-sm rounded-xl transition flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4 text-primary-blue" />
                  <span>View Messenger</span>
                </button>

                <button
                  onClick={() => onNavigate('settings')}
                  className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-sm rounded-xl transition flex items-center justify-center space-x-2 border border-gray-150"
                >
                  <span>Edit Settings</span>
                </button>
              </div>
            </div>

            {/* UPCOMING DEADLINES OUTLINE */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm text-left">
              <h3 className="text-lg font-bold text-gray-950 heading-font mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-secondary-orange" />
                <span>Upcoming Milestones</span>
              </h3>

              {activeProjects.length === 0 ? (
                <p className="text-xs text-gray-400 leading-relaxed body-font">
                  No near deadlines. Secure a project on the explore jobs boards to track progress.
                </p>
              ) : (
                <div className="space-y-3">
                  {activeProjects.map(j => (
                    <div key={j.job_id} className="p-3 bg-orange-50/10 border border-orange-100 rounded-lg">
                      <h4 className="text-xs font-bold text-gray-900 heading-font line-clamp-1">{j.title}</h4>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-secondary-orange font-bold font-mono">Deadline: {j.deadline}</span>
                        <span className="text-[10px] font-extrabold text-gray-700">${j.budget}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
