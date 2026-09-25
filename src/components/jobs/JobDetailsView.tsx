/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Briefcase, DollarSign, Calendar, MapPin, Inbox, Star, 
  Send, User, ShieldCheck, CheckCircle2, MessageSquare, AlertOctagon, HelpCircle
} from 'lucide-react';

interface JobDetailsViewProps {
  onNavigate: (page: string, params?: any) => void;
  jobId: string;
}

export const JobDetailsView: React.FC<JobDetailsViewProps> = ({ onNavigate, jobId }) => {
  const { 
    jobs, users, applications, currentUser, applyForJob, 
    clientDetails, freelanceDetails, disputes, raiseDispute 
  } = useApp();

  const job = jobs.find(j => j.job_id === jobId);

  if (!job) {
    return (
      <div className="py-20 text-center space-y-4">
        <h3 className="text-xl font-bold">Job specifications not found</h3>
        <button onClick={() => onNavigate('browse_jobs')} className="px-5 py-2.5 bg-primary-blue text-white rounded-lg">Return to list</button>
      </div>
    );
  }

  // Derive employer user profile
  const employer = users.find(u => u.user_id === job.client_id);
  const employerDetail = clientDetails.find(c => c.client_id === job.client_id);

  // Applications list for this specific job
  const jobApps = applications.filter(a => a.job_id === jobId);
  
  // Checking actions for active logged-in account
  const isEmployer = currentUser?.user_id === job.client_id;
  const isFreelancer = currentUser?.role === 'freelancer';

  // Has the active freelancer already drafted a cover letter bid?
  const freelancerApp = isFreelancer 
    ? applications.find(a => a.job_id === jobId && a.freelancer_id === currentUser?.user_id) 
    : null;

  // Active accepted contractor (if in production)
  const acceptedApp = applications.find(a => a.job_id === jobId && a.status === 'accepted');
  const contractorUser = acceptedApp ? users.find(u => u.user_id === acceptedApp.freelancer_id) : null;
  const activeDispute = disputes.find(d => d.job_id === jobId);

  // Freelancer Apply Form states
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState(job.budget);
  const [applySuccess, setApplySuccess] = useState(false);

  // Client Dispute Form state
  const [disputeReason, setDisputeReason] = useState('');
  const [showDisputeModal, setShowDisputeModal] = useState(false);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverLetter) return;

    try {
      const newApp = applyForJob(jobId, coverLetter);
      if (newApp) {
        setApplySuccess(true);
        setTimeout(() => {
          setApplySuccess(false);
          setCoverLetter('');
        }, 2000);
      }
    } catch (err: any) {
      alert(err.message || 'Apply call failed');
    }
  };

  const handleAcceptAppClick = (appId: string) => {
    // Lead client to secure payment portal to lock Escrow budget
    onNavigate('payments', { applicationId: appId });
  };

  const handleDeliverWorkClick = () => {
    onNavigate('work_submission', { jobId: jobId });
  };

  const handleReviewDeliverableClick = () => {
    onNavigate('work_approval', { jobId: jobId });
  };

  const handleFileDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason) return;
    
    try {
      const result = raiseDispute(jobId, 'Other', disputeReason, []);
      if (result) {
        setShowDisputeModal(false);
        setDisputeReason('');
      }
    } catch (err: any) {
      alert(err.message || 'Dispute raising failed');
    }
  };

  return (
    <div className="bg-gray-50/30 min-h-screen py-10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* STATUS STEP TRACK PROGRESS */}
        <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm mb-8">
          <div className="text-xs font-bold text-gray-400 font-mono uppercase tracking-widest mb-4">Job Progression Track:</div>
          <div className="grid grid-cols-4 gap-4 text-center text-xs font-bold font-mono">
            {/* Posted */}
            <div className={`p-3 rounded-lg border uppercase ${
              job.status === 'posted' ? 'bg-blue-50 border-primary-blue text-primary-blue shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-400'
            }`}>
              1. Open Bids
            </div>
            {/* In Progress */}
            <div className={`p-3 rounded-lg border uppercase ${
              job.status === 'in-progress' ? 'bg-yellow-50 border-yellow-300 text-yellow-750 shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-400'
            }`}>
              2. Secured Escrow
            </div>
            {/* Completed */}
            <div className={`p-3 rounded-lg border uppercase ${
              job.status === 'completed' ? 'bg-green-50 border-green-300 text-green-700 shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-400'
            }`}>
              3. Released
            </div>
            {/* Disputed */}
            <div className={`p-3 rounded-lg border uppercase ${
              job.status === 'disputed' || activeDispute ? 'bg-red-50 border-red-300 text-red-700 shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-400'
            }`}>
              Claim Dispute
            </div>
          </div>
        </div>

        {activeDispute && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-900 p-4 rounded-xl flex items-start space-x-3 text-xs leading-normal font-semibold">
            <AlertOctagon className="w-5 h-5 text-red-650 shrink-0" />
            <div>
              <h4 className="font-extrabold uppercase tracking-wide">Litigation Dispute Active</h4>
              <p className="mt-1 text-red-700">
                Claim: "{activeDispute.reason}"
              </p>
              <p className="mt-1 text-gray-450 text-[10px] uppercase">
                FreelanceFactory Neutral Admins are validating work logs. Dispute Status: {activeDispute.status}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMN 1 & 2: SPEC DETAILS, SUBMISSIONS AND APPLICATIONS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* JOB CONTENT CARD */}
            <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-6">
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-50 text-primary-blue text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider border border-blue-100">
                    {job.category}
                  </span>
                  <span className="text-[10px] text-gray-450 uppercase font-bold font-mono tracking-wider">
                    {job.budget_type} Budget rate
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-950 heading-font leading-tight">
                  {job.title}
                </h2>
              </div>

              <div className="h-[1px] bg-gray-100" />

              <div>
                <h3 className="text-sm font-bold text-gray-900 heading-font mb-2">Detailed Deliverables</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed body-font whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3.5 font-mono">Required Badges</h4>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required.map(skill => (
                    <span key={skill} className="bg-gray-50 text-gray-600 font-bold text-[10px] px-2.5 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* DURATION STATS */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center space-x-3 text-xs leading-normal">
                  <DollarSign className="w-5 h-5 text-secondary-orange" />
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 font-mono uppercase">Compensation:</span>
                    <span className="font-extrabold text-gray-800 text-sm">${job.budget}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs leading-normal">
                  <Calendar className="w-5 h-5 text-primary-blue" />
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 font-mono uppercase">Target Deadline:</span>
                    <span className="font-extrabold text-gray-800 text-sm">{job.deadline}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* INTERACTIVE APPLICATIONS AND WORK DELIVERABLES WORKSPACE PANEL */}
            {job.status === 'posted' ? (
              /* APPLICATIONS REVIEW PANEL (FOR EMPLOYER OR APPLY FORM FOR FREELANCERS) */
              isEmployer ? (
                <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm text-left">
                  <h3 className="text-base font-bold text-gray-990 heading-font mb-4 flex items-center space-x-2">
                    <Inbox className="w-5 h-5 text-primary-blue" />
                    <span>Candidate Applicants ({jobApps.length})</span>
                  </h3>

                  {jobApps.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 space-y-1">
                      <p className="text-sm font-semibold">No applications submitted yet</p>
                      <p className="text-xs text-gray-400">Freelancer applications appear here immediately upon submission.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {jobApps.map((app) => {
                        const applicant = users.find(u => u.user_id === app.freelancer_id);
                        const fDetails = freelanceDetails.find(f => f.freelancer_id === app.freelancer_id);
                        return (
                          <div key={app.application_id} className="border border-gray-100 rounded-xl p-5 hover:bg-gray-50/30 transition text-left space-y-3.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('freelancer_profile', { userId: app.freelancer_id })}>
                                <img
                                  src={applicant?.profile_photo_url}
                                  alt="Applicant"
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                  <h4 className="text-xs font-black text-gray-900 hover:underline">{applicant?.full_name}</h4>
                                  <p className="text-[10px] text-secondary-orange font-bold font-mono tracking-wide mt-0.5">{fDetails?.headline}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-gray-400 font-mono">Bids Amount</span>
                                <div className="text-sm font-bold text-primary-blue">${app.bid_amount}</div>
                              </div>
                            </div>

                            <p className="text-xs text-gray-500 leading-relaxed body-font bg-gray-50 p-3 rounded-lg border border-gray-100">
                              "{app.cover_letter}"
                            </p>

                            <div className="flex justify-between items-center pt-2">
                              {/* Rating indicator */}
                              <div className="text-[10px] font-bold text-gray-400 flex items-center space-x-1">
                                <Star className="w-3.5 h-3.5 fill-current text-yellow-500" />
                                <span>{fDetails?.average_rating} rating ({fDetails?.total_reviews} reviews)</span>
                              </div>

                              <button
                                onClick={() => handleAcceptAppClick(app.application_id)}
                                className="bg-secondary-orange hover:bg-orange-650 text-white font-bold text-xs px-4 py-2 rounded-lg transition"
                              >
                                Accept & Escrow Fund
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                }
                </div>
              ) : isFreelancer ? (
                freelancerApp ? (
                  <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm text-center space-y-3.5">
                    <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto animate-pulse" />
                    <h3 className="text-base font-bold text-gray-900 heading-font">Your cover letter has been lodged!</h3>
                    <div className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed border border-gray-100 bg-gray-50 p-4 rounded-xl text-left">
                      <span className="block font-bold text-gray-400 font-mono tracking-wider uppercase mb-1.5 text-[10px]">Your Bid Cover Letter:</span>
                      "{freelancerApp.cover_letter}"
                      <div className="mt-3.5 text-[10px] font-bold text-primary-blue font-mono uppercase bg-blue-50/50 border border-blue-100 w-max px-2.5 py-1 rounded">
                        Proposed: ${freelancerApp.bid_amount}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-base font-bold text-gray-950 heading-font mb-4 flex items-center space-x-2">
                      <Send className="w-5 h-5 text-primary-blue" />
                      <span>Draft Bid Application Placement</span>
                    </h3>

                    <form onSubmit={handleApplySubmit} className="space-y-4">
                      {applySuccess && (
                        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold p-3 rounded-lg">
                          🎉 Application Lodged Successfully! Real-time notifications synced.
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">My proposed Bid Rate ($) *</label>
                          <input
                            type="number"
                            required
                            min={10}
                            value={bidAmount}
                            onChange={e => setBidAmount(parseInt(e.target.value) || 120)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-220 text-xs font-bold text-gray-750"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Crisp Cover Letter description *</label>
                        <textarea
                          required
                          rows={4}
                          value={coverLetter}
                          onChange={e => setCoverLetter(e.target.value)}
                          placeholder="Introduce your skill badges, former experience samples, and how you will tackle requirements..."
                          className="w-full px-4 py-3 rounded-lg border border-gray-220 text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition resize-none text-gray-800"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-primary-blue hover:bg-blue-950 text-white font-bold text-xs rounded-lg transition shadow-sm"
                      >
                        Submit Cover Letter Bid
                      </button>
                    </form>
                  </div>
                )
              ) : (
                <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm text-center py-10 space-y-3">
                  <User className="w-10 h-10 text-gray-300 mx-auto" />
                  <p className="text-sm font-semibold">Sign in as Freelancer to Apply</p>
                  <button 
                    onClick={() => onNavigate('auth')} 
                    className="mt-2 text-xs font-bold text-primary-blue hover:underline bg-blue-50 px-4 py-2 rounded-lg inline-block"
                  >
                    Authenticate Account
                  </button>
                </div>
              )
            ) : job.status === 'in-progress' ? (
              /* ACTIVE CONTRACT WORK IN PROGRESS PANEL */
              <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm text-left">
                <h3 className="text-base font-bold text-gray-950 heading-font mb-4 flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                  <span>Secure Escrow Project Workspace</span>
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed mb-5 body-font">
                  Contract is actively engaged in production. Escrow is verified under secure custody and cannot be retrieved on a whim. 
                  Once work is uploaded, client reviews assets to officially trigger releases.
                </p>

                {contractorUser && (
                  <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 mb-5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={contractorUser.profile_photo_url} 
                        alt="Contractor" 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <span className="text-[9px] text-gray-400 font-mono uppercase font-bold block">Assigned Specialist:</span>
                        <h4 className="text-xs font-bold text-gray-900">{contractorUser.full_name}</h4>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-gray-400 font-mono uppercase block">Budget locked:</span>
                      <span className="text-sm font-bold text-secondary-orange">${job.budget}</span>
                    </div>
                  </div>
                )}

                {/* SHOW SUBMITTED FILES / NOTES */}
                {job.work_submission_notes && (
                  <div className="mb-6 bg-blue-50/20 border border-blue-105 rounded-xl p-5 text-xs text-left">
                    <h4 className="font-bold text-primary-blue uppercase font-mono tracking-wider mb-2 text-[10px]">Submitted Deliverables Portfolio:</h4>
                    <p className="text-gray-700 leading-relaxed font-sans font-medium whitespace-pre-wrap">
                      "{job.work_submission_notes}"
                    </p>
                    {job.work_submission_files && job.work_submission_files.length > 0 && (
                      <div className="mt-3 flex items-center space-x-1.5 text-primary-blue font-bold">
                        <span>📂 File attached / Link: </span>
                        <a href={`#${job.work_submission_files[0]}`} className="hover:underline text-blue-900 font-mono bg-white border border-blue-100 px-2 py-0.5 rounded text-[11px] truncate max-w-xs block select-all">
                          {job.work_submission_files[0]}
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* WORKFLOW DISK ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {currentUser?.user_id === job.freelancer_id && (
                    <button
                      onClick={handleDeliverWorkClick}
                      className="flex-1 py-3 bg-primary-blue hover:bg-blue-950 text-white font-bold text-xs rounded-lg transition text-center shadow-sm"
                    >
                      {job.work_submission_notes ? 'Modify Submitted Deliverables' : 'Submit Deliverables Log'}
                    </button>
                  )}

                  {isEmployer && (
                    <button
                      onClick={handleReviewDeliverableClick}
                      className="flex-1 py-3 bg-secondary-orange hover:bg-orange-600 text-white font-bold text-xs rounded-lg transition text-center shadow-sm"
                    >
                      {job.work_submission_notes ? 'Inspect & Approve Work' : 'Awaiting Work Uploads'}
                    </button>
                  )}

                  {/* Raise claim disputes */}
                  <button
                    onClick={() => setShowDisputeModal(true)}
                    className="py-3 px-4 border border-red-200 hover:bg-red-50 text-red-650 font-semibold text-xs rounded-lg transition"
                  >
                    File Claim Dispute
                  </button>
                </div>
              </div>
            ) : (
              /* COMPLETED WORK DONE FEEDBACK */
              <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm text-center py-10 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto animate-bounce" />
                <h3 className="text-base font-bold text-gray-950 heading-font">Escrow releases settled completely!</h3>
                <p className="text-xs text-gray-505 max-w-sm mx-auto leading-relaxed body-font">
                  This work transaction is fulfilled. Both freelancer rating points and total spent values have recalculated. Thanks for using FreelanceFactory!
                </p>
              </div>
            )}

          </div>

          {/* COLUMN 3: EMPLOYER METADATA CARD */}
          <div className="space-y-6">
            
            {/* EMPLOYER OVERVIEW */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm text-left">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 font-mono">Job Sponsor Desk</h3>

              {employer ? (
                <div className="space-y-4">
                  <div 
                    onClick={() => onNavigate('client_profile', { userId: employer.user_id })}
                    className="flex items-center space-x-3 cursor-pointer group"
                  >
                    <img
                      src={employer.profile_photo_url}
                      alt="Employer"
                      className="w-12 h-12 rounded-xl object-cover border border-gray-150 group-hover:opacity-90"
                    />
                    <div>
                      <h4 className="font-bold text-gray-950 heading-font text-sm group-hover:underline">{employerDetail?.company_name || employer.full_name}</h4>
                      <div className="flex items-center space-x-1 mt-0.5 text-xs text-gray-500 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-secondary-orange" />
                        <span>{employerDetail?.location || employer.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-[1px] bg-gray-100" />

                  {/* Employer numbers */}
                  <div className="space-y-2.5 text-xs text-gray-600 font-medium">
                    <p className="flex justify-between">
                      <span className="text-gray-400">HQ Location:</span>
                      <span>{employerDetail?.location || 'Lalitpur, Nepal'}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">Segment Industry:</span>
                      <span>{employerDetail?.industry || 'Digital Solutions'}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">Total Spent:</span>
                      <span className="font-extrabold text-primary-blue">${employerDetail?.total_spent || '0'}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400">Client details unavailable currently.</p>
              )}
            </div>

            {/* Chat Shortcut Banner */}
            {currentUser && currentUser.user_id !== job.client_id && (
              <div 
                onClick={() => onNavigate('chat', { otherUserId: job.client_id })}
                className="bg-blue-50 hover:bg-blue-100/50 border border-blue-150 p-5 rounded-2xl text-left cursor-pointer transition flex items-center justify-between"
              >
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-primary-blue heading-font">Need clarification?</h4>
                  <p className="text-[11px] text-blue-800 leading-relaxed body-font">Ask client directly inside chats.</p>
                </div>
                <MessageSquare className="w-5 h-5 text-primary-blue shrink-0 ml-3" />
              </div>
            )}

          </div>

        </div>

      </div>

      {/* DISPUTE SYSTEM MODAL POPUP */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 text-left space-y-4 animate-scaleUp">
            <h3 className="text-lg font-bold text-gray-900 heading-font flex items-center space-x-2">
              <AlertOctagon className="w-5 h-5 text-red-550" />
              <span>Raise Litigation Claim Dispute</span>
            </h3>
            
            <p className="text-xs text-gray-400 leading-relaxed body-font">
              Warning: Filing a claim freezes current held escrow funds immediately. Both parties can submit logs to administrative arbitrations.
            </p>

            <form onSubmit={handleFileDispute} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Dispute Reason Details *</label>
                <textarea
                  required
                  rows={4}
                  value={disputeReason}
                  onChange={e => setDisputeReason(e.target.value)}
                  placeholder="e.g. Freelancer failed to submit files despite multiple reminders..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex space-x-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowDisputeModal(false)}
                  className="px-4 py-2 bg-gray-100 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-650 hover:bg-red-700 rounded-lg text-xs font-bold text-white shadow-sm"
                >
                  Confirm Claim Dispute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
