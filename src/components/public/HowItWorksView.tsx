/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building, UserCheck, ShieldCheck, Mail, Send, 
  PlusCircle, FileCheck, DollarSign, PenTool, CheckSquare 
} from 'lucide-react';

export const HowItWorksView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'client' | 'freelancer'>('client');

  return (
    <div className="bg-white text-gray-800">
      {/* HEADER */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-950 to-blue-950 text-white py-16 md:py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight heading-font">
            How It Works
          </h1>
          <p className="mt-3 text-lg text-blue-100 max-w-2xl mx-auto body-font">
            A secure step-by-step manual guaranteeing quality results and verified payments.
          </p>
        </div>
      </section>

      {/* TARGETED TABS */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 p-1.5 rounded-2xl flex max-w-md w-full">
              <button
                onClick={() => setActiveTab('client')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition flex items-center justify-center space-x-2 ${
                  activeTab === 'client' 
                    ? 'bg-white text-primary-blue shadow-sm' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>For Clients</span>
              </button>
              <button
                onClick={() => setActiveTab('freelancer')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition flex items-center justify-center space-x-2 ${
                  activeTab === 'freelancer' 
                    ? 'bg-white text-primary-blue shadow-sm' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>For Freelancers</span>
              </button>
            </div>
          </div>

          {activeTab === 'client' ? (
            <div className="space-y-16 animate-fadeIn">
              {/* Clients process */}
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs uppercase font-mono tracking-widest text-secondary-orange font-bold">Client Workflow</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 heading-font mt-1">Hire Globally, Safely</h2>
                <p className="text-sm text-gray-400 mt-2 body-font">Follow our transparent 4-stage pipeline to secure talent.</p>
              </div>

              {/* FLOW DIAGRAM */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                {/* Visual Connector Line */}
                <div className="hidden md:block absolute top-12 left-12 right-12 h-0.5 bg-dashed bg-gray-200 -z-10" />

                <div className="bg-white border border-gray-150 p-6 rounded-2xl text-center shadow-sm relative">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-primary-blue font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                    1
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 heading-font mb-2">Publish Requirements</h4>
                  <p className="text-xs text-gray-500 leading-relaxed body-font">
                    State job category, comprehensive details, required skill badges, budgets (fixed/hourly), and file attachments.
                  </p>
                </div>

                <div className="bg-white border border-gray-150 p-6 rounded-2xl text-center shadow-sm relative">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-primary-blue font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                    2
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 heading-font mb-2">Fund Secure Escrow</h4>
                  <p className="text-xs text-gray-500 leading-relaxed body-font">
                    Select the ideal cover-letter applicant and commit the budget securely via Khalti or eSewa to lock inside Escrow.
                  </p>
                </div>

                <div className="bg-white border border-gray-150 p-6 rounded-2xl text-center shadow-sm relative">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-primary-blue font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                    3
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 heading-font mb-2">Inspect Deliverables</h4>
                  <p className="text-xs text-gray-500 leading-relaxed body-font">
                    Freelancers upload code/links directly onto work submission boards. Review the log, download files, or request revisions.
                  </p>
                </div>

                <div className="bg-white border border-gray-150 p-6 rounded-2xl text-center shadow-sm relative">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-primary-blue font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                    4
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 heading-font mb-2">Release and Rate</h4>
                  <p className="text-xs text-gray-500 leading-relaxed body-font">
                    Approve deliverables to instantly release funds. Share ratings and qualitative stars to build peer trust metrics.
                  </p>
                </div>
              </div>

              {/* HIGHLIGHT DETAILS */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-150 grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-12 text-left">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 heading-font mb-4 flex items-center space-x-2">
                    <ShieldCheck className="w-6 h-6 text-[#10B981]" />
                    <span>The Escrow Guarantee</span>
                  </h3>
                  <p className="text-xs leading-relaxed text-gray-500 mb-4 body-font">
                    When you hire a designer or engineer on FreelanceFactory, capital is fully separated from your bank accounts upfront but remains safely under our neutral custody while work completes.
                  </p>
                  <p className="text-xs leading-relaxed text-gray-500 body-font text-left">
                    We only distribute payment once you officially inspect and push "Approve & Release". If difficulties occur, our neutral litigation admins review logs to resolve funds fairly.
                  </p>
                </div>
                <div className="border border-blue-100 bg-white p-6 rounded-xl space-y-4">
                  <h4 className="text-xs tracking-wider uppercase font-mono text-primary-blue font-bold">Key Safety Protocols:</h4>
                  <ul className="space-y-3 font-semibold text-xs text-gray-600">
                    <li className="flex items-center space-x-2">
                      <span className="text-[#10B981]">✔</span>
                      <span>100% Upfront Budget Security verification for workers</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-[#10B981]">✔</span>
                      <span>Interactive chats & file submission logs</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-[#10B981]">✔</span>
                      <span>Flexible change-requests & revisions pipeline</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-[#10B981]">✔</span>
                      <span>Neutral administrative dispute resolution panels</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-16 animate-fadeIn">
              {/* Freelancers process */}
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs uppercase font-mono tracking-widest text-[#10B981] font-bold">Freelancer Workflow</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 heading-font mt-1">Work Reliably, Get Funded</h2>
                <p className="text-sm text-gray-400 mt-2 body-font">Operate as an independent, knowing you are protected from payment defaults.</p>
              </div>

              {/* FLOW DIAGRAM */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                {/* Visual Connector Line */}
                <div className="hidden md:block absolute top-12 left-12 right-12 h-0.5 bg-dashed bg-gray-200 -z-10" />

                <div className="bg-white border border-gray-150 p-6 rounded-2xl text-center shadow-sm relative">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-secondary-orange font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                    1
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 heading-font mb-2">Define Profile details</h4>
                  <p className="text-xs text-gray-500 leading-relaxed body-font">
                    State specialized software tags, portfolios, certification lists, hourly ratings, languages, and timezones.
                  </p>
                </div>

                <div className="bg-white border border-gray-150 p-6 rounded-2xl text-center shadow-sm relative">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-secondary-orange font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                    2
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 heading-font mb-2">Apply & Interview</h4>
                  <p className="text-xs text-gray-500 leading-relaxed body-font">
                    Draft crisp, targeted cover letters to client placements. Finalize rates and terms securely via our chat logs.
                  </p>
                </div>

                <div className="bg-white border border-gray-150 p-6 rounded-2xl text-center shadow-sm relative">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-secondary-orange font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                    3
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 heading-font mb-2">Build with Safety</h4>
                  <p className="text-xs text-gray-500 leading-relaxed body-font">
                    Clients lock funds in Escrow prior to starting. Once notified, write code or build vectors with absolute peace of mind.
                  </p>
                </div>

                <div className="bg-white border border-gray-150 p-6 rounded-2xl text-center shadow-sm relative">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-secondary-orange font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                    4
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 heading-font mb-2">Collect released Funds</h4>
                  <p className="text-xs text-gray-500 leading-relaxed body-font">
                    Upload your deliverables. Upon validation, the capital transfers instantly into your balance, ready to draw.
                  </p>
                </div>
              </div>

              {/* SAFETY AND REVISIONS */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-150 grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-12 text-left">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 heading-font mb-4 flex items-center space-x-2">
                    <ShieldCheck className="w-6 h-6 text-secondary-orange" />
                    <span>Risk-Free Production</span>
                  </h3>
                  <p className="text-xs leading-relaxed text-gray-500 mb-4 body-font">
                    No more waiting weeks for client check clearance. Our real-time notification alerts you: "Client has secured payment. You can now start work!"
                  </p>
                  <p className="text-xs leading-relaxed text-gray-500 body-font text-left">
                    This guarantees that the capital is fully funded and cannot be pulled back on a whim. Work with peak focus, knowing your professional hours are secured.
                  </p>
                </div>
                <div className="border border-orange-100 bg-white p-6 rounded-xl space-y-4">
                  <h4 className="text-xs tracking-wider uppercase font-mono text-secondary-orange font-bold">What is expected of you:</h4>
                  <ul className="space-y-3 font-semibold text-xs text-gray-600">
                    <li className="flex items-center space-x-2">
                      <span className="text-secondary-orange">✔</span>
                      <span>Honest delivery timelines & accurate rates</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-secondary-orange">✔</span>
                      <span>Comprehensive code or design asset upload logs</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-secondary-orange">✔</span>
                      <span>Friendly, professional responses to change reviews</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-secondary-orange">✔</span>
                      <span>Adherence to terms contract specifications</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
