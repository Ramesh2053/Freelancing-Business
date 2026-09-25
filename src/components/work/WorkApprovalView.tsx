/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowLeft, Star, Heart, CheckCircle2, AlertTriangle, MessageSquare, ClipboardCheck } from 'lucide-react';

interface WorkApprovalViewProps {
  onNavigate: (page: string, params?: any) => void;
  jobId: string;
}

export const WorkApprovalView: React.FC<WorkApprovalViewProps> = ({ onNavigate, jobId }) => {
  const { jobs, users, approveWork, submitReview, requestChanges } = useApp();

  const job = jobs.find(j => j.job_id === jobId);
  const contractor = job ? users.find(u => u.user_id === job.freelancer_id) : null;

  if (!job || !contractor) {
    return (
      <div className="py-20 text-center space-y-4">
        <h3 className="text-xl font-bold">Active project workspace not found</h3>
        <button onClick={() => onNavigate('dashboard')} className="px-5 py-2.5 bg-primary-blue text-white rounded-lg">Return to dashboard</button>
      </div>
    );
  }

  const [notes, setNotes] = useState(job.work_submission_notes || '');
  const [fileUrl, setFileUrl] = useState(
    job.work_submission_files && job.work_submission_files.length > 0 
      ? job.work_submission_files[0] 
      : ''
  );
  
  // Revision states
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionComments, setRevisionComments] = useState('');

  // Rating States
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('Excellent work! Completed our required deliverables exactly on time and responded within minutes to review suggestions.');
  const [success, setSuccess] = useState(false);

  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionComments) return;

    try {
      requestChanges(jobId, revisionComments);
      alert('Revision logs published and contractor notified. Job status remains in progress!');
      onNavigate('job_details', { jobId: jobId });
    } catch (err: any) {
      alert(err.message || 'Failed to submit revisions');
    }
  };

  const handleApproveReleaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment) return;

    try {
      // Release escrow balance first
      approveWork(jobId);

      // Register star counts and critiques
      submitReview(jobId, contractor.user_id, rating, comment);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onNavigate('dashboard');
      }, 1800);
    } catch (err: any) {
      alert(err.message || 'Review release failed.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50/30 py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-2xl mx-auto bg-white p-8 border border-gray-150 rounded-2xl shadow-sm">
        
        {/* NAV HEADER */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => onNavigate('job_details', { jobId: jobId })}
            className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-150 text-gray-600 rounded text-xs font-bold transition flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Workspace details</span>
          </button>
        </div>

        {success ? (
          <div className="text-center py-12 space-y-4 animate-scaleUp">
            <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto" />
            <h3 className="text-xl font-bold text-gray-900 heading-font">Contract Escrow Released!</h3>
            <p className="text-xs text-gray-550 max-w-sm mx-auto leading-relaxed body-font">
              Wow! The Escrow locked sum of <span className="font-extrabold text-[#10B981]">${job.budget}</span> has successfully credited onto <span className="font-exrabold text-blue-900">{contractor.full_name}</span>'s account wallet balance. Redirecting...
            </p>
          </div>
        ) : showRatingForm ? (
          /* RATING FORM MODE */
          <form onSubmit={handleApproveReleaseSubmit} className="space-y-6">
            <div className="text-center">
              <span className="inline-flex h-7 bg-green-50 text-[#10B981] text-[11px] font-bold px-3 py-1 items-center rounded-xl space-x-1 justify-center mb-2">
                <Heart className="w-3.5 h-3.5" />
                <span>Escrow release and stars rating</span>
              </span>
              <h2 className="text-2xl font-black text-gray-900 heading-font mt-1">Review & Rate {contractor.full_name}</h2>
              <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mt-0.5">Build transparent talent profiles</p>
            </div>

            {/* STAR ACCORDION LIST */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3.5 font-mono">Assign Rating Value</span>
              <div className="flex space-x-2 text-gray-200">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-115"
                  >
                    <Star className={`w-10 h-10 ${star <= rating ? 'text-[#FBBF24] fill-current' : 'text-gray-200'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* COMMENT */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Public Peer Review Comment *</label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your qualitative experience on communication, layout quality, and overall output velocity..."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition resize-none text-gray-800"
              />
            </div>

            {/* REASSURANCE BLOCK */}
            <div className="bg-yellow-50/50 border border-yellow-250 p-4 rounded-xl leading-normal text-xs text-yellow-850">
              ⚠️ Warning: Clicking "Approve & Settle Release" will instantly disperse the held Escrow hold capital of <span className="font-bold">${job.budget}</span> into the freelancer's profile. This transition is final and irreversible.
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-primary-blue hover:bg-blue-950 font-bold text-white text-xs rounded-lg transition shadow flex items-center justify-center space-x-1"
            >
              <ClipboardCheck className="w-4 h-4 text-white" />
              <span>Approve Deliverables & Settle Release</span>
            </button>
          </form>
        ) : (
          /* DELIVERABLES INSPECTION VIEW MODE */
          <div className="space-y-6">
            <div className="text-center">
              <span className="inline-flex h-7 bg-blue-50 text-primary-blue text-[11px] font-bold px-3 py-1 items-center rounded-xl space-x-1 justify-center mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deliverables Audit review</span>
              </span>
              <h2 className="text-2xl font-black text-gray-900 heading-font mt-1">Audit Contractor Outputs</h2>
              <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mt-0.5">Conduct project check-offs securely</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 font-medium text-xs leading-normal">
              <span className="text-[10px] text-gray-450 block font-bold font-mono uppercase mb-0.5">Deliverable Owner:</span>
              <span className="font-extrabold text-blue-900 text-sm">{contractor.full_name}</span>
              <div className="mt-2 text-gray-500">Escrow Capital Locked: <span className="font-bold text-gray-750">${job.budget}</span></div>
            </div>

            {notes ? (
              <div className="space-y-4">
                <div className="bg-blue-50/20 border border-blue-150 p-5 rounded-xl text-left">
                  <h4 className="font-bold text-primary-blue uppercase font-mono tracking-wider mb-2 text-[10px]">Contractor Submission notes:</h4>
                  <p className="text-xs text-gray-700 leading-relaxed font-sans font-medium whitespace-pre-wrap">
                    "{notes}"
                  </p>
                  {fileUrl && (
                    <div className="mt-4 flex items-center space-x-1.5 text-xs text-primary-blue font-bold">
                      <span>📂 Delivered file references:</span>
                      <a href={`#${fileUrl}`} className="text-blue-950 bg-white border border-blue-100 hover:underline font-mono px-2 py-0.5 rounded text-[11px] select-all truncate max-w-sm block">
                        {fileUrl}
                      </a>
                    </div>
                  )}
                </div>

                {/* SHOW FORM TO COMMENT ON REVISIONS */}
                {showRevisionForm ? (
                  <form onSubmit={handleRevisionSubmit} className="space-y-3.5 bg-gray-50 p-4 rounded-xl border border-gray-150 animate-slideDown">
                    <h4 className="font-bold text-xs text-gray-750">State Revision requirements</h4>
                    <textarea
                      required
                      rows={3}
                      value={revisionComments}
                      onChange={e => setRevisionComments(e.target.value)}
                      placeholder="Comment exactly what edits or design revisions are needed..."
                      className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs"
                    />
                    <div className="flex space-x-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowRevisionForm(false)}
                        className="px-3 py-1.5 bg-gray-200 text-gray-600 rounded text-xs font-semibold"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-primary-blue text-white rounded text-xs font-bold shadow"
                      >
                        Submit Revision Ticket
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowRatingForm(true)}
                      className="flex-1 py-4 bg-primary-blue hover:bg-blue-950 text-white font-black rounded-lg text-xs transition shadow flex items-center justify-center space-x-1"
                    >
                      <span>Approve & Settle Release Hold</span>
                    </button>
                    
                    <button
                      onClick={() => setShowRevisionForm(true)}
                      className="py-4 px-6 border border-gray-250 hover:bg-gray-50 text-gray-700 font-bold rounded-lg text-xs transition uppercase tracking-wide"
                    >
                      Request Revisions
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 border border-dashed border-gray-150 rounded-xl bg-gray-50 text-center text-gray-400 space-y-1">
                <AlertTriangle className="w-8 h-8 mx-auto" />
                <h4 className="text-sm font-semibold text-gray-700">Contractor has not submitted deliverables yet</h4>
                <p className="text-xs text-gray-405">Encourage them directly inside chats to publish logs securely here.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
