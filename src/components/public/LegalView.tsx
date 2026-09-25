/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shield, Lock, Scale, Eye, HelpCircle } from 'lucide-react';

interface LegalViewProps {
  initialDocument: 'terms' | 'privacy';
}

export const LegalView: React.FC<LegalViewProps> = ({ initialDocument }) => {
  const [activeDoc, setActiveDoc] = useState<'terms' | 'privacy'>(initialDocument);

  useEffect(() => {
    setActiveDoc(initialDocument);
  }, [initialDocument]);

  return (
    <div className="bg-white text-gray-800">
      {/* HEADER */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-950 to-blue-950 text-white py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight heading-font">
            Legal Compliance Outline
          </h1>
          <p className="mt-2 text-lg text-blue-100 max-w-2xl mx-auto body-font">
            Learn more about our secure payment terms, refund protocols, and privacy policies.
          </p>
        </div>
      </section>

      {/* TABS */}
      <section className="py-12 bg-gray-50/50 border-b border-gray-100">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-gray-100 p-1 rounded-xl flex">
            <button
              onClick={() => setActiveDoc('terms')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center space-x-1.5 ${
                activeDoc === 'terms' ? 'bg-white text-primary-blue shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Terms of Service</span>
            </button>
            <button
              onClick={() => setActiveDoc('privacy')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center space-x-1.5 ${
                activeDoc === 'privacy' ? 'bg-white text-primary-blue shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Privacy Policy</span>
            </button>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8">
          
          {activeDoc === 'terms' ? (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-extrabold text-gray-950 heading-font">Terms of Service Agreement</h2>
              <p className="text-xs text-gray-400 font-mono">Last updated: June 5, 2026</p>
              
              <div className="h-[1px] bg-gray-100" />

              <div className="space-y-4 text-sm text-gray-600 leading-relaxed body-font">
                <h3 className="text-lg font-bold text-gray-900 heading-font">1. Acceptance of Terms</h3>
                <p>
                  Welcome to FreelanceFactory (the "Platform"). By accessing or utilizing any aspects of our electronic freelance marketplace system, you signify that you have read, understand, and agree to be bound by these exhaustive Terms of Service (TOS), including our Payment protocols and Dispute Resolution guidelines.
                </p>

                <h3 className="text-lg font-bold text-gray-900 heading-font">2. Marketplace Service Roles</h3>
                <p>
                  FreelanceFactory connects Clients (entities seeking design, administrative, or software development work deliverables) with Freelancers (independent actors holding specific skill badges). The Platform acts solely as a secure facilitator. We hold escrow capital, log conversations, and arbitrate claims but do not maintain employer-employee relations with any user.
                </p>

                <h3 className="text-lg font-bold text-gray-900 heading-font">3. Payment & Escrow Holdings</h3>
                <p>
                  Clients agree to fully fund and secure the project budget up-front. These funds are held safely within the FreelanceFactory Escrow bank ledger via partnered methods (Khalti, eSewa). Freelancers must submit deliverables directly via the Work Submission board. Payment release is released to the freelancer upon the Client's official click of the "Approve & Release" control.
                </p>

                <h3 className="text-lg font-bold text-gray-900 heading-font">4. Dispute Resolution Policy</h3>
                <p>
                  If a deliverable fails to comply with job descriptions, or if a client refuses payment without actionable instructions, either party can officially initiate a "Dispute" within 7 days of work submission. Filing a dispute instantly freezes the held escrow funds. Neutral Platform admins review communication lists, files, and agreements to release or refund capital fairly.
                </p>

                <h3 className="text-lg font-bold text-gray-900 heading-font">5. Code of Professional Conduct</h3>
                <p>
                  All members must operate with honesty. Threatening behavior, spamming listings, misrepresenting professional designations, or copying portfolio items from other creators is strictly prohibited and results in immediate account deactivation.
                </p>

                <h3 className="text-lg font-bold text-gray-900 heading-font">6. Disclaimers of Liability</h3>
                <p>
                  The Platform is provided "as is". While we synchronize systems in real-time and secure escrow balances, FreelanceFactory is not liable for indirect technical damages, delivery delays, or loss of profits arising out of remote contract agreements.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-extrabold text-gray-950 heading-font">Privacy Policy & Secure Practices</h2>
              <p className="text-xs text-gray-400 font-mono">Last updated: June 5, 2026</p>

              <div className="h-[1px] bg-gray-100" />

              <div className="space-y-4 text-sm text-gray-600 leading-relaxed body-font">
                <h3 className="text-lg font-bold text-gray-900 heading-font">1. Data We Collect</h3>
                <p>
                  To secure user profiles and verify emails, we collect Full Name, Email, Phone Number, Password, and Location Timezones during SignUp. For Freelancers, we store profile photos, skill selections, portfolio URLs, and certification documents.
                </p>

                <h3 className="text-lg font-bold text-gray-900 heading-font">2. Data Security & GDPR Readiness</h3>
                <p>
                  We compile with GDPR disclosures. We isolate sensitive private credentials and never share emails or contact parameters with unauthenticated external scraper clients. We implement secure real-time encryption during chat deliveries.
                </p>

                <h3 className="text-lg font-bold text-gray-900 heading-font">3. How We Use Information</h3>
                <p>
                  Your information is used strictly to authenticate logins, display search grids to hiring clients, match jobs, power chat list indicators, process escrow notifications, and resolve disputes.
                </p>

                <h3 className="text-lg font-bold text-gray-900 heading-font">4. Cookie Tracking</h3>
                <p>
                  We utilize lightweight client-side tokens (like localStorage or temporary authentication cookies) to maintain "Remember Me" logged-in sessions and allow real-time multi-tab state synchronizations. We do not place malicious advertising trackers.
                </p>

                <h3 className="text-lg font-bold text-gray-900 heading-font">5. User Privacy Rights</h3>
                <p>
                  Every individual owns their data. You can edit bio details, hide your hourly earnings, or deactivate your account at any time on the Settings page.
                </p>

                <h3 className="text-lg font-bold text-gray-900 heading-font">6. Contact for Concerns</h3>
                <p>
                  For any personal data privacy queries or erasure inquiries, please write directly to our Compliance Architect at <span className="text-primary-blue font-semibold">compliance@freelancefactory.com</span>.
                </p>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};
