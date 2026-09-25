/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="bg-white text-gray-800">
      {/* HEADER */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-950 to-blue-950 text-white py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight heading-font">
            Contact Our Support Team
          </h1>
          <p className="mt-2 text-lg text-blue-100 max-w-2xl mx-auto body-font">
            Have queries regarding escrow holds, verification, or disputes? Reach out to us.
          </p>
        </div>
      </section>

      {/* CORE INFO */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* COLUMN 1 & 2: CONTACT FORM */}
            <div className="lg:col-span-2 bg-white border border-gray-150 rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-950 heading-font mb-6 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-primary-blue" />
                <span>Send Us a Direct Message</span>
              </h2>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 p-8 rounded-2xl text-center space-y-4 animate-scaleUp">
                  <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto" />
                  <h3 className="text-xl font-bold text-green-900 heading-font">Message Sent Successfully!</h3>
                  <p className="text-sm text-green-600 max-w-md mx-auto body-font">
                    Thank you, <span className="font-bold">{formData.name}</span>! Our administrator desk has received your ticket and will respond back to <span className="font-bold">{formData.email}</span> within 24-48 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="mt-4 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-lg transition"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ram Bahadur"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ram@example.com"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">Subject</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Escrow Khalti Refund Query"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">Message Outline</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="State the comprehensive details of your system issue or suggestion here..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3.5 bg-primary-blue hover:bg-blue-950 text-white font-bold rounded-xl transition shadow flex items-center justify-center space-x-2"
                  >
                    <span>Submit Message</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* COLUMN 3: INFO CARD */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-150 text-left">
                <h3 className="text-lg font-bold text-gray-900 heading-font mb-6">Contact Channels</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-primary-blue flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">General Support</h4>
                      <p className="text-sm font-semibold text-gray-850 mt-0.5">support@freelancefactory.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 text-secondary-orange flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Office Helpline</h4>
                      <p className="text-sm font-semibold text-gray-850 mt-0.5">+977-1-4432100</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Sun to Fri, 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-green-100 text-[#10B981] flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Physical Office</h4>
                      <p className="text-sm font-semibold text-gray-850 mt-0.5">Grace Plaza, Ward 4</p>
                      <p className="text-xs text-gray-500">Lalitpur, Nepal</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-8 text-left space-y-4">
                <h4 className="text-sm font-bold heading-font uppercase text-secondary-orange">Admin Dispute Desk</h4>
                <p className="text-xs text-blue-200 leading-relaxed body-font">
                  Filing a dispute handles funds objectively. If you have been hired but the client refuses release despite complete deliverables, you can raise an official dispute directly on the active job detail screen.
                </p>
                <div className="text-[10px] font-mono text-blue-300">ADMINISTRATORS ACTIVE STATS: 100% MONITORING</div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
