/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, X, Mail, User as UserIcon, LogOut, Settings, Briefcase, Users, LayoutDashboard, PlusCircle, Bell, ArrowRight } from 'lucide-react';

interface NavigationProps {
  onNavigate: (page: string, params?: any) => void;
  currentPage: string;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate, currentPage }) => {
  const { currentUser, logout, getConversations } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const conversations = getConversations();
  const unreadMsgCount = conversations.reduce((sum, c) => sum + c.unread_count, 0);

  const handlePageClick = (page: string, params?: any) => {
    onNavigate(page, params);
    setIsOpen(false);
  };

  const menuItems = currentUser ? (
    currentUser.role === 'client' ? [
      { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
      { id: 'browse_freelancers', name: 'Find Talent', icon: Users },
      { id: 'browse_jobs', name: 'My Jobs', icon: Briefcase },
      { id: 'post_job', name: 'Post a Job', icon: PlusCircle },
      { id: 'chat', name: 'Messages', icon: Mail, badge: unreadMsgCount },
      { id: 'settings', name: 'Settings', icon: Settings },
    ] : [
      { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
      { id: 'browse_jobs', name: 'Browse Jobs', icon: Briefcase },
      { id: 'browse_freelancers', name: 'Explore Talent', icon: Users },
      { id: 'chat', name: 'Messages', icon: Mail, badge: unreadMsgCount },
      { id: 'settings', name: 'Settings', icon: Settings },
    ]
  ) : [
    { id: 'home', name: 'Home' },
    { id: 'about', name: 'About' },
    { id: 'how_it_works', name: 'How It Works' },
    { id: 'contact', name: 'Contact' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex flex-col justify-center cursor-pointer select-none" onClick={() => handlePageClick('home')}>
            <span className="text-2xl font-bold tracking-tight text-primary-blue heading-font flex items-center">
              Freelance<span className="text-secondary-orange">Factory</span>
            </span>
            <span className="text-[10px] text-gray-400 font-medium tracking-wide body-font uppercase">
              Where every skill finds its perfect match
            </span>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handlePageClick(item.id)}
                  className={`relative flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive 
                      ? 'bg-blue-50 text-primary-blue' 
                      : 'text-gray-600 hover:text-primary-blue hover:bg-gray-50'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1.5 -right-0.5 min-w-4 h-4 bg-secondary-orange text-white text-[9px] rounded-full flex items-center justify-center px-1 font-bold animate-pulse">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}

            {/* Separator */}
            {currentUser && <div className="h-6 w-[1px] bg-gray-200 mx-2" />}

            {/* User Session Profile and Actions */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageClick(currentUser.role === 'client' ? 'client_profile' : 'freelancer_profile', { userId: currentUser.user_id })}
                  className="flex items-center space-x-2.5 p-1.5 pr-3 hover:bg-gray-50 rounded-lg transition"
                >
                  <img
                    src={currentUser.profile_photo_url}
                    alt={currentUser.full_name}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left leading-none">
                    <div className="text-xs font-semibold text-gray-800 line-clamp-1 max-w-[120px]">{currentUser.full_name}</div>
                    <div className="text-[10px] text-gray-400 capitalize">{currentUser.role}</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    logout();
                    handlePageClick('home');
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 pl-3">
                <button
                  onClick={() => handlePageClick('auth', { initialTab: 'login' })}
                  className="text-gray-600 hover:text-primary-blue font-semibold text-sm px-4 py-2 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handlePageClick('auth', { initialTab: 'register' })}
                  className="bg-primary-blue hover:bg-blue-950 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition shadow-sm hover:shadow flex items-center space-x-1"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            {currentUser && (
              <button
                onClick={() => handlePageClick(currentUser.role === 'client' ? 'client_profile' : 'freelancer_profile', { userId: currentUser.user_id })}
                className="flex items-center"
              >
                <img
                  src={currentUser.profile_photo_url}
                  alt={currentUser.full_name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  referrerPolicy="no-referrer"
                />
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-primary-blue hover:bg-gray-50 rounded-lg"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-3 px-4 shadow-inner space-y-1.5 animate-fadeIn">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handlePageClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition ${
                  isActive 
                    ? 'bg-blue-50 text-primary-blue' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-blue'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className="bg-secondary-orange text-white text-[10px] rounded-full h-5 px-2 flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}

          <div className="h-[1px] bg-gray-100 my-2" />

          {currentUser ? (
            <button
              onClick={() => {
                logout();
                handlePageClick('home');
              }}
              className="w-full flex items-center space-x-2.5 px-4 py-3 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2 px-2">
              <button
                onClick={() => handlePageClick('auth', { initialTab: 'login' })}
                className="w-full text-center border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-sm py-2.5 rounded-lg transition"
              >
                Sign In
              </button>
              <button
                onClick={() => handlePageClick('auth', { initialTab: 'register' })}
                className="w-full text-center bg-primary-blue hover:bg-blue-950 text-white font-semibold text-sm py-2.5 rounded-lg transition"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
