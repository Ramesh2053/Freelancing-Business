/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';

// PUBLIC VIEWS
import { LandingView } from './components/public/LandingView';
import { AboutView } from './components/public/AboutView';
import { HowItWorksView } from './components/public/HowItWorksView';
import { ContactView } from './components/public/ContactView';
import { LegalView } from './components/public/LegalView';

// AUTH VIEWS
import { AuthView } from './components/auth/AuthView';
import { ProfileSetupView } from './components/auth/ProfileSetupView';

// DASHBOARDS
import { DashboardView } from './components/dashboard/DashboardView';

// PROFILE VIEWS
import { FreelancerProfileView } from './components/profile/FreelancerProfileView';
import { ClientProfileView } from './components/profile/ClientProfileView';

// JOB VIEWS
import { BrowseJobsView } from './components/jobs/BrowseJobsView';
import { PostJobView } from './components/jobs/PostJobView';
import { JobDetailsView } from './components/jobs/JobDetailsView';

// FREELANCER DISCOVERY
import { BrowseFreelancersView } from './components/freelancers/BrowseFreelancersView';

// COLLABORATIVE & WORKSPACE VIEWS
import { ChatView } from './components/chat/ChatView';
import { PaymentView } from './components/payments/PaymentView';
import { WorkSubmissionView } from './components/work/WorkSubmissionView';
import { WorkApprovalView } from './components/work/WorkApprovalView';

// SETTINGS
import { SettingsView } from './components/settings/SettingsView';

// Footer branding
import { Heart, Globe, Shield, MessageCircle } from 'lucide-react';

function AppContent() {
  const { currentUser } = useApp();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [navigationParams, setNavigationParams] = useState<any>(null);

  // Synchronize hash routing for direct access / deep links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#home';
      const cleanPage = hash.replace('#', '');
      
      // Basic route splitter
      const parts = cleanPage.split('?');
      const pageId = parts[0] || 'home';
      
      setCurrentPage(pageId);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Trigger initial view align

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: string, params?: any) => {
    setNavigationParams(params || null);
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Render view router switcher
  const renderCurrentView = () => {
    switch (currentPage) {
      case 'home':
        return <LandingView onNavigate={handleNavigate} />;
      case 'about':
        return <AboutView onNavigate={handleNavigate} />;
      case 'how_it_works':
        return <HowItWorksView />;
      case 'contact':
        return <ContactView />;
      case 'terms_of_service':
        return <LegalView initialDocument="terms" />;
      case 'privacy_policy':
        return <LegalView initialDocument="privacy" />;
      
      // Authentication and wizards
      case 'auth':
        return (
          <AuthView 
            onNavigate={handleNavigate} 
            initialTab={navigationParams?.initialTab} 
            initialRole={navigationParams?.initialRole} 
          />
        );
      case 'profile_setup':
        return <ProfileSetupView onNavigate={handleNavigate} />;

      // Dashboards
      case 'dashboard':
        return <DashboardView onNavigate={handleNavigate} />;

      // Exploration boards
      case 'browse_jobs':
        return <BrowseJobsView onNavigate={handleNavigate} />;
      case 'browse_freelancers':
        return <BrowseFreelancersView onNavigate={handleNavigate} />;

      // Detail views
      case 'job_details':
        return <JobDetailsView onNavigate={handleNavigate} jobId={navigationParams?.jobId || 'job_1'} />;
      case 'freelancer_profile':
        return <FreelancerProfileView onNavigate={handleNavigate} userId={navigationParams?.userId || 'user_f1'} />;
      case 'client_profile':
        return <ClientProfileView onNavigate={handleNavigate} userId={navigationParams?.userId || 'user_c1'} />;

      // Jobs launcher
      case 'post_job':
        return <PostJobView onNavigate={handleNavigate} inviteFreelancerId={navigationParams?.inviteFreelancerId} />;

      // Payments & active contract workspaces
      case 'payments':
        return <PaymentView onNavigate={handleNavigate} applicationId={navigationParams?.applicationId || ''} />;
      case 'work_submission':
        return <WorkSubmissionView onNavigate={handleNavigate} jobId={navigationParams?.jobId || ''} />;
      case 'work_approval':
        return <WorkApprovalView onNavigate={handleNavigate} jobId={navigationParams?.jobId || ''} />;

      // Real-time messenger
      case 'chat':
        return <ChatView onNavigate={handleNavigate} otherUserId={navigationParams?.otherUserId} />;

      // Settings
      case 'settings':
        return <SettingsView />;

      default:
        return <LandingView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div id="ff-app-root" className="min-h-screen flex flex-col bg-slate-50/20 text-gray-800">
      
      {/* Navigation header banner */}
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main router view window */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Universal footer brand */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 text-left text-xs leading-relaxed font-sans mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white heading-font tracking-wider">FreelanceFactory</h4>
            <p className="text-[11px] text-slate-400 max-w-xs leading-normal font-medium">
              A premium global marketplace connecting skilled Nepalese freelancers with international sponsors, backed by secure Khalti-powered escrow hold ledgers.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-black text-white heading-font tracking-wider uppercase font-mono text-[10px]">Solutions Workspace</h4>
            <ul className="space-y-1.5 font-semibold text-[11px]">
              <li><button onClick={() => handleNavigate('browse_jobs')} className="hover:text-white transition">Explore Jobs</button></li>
              <li><button onClick={() => handleNavigate('browse_freelancers')} className="hover:text-white transition">Source Talent</button></li>
              <li><button onClick={() => handleNavigate('how_it_works')} className="hover:text-white transition">How Escrow works</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-black text-white heading-font tracking-wider uppercase font-mono text-[10px]">Corporate desk</h4>
            <ul className="space-y-1.5 font-semibold text-[11px]">
              <li><button onClick={() => handleNavigate('about')} className="hover:text-white transition">About us</button></li>
              <li><button onClick={() => handleNavigate('contact')} className="hover:text-white transition">Contact supports</button></li>
              <li><button onClick={() => handleNavigate('terms_of_service')} className="hover:text-white transition">Terms & conditions</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-black text-white heading-font tracking-wider uppercase font-mono text-[10px]">Secure escrow</h4>
            <p className="text-[11px] leading-relaxed">
              🔒 Neutral lockboxes guarantee freelancer compensation upon deliverables verification. eSewa, Khalti, or Himalayan Transfers.
            </p>
            <div className="flex items-center space-x-1 mt-2 text-[10px] text-slate-500 font-mono font-bold">
              <Globe className="w-3.5 h-3.5 text-secondary-orange" />
              <span>KATHMANDU, NEPAL</span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-semibold font-mono">
          <p>© 2026 FreelanceFactory Inc. Supporting sustainable freelance micro-economies.</p>
          <div className="flex items-center space-x-1.5 mt-2 sm:mt-0">
            <span>Powered with</span>
            <Heart className="w-3 h-3 text-secondary-orange fill-current" />
            <span>in Kathmandu</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
