/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { KeyRound, Mail, Phone, UserCheck, Eye, EyeOff, ShieldCheck, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthViewProps {
  onNavigate: (page: string, params?: any) => void;
  initialTab?: 'login' | 'register';
  initialRole?: 'freelancer' | 'client';
}

export const AuthView: React.FC<AuthViewProps> = ({ onNavigate, initialTab = 'login', initialRole = 'freelancer' }) => {
  const { signUp, login, verifyOTP } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [role, setRole] = useState<'freelancer' | 'client'>(initialRole);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    agree_terms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // OTP simulation states
  const [otpStage, setOtpStage] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpNotice, setOtpNotice] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
    setRole(initialRole);
  }, [initialTab, initialRole]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const clearForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone_number: '',
      password: '',
      confirm_password: '',
      agree_terms: false
    });
    setAuthError(null);
  };

  const runLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const result = login(formData.email, formData.password, true);
    if (result.success) {
      if (result.user) {
        if (!result.user.is_verified) {
          // Trigger OTP stage
          setOtpStage(true);
          setOtpNotice(`Simulated OTP Verification: We sent a 6-digit passcode to your email. Check your simulated status banner below!`);
        } else {
          onNavigate('dashboard');
        }
      }
    } else {
      setAuthError(result.error || 'Authentication failure.');
    }
  };

  const runSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (formData.password !== formData.confirm_password) {
      setAuthError('Passwords do not match.');
      return;
    }

    if (!formData.agree_terms) {
      setAuthError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    const signupData = {
      full_name: formData.full_name,
      email: formData.email,
      phone_number: formData.phone_number,
      password: formData.password,
      role
    };

    const result = signUp(signupData);
    if (result.success) {
      // Trigger Email OTP simulation stage
      setOtpStage(true);
      setOtpNotice(`Simulated OTP sent! Copy and use the passcode from the simulator notify badge to verify.`);
    } else {
      setAuthError(result.error || 'Signup failed.');
    }
  };

  const handleOTPVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const isVerified = verifyOTP(formData.email, otpCode);
    if (isVerified) {
      setOtpSuccess(true);
      setTimeout(() => {
        setOtpStage(false);
        setOtpSuccess(false);
        // Automatically route to Profile Setup view
        onNavigate('profile_setup');
      }, 1500);
    } else {
      setAuthError('Invalid passcode. Please use the simulated code "123456" to proceed.');
    }
  };

  // Switch tabs
  const toggleAuthMode = (mode: 'login' | 'register') => {
    setActiveTab(mode);
    clearForm();
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50/50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* SIMULATED OTP NOTIFICATION ACCORDION BUBBLE AT THE TOP */}
      {otpStage && (
        <div className="max-w-md mx-auto w-full mb-6 bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-xl p-5 shadow-lg relative border border-blue-500 animate-slideDown">
          <div className="flex items-start space-x-3 text-left">
            <span className="text-xl">✉️</span>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-orange font-mono">Simulated Email Inbox</h4>
              <p className="text-xs text-blue-100 mt-1 body-font">
                To simplify verification testing inside the preview environment, we have intercepted the verification pipeline!
              </p>
              <div className="mt-3 bg-white/10 rounded-lg p-2.5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-300">Your verification passcode is:</div>
                  <div className="text-base font-extrabold tracking-widest text-[#10B981] font-mono">123456</div>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpCode('123456')}
                  className="bg-white hover:bg-gray-100 text-primary-blue text-[11px] font-bold px-3 py-1.5 rounded-md transition select-none"
                >
                  Autofill Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white border border-gray-150 p-8 rounded-2xl shadow-sm">
        
        {/* TAB HEADERS */}
        {!otpStage && (
          <div className="flex justify-center border-b border-gray-100 pb-5 mb-6">
            <button
              onClick={() => toggleAuthMode('login')}
              className={`flex-1 text-center font-bold text-sm pb-3 border-b-2 transition ${
                activeTab === 'login' ? 'border-primary-blue text-primary-blue' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => toggleAuthMode('register')}
              className={`flex-1 text-center font-bold text-sm pb-3 border-b-2 transition ${
                activeTab === 'register' ? 'border-primary-blue text-primary-blue' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* LOGO & DESCRIPTIONS */}
        <div className="text-center mb-8">
          <span className="text-2xl font-black heading-font text-primary-blue">
            Freelance<span className="text-secondary-orange">Factory</span>
          </span>
          <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mt-1">
            {otpStage ? 'Security Verification' : activeTab === 'login' ? 'Welcome back to work' : 'Register your secure profile'}
          </p>
        </div>

        {/* ERROR DISPLAY */}
        {authError && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3.5 rounded-lg text-left">
            ⚠️ {authError}
          </div>
        )}

        {/* OTP VERIFICATION VIEW CONTAINER */}
        {otpStage ? (
          <form onSubmit={handleOTPVerify} className="space-y-6 text-left animate-fadeIn">
            {otpSuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-gray-950 heading-font">Email Verified!</h3>
                <p className="text-xs text-gray-500 body-font">Setting up your profile folder parameters...</p>
              </div>
            ) : (
              <>
                <div className="bg-blue-50 border border-blue-100 text-blue-800 text-xs p-3.5 rounded-lg">
                  {otpNotice}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">6-Digit Verification Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value)}
                    placeholder="Enter 123456"
                    className="w-full text-center tracking-widest text-lg font-extrabold px-4 py-3.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary-blue hover:bg-blue-950 text-white font-bold text-sm rounded-xl transition shadow"
                >
                  Verify Email
                </button>

                <div className="text-center text-xs text-gray-400">
                  Didn't receive a simulated email? Use simulated code <span className="font-bold text-gray-600">123456</span> to proceed.
                </div>
              </>
            )}
          </form>
        ) : activeTab === 'login' ? (
          /* LOGIN FLOW */
          <form onSubmit={runLogin} className="space-y-5 text-left animate-fadeIn">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Email / Phone</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4.5 h-4.5 text-gray-300" />
                <input
                  type="text"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="ram@factory.com or phone"
                  className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Secret Password</label>
                <button
                  type="button"
                  onClick={() => alert('For simulation support, any password is valid! Matched profiles will instantly sync.')}
                  className="text-[11px] font-semibold text-secondary-orange hover:underline focus:outline-none"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3.5 w-4.5 h-4.5 text-gray-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-primary-blue focus:ring-primary-blue/30 border-gray-300 rounded transition"
              />
              <label htmlFor="remember_me" className="ml-2 block text-xs font-medium text-gray-500">
                Remember my session credentials
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-primary-blue hover:bg-blue-950 text-white font-bold text-sm rounded-xl transition shadow flex items-center justify-center space-x-1.5"
            >
              <span>Sign In to Factory</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-gray-400 font-medium">New to FreelanceFactory? </span>
              <button
                type="button"
                onClick={() => toggleAuthMode('register')}
                className="text-xs font-bold text-primary-blue hover:underline"
              >
                Sign Up
              </button>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-[11px] text-gray-400 leading-normal text-center">
              <span className="font-bold text-gray-500 uppercase tracking-wider block mb-1">Quick Preview Profiles</span>
              Client: <span className="text-primary-blue font-bold">bishal@factory.com</span> (pass: anything)<br/>
              Client Company: <span className="text-primary-blue font-bold">suresh@synergy.com</span> (pass: anything)
            </div>
          </form>
        ) : (
          /* REGISTRATION FLOW */
          <form onSubmit={runSignUp} className="space-y-4 text-left animate-fadeIn">
            {/* ROLE TOGGLE TABS */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">My Marketplace Role</label>
              <div className="bg-gray-100 p-1.5 rounded-xl flex">
                <button
                  type="button"
                  onClick={() => setRole('freelancer')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition ${
                    role === 'freelancer' ? 'bg-white text-primary-blue shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  I am a Freelancer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition ${
                    role === 'client' ? 'bg-white text-primary-blue shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  I am a Client
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 font-mono">Full Name / Enterprise Name</label>
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="e.g. Sujata Adhikari"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 font-mono">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="sujata@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 font-mono">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                required
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="e.g. 9841223344"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 font-mono">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 font-mono">Validate Password</label>
                <input
                  type="password"
                  name="confirm_password"
                  required
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition"
                />
              </div>
            </div>

            <div className="flex items-start">
              <input
                id="agree_terms"
                name="agree_terms"
                type="checkbox"
                required
                checked={formData.agree_terms}
                onChange={handleInputChange}
                className="h-4 w-4 mt-0.5 text-primary-blue focus:ring-primary-blue/30 border-gray-300 rounded transition"
              />
              <label htmlFor="agree_terms" className="ml-2 block text-xs text-gray-500 leading-snug">
                I agree to the <span className="text-primary-blue font-bold hover:underline cursor-pointer" onClick={() => onNavigate('terms_of_service')}>Terms & Conditions</span> and <span className="text-primary-blue font-bold hover:underline cursor-pointer" onClick={() => onNavigate('privacy_policy')}>Privacy Policy</span>.
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-secondary-orange hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition shadow flex items-center justify-center space-x-1"
            >
              <span>Verify & Sign Up</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-gray-400 font-medium">Already have an account? </span>
              <button
                type="button"
                onClick={() => toggleAuthMode('login')}
                className="text-xs font-bold text-primary-blue hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
