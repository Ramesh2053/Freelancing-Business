/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Calendar, CheckCircle, ArrowLeft, Send, UploadCloud, Link2 } from 'lucide-react';

interface WorkSubmissionViewProps {
  onNavigate: (page: string, params?: any) => void;
  jobId: string;
}

export const WorkSubmissionView: React.FC<WorkSubmissionViewProps> = ({ onNavigate, jobId }) => {
  const { jobs, submitWork, currentUser } = useApp();

  const job = jobs.find(j => j.job_id === jobId);

  if (!currentUser) {
    onNavigate('auth');
    return null;
  }

  if (!job) {
    return (
      <div className="py-20 text-center space-y-4 font-semibold">
        <h3 className="text-lg">Job listing details not found</h3>
        <button onClick={() => onNavigate('dashboard')} className="px-5 py-2 bg-primary-blue text-white rounded-lg">Return to dashboard</button>
      </div>
    );
  }

  const [notes, setNotes] = useState(job.work_submission_notes || '');
  const [fileUrl, setFileUrl] = useState(
    job.work_submission_files && job.work_submission_files.length > 0 
      ? job.work_submission_files[0] 
      : ''
  );
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes) return;

    try {
      submitWork(jobId, notes, fileUrl ? [fileUrl] : []);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onNavigate('job_details', { jobId: jobId });
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Work submission failed.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50/30 py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-2xl mx-auto bg-white p-8 border border-gray-150 rounded-2xl shadow-sm text-left">
        
        {/* NAV HEAD HEADER */}
        <div className="mb-6">
          <button
            onClick={() => onNavigate('job_details', { jobId: jobId })}
            className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-150 text-gray-600 rounded text-xs font-bold transition flex items-center space-x-1 w-max"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Job Workspace</span>
          </button>
        </div>

        {success ? (
          <div className="text-center py-12 space-y-4 animate-scaleUp">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />
            <h3 className="text-xl font-bold text-gray-900 heading-font">Work Deliverables Submitted!</h3>
            <p className="text-xs text-gray-550 max-w-sm mx-auto body-font">
              Perfect! Your employer has been notified in-app and can now inspect the deliverables to release the locked Escrow funds of <span className="font-exrabold text-[#10B981]">${job.budget}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="text-center mb-8 border-b border-gray-50 pb-5">
              <span className="inline-flex h-7 bg-blue-50 text-primary-blue text-[11px] font-bold px-3 py-1 items-center rounded-xl space-x-1 justify-center mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deliverable Upload board</span>
              </span>
              <h2 className="text-2xl font-black text-gray-900 heading-font mt-1">Submit Project Deliverables</h2>
              <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mt-0.5">Fulfill contract terms securely</p>
            </div>

            {/* Position label */}
            <div className="bg-gray-50 p-4 border border-gray-100 rounded-xl leading-normal text-xs text-left text-gray-700">
              <span className="text-[10px] uppercase font-mono text-gray-405 font-bold block">Active Contract Job:</span>
              <span className="font-extrabold text-gray-800">{job.title}</span>
              <span className="text-gray-400 block mt-1.5 font-semibold">Locked Escrow Hold: ${job.budget}</span>
            </div>

            {/* Description Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Deliverables Notes & Description *</label>
              <textarea
                required
                rows={5}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="State your findings, design brief details, or code logs. Guide the client on how to review and run your files..."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition resize-none text-gray-800"
              />
            </div>

            {/* Simulated file url link */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Attachment Link / ZIP File repository</label>
              <div className="relative">
                <Link2 className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-300" />
                <input
                  type="text"
                  value={fileUrl}
                  onChange={e => setFileUrl(e.target.value)}
                  placeholder="github.com/my-workspace/repository.git or figma.com/file/canvas_key"
                  className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition text-gray-800"
                />
              </div>
            </div>

            {/* FILE UPLOAD DRAG DROP SIMULATED BLOCK */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-250 p-6 rounded-xl text-center space-y-1 hover:border-primary-blue transition cursor-pointer select-none" onClick={() => setFileUrl('deliverables_package_revised.zip')}>
              <UploadCloud className="w-8 h-8 text-gray-400 mx-auto" />
              <h4 className="text-xs font-bold text-gray-800">Simulate Manual attachment upload</h4>
              <p className="text-[10px] text-gray-400">Click anywhere inside this block to automatically append file placeholder <span className="font-mono text-gray-650 font-bold">"deliverables_package_revised.zip"</span>!</p>
            </div>

            {/* SEND CTA */}
            <button
              type="submit"
              className="w-full py-4 bg-primary-blue hover:bg-blue-950 font-bold text-white text-xs rounded-lg transition shadow-md flex items-center justify-center space-x-1.5"
            >
              <Send className="w-4 h-4 text-white" />
              <span>Publish Deliverables and Notify Client</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
