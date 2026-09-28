/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { KeyRound, Mail, Phone, UserCheck, Eye, EyeOff, ArrowRight, CheckCircle2, Loader2, Info, RefreshCw, ArrowLeft } from 'lucide-react';

interface AuthViewProps {
  onNavigate: (page: string, params?: any) => void;
  initialTab?: 'login' | 'register';
  initialRole?: 'freelancer' | 'client';
}

export const AuthView: React.FC<AuthViewProps> = ({ onNavigate, initialTab = 'login', initialRole = 'freelancer' }) => {
  const { signUp, login, sendVerificationCode, verifyEmailCode } = useApp();

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
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForgotTip, setShowForgotTip] = useState(false);

  // Email verification screen state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    setActiveTab(initialTab);
    setRole(initialRole);
    setAuthError(null);
    setAuthSuccess(null);
    setIsVerifying(false);
  }, [initialTab, initialRole]);

  // Handle resend countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

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
    setAuthSuccess(null);
    setIsVerifying(false);
    setVerificationCode('');
  };

  const runLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setSubmitting(true);

    try {
      const result = await login(formData.email, formData.password, true);
      if (result.requiresVerification) {
        setVerificationEmail(result.email || formData.email.trim());
        setIsVerifying(true);
        setResendCooldown(45);
        setAuthSuccess('A 6-digit verification code has been sent to your email. Please enter it below.');
      } else if (result.success) {
        setAuthSuccess('Welcome back! Logging you in...');
        setTimeout(() => {
          onNavigate('dashboard');
        }, 500);
      } else {
        setAuthError(result.error || 'Authentication failure. Please check your credentials.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'An unexpected error occurred during sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  const runSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (formData.password !== formData.confirm_password) {
      setAuthError('Passwords do not match. Please verify.');
      return;
    }

    if (formData.password.length < 6) {
      setAuthError('Password should be at least 6 characters long.');
      return;
    }

    if (!formData.agree_terms) {
      setAuthError('Please agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setSubmitting(true);
    try {
      const signupData = {
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
        role
      };

      const result = await signUp(signupData);
      if (result.requiresVerification) {
        setVerificationEmail(result.email || formData.email.trim().toLowerCase());
        setIsVerifying(true);
        setResendCooldown(45);
        setAuthSuccess('Account registered! A 6-digit confirmation code was sent to your email.');
      } else if (result.success) {
        setAuthSuccess('Account created! Taking you to profile setup...');
        setTimeout(() => {
          onNavigate('profile_setup');
        }, 800);
      } else {
        setAuthError(result.error || 'Signup failed. Please try again.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Could not complete registration. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!verificationCode.trim()) {
      setAuthError('Please enter the 6-digit code received in your email.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await verifyEmailCode(verificationEmail, verificationCode);
      if (result.success) {
        setAuthSuccess('Email verified successfully! Loading your workspace...');
        setTimeout(() => {
          if (role === 'freelancer') {
            onNavigate('profile_setup');
          } else {
            onNavigate('dashboard');
          }
        }, 1000);
      } else {
        setAuthError(result.error || 'Invalid or expired code. Please check your email or request a new code.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Failed to verify code.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || !verificationEmail) return;
    setAuthError(null);
    setAuthSuccess(null);
    setSubmitting(true);

    try {
      const res = await sendVerificationCode(verificationEmail);
      if (res.success) {
        setAuthSuccess(res.message || 'A new verification code has been sent to your email.');
        setResendCooldown(60);
      } else {
        setAuthError(res.error || 'Could not send verification code.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Error requesting code resend.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAuthMode = (mode: 'login' | 'register') => {
    setActiveTab(mode);
    clearForm();
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50/50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white border border-gray-150 p-8 rounded-2xl shadow-sm">
        
        {/* TAB HEADERS (Hidden when in verification step) */}
        {!isVerifying && (
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
        <div className="text-center mb-6">
          <span className="text-2xl font-black heading-font text-primary-blue">
            Freelance<span className="text-secondary-orange">Factory</span>
          </span>
          <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mt-1">
            {isVerifying ? 'Email Security Verification' : activeTab === 'login' ? 'Welcome back to work' : 'Register your secure profile'}
          </p>
        </div>

        {/* SUCCESS NOTIFICATION */}
        {authSuccess && (
          <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-3.5 rounded-lg text-left flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{authSuccess}</span>
          </div>
        )}

        {/* ERROR NOTIFICATION */}
        {authError && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3.5 rounded-lg text-left flex items-start gap-2">
            <span className="text-sm shrink-0">⚠️</span>
            <span className="leading-relaxed">{authError}</span>
          </div>
        )}

        {/* FORGOT PASSWORD INLINE TIP */}
        {showForgotTip && (
          <div className="mb-5 bg-blue-50 border border-blue-200 text-blue-800 text-xs p-3.5 rounded-lg text-left flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Password assistance</p>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  If you forgot your password, contact support or register with your email address to receive a secure login code.
                </p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => setShowForgotTip(false)}
              className="text-xs font-bold text-blue-500 hover:text-blue-800"
            >
              ✕
            </button>
          </div>
        )}

        {/* SCREEN 1: VERIFICATION CODE FORM */}
        {isVerifying ? (
          <form onSubmit={handleVerifyCodeSubmit} className="space-y-5 text-left animate-fadeIn">
            <div className="text-center py-2">
              <div className="w-14 h-14 bg-blue-50 text-primary-blue rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Check Your Email</h3>
              <p className="text-xs text-gray-500 mt-1">
                We sent a 6-digit confirmation code to:
              </p>
              <p className="text-xs font-bold text-primary-blue mt-0.5 font-mono">
                {verificationEmail}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono text-center">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={verificationCode}
                onChange={e => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                autoFocus
                className="w-full text-center tracking-[0.3em] text-2xl font-black px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue font-mono transition"
              />
              <p className="text-[11px] text-gray-400 text-center mt-2">
                Tip: If you don't see it in a few seconds, check your spam or junk folder.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || verificationCode.length < 6}
              className="w-full py-3.5 bg-primary-blue hover:bg-blue-950 text-white font-bold text-sm rounded-xl transition shadow flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>Verify & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsVerifying(false);
                  setVerificationCode('');
                }}
                className="text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendCooldown > 0 || submitting}
                className="text-secondary-orange hover:text-orange-700 font-bold flex items-center gap-1 disabled:opacity-50 disabled:hover:text-secondary-orange"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${submitting ? 'animate-spin' : ''}`} />
                <span>
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
                </span>
              </button>
            </div>
          </form>
        ) : activeTab === 'login' ? (
          /* SCREEN 2: LOGIN FLOW */
          <form onSubmit={runLogin} className="space-y-5 text-left animate-fadeIn">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Email or Phone</label>
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
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotTip(prev => !prev)}
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
              disabled={submitting}
              className="w-full py-3.5 bg-primary-blue hover:bg-blue-950 text-white font-bold text-sm rounded-xl transition shadow flex items-center justify-center space-x-1.5 disabled:opacity-75"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Factory</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
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
            
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-150 text-[11px] text-gray-500 leading-normal text-center space-y-2">
              <span className="font-bold text-gray-600 uppercase tracking-wider block font-mono text-[10px]">1-Click Quick Demo Access</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, email: 'bishal@factory.com', password: 'password123' }));
                    login('bishal@factory.com', 'password123', true).then(res => {
                      if (res.success) onNavigate('dashboard');
                    });
                  }}
                  className="py-2 px-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-primary-blue text-primary-blue rounded-lg font-bold text-xs transition shadow-xs flex flex-col items-center"
                >
                  <span className="text-[10px] uppercase font-mono text-gray-400">Freelancer</span>
                  <span>Bishal Shrestha</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, email: 'suresh@synergy.com', password: 'password123' }));
                    login('suresh@synergy.com', 'password123', true).then(res => {
                      if (res.success) onNavigate('dashboard');
                    });
                  }}
                  className="py-2 px-2 bg-white hover:bg-orange-50 border border-gray-200 hover:border-secondary-orange text-secondary-orange rounded-lg font-bold text-xs transition shadow-xs flex flex-col items-center"
                >
                  <span className="text-[10px] uppercase font-mono text-gray-400">Client</span>
                  <span>Suresh Maharjan</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* SCREEN 3: REGISTRATION FLOW */
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
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Full Name</label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-3.5 w-4 h-4 text-gray-300" />
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="e.g. Ramesh Paudel"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-300" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-300" />
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="+977 9800000000"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="At least 6 chars"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Confirm</label>
                <input
                  type="password"
                  name="confirm_password"
                  required
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  placeholder="Re-enter password"
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
              disabled={submitting}
              className="w-full py-3.5 bg-secondary-orange hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition shadow flex items-center justify-center space-x-1.5 disabled:opacity-75"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Send Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
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
