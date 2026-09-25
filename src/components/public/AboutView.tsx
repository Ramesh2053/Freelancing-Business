/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Compass, ShieldAlert, Award, Star, Heart } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (page: string, params?: any) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white text-gray-800">
      {/* HEADER */}
      <section className="bg-blue-900 text-white py-16 md:py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950 via-blue-900 to-indigo-950 opacity-90" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight heading-font">
            Our Story & Core Vision
          </h1>
          <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto body-font">
            Connecting Himalayan and global talent with secure project terms.
          </p>
        </div>
      </section>

      {/* MISSION, VISION & VALUES */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="flex items-center space-x-2 text-primary-blue bg-blue-50 px-3.5 py-1.5 rounded-full text-xs font-bold leading-none w-max mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Driven Ambition</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 heading-font mb-4">
                The FreelanceFactory Philosophy
              </h2>
              <p className="text-sm leading-relaxed text-gray-500 mb-4 body-font">
                Hiring freelancers is historically plagued with payment defaults, opaque reviews, or platform fees exceeding 20%. FreelanceFactory was designed by digital advocates to construct a reliable workspace where remote freelancers and clients collaborate under absolute secure terms.
              </p>
              <p className="text-sm leading-relaxed text-gray-500 body-font">
                By integrating a real-time responsive interface, escrow locks, and authenticated logging, we align individual productivity with capital safety.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="border border-blue-100 bg-blue-50/20 p-6 rounded-2xl">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary-blue mb-2 font-mono">Our Mission Statement</h3>
                <p className="text-gray-700 font-medium body-font text-base text-left leading-relaxed">
                  "Connecting talent with meaningful opportunities."
                </p>
              </div>

              <div className="border border-orange-100 bg-orange-50/10 p-6 rounded-2xl">
                <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-orange mb-2 font-mono">Our Vision Statement</h3>
                <p className="text-gray-700 font-medium body-font text-base text-left leading-relaxed">
                  "To build a world where every person can earn a living doing work they love, on their own terms."
                </p>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-gray-100 mb-16" />

          {/* WHY FREELANCEFACTORY */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-950 heading-font">Why FreelanceFactory?</h3>
            <p className="text-gray-400 text-xs mt-1 font-medium body-font uppercase">Our Unique Value Propositions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-100 rounded-xl bg-gray-50/30 text-left">
              <div className="w-10 h-10 bg-blue-50 text-primary-blue rounded-lg flex items-center justify-center mb-4 font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-gray-900 heading-font mb-2">Punctual Escrow Controls</h4>
              <p className="text-xs text-gray-500 leading-relaxed body-font">
                Clients secure the budget inside our escrow hold up-front. Freelancers begin tasks with immediate verification of credit, completely eliminating delayed payments.
              </p>
            </div>

            <div className="p-6 border border-gray-100 rounded-xl bg-gray-50/30 text-left">
              <div className="w-10 h-10 bg-orange-50 text-secondary-orange rounded-lg flex items-center justify-center mb-4 font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-gray-900 heading-font mb-2">Zero Verification Fluff</h4>
              <p className="text-xs text-gray-500 leading-relaxed body-font">
                All client listings are backed by genuine phone profiles, and freelancer portfolio details are verified under transparent rating tallies.
              </p>
            </div>

            <div className="p-6 border border-gray-100 rounded-xl bg-gray-50/30 text-left">
              <div className="w-10 h-10 bg-green-50 text-[#10B981] rounded-lg flex items-center justify-center mb-4 font-bold">
                <Star className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-gray-900 heading-font mb-2">Empathetic Faciliation</h4>
              <p className="text-xs text-gray-500 leading-relaxed body-font">
                Our 5% transaction fees go strictly towards facilitating real-time chats, protecting data integrity, and arbitrating claims transparently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-16 bg-gray-50/50 border-t border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 heading-font">Our Leadership Team</h2>
            <p className="text-sm text-gray-400 mt-2 font-medium body-font">The crew keeping FreelanceFactory secure and active.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden text-center p-6 hover:shadow transition">
              <img 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80" 
                alt="Rajesh" 
                className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-primary-blue/30"
              />
              <h4 className="text-base font-bold text-gray-900 heading-font mt-4">Rajesh Paudel</h4>
              <p className="text-xs text-secondary-orange font-semibold tracking-wide uppercase font-mono mt-1">Chief Executive Officer</p>
              <p className="text-xs text-gray-500 mt-3 body-font">
                A veteran backend systems developer coordinating corporate expansion and secure local banking integrations.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden text-center p-6 hover:shadow transition">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" 
                alt="Karina" 
                className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-primary-blue/30"
              />
              <h4 className="text-base font-bold text-gray-900 heading-font mt-4">Karina Sharma</h4>
              <p className="text-xs text-secondary-orange font-semibold tracking-wide uppercase font-mono mt-1">Creative Director</p>
              <p className="text-xs text-gray-500 mt-3 body-font">
                Overseeing branding layout, user interfaces, micro-animations, and the complete design-system harmony.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden text-center p-6 hover:shadow transition">
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" 
                alt="Ayush" 
                className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-primary-blue/30"
              />
              <h4 className="text-base font-bold text-gray-900 heading-font mt-4">Ayush Adhikari</h4>
              <p className="text-xs text-secondary-orange font-semibold tracking-wide uppercase font-mono mt-1">Head of Engineering</p>
              <p className="text-xs text-gray-500 mt-3 body-font">
                Directing real-time synchronization pipelines, relational schema triggers, and security log filters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BOTTOM */}
      <section className="py-20 text-center bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Heart className="w-12 h-12 text-secondary-orange mx-auto mb-4 animate-pulse" />
          <h3 className="text-2xl font-extrabold text-gray-950 heading-font">Have questions about our operations?</h3>
          <p className="text-gray-500 text-sm mt-2 body-font">Our responsive Nepalese support team operates 24/7 to resolve queries.</p>
          <button
            onClick={() => onNavigate('contact')}
            className="mt-6 px-7 py-3 bg-primary-blue hover:bg-blue-950 text-white font-bold text-sm rounded-xl transition shadow"
          >
            Contact Team Us
          </button>
        </div>
      </section>
    </div>
  );
};
