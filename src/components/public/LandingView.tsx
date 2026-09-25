/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowRight, ShieldCheck, CheckCircle, Users, Sparkles, 
  ChevronRight, ChevronLeft, PlusCircle, Search, HelpCircle, 
  Star, Quote, Heart, DollarSign, ExternalLink
} from 'lucide-react';

interface LandingViewProps {
  onNavigate: (page: string, params?: any) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const { users, freelanceDetails, jobs } = useApp();

  // Carousel Indexes
  const [freelancerIndex, setFreelancerIndex] = useState(0);
  const [jobIndex, setJobIndex] = useState(0);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Get first 6 freelancers to display
  const displayFreelancers = freelanceDetails.slice(0, 6).map(f => {
    const user = users.find(u => u.user_id === f.freelancer_id);
    return {
      ...f,
      name: user?.full_name || 'Anonymous Creator',
      photo: user?.profile_photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      location: user?.location || 'Nepal'
    };
  });

  // Get first 6 posted jobs
  const displayJobs = jobs.filter(j => j.status === 'posted').slice(0, 6).map(j => {
    const clientUser = users.find(u => u.user_id === j.client_id);
    return {
      ...j,
      clientName: clientUser?.full_name || 'Synergy Client'
    };
  });

  const nextFreelancer = () => {
    setFreelancerIndex((prev) => (prev + 3 >= displayFreelancers.length ? 0 : prev + 3));
  };

  const prevFreelancer = () => {
    setFreelancerIndex((prev) => (prev === 0 ? Math.max(0, displayFreelancers.length - 3) : prev - 3));
  };

  const nextJob = () => {
    setJobIndex((prev) => (prev + 3 >= displayJobs.length ? 0 : prev + 3));
  };

  const prevJob = () => {
    setJobIndex((prev) => (prev === 0 ? Math.max(0, displayJobs.length - 3) : prev - 3));
  };

  const faqData = [
    {
      q: "How does FreelanceFactory secure payments?",
      a: "Our marketplace utilizes a secure Escrow holding protocol. When a client hires a freelancer, payment is secured in Escrow via integrated payment options (like Khalti or eSewa). These funds are locked safely until the freelancer submits files and the client confirms approval, which ensures zero payment or delivery risk."
    },
    {
      q: "What is OTP verification?",
      a: "Every new user registration undergoes verification. Users receive a simulated 6-digit One Time Password (OTP) to confirm their email authenticity, locking down the registration safety baseline against malicious spam accounts."
    },
    {
      q: "Can I register as both a freelancer and a client?",
      a: "An email account is bound to one user type role (Freelancer or Client) to maintain streamlined dashboards. However, you can register secondary accounts using distinct email logins to explore both talent and job poster options!"
    },
    {
      q: "What happens if there is a dispute regarding deliverables?",
      a: "Either user can file an official Dispute within 7 days of completion. This freezes escrow funds completely, and administrators audit the timeline logs, communication logs, and deliverables to ensure a fair resolution based on contract evidence."
    },
    {
      q: "Who pays the commission fee?",
      a: "FreelanceFactory remains committed to providing maximum earning power, charging a highly minimal standard 5% escrow facilitation fee upon project release to cover secure cloud database maintenance."
    },
    {
      q: "Does this workspace support real-time sync?",
      a: "Absolutely! The factory is fully reactive. Registering, messaging, posting jobs, or releasing capital synchronizes instantly in real-time across all browser windows and tabs instantly."
    }
  ];

  return (
    <div className="bg-white text-gray-800">
      
      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-blue-50/70 via-white to-orange-50/50 py-16 md:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-1.5 bg-blue-50 rounded-full px-4 py-1.5 text-xs font-semibold text-primary-blue mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connecting premium talent with secure projects</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-950 heading-font max-w-4xl mx-auto leading-tight">
            Where every skill finds its <span className="text-secondary-orange">perfect match</span>
          </h1>

          <p className="mt-6 text-xl text-gray-600 font-medium tracking-normal body-font max-w-2xl mx-auto">
            Connect. Create. Thrive. Hire vetted experts with absolute payment safety, or unlock stable remote income doing what you love.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => onNavigate('auth', { initialTab: 'register', initialRole: 'client' })}
              className="w-full sm:w-auto px-8 py-4 bg-primary-blue hover:bg-blue-950 text-white font-bold rounded-xl transition duration-150 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <span>I Need Work Done</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('auth', { initialTab: 'register', initialRole: 'freelancer' })}
              className="w-full sm:w-auto px-8 py-4 bg-secondary-orange hover:bg-orange-600 text-white font-bold rounded-xl transition duration-150 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <span>I Want to Work</span>
              <Users className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-8 border-t border-gray-100/60">
            <div>
              <div className="text-3xl font-extrabold text-primary-blue heading-font">100+</div>
              <div className="text-xs text-gray-400 font-medium body-font uppercase tracking-wider mt-1">Verified Experts</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#10B981] heading-font">$25k+</div>
              <div className="text-xs text-gray-400 font-medium body-font uppercase tracking-wider mt-1">Secured in Escrow</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#FF6B35] heading-font">350+</div>
              <div className="text-xs text-gray-400 font-medium body-font uppercase tracking-wider mt-1">Projects Completed</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-gray-800 heading-font">99.2%</div>
              <div className="text-xs text-gray-400 font-medium body-font uppercase tracking-wider mt-1">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-gray-950 heading-font">How FreelanceFactory Works</h2>
            <p className="mt-3 text-gray-500 font-medium body-font">We remove trust hurdles with transparent reviews and secure escrow payments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-6 -mt-6 transition group-hover:scale-110" />
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-primary-blue flex items-center justify-center font-bold text-lg heading-font relative z-10 mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 heading-font mb-3">Post a Job</h3>
              <p className="text-sm leading-relaxed text-gray-500 body-font">
                Clients draft project outlines with scope descriptions, pricing tiers, design attachments, and specific skill constraints.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-6 -mt-6 transition group-hover:scale-110" />
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-secondary-orange flex items-center justify-center font-bold text-lg heading-font relative z-10 mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 heading-font mb-3">Review Freelancers</h3>
              <p className="text-sm leading-relaxed text-gray-500 body-font">
                Qualified experts apply with cover letters. Clients browse user reviews, past work metrics, and interview them via integrated chats.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-6 -mt-6 transition group-hover:scale-110" />
              <div className="w-12 h-12 rounded-xl bg-green-100 text-[#10B981] flex items-center justify-center font-bold text-lg heading-font relative z-10 mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 heading-font mb-3">Pay Securely</h3>
              <p className="text-sm leading-relaxed text-gray-500 body-font">
                Secure funds stay locked in Escrow. Once work has been uploaded, reviewed, and approved, payments release directly to the freelancer.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('how_it_works')}
              className="text-primary-blue hover:text-blue-900 font-bold text-sm inline-flex items-center space-x-1"
            >
              <span>Explore structural step guides in detail</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED FREELANCERS CAROUSEL */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-950 heading-font">Our Top Verified Freelancers</h2>
              <p className="mt-2 text-sm text-gray-400 font-medium body-font">Discover highest-rated freelance experts across development and design.</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <button 
                onClick={prevFreelancer}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-primary-blue text-gray-500 transition shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextFreelancer}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-primary-blue text-gray-500 transition shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayFreelancers.slice(freelancerIndex, freelancerIndex + 3).map((f) => (
              <div 
                key={f.freelancer_id} 
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={f.photo} 
                      alt={f.name} 
                      className="w-14 h-14 rounded-full object-cover border border-gray-100"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 heading-font hover:text-primary-blue cursor-pointer"
                        onClick={() => onNavigate('freelancer_profile', { userId: f.freelancer_id })}
                      >
                        {f.name}
                      </h4>
                      <p className="text-xs text-gray-400">{f.location}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-secondary-orange bg-orange-50 inline-block px-2.5 py-1 rounded-md">
                    {f.headline || 'Professional Freelancer'}
                  </p>

                  <p className="mt-3 text-sm text-gray-500 line-clamp-3 body-font">
                    {f.member_since === 'Just Joined' ? 'Ready to write code, design assets, and handle administrative virtual workloads immediately.' : 'Highly active professional providing outstanding work quality, and punctual deliveries on every milestone.'}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {f.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="bg-gray-50 border border-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-md capitalize">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Starting Rate</div>
                    <div className="text-xl font-extrabold text-primary-blue heading-font">${f.hourly_rate}<span className="text-xs text-gray-400">/hr</span></div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-[#FBBF24]">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <span className="text-sm font-bold text-gray-700">{f.average_rating || '5.0'}</span>
                    </div>
                    <button
                      onClick={() => onNavigate('freelancer_profile', { userId: f.freelancer_id })}
                      className="text-xs bg-gray-50 border border-gray-200 font-bold px-3.5 py-2 hover:bg-primary-blue hover:text-white rounded-lg transition"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => onNavigate('browse_freelancers')}
              className="px-6 py-3 border-2 border-primary-blue/30 text-primary-blue hover:border-primary-blue font-bold text-sm rounded-xl transition"
            >
              Browse All Freelancers
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED JOBS CAROUSEL */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-950 heading-font">Explore Recent Jobs</h2>
              <p className="mt-2 text-sm text-gray-400 font-medium body-font">Find open assignments with guaranteed budgets backed by secure escrow.</p>
            </div>
            {displayJobs.length > 3 && (
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <button 
                  onClick={prevJob}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-primary-blue text-gray-500 transition shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextJob}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-primary-blue text-gray-500 transition shadow-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayJobs.slice(jobIndex, jobIndex + 3).map((job) => (
              <div 
                key={job.job_id} 
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-50 text-primary-blue text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
                      {job.category}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-400">
                      {job.job_type === 'one-time' ? 'One-time Work' : 'Ongoing Scope'}
                    </span>
                  </div>

                  <h4 
                    onClick={() => onNavigate('job_details', { jobId: job.job_id })}
                    className="mt-4 text-lg font-bold text-gray-950 heading-font hover:text-primary-blue cursor-pointer line-clamp-1"
                  >
                    {job.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">Hiring: {job.clientName}</p>

                  <p className="mt-3 text-sm text-gray-500 line-clamp-3 body-font">
                    {job.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {job.skills_required.map(skill => (
                      <span key={skill} className="bg-gray-50 border border-gray-100 text-gray-500 text-[10px] font-semibold px-2 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Budget</div>
                    <div className="text-lg font-bold text-[#10B981] heading-font">
                      ${job.budget}
                      <span className="text-[11px] text-gray-400 font-normal capitalize">
                        {job.budget_type === 'hourly' ? ' / hr' : ' Total'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('job_details', { jobId: job.job_id })}
                    className="text-xs bg-primary-blue text-white font-bold px-4 py-2.5 hover:bg-blue-950 rounded-lg transition shadow-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => onNavigate('browse_jobs')}
              className="px-6 py-3 bg-secondary-orange hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition shadow-md"
            >
              Browse Open Positions
            </button>
          </div>
        </div>
      </section>

      {/* TRUST INDICATORS SECTION */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 heading-font mb-4">
              Building Trust in the Freelance Economy
            </h2>
            <p className="text-sm font-medium text-gray-400 body-font mb-16">
              FreelanceFactory implements state-of-the-art protections to remove risks for both clients and freelancers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-blue-100 text-primary-blue flex items-center justify-center mb-5">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 heading-font mb-2">Secure Escrow Payments</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-sm body-font">
                Funds are committed up-front and held safely in Escrow via Khalti/eSewa and only released when the deliverables are fully approved.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-green-100 text-[#10B981] flex items-center justify-center mb-5">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 heading-font mb-2">100% Verified Users</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-sm body-font">
                Every user is verified via email OTP login, and profiles are checked for skills and portfolio authenticity.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-orange-100 text-secondary-orange flex items-center justify-center mb-5">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 heading-font mb-2">Real-Time Interaction</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-sm body-font">
                Chat histories, active applications, payment releases, and dispute resolutions synchronize instantly across any browser tab in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 bg-gray-55 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-gray-950 heading-font">Stories from Early Users</h2>
            <p className="mt-3 text-sm font-medium text-gray-400 body-font">Hear how FreelanceFactory transformed remote contract collaboration for Nepalese and international teams.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center text-[#FBBF24] mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm leading-relaxed text-gray-500 italic body-font">
                  "Securing budgets in escrow has changed how we outsource. With eSewa integration and immediate real-time sync, our designers feel completely safe and deliverables have skyrocketed in quality!"
                </p>
              </div>
              <div className="mt-6 flex items-center space-x-3 pt-6 border-t border-gray-50">
                <img 
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80" 
                  alt="Suresh" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h5 className="text-sm font-bold text-gray-900 heading-font">Suresh Acharya</h5>
                  <p className="text-xs text-gray-400 font-medium">Founder, Synergy Tech Solutions</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center text-[#FBBF24] mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm leading-relaxed text-gray-500 italic body-font">
                  "I signed up, verified my email via OTP, and immediately found a branding project with Everest Coffee. Receiving the locked payment notice in real-time meant I completed work with zero stress."
                </p>
              </div>
              <div className="mt-6 flex items-center space-x-3 pt-6 border-t border-gray-50">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                  alt="Bishal" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h5 className="text-sm font-bold text-gray-900 heading-font">Bishal Shrestha</h5>
                  <p className="text-xs text-gray-400 font-medium">Brand Identity Designer</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center text-[#FBBF24] mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm leading-relaxed text-gray-500 italic body-font">
                  "We needed a copywriter within 48 hours for a critical blog strategy. We searched via specific content tags, reviewed portfolios, and signed Anjali. Her submission review flow was seamless!"
                </p>
              </div>
              <div className="mt-6 flex items-center space-x-3 pt-6 border-t border-gray-50">
                <img 
                  src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=150&q=80" 
                  alt="Elena" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h5 className="text-sm font-bold text-gray-900 heading-font">Elena Gurung</h5>
                  <p className="text-xs text-gray-400 font-medium">Producer, Apex Digital</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-950 heading-font">Frequently Asked Questions</h2>
            <p className="mt-3 text-sm text-gray-400 font-medium body-font">Everything you need to know about working on FreelanceFactory.</p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className={`border rounded-xl transition-all duration-200 ${
                    isOpen ? 'border-primary-blue bg-blue-50/20 shadow-sm' : 'border-gray-150 hover:bg-gray-50/50'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex justify-between items-center px-6 py-5.5 text-left font-bold text-gray-950 heading-font text-base"
                    id={`faq-btn-${index}`}
                  >
                    <span>{faq.q}</span>
                    <span className={`text-xl transform duration-150 ${isOpen ? 'rotate-45 text-primary-blue' : 'text-gray-400'}`}>
                      ＋
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-gray-500 leading-relaxed body-font animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="bg-gray-950 text-white pt-16 pb-8 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
            {/* Meta */}
            <div className="md:col-span-1.5 text-left">
              <span className="text-xl font-bold tracking-tight text-white heading-font">
                Freelance<span className="text-secondary-orange">Factory</span>
              </span>
              <p className="mt-4 text-xs leading-relaxed text-gray-400 font-semibold uppercase tracking-wide">
                Where every skill finds its perfect match
              </p>
              <p className="mt-3 text-xs leading-relaxed text-gray-400 max-w-sm body-font mb-4">
                FreelanceFactory is a secure Nepalese-developed open freelance marketplace powering remote collaboration and direct escrow payments across verified accounts.
              </p>
              <div className="text-gray-500 text-xs font-mono">APP PORTAL: 3000 (SECURE)</div>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="text-sm font-semibold tracking-wider text-gray-300 uppercase heading-font mb-4">Quick Links</h5>
              <ul className="space-y-2.5 text-xs text-gray-400 font-medium">
                <li><button onClick={() => onNavigate('about')} className="hover:text-secondary-orange transition">About Factory Us</button></li>
                <li><button onClick={() => onNavigate('how_it_works')} className="hover:text-secondary-orange transition">How It Works Page</button></li>
                <li><button onClick={() => onNavigate('contact')} className="hover:text-secondary-orange transition">Contact Support</button></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h5 className="text-sm font-semibold tracking-wider text-gray-300 uppercase heading-font mb-4">Legal Agreements</h5>
              <ul className="space-y-2.5 text-xs text-gray-400 font-medium">
                <li><button onClick={() => onNavigate('terms_of_service')} className="hover:text-secondary-orange transition">Terms of Service</button></li>
                <li><button onClick={() => onNavigate('privacy_policy')} className="hover:text-secondary-orange transition">Privacy Policy</button></li>
              </ul>
            </div>

            {/* Contact info */}
            <div>
              <h5 className="text-sm font-semibold tracking-wider text-gray-300 uppercase heading-font mb-4">Get In Touch</h5>
              <ul className="space-y-3 text-xs text-gray-300 font-medium font-sans">
                <li className="text-gray-400">Email: <span className="text-white hover:text-secondary-orange transition">support@freelancefactory.com</span></li>
                <li className="text-gray-400 font-sans">Call: <span className="text-white transition">+977-1-4432100</span></li>
                <li className="text-gray-400">Office: <span className="text-white">Grace Plaza, Lalitpur, West Nepal</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>&copy; 2026 FreelanceFactory Inc. Celebrating talent and secure work terms.</p>
            <div className="flex space-x-6 mt-4 md:mt-0 font-bold">
              <a href="#linkedin" className="hover:text-white transition">LinkedIn</a>
              <a href="#facebook" className="hover:text-white transition">Facebook</a>
              <a href="#instagram" className="hover:text-white transition">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
