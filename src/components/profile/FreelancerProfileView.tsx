/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { insforge } from '../../lib/insforge';
import { User, FreelancerDetails } from '../../types';
import { 
  Star, MapPin, Globe, Award, MessageSquare, Clock, 
  Calendar, ArrowLeft, ArrowRight, Mail, Compass, ExternalLink, ChevronRight,
  Send, Briefcase, CheckCircle2, ShieldCheck, ThumbsUp, PlusCircle, X
} from 'lucide-react';

interface FreelancerProfileViewProps {
  onNavigate: (page: string, params?: any) => void;
  userId: string;
  openReview?: boolean;
  openMessage?: boolean;
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
  { title: 'Client Deliverable Pack', desc: 'Complete set of vetted visual vectors, layout schematics, and components.', link: 'factory.com/sample', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=70' },
  { title: 'Tech Prototype Wireframes', desc: 'A multi-screen layout mapped for user testing audits and responsive web.', link: 'factory.com/sample2', image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=70' },
  { title: 'Marketing Content Outline', desc: 'Highly optimized SEO blogs and brand statements driving high conversion.', link: 'factory.com/sample3', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=70' },
  { title: 'Operational Dashboards', desc: 'Schedules and financial data logs structured beautifully for scale.', link: 'factory.com/sample4', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=70' }
];

export const FreelancerProfileView: React.FC<FreelancerProfileViewProps> = ({ onNavigate, userId, openReview, openMessage }) => {
  const { users, freelanceDetails, reviews, currentUser, sendMessage, submitReview, postJob } = useApp();

  const [dbUser, setDbUser] = useState<User | null>(null);
  const [dbDetail, setDbDetail] = useState<FreelancerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Modals state
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSentSuccess, setMessageSentSuccess] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmittedSuccess, setReviewSubmittedSuccess] = useState(false);
  const [reviewErrorNotice, setReviewErrorNotice] = useState<string | null>(null);

  const [showHireModal, setShowHireModal] = useState(false);
  const [hireTitle, setHireTitle] = useState('');
  const [hireBudget, setHireBudget] = useState('150');
  const [hireDescription, setHireDescription] = useState('');
  const [hireSuccessNotice, setHireSuccessNotice] = useState<string | null>(null);
  const [hireErrorNotice, setHireErrorNotice] = useState<string | null>(null);

  // Auto-trigger requested modal from props (e.g. from Discover Talent / Review Crew shortcuts)
  useEffect(() => {
    if (openReview) setShowReviewModal(true);
    if (openMessage) setShowMessageModal(true);
  }, [openReview, openMessage]);

  // Lookup in current state
  const localUser = users.find(u => u.user_id === userId);
  const localDetail = freelanceDetails.find(f => f.freelancer_id === userId);

  // If missing from memory, query directly from InsForge database so newly signed up users like Alex Cooper always load!
  useEffect(() => {
    if (!localUser || !localDetail) {
      setIsLoading(true);
      Promise.all([
        insforge.database.from('users').select('*').eq('user_id', userId).maybeSingle(),
        insforge.database.from('freelancer_details').select('*').eq('freelancer_id', userId).maybeSingle()
      ]).then(([userRes, detailRes]) => {
        if (userRes.data) setDbUser(userRes.data as User);
        if (detailRes.data) setDbDetail(detailRes.data as FreelancerDetails);
      }).catch(console.warn).finally(() => {
        setIsLoading(false);
      });
    }
  }, [userId, localUser, localDetail]);

  const user = localUser || dbUser;
  const detail = localDetail || dbDetail;

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-gray-500 font-mono">Loading crew profile from database...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <h3 className="text-xl font-bold text-gray-900 heading-font">Crew Profile Not Found</h3>
        <p className="text-xs text-gray-500">
          We could not locate this talent profile in the active registry.
        </p>
        <button 
          onClick={() => onNavigate('browse_freelancers')} 
          className="px-5 py-2.5 bg-primary-blue text-white rounded-xl text-xs font-bold transition shadow"
        >
          Browse All Talent
        </button>
      </div>
    );
  }

  // Fallback defaults for newly created freelancers
  const effectiveDetail: FreelancerDetails = detail || {
    freelancer_id: user.user_id,
    headline: 'Creative Remote Talent & Specialist',
    skills: ['Web Design', 'Development', 'Remote Collaboration'],
    hourly_rate: 20,
    rate_type: 'hourly',
    portfolio_links: [],
    certifications: ['Verified Identity'],
    languages: ['English', 'Nepali'],
    availability_status: 'Available',
    average_rating: 5.0,
    total_reviews: 0,
    total_earned: 0,
    response_time: 'Responds in <2 hours',
    member_since: 'Just Joined'
  };

  const userReviews = reviews.filter(r => r.reviewee_id === userId);
  const portfolios = MOCK_PORTFOLIOS[userId] || GENERIC_PORTFOLIOS;

  const handleMessageClick = () => {
    setMessageError(null);
    setShowMessageModal(true);
  };

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    if (!currentUser) {
      onNavigate('auth', { initialTab: 'login', returnTo: 'freelancer_profile', returnUserId: userId, openMessage: true });
      return;
    }

    try {
      sendMessage(userId, messageText.trim());
      setMessageSentSuccess(true);
      setMessageText('');
      setMessageError(null);
    } catch (err: any) {
      setMessageError(err.message || 'Could not send message.');
    }
  };

  const handleHireClick = () => {
    setHireErrorNotice(null);
    setShowHireModal(true);
  };

  const handleCreateHireOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onNavigate('auth', { initialTab: 'login', returnTo: 'freelancer_profile', returnUserId: userId });
      return;
    }
    if (currentUser.role !== 'client') {
      setHireErrorNotice('Only client accounts can create direct hire contracts.');
      return;
    }

    try {
      const title = hireTitle.trim() || `Direct Contract with ${user.full_name}`;
      const budgetNum = parseFloat(hireBudget) || 100;
      
      const newJob = postJob({
        title,
        description: hireDescription.trim() || `Direct project offer initiated by ${currentUser.full_name} for ${user.full_name}.`,
        category: 'Software Development',
        budget: budgetNum,
        budget_type: 'fixed',
        job_type: 'one-time',
        deadline: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
        status: 'posted',
        visibility: 'invite-only',
        attachments: [],
        invited_freelancers: [userId],
        skills_required: effectiveDetail.skills.length > 0 ? effectiveDetail.skills : ['Remote Collaboration']
      });

      // Send chat confirmation
      sendMessage(userId, `🤝 CONTRACT INVITATION: I sent you a job contract "${title}" for $${budgetNum}. Check your dashboard or reply here to coordinate!`);

      setHireSuccessNotice(`Contract created successfully! Invitation sent to ${user.full_name}.`);
      setTimeout(() => {
        setShowHireModal(false);
        setHireSuccessNotice(null);
        setHireTitle('');
        setHireBudget('150');
        setHireDescription('');
        onNavigate('chat', { otherUserId: userId });
      }, 1500);
    } catch (err: any) {
      setHireErrorNotice(err.message || 'Failed to submit contract.');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onNavigate('auth', { initialTab: 'login', returnTo: 'freelancer_profile', returnUserId: userId, openReview: true });
      return;
    }
    if (!reviewComment.trim()) return;

    try {
      await submitReview('direct_review', userId, reviewRating, reviewComment.trim());
      setReviewSubmittedSuccess(true);
      setReviewComment('');
      setReviewErrorNotice(null);
      setTimeout(() => {
        setShowReviewModal(false);
        setReviewSubmittedSuccess(false);
      }, 1800);
    } catch (err: any) {
      setReviewErrorNotice(err.message || 'Could not post review.');
    }
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
            <span>Discover Talent</span>
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
                src={user.profile_photo_url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`} 
                alt={user.full_name} 
                className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-white shadow-md"
                referrerPolicy="no-referrer"
              />
              <h1 className="text-xl font-bold text-gray-950 heading-font mt-4">{user.full_name}</h1>
              <p className="text-xs text-secondary-orange font-bold uppercase tracking-wider font-mono mt-1">
                {effectiveDetail.headline || 'Verified Creative Professional'}
              </p>

              <div className="flex items-center justify-center space-x-1.5 mt-2.5 text-gray-500 text-xs">
                <MapPin className="w-3.5 h-3.5" />
                <span>{user.location || 'Kathmandu, Nepal (GMT+5:45)'}</span>
              </div>
            </div>

            <div className="h-[1px] bg-gray-100" />

            {/* HOURLY RATE */}
            <div className="text-center p-4 bg-blue-50/30 border border-blue-100 rounded-xl">
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wide">Starting Rate Quote</div>
              <div className="text-3xl font-black text-primary-blue mt-1 heading-font">
                ${effectiveDetail.hourly_rate}
                <span className="text-xs text-gray-450 font-medium uppercase font-sans"> / {effectiveDetail.rate_type}</span>
              </div>
            </div>

            {/* DETAILS BLOCK */}
            <div className="space-y-4 text-xs font-semibold text-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center space-x-1.5 font-mono uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Speed:</span>
                </span>
                <span>{effectiveDetail.response_time || 'Responds in <2 hours'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center space-x-1.5 font-mono uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Joined:</span>
                </span>
                <span>{effectiveDetail.member_since || 'Active Member'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center space-x-1.5 font-mono uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Languages:</span>
                </span>
                <span>{effectiveDetail.languages?.join(', ') || 'English, Nepali'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center space-x-1.5 font-mono uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  <span>Status:</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-green-50 text-green-700 border border-green-200">
                  {effectiveDetail.availability_status || 'Available'}
                </span>
              </div>
            </div>

            {/* ACTION INTERACTS */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleMessageClick}
                className="w-full py-3 bg-primary-blue hover:bg-blue-950 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Message</span>
              </button>
              
              <button
                onClick={handleHireClick}
                className="w-full py-3 bg-secondary-orange hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <Briefcase className="w-4 h-4" />
                <span>Hire Now</span>
              </button>

              <button
                onClick={() => setShowReviewModal(true)}
                className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5"
              >
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Review Crew</span>
              </button>
            </div>

          </div>

          {/* COLUMN 2 & 3: BIO, SKILLS, PORTFOLIO & REVIEWS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* ABOUT & SKILL BADGES */}
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-950 heading-font mb-3">About {user.full_name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed body-font">
                  {user.bio || 'Verified digital contractor specializing in high-fidelity interface design, full-stack applications, and scalable deliverable execution. Available for fixed escrow contracts and hourly milestones.'}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 font-mono">Expert Skill Badges</h4>
                <div className="flex flex-wrap gap-2">
                  {(effectiveDetail.skills.length > 0 ? effectiveDetail.skills : ['Frontend Engineering', 'UI/UX Design', 'API Integration', 'Responsive Layouts']).map(skill => (
                    <span 
                      key={skill} 
                      className="bg-blue-50/50 border border-blue-100 text-primary-blue text-xs font-bold px-3 py-1.5 rounded-lg capitalize shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {effectiveDetail.certifications && effectiveDetail.certifications.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 font-mono">Certifications & Awards</h4>
                  <div className="space-y-2">
                    {effectiveDetail.certifications.map(cert => (
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-gray-950 heading-font">Client Feedback Reviews</h3>
                  <p className="text-xs text-gray-400">Verified testimonials from collaborating clients.</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-[#FBBF24]">
                    <Star className="w-5 h-5 fill-current mr-1" />
                    <span className="text-base font-black text-gray-800">{effectiveDetail.average_rating || 5.0}</span>
                    <span className="text-xs text-gray-400 ml-1">({userReviews.length})</span>
                  </div>

                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="px-3.5 py-1.5 bg-primary-blue hover:bg-blue-950 text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center space-x-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Leave Review</span>
                  </button>
                </div>
              </div>

              {userReviews.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <p className="text-xs text-gray-400">No client reviews submitted yet for {user.full_name}.</p>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="text-xs font-bold text-secondary-orange hover:underline inline-flex items-center space-x-1"
                  >
                    <span>Be the first client to review this crew member</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {userReviews.map((rev) => {
                    const reviewer = users.find(u => u.user_id === rev.reviewer_id);
                    return (
                      <div key={rev.review_id} className="pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-primary-blue font-bold flex items-center justify-center text-xs border border-blue-100">
                              {reviewer?.full_name ? reviewer.full_name[0] : 'C'}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-gray-900">{reviewer?.full_name || 'Verified Client'}</h4>
                              <div className="flex items-center text-xs text-[#FBBF24] mt-0.5">
                                {[...Array(5)].map((_, idx) => (
                                  <Star 
                                    key={idx} 
                                    className={`w-3 h-3 ${idx < rev.rating ? 'fill-current text-[#FBBF24]' : 'text-gray-200'}`} 
                                  />
                                ))}
                                <span className="text-[10px] text-gray-400 font-bold ml-1.5">
                                  {rev.created_at ? rev.created_at.slice(0, 10) : 'Recent'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2.5 text-xs text-gray-600 leading-relaxed body-font italic pl-10">
                          "{rev.comment}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* MODAL 1: MESSAGE TALENT MODAL */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-150 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <img 
                  src={user.profile_photo_url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`} 
                  alt={user.full_name}
                  className="w-8 h-8 rounded-full object-cover border" 
                />
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Message {user.full_name}</h3>
                  <p className="text-[10px] text-gray-400 uppercase font-mono">Direct Communication</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowMessageModal(false);
                  setMessageSentSuccess(false);
                  setMessageError(null);
                }}
                className="text-gray-400 hover:text-gray-600 font-bold p-1 text-sm"
              >
                ✕
              </button>
            </div>

            {messageSentSuccess ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-gray-900">Message Delivered!</h4>
                <p className="text-xs text-gray-500">
                  Your message has been sent to {user.full_name}. You can continue the conversation in your Inbox.
                </p>
                <div className="flex justify-center space-x-2 pt-2">
                  <button
                    onClick={() => {
                      setShowMessageModal(false);
                      setMessageSentSuccess(false);
                      onNavigate('chat', { otherUserId: userId });
                    }}
                    className="px-4 py-2 bg-primary-blue text-white rounded-lg text-xs font-bold transition shadow"
                  >
                    Open in Messenger
                  </button>
                  <button
                    onClick={() => {
                      setShowMessageModal(false);
                      setMessageSentSuccess(false);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold"
                  >
                    Stay on Profile
                  </button>
                </div>
              </div>
            ) : !currentUser ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-primary-blue flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Sign in to message {user.full_name}</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                    Create an account or sign in as a client to coordinate terms and chat directly.
                  </p>
                </div>
                <div className="flex justify-center space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMessageModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMessageModal(false);
                      onNavigate('auth', { initialTab: 'login', returnTo: 'freelancer_profile', returnUserId: userId, openMessage: true });
                    }}
                    className="px-5 py-2 bg-primary-blue hover:bg-blue-950 text-white text-xs font-bold rounded-lg transition shadow"
                  >
                    Sign In to Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendMessageSubmit} className="space-y-4">
                {messageError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                    {messageError}
                  </div>
                )}

                <div className="p-2.5 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-center justify-between">
                  <span>Sending as: <strong className="font-bold">{currentUser.full_name}</strong></span>
                  <span className="text-[10px] uppercase font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">{currentUser.role}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 font-mono">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    placeholder={`Hello ${user.full_name}, I saw your profile on FreelanceFactory and would like to discuss a project with you...`}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue"
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] text-gray-400">
                  <span>Press Send to deliver to their inbox.</span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMessageModal(false);
                      onNavigate('chat', { otherUserId: userId });
                    }}
                    className="text-primary-blue font-bold hover:underline"
                  >
                    Open full chat window →
                  </button>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMessageModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary-blue hover:bg-blue-950 text-white text-xs font-bold rounded-lg transition shadow flex items-center space-x-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: REVIEW CREW MEMBER MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-150 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900 heading-font uppercase font-mono tracking-wider">
                  Review Crew: {user.full_name}
                </h3>
                <p className="text-xs text-gray-400">Share your verified collaboration rating & feedback</p>
              </div>
              <button 
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewSubmittedSuccess(false);
                  setReviewErrorNotice(null);
                }}
                className="text-gray-400 hover:text-gray-600 font-bold p-1 text-sm"
              >
                ✕
              </button>
            </div>

            {reviewSubmittedSuccess ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-gray-900">Review Published!</h4>
                <p className="text-xs text-gray-500">
                  Your feedback and star rating have been added to {user.full_name}'s verified crew profile.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowReviewModal(false);
                      setReviewSubmittedSuccess(false);
                    }}
                    className="px-5 py-2 bg-primary-blue text-white rounded-lg text-xs font-bold transition shadow"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : !currentUser ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Sign in to review {user.full_name}</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                    Please sign in with your client account to publish a verified review for this crew member.
                  </p>
                </div>
                <div className="flex justify-center space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewModal(false);
                      onNavigate('auth', { initialTab: 'login', returnTo: 'freelancer_profile', returnUserId: userId, openReview: true });
                    }}
                    className="px-5 py-2 bg-primary-blue hover:bg-blue-950 text-white text-xs font-bold rounded-lg transition shadow"
                  >
                    Sign In as Client
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {reviewErrorNotice && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                    {reviewErrorNotice}
                  </div>
                )}

                <div className="p-2.5 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-center justify-between">
                  <span>Reviewing as: <strong className="font-bold">{currentUser.full_name}</strong></span>
                  <span className="text-[10px] uppercase font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">{currentUser.role}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 font-mono">
                    Rating Score
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map(starNum => (
                      <button
                        key={starNum}
                        type="button"
                        onClick={() => setReviewRating(starNum)}
                        onMouseEnter={() => setReviewHoverRating(starNum)}
                        onMouseLeave={() => setReviewHoverRating(0)}
                        className="p-1 focus:outline-none transition hover:scale-110"
                      >
                        <Star 
                          className={`w-7 h-7 ${
                            starNum <= (reviewHoverRating || reviewRating)
                              ? 'text-amber-400 fill-amber-400' 
                              : 'text-gray-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-bold text-gray-700 ml-2">
                      {reviewHoverRating || reviewRating} out of 5 stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 font-mono">
                    Review Feedback Comment
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    placeholder={`Describe your collaboration with ${user.full_name} (e.g. responsiveness, code quality, communication, punctuality)...`}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary-blue hover:bg-blue-950 text-white text-xs font-bold rounded-lg transition shadow"
                  >
                    Publish Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: DIRECT HIRE MODAL */}
      {showHireModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-150 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900 heading-font uppercase font-mono tracking-wider">
                  Hire {user.full_name}
                </h3>
                <p className="text-xs text-gray-500">Create a direct milestone contract proposal</p>
              </div>
              <button 
                onClick={() => {
                  setShowHireModal(false);
                  setHireSuccessNotice(null);
                  setHireErrorNotice(null);
                }}
                className="text-gray-400 hover:text-gray-600 font-bold p-1 text-sm"
              >
                ✕
              </button>
            </div>

            {hireSuccessNotice ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-gray-900">Contract Sent!</h4>
                <p className="text-xs text-gray-500">{hireSuccessNotice}</p>
              </div>
            ) : !currentUser ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-orange-50 text-secondary-orange flex items-center justify-center mx-auto">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Sign in to hire {user.full_name}</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                    Please sign in with your client account to send a contract offer and initiate escrow.
                  </p>
                </div>
                <div className="flex justify-center space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowHireModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowHireModal(false);
                      onNavigate('auth', { initialTab: 'login', returnTo: 'freelancer_profile', returnUserId: userId });
                    }}
                    className="px-5 py-2 bg-secondary-orange hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition shadow"
                  >
                    Sign In as Client
                  </button>
                </div>
              </div>
            ) : currentUser.role !== 'client' ? (
              <div className="py-6 text-center space-y-3">
                <p className="text-xs text-gray-600">
                  Only client accounts can create job contracts. You are currently logged in as a <strong>{currentUser.role}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setShowHireModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateHireOffer} className="space-y-4">
                {hireErrorNotice && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                    {hireErrorNotice}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-mono">
                    Project Contract Title
                  </label>
                  <input
                    type="text"
                    required
                    value={hireTitle}
                    onChange={e => setHireTitle(e.target.value)}
                    placeholder="e.g. Full-Stack Web Development & API Integration"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-mono">
                    Fixed Escrow Budget ($ USD)
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={hireBudget}
                    onChange={e => setHireBudget(e.target.value)}
                    placeholder="150"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue font-bold text-primary-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-mono">
                    Deliverables & Requirements
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={hireDescription}
                    onChange={e => setHireDescription(e.target.value)}
                    placeholder={`Describe the scope and timeline for ${user.full_name}...`}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue"
                  />
                </div>

                <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-[11px] text-blue-800 space-y-1">
                  <div className="font-bold flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary-blue" />
                    <span>Protected Escrow Workflow</span>
                  </div>
                  <p>Your deposit remains securely protected in escrow until deliverables are delivered and approved.</p>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowHireModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-secondary-orange hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition shadow flex items-center space-x-1"
                  >
                    <span>Send Contract Offer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
