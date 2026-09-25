/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Camera, Check, Briefcase, Award, Languages, Globe } from 'lucide-react';

interface ProfileSetupViewProps {
  onNavigate: (page: string, params?: any) => void;
}

const PREDEFINED_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Figma', 
  'UI/UX Design', 'Logo Design', 'Brand Identity', 'Illustration', 
  'Copywriting', 'SEO Writing', 'Content Strategy', 
  'Virtual Assistant', 'Data Entry', 'Customer Support', 'Google Maps Platform', 'Firebase'
];

const PREDEFINED_INDUSTRIES = [
  'Software Development', 'Food & Beverage', 
  'Business Development & Marketing', 'Education & training', 
  'Finance & Crypto', 'Healthcare', 'E-commerce & retail', 'Engineering & Construction'
];

export const ProfileSetupView: React.FC<ProfileSetupViewProps> = ({ onNavigate }) => {
  const { currentUser, updateProfile } = useApp();

  if (!currentUser) {
    onNavigate('auth');
    return null;
  }

  const isFreelancer = currentUser.role === 'freelancer';

  // State for Freelancer setup
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [rateType, setRateType] = useState<'hourly' | 'project'>('hourly');
  const [rate, setRate] = useState(25);
  const [portfolioLink, setPortfolioLink] = useState('');
  const [certification, setCertification] = useState('');
  const [languages, setLanguages] = useState('English, Nepali');
  const [availability, setAvailability] = useState<'Available' | 'Busy' | 'Not Available'>('Available');
  const [location, setLocation] = useState('Kathmandu, Nepal (GMT+5:45)');
  
  // State for Client setup
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState(PREDEFINED_INDUSTRIES[0]);
  const [companyDescription, setCompanyDescription] = useState('');
  const [clientLocation, setClientLocation] = useState('Kathmandu, West Nepal');

  // Simulated avatar URL
  const [avatarUrl, setAvatarUrl] = useState(currentUser.profile_photo_url);

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSimulatedAvatarChange = () => {
    // Cycle through 4 mock images for fun
    const avatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
    ];
    const currentIndex = avatars.indexOf(avatarUrl);
    const nextIndex = (currentIndex + 1) % avatars.length;
    setAvatarUrl(avatars[nextIndex]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isFreelancer) {
      if (!headline) return;
      if (selectedSkills.length === 0) {
        alert('Please choose at least 1 skill.');
        return;
      }
      if (!portfolioLink) {
        alert('Please submit at least 1 portfolio address or filename.');
        return;
      }

      const userUpdates = {
        bio,
        location,
        profile_photo_url: avatarUrl
      };

      const roleDetails = {
        headline,
        skills: selectedSkills,
        hourly_rate: rate,
        rate_type: rateType,
        portfolio_links: [portfolioLink],
        certifications: certification ? [certification] : [],
        languages: languages.split(',').map(l => l.trim()),
        availability_status: availability
      };

      updateProfile(userUpdates, roleDetails);
    } else {
      // Client
      const userUpdates = {
        bio: companyDescription,
        location: clientLocation,
        profile_photo_url: avatarUrl
      };

      const roleDetails = {
        company_name: companyName || currentUser.full_name,
        industry,
        company_description: companyDescription,
        location: clientLocation
      };

      updateProfile(userUpdates, roleDetails);
    }

    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 md:p-10 border border-gray-150 rounded-2xl shadow-sm">
        
        {/* PROGRESS HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex h-8 bg-blue-50 text-primary-blue text-xs font-bold px-3.5 py-1 items-center rounded-full space-x-1.5 justify-center mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Setup Stepper Profile Profile</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 heading-font">Configure Your Profile Context</h2>
          <p className="text-sm text-gray-500 mt-1 body-font">
            Please fill in your active details to display in our search databases.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 text-left">
          
          {/* PROFILE PHOTO SIMULATION */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-150 text-center flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={handleSimulatedAvatarChange}>
              <img 
                src={avatarUrl} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md group-hover:opacity-80 transition"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-blue text-white flex items-center justify-center border-2 border-white shadow">
                <Camera className="w-4 h-4" />
              </div>
            </div>
            <h4 className="text-sm font-bold text-gray-800 heading-font mt-3">Profile Avatar Simulation</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">Click directly on the image bubble above to cycle and test various photos!</p>
          </div>

          {isFreelancer ? (
            /* FREELANCER SPECIFIC DETAILS */
            <div className="space-y-6">
              
              {/* headline */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Professional Headline *</label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  placeholder="e.g. Lead UI/UX Designer | Figma Pro Brand Identity Expert"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition text-gray-800"
                />
              </div>

              {/* bio */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Executive Bio / About Us *</label>
                  <span className="text-[11px] font-semibold text-gray-400 font-mono">{bio.length}/200 characters</span>
                </div>
                <textarea
                  required
                  maxLength={200}
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="State a brief 2-3 sentence overview of your professional skills within a maximum of 200 characters..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition resize-none text-gray-800"
                />
              </div>

              {/* predefined list of multiple selection skills */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5 font-mono">Select Skill Badges (Multiple Select) *</label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1.5 border border-gray-150 rounded-xl bg-gray-50/50">
                  {PREDEFINED_SKILLS.map(skill => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => handleSkillToggle(skill)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition flex items-center space-x-1.5 ${
                          isSelected
                            ? 'bg-blue-50 border-primary-blue/50 text-primary-blue shadow-sm'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* rate toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">Pricing Rate Type</label>
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setRateType('hourly')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                        rateType === 'hourly' ? 'bg-white text-primary-blue shadow-sm' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      Hourly Rate ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRateType('project')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                        rateType === 'project' ? 'bg-white text-primary-blue shadow-sm' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      Project Basis ($)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">Rate Value ($) *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-sm font-extrabold text-gray-400">$</span>
                    <input
                      type="number"
                      required
                      min={5}
                      value={rate}
                      onChange={e => setRate(Math.max(5, parseInt(e.target.value) || 5))}
                      className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* portfolio links */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Portfolio Web Address / File Uploads *</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    required
                    value={portfolioLink}
                    onChange={e => setPortfolioLink(e.target.value)}
                    placeholder="github.com/my-profile or behance.net/design-showcase"
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition text-gray-800"
                  />
                </div>
              </div>

              {/* Certifications (optional) & Languages & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Certifications (Optional)</label>
                  <input
                    type="text"
                    value={certification}
                    onChange={e => setCertification(e.target.value)}
                    placeholder="e.g. AWS Developer, Google UX Pro"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Languages Spoken</label>
                  <input
                    type="text"
                    required
                    value={languages}
                    onChange={e => setLanguages(e.target.value)}
                    placeholder="e.g. English, Nepali, Hindi"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Availability Status</label>
                  <select
                    value={availability}
                    onChange={e => setAvailability(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition text-gray-800"
                  >
                    <option value="Available">Available Immediately</option>
                    <option value="Busy">Currently Busy / contract</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Timezone / Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="Kathmandu, Nepal (GMT+5:45)"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition text-gray-800"
                  />
                </div>
              </div>

            </div>
          ) : (
            /* CLIENT SPECIFIC DETAILS */
            <div className="space-y-6">
              
              {/* Company name */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Company Name / Organization Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="e.g. Synergy Tech Labs or Personal Name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition text-gray-800"
                />
              </div>

              {/* Industry sector */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Industry / Sector Segment</label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition text-gray-800"
                >
                  {PREDEFINED_INDUSTRIES.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              {/* company desc */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Company description</label>
                <textarea
                  rows={4}
                  value={companyDescription}
                  onChange={e => setCompanyDescription(e.target.value)}
                  placeholder="State a brief 2-4 sentence description regarding your company projects, workflow segments, or tech stacks..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition resize-none text-gray-800"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Company Headquarters Location</label>
                <input
                  type="text"
                  required
                  value={clientLocation}
                  onChange={e => setClientLocation(e.target.value)}
                  placeholder="Lalitpur, West Nepal"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition text-gray-800"
                />
              </div>

            </div>
          )}

          {/* SAVE BUTTON */}
          <button
            type="submit"
            className="w-full py-4 bg-primary-blue hover:bg-blue-950 text-white font-bold rounded-xl text-sm transition shadow-lg flex items-center justify-center space-x-1"
          >
            <span>Save & Proceed to Dashboard</span>
          </button>

        </form>
      </div>
    </div>
  );
};
