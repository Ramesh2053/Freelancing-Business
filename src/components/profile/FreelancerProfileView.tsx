/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Star, MapPin, Globe, Award, MessageSquare, Clock, 
  Calendar, ArrowLeft, Mail, Compass, ExternalLink, ChevronRight
} from 'lucide-react';

interface FreelancerProfileViewProps {
  onNavigate: (page: string, params?: any) => void;
  userId: string;
}

// Custom Portfolio Generator based on user
const MOCK_PORTFOLIOS: { [key: string]: { title: string, desc: string, link: string, image: string }[] } = {
  'user_f1': [
    { title: 'Apex Rider UI Kit', desc: 'Full custom ride-sharing interface designed from scratch in Figma.', link: 'behance.net/sample1', image: 'https://images.unsplash.com/photo-1541462608141-ad4979e408c9?auto=format&fit=crop&w=400&q=70' },
    { title: 'Organic Cafe Branding', desc: 'Stunning earthy logos and complete menus for local roasters.', link: 'behance.net/sample2', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=70' },
    { title: 'E-commerce Redesigns', desc: 'Modern user flows and fast checkout checkout layout designs.', link: 'behance.net/sample3', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=70' },
    { title: 'Local Hotel Web Suite', desc: 'Custom branding and high-fidelity wireframes.', link: 'behance.net/sample4', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=70' }
  ],
  'user_f2': [
    { title: 'Analytics Panel Core', desc: 'React, TypeScript dashboard with complex data visualization controls.', link: 'github.com/sample5', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=70' },
    { title: 'Himalayan Logistics Gateway', desc: 'Secure Express API handling bulk order distributions.', link: 'github.com/sample6', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=70' },
    { title: 'Task Sync Engine', desc: 'A real-time reactive task manager synced with WebSockets.', link: 'github.com/sample7', image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=70' },
    { title: 'Custom CRM Portal', desc: 'MERN stack multi-auth pipeline for local retailers.', link: 'github.com/sample8', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=70' }
  ]
};

const GENERIC_PORTFOLIOS = [
  { title: 'Client Deliverable Pack', desc: 'Complete set of vetted visual vectors and layouts.', link: 'factory.com/sample', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=70' },
  { title: 'Tech Prototype Wireframes', desc: 'A multi-screen layout mapped for user testing audits.', link: 'factory.com/sample2', image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=70' },
  { title: 'Marketing Content Outline', desc: 'Highly optimized SEO blogs driving high conversion rates.', link: 'factory.com/sample3', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=70' },
  { title: 'VA Operational Spreadsheets', desc: 'Schedules and financial data logs structured beautifully.', link: 'factory.com/sample4', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=70' }
];

export const FreelancerProfileView: React.FC<FreelancerProfileViewProps> = ({ onNavigate, userId }) => {
  const { users, freelanceDetails, reviews, currentUser } = useApp();

  const user = users.find(u => u.user_id === userId);
  const detail = freelanceDetails.find(f => f.freelancer_id === userId);

  if (!user || !detail) {
    return (
      <div className="py-16 text-center space-y-4">
        <h3 className="text-xl font-bold">Profile not found</h3>
        <button onClick={() => onNavigate('home')} className="px-4 py-2 bg-primary-blue text-white rounded-lg">Return Home</button>
      </div>
    );
  }

  const userReviews = reviews.filter(r => r.reviewee_id === userId);
  const portfolios = MOCK_PORTFOLIOS[userId] || GENERIC_PORTFOLIOS;

  const handleMessageClick = () => {
    if (!currentUser) {
      onNavigate('auth', { initialTab: 'login' });
      return;
    }
    // Route to chat directly with this freelancer param
    onNavigate('chat', { otherUserId: userId });
  };

  const handleHireClick = () => {
    if (!currentUser) {
      onNavigate('auth', { initialTab: 'login' });
      return;
    }
    if (currentUser.role !== 'client') {
      alert('Only Clients are permitted to initiate job hires.');
      return;
    }
    // Route to post job with this freelancer pre-invited
    onNavigate('post_job', { inviteFreelancerId: userId });
  };

  return (
    <div className="bg-gray-50/30 min-h-screen pb-16 text-left">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 h-44 w-full relative">
        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={() => onNavigate('browse_freelancers')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-lg transition backdrop-blur-md flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Find Talent</span>
          </button>
        </div>
      </div>

      {/* CORE PROFILE WRAP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMN 1: PHOTO & SIDE SUMMARY STATS */}
          <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6">
            
            <div className="text-center">
              <img 
                src={user.profile_photo_url} 
                alt={user.full_name} 
                className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-white shadow-md"
                referrerPolicy="no-referrer"
              />
              <h1 className="text-xl font-bold text-gray-950 heading-font mt-4">{user.full_name}</h1>
              <p className="text-xs text-secondary-orange font-bold uppercase tracking-wider font-mono mt-1">{detail.headline}</p>

              <div className="flex items-center justify-center space-x-1.5 mt-2.5 text-gray-500 text-xs">
                <MapPin className="w-3.5 h-3.5" />
                <span>{user.location}</span>
              </div>
            </div>

            <div className="h-[1px] bg-gray-100" />

            {/* HOURLY RATE */}
            <div className="text-center p-4 bg-blue-50/30 border border-blue-100 rounded-xl">
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wide">Starting Rate Quote</div>
              <div className="text-3xl font-black text-primary-blue mt-1 heading-font">
                ${detail.hourly_rate}
                <span className="text-xs text-gray-405 font-medium uppercase font-sans"> / {detail.rate_type}</span>
              </div>
            </div>

            {/* DETAILS BLOCK */}
            <div className="space-y-4 text-xs font-semibold text-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center space-x-1.5 font-mono uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Speed:</span>
                </span>
                <span>{detail.response_time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center space-x-1.5 font-mono uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Joined:</span>
                </span>
                <span>{detail.member_since}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center space-x-1.5 font-mono uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Languages:</span>
                </span>
                <span>{detail.languages.join(', ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center space-x-1.5 font-mono uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  <span>status:</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                  detail.availability_status === 'Available' ? 'bg-green-50 text-green-700 border border-green-200' :
                  detail.availability_status === 'Busy' ? 'bg-yellow-50 text-yellow-750 border border-yellow-200' :
                  'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {detail.availability_status}
                </span>
              </div>
            </div>

            {/* ACTION INTERACTS */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleMessageClick}
                className="w-full py-3 bg-primary-blue hover:bg-blue-950 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Message</span>
              </button>
              <button
                onClick={handleHireClick}
                className="w-full py-3 bg-secondary-orange hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1 shadow-sm"
              >
                <span>Hire Now</span>
              </button>
            </div>

          </div>

          {/* COLUMN 2 & 3: BIO, SKILLS, PORTFOLIO & REVIEWS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* ABOUT & SKILL BADGES */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-950 heading-font mb-3">About {user.full_name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed body-font">
                  {user.bio || 'This professional freelancer has not published a biological summary statement yet. Browse matching portfolio items and ratings metrics bellow.'}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 font-mono">Expert Skill Badges</h4>
                <div className="flex flex-wrap gap-2">
                  {detail.skills.map(skill => (
                    <span 
                      key={skill} 
                      className="bg-blue-50/50 border border-blue-100 text-primary-blue text-xs font-bold px-3 py-1.5 rounded-lg capitalize shadow-sm hover:scale-103 transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {detail.certifications && detail.certifications.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 font-mono">Certifications & Awards</h4>
                  <div className="space-y-2">
                    {detail.certifications.map(cert => (
                      <div key={cert} className="flex items-center space-x-2 text-xs text-gray-700 font-semibold">
                        <Award className="w-4 h-4 text-secondary-orange" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PORTFOLIO SECTION */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-950 heading-font mb-5">Featured Portfolio ({portfolios.length})</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {portfolios.map((port, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm group hover:shadow-md transition">
                    <img 
                      src={port.image} 
                      alt={port.title} 
                      className="w-full h-36 object-cover group-hover:scale-102 transition duration-200"
                    />
                    <div className="p-4 text-left">
                      <h4 className="font-bold text-gray-900 heading-font text-sm">{port.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{port.desc}</p>
                      <a 
                        href={`#${port.link}`} 
                        onClick={e => e.preventDefault()}
                        className="mt-3 text-[11px] font-bold text-primary-blue flex items-center space-x-1.5 hover:underline"
                      >
                        <span>Inspect showcase</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TESTIMONIALS & REVIEWS FEED */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm text-left">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-950 heading-font">Client Feedback Reviews</h3>
                  <p className="text-xs text-gray-400">Read verified experiences from former contract partnerships.</p>
                </div>
                <div className="flex items-center text-[#FBBF24]">
                  <Star className="w-5 h-5 fill-current mr-1" />
                  <span className="text-base font-black text-gray-800">{detail.average_rating}</span>
                  <span className="text-xs text-gray-400 ml-1">({userReviews.length})</span>
                </div>
              </div>

              {userReviews.length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center">No reviews submitted yet for this professional account.</p>
              ) : (
                <div className="space-y-5">
                  {userReviews.map((rev) => (
                    <div key={rev.review_id} className="pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-gray-800 uppercase font-mono">Client Review Account</h4>
                          <div className="flex items-center text-xs text-[#FBBF24] mt-1">
                            {[...Array(5)].map((_, idx) => (
                              <Star 
                                key={idx} 
                                className={`w-3.5 h-3.5 ${idx < rev.rating ? 'fill-current text-[#FBBF24]' : 'text-gray-200'}`} 
                              />
                            ))}
                            <span className="text-[10px] text-gray-400 font-bold ml-1.5">{rev.created_at.slice(0, 10)}</span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2.5 text-xs text-gray-500 leading-relaxed body-font italic">
                        "{rev.comment}"
                      </p>
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
