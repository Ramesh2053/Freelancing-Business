/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, ShieldCheck, CheckCircle2, ChevronRight, Sparkles, Receipt } from 'lucide-react';

interface PaymentViewProps {
  onNavigate: (page: string, params?: any) => void;
  applicationId: string;
}

export const PaymentView: React.FC<PaymentViewProps> = ({ onNavigate, applicationId }) => {
  const { applications, jobs, users, initiatePayment, updateApplicationStatus } = useApp();

  const application = applications.find(a => a.application_id === applicationId);
  const job = application ? jobs.find(j => j.job_id === application.job_id) : null;
  const freelancer = application ? users.find(u => u.user_id === application.freelancer_id) : null;

  if (!application || !job || !freelancer) {
    return (
      <div className="py-20 text-center space-y-4">
        <h3 className="text-xl font-bold text-gray-500">Contract application context not found</h3>
        <button onClick={() => onNavigate('dashboard')} className="px-5 py-2 px-4 bg-primary-blue text-white rounded-lg">Return to dashboard</button>
      </div>
    );
  }

  const [paymentPartner, setPaymentPartner] = useState<'khalti' | 'esewa' | 'bank'>('khalti');
  const [success, setSuccess] = useState(false);

  const handleFundSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Formally accept application
      updateApplicationStatus(applicationId, 'accepted');

      // Coordinate payment partner parameter map
      const method = paymentPartner === 'esewa' ? 'eSewa' : 'Khalti';

      // Fund the contract escrow deposit
      initiatePayment(job.job_id, freelancer.user_id, job.budget, method);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        // Navigate to active job details to showcase progress tracks
        onNavigate('job_details', { jobId: job.job_id });
      }, 2000);
    } catch (err: any) {
      alert(err.message || 'Payment execution failed.');
    }
  };

  return (
    <div className="bg-gray-50/30 min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-2xl mx-auto bg-white p-8 border border-gray-150 rounded-2xl shadow-sm">
        
        {success ? (
          <div className="text-center py-12 space-y-4 animate-scaleUp">
            <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-gray-900 heading-font">Escrow Payment Locked Successfully!</h3>
            <p className="text-xs text-gray-550 max-w-sm mx-auto leading-relaxed body-font">
              Hooray! The budget of <span className="font-exrabold text-blue-900">${application.bid_amount}</span> has successfully locked inside the neutral FreelanceFactory Escrow bank ledger. Moving back...
            </p>
          </div>
        ) : (
          <form onSubmit={handleFundSubmit} className="space-y-6">
            
            <div className="text-center mb-8 border-b border-gray-50 pb-5">
              <span className="inline-flex h-7 bg-blue-50 text-primary-blue text-[11px] font-bold px-3 py-1 items-center rounded-xl space-x-1 justify-center mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Financial Escrow Securing</span>
              </span>
              <h2 className="text-2xl font-black text-gray-950 heading-font mt-1">Fund Project Escrow Hold</h2>
              <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mt-0.5">Secure remote freelance production cycles</p>
            </div>

            {/* CONTRACT SUMMARY INFO */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-150 text-xs text-left space-y-3.5 leading-normal">
              <h4 className="font-black text-[10px] uppercase font-mono tracking-wider text-gray-400">Contract Agreement Summary:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 block font-semibold">Position details:</span>
                  <span className="font-bold text-gray-800 line-clamp-1">{job.title}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold">Selected Contractor:</span>
                  <span className="font-bold text-gray-800">{freelancer.full_name}</span>
                </div>
              </div>

              <div className="h-[1px] bg-gray-200" />

              <div className="flex justify-between items-center bg-white p-3.5 rounded-lg border border-gray-100">
                <div>
                  <span className="text-gray-400 block text-[10px] font-bold uppercase font-mono">Agreed Escrow Lock Capital:</span>
                  <span className="text-[10px] text-gray-450 italic">Frictionless 5% platform fees included</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-[#10B981] heading-font">${application.bid_amount}</span>
                </div>
              </div>
            </div>

            {/* PAYMENT TABS CHOICE */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3.5 font-mono">Select Secure Payment Provider</label>
              <div className="grid grid-cols-3 gap-3">
                {/* Khalti */}
                <div 
                  onClick={() => setPaymentPartner('khalti')}
                  className={`p-4 border rounded-xl text-center cursor-pointer transition select-none flex flex-col justify-between items-center ${
                    paymentPartner === 'khalti' 
                      ? 'border-primary-blue bg-blue-50/20 shadow-sm' 
                      : 'border-gray-200 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="text-xl">💳</div>
                  <h4 className="text-xs font-bold text-gray-800 mt-2">Khalti Wallet</h4>
                  <span className="text-[9px] text-gray-450 mt-1 font-semibold">Instant verification</span>
                </div>

                {/* eSewa */}
                <div 
                  onClick={() => setPaymentPartner('esewa')}
                  className={`p-4 border rounded-xl text-center cursor-pointer transition select-none flex flex-col justify-between items-center ${
                    paymentPartner === 'esewa' 
                      ? 'border-primary-blue bg-blue-50/20 shadow-sm' 
                      : 'border-gray-200 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="text-xl">📲</div>
                  <h4 className="text-xs font-bold text-gray-800 mt-2">eSewa Pay</h4>
                  <span className="text-[9px] text-gray-450 mt-1 font-semibold">Nepal Standard</span>
                </div>

                {/* Direct bank */}
                <div 
                  onClick={() => setPaymentPartner('bank')}
                  className={`p-4 border rounded-xl text-center cursor-pointer transition select-none flex flex-col justify-between items-center ${
                    paymentPartner === 'bank' 
                      ? 'border-primary-blue bg-blue-50/20 shadow-sm' 
                      : 'border-gray-200 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="text-xl">🏦</div>
                  <h4 className="text-xs font-bold text-gray-800 mt-2">Direct Bank</h4>
                  <span className="text-[9px] text-gray-450 mt-1 font-semibold">Secure Swift Transfer</span>
                </div>
              </div>
            </div>

            {/* ADVISORY GUARANTEE BLOCK */}
            <div className="bg-green-50/35 border border-green-200 p-4 rounded-xl flex items-start space-x-3 text-xs leading-relaxed text-green-800">
              <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold uppercase font-mono tracking-wider text-[10px]">The Escrow Ledger Guarantee:</h4>
                <p className="mt-0.5 font-medium">
                  We secure these funds temporarily within a neutral ledger. These funds belong to both parties: you verify you have funded, and freelancers receive them instantly once deliverables meet objectives.
                </p>
              </div>
            </div>

            {/* FUND CTAS */}
            <button
              type="submit"
              className="w-full py-4 bg-primary-blue hover:bg-blue-950 text-white font-bold text-sm rounded-xl transition shadow flex items-center justify-center space-x-1.5"
            >
              <CreditCard className="w-4 h-4" />
              <span>Authorize & Fund Escrow Wallet</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
