/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { insforge } from '../../lib/insforge';
import { User as UserType } from '../../types';
import { 
  Send, Search, MessagesSquare, CheckCheck, User, MessageCircle, 
  UserPlus, Briefcase, ArrowRight, ShieldCheck, Clock, X, Check, Star, CheckCircle2
} from 'lucide-react';

interface ChatViewProps {
  onNavigate: (page: string, params?: any) => void;
  otherUserId?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ onNavigate, otherUserId }) => {
  const { messages, users, currentUser, sendMessage, submitReview, postJob } = useApp();

  if (!currentUser) {
    onNavigate('auth');
    return null;
  }

  // Active selection
  const [selectedUserId, setSelectedUserId] = useState<string | null>(otherUserId || null);
  const [typedMessage, setTypedMessage] = useState('');
  const [searchContact, setSearchContact] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [hireOffer, setHireOffer] = useState({ title: '', budget: '150', description: '' });
  const [hireSuccessNotice, setHireSuccessNotice] = useState<string | null>(null);
  const [hireErrorNotice, setHireErrorNotice] = useState<string | null>(null);

  // Review Crew Modal in Chat
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmittedSuccess, setReviewSubmittedSuccess] = useState(false);

  // Database fallback for deep-linked contacts like Alex Cooper
  const [dbFetchedUser, setDbFetchedUser] = useState<UserType | null>(null);

  const messageEndRef = useRef<HTMLDivElement>(null);

  // Sync selectedUserId when otherUserId prop changes or deep-linked
  useEffect(() => {
    if (otherUserId) {
      setSelectedUserId(otherUserId);
    }
  }, [otherUserId]);

  // Query database if selected user is not yet in users state
  useEffect(() => {
    if (selectedUserId && !users.some(u => u.user_id === selectedUserId)) {
      insforge.database.from('users').select('*').eq('user_id', selectedUserId).maybeSingle().then(res => {
        if (res.data) {
          setDbFetchedUser(res.data as UserType);
        }
      }, (err) => {
        console.warn('Could not fetch user from DB:', err);
      });
    }
  }, [selectedUserId, users]);

  // Derive all contacts who have exchanged messages with currentUser
  const chatUsers = useMemo(() => {
    const chatterIds = new Set<string>();
    messages.forEach(m => {
      if (m.sender_id === currentUser.user_id) {
        chatterIds.add(m.receiver_id);
      } else if (m.receiver_id === currentUser.user_id) {
        chatterIds.add(m.sender_id);
      }
    });

    if (otherUserId) {
      chatterIds.add(otherUserId);
    }
    if (selectedUserId) {
      chatterIds.add(selectedUserId);
    }

    const allCandidateUsers = [...users];
    if (dbFetchedUser && !allCandidateUsers.some(u => u.user_id === dbFetchedUser.user_id)) {
      allCandidateUsers.push(dbFetchedUser);
    }

    const list = allCandidateUsers.filter(u => chatterIds.has(u.user_id) && u.user_id !== currentUser.user_id);
    if (list.length === 0) {
      // Suggest contacts with opposite role prioritized so user can immediately chat
      const suggestions = allCandidateUsers.filter(u => u.user_id !== currentUser.user_id);
      suggestions.sort((a, b) => (a.role !== currentUser.role ? -1 : 1));
      return suggestions.slice(0, 6);
    }
    return list;
  }, [messages, users, dbFetchedUser, currentUser.user_id, otherUserId, selectedUserId]);

  // Pick first contact if none selected
  useEffect(() => {
    if (!selectedUserId && chatUsers.length > 0) {
      setSelectedUserId(chatUsers[0].user_id);
    }
  }, [chatUsers, selectedUserId]);

  const activeContact = users.find(u => u.user_id === selectedUserId) || dbFetchedUser;

  // Active messages thread between currentUser and selectedUserId
  const activeThread = useMemo(() => {
    if (!selectedUserId) return [];
    return messages.filter(m => 
      (m.sender_id === currentUser.user_id && m.receiver_id === selectedUserId) ||
      (m.sender_id === selectedUserId && m.receiver_id === currentUser.user_id)
    ).sort((a, b) => new Date(a.timestamp || a.created_at || 0).getTime() - new Date(b.timestamp || b.created_at || 0).getTime());
  }, [messages, currentUser.user_id, selectedUserId]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThread, selectedUserId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = typedMessage.trim();
    if (!content || !selectedUserId || isSending) return;

    setIsSending(true);
    setTypedMessage('');

    try {
      sendMessage(selectedUserId, content);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateDirectHire = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !activeContact) return;

    try {
      const budgetNum = parseFloat(hireOffer.budget) || 150;
      // 1. Create direct project offer with valid columns
      const newJob = postJob({
        title: hireOffer.title.trim() || `Direct Contract with ${activeContact.full_name}`,
        description: hireOffer.description.trim() || `Direct project contract initiated on FreelanceFactory workspace. Scope agreed with client.`,
        category: 'Software Development',
        budget: budgetNum,
        budget_type: 'fixed',
        job_type: 'one-time',
        deadline: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
        status: 'posted',
        visibility: 'invite-only',
        attachments: [],
        invited_freelancers: [selectedUserId],
        skills_required: ['Communication', 'Deliverable Execution']
      });

      // 2. Automatically dispatch offer notification message into the chat thread
      sendMessage(
        selectedUserId, 
        `🤝 CONTRACT OFFER INITIATED: I have created a contract offer "${newJob.title}" for $${budgetNum}. Let's work together!`
      );

      setHireSuccessNotice(`Contract proposal sent to ${activeContact.full_name}! Check your active workspace.`);
      setTimeout(() => {
        setShowHireModal(false);
        setHireSuccessNotice(null);
        setHireErrorNotice(null);
        setHireOffer({ title: '', budget: '150', description: '' });
      }, 1500);
    } catch (err: any) {
      setHireErrorNotice(err.message || 'Could not initiate contract.');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !reviewComment.trim()) return;

    try {
      await submitReview('direct_review', selectedUserId, reviewRating, reviewComment.trim());
      setReviewSubmittedSuccess(true);
      setReviewComment('');
      setTimeout(() => {
        setShowReviewModal(false);
        setReviewSubmittedSuccess(false);
      }, 1800);
    } catch (err) {
      console.error('Failed to submit review from chat:', err);
    }
  };

  const filteredContacts = chatUsers.filter(u => 
    u.full_name.toLowerCase().includes(searchContact.toLowerCase())
  );

  // Available users to start new conversation with
  const availableToChat = useMemo(() => {
    return users.filter(u => u.user_id !== currentUser.user_id);
  }, [users, currentUser.user_id]);

  return (
    <div className="bg-white min-h-[calc(100vh-80px)] flex flex-col md:flex-row border-t border-gray-150 relative">
      
      {/* SIDEBAR THREAD INDEX COLUMN */}
      <div className="w-full md:w-80 border-r border-gray-150 flex flex-col justify-between shrink-0 bg-white">
        
        {/* Contact list search & header */}
        <div className="p-4 border-b border-gray-100 space-y-3 text-left">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-950 heading-font uppercase font-mono tracking-wider">
              Inbox Messages
            </h3>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="px-2.5 py-1 bg-primary-blue hover:bg-blue-950 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1"
              title="Start new conversation"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New Chat</span>
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-300" />
            <input
              type="text"
              value={searchContact}
              onChange={e => setSearchContact(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition"
            />
          </div>
        </div>

        {/* Contact listing container */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {filteredContacts.length === 0 ? (
            <div className="py-12 px-4 text-center text-gray-400 space-y-2">
              <MessagesSquare className="w-8 h-8 mx-auto text-gray-300" />
              <p className="text-xs font-semibold text-gray-600">No active conversations</p>
              <p className="text-[11px] text-gray-400">Click "New Chat" above to message any talent or client directly.</p>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="mt-2 inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-xs font-bold transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Select Contact</span>
              </button>
            </div>
          ) : (
            filteredContacts.map(contact => {
              const isSelected = contact.user_id === selectedUserId;
              
              const thread = messages.filter(m => 
                (m.sender_id === currentUser.user_id && m.receiver_id === contact.user_id) ||
                (m.sender_id === contact.user_id && m.receiver_id === currentUser.user_id)
              ).sort((a, b) => new Date(a.timestamp || a.created_at || 0).getTime() - new Date(b.timestamp || b.created_at || 0).getTime());
              
              const lastMsg = thread[thread.length - 1];

              return (
                <div 
                  key={contact.user_id}
                  onClick={() => setSelectedUserId(contact.user_id)}
                  className={`p-3.5 flex items-start space-x-3 cursor-pointer transition select-none ${
                    isSelected ? 'bg-blue-50/60 border-l-4 border-primary-blue text-primary-blue' : 'hover:bg-gray-50'
                  }`}
                >
                  <img
                    src={contact.profile_photo_url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`}
                    alt={contact.full_name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                  />
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{contact.full_name}</h4>
                      <span className="text-[9px] uppercase font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        {contact.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 truncate font-medium">
                      {lastMsg ? (lastMsg.text || (lastMsg as any).message_text || 'Active conversation') : `Start conversation...`}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info panel */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-500 leading-relaxed font-semibold text-left flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Real-time cloud synced via InsForge database.</span>
        </div>

      </div>

      {/* ACTIVE MESSAGE LOGS COLUMN */}
      <div className="flex-1 flex flex-col justify-between bg-gray-50/30">
        
        {activeContact ? (
          <>
            {/* THREAD HEADER */}
            <div className="bg-white border-b border-gray-150 px-6 py-3.5 flex items-center justify-between text-left">
              <div className="flex items-center space-x-3">
                <img
                  src={activeContact.profile_photo_url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`}
                  alt={activeContact.full_name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 heading-font flex items-center gap-1.5">
                    <span>{activeContact.full_name}</span>
                    <span className="text-[10px] font-mono uppercase bg-blue-50 text-primary-blue px-2 py-0.5 rounded font-bold">
                      {activeContact.role}
                    </span>
                  </h3>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-[10px] text-gray-500 font-mono">Available for discussion</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {currentUser.role === 'client' && activeContact.role === 'freelancer' && (
                  <>
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                      title="Leave a star review for this crew member"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="hidden sm:inline">Review Crew</span>
                    </button>

                    <button
                      onClick={() => setShowHireModal(true)}
                      className="px-3.5 py-1.5 bg-secondary-orange hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 shadow-sm"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Hire Talent</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    if (activeContact.role === 'freelancer') {
                      onNavigate('freelancer_profile', { userId: activeContact.user_id });
                    } else {
                      onNavigate('client_profile', { userId: activeContact.user_id });
                    }
                  }}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 transition"
                >
                  View Profile
                </button>
              </div>
            </div>

            {/* MESSAGES LIST BOX */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              
              {activeThread.length === 0 ? (
                <div className="py-16 text-center text-gray-400 space-y-2">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-sm font-bold text-gray-700">Start the conversation with {activeContact.full_name}!</p>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Discuss project scope, request a portfolio demonstration, or arrange working terms safely.
                  </p>
                </div>
              ) : (
                activeThread.map((msg) => {
                  const isSentByMe = msg.sender_id === currentUser.user_id;
                  const messageBody = msg.text || (msg as any).message_text || '';
                  const timeFormatted = new Date(msg.timestamp || msg.created_at || Date.now()).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });

                  return (
                    <div 
                      key={msg.message_id} 
                      className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                    >
                      <div className="max-w-xs sm:max-w-md text-left">
                        <div className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm font-medium ${
                          isSentByMe 
                            ? 'bg-primary-blue text-white rounded-tr-none' 
                            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                        }`}>
                          {messageBody}
                        </div>
                        <div className={`flex items-center space-x-1.5 text-[10px] mt-1 text-gray-400 ${
                          isSentByMe ? 'justify-end' : 'justify-start'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>{timeFormatted}</span>
                          {isSentByMe && <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              <div ref={messageEndRef} />
            </div>

            {/* MESSAGE ENTRY BAR */}
            <div className="bg-white border-t border-gray-150 p-4">
              <form onSubmit={handleSend} className="flex space-x-2">
                <input
                  type="text"
                  required
                  value={typedMessage}
                  onChange={e => setTypedMessage(e.target.value)}
                  placeholder={`Write your secure message to ${activeContact.full_name}...`}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition"
                />
                <button
                  type="submit"
                  disabled={!typedMessage.trim() || isSending}
                  className="px-5 py-3 bg-primary-blue hover:bg-blue-950 text-white rounded-xl transition shrink-0 flex items-center justify-center shadow disabled:opacity-50 font-bold text-xs"
                >
                  <Send className="w-4 h-4 mr-1.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center p-6 text-gray-400 space-y-3">
            <MessagesSquare className="w-14 h-14 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-800 heading-font">Select a conversation</h3>
            <p className="text-xs text-gray-500 max-w-sm text-center">
              Choose a contact from the left sidebar or click below to start a chat with Alex Cooper or any expert.
            </p>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="px-4 py-2 bg-primary-blue hover:bg-blue-950 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow"
            >
              <UserPlus className="w-4 h-4" />
              <span>Choose Person to Chat With</span>
            </button>
          </div>
        )}

      </div>

      {/* MODAL 1: START NEW CHAT MODAL */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-150 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 heading-font uppercase font-mono tracking-wider">
                Start a New Conversation
              </h3>
              <button 
                onClick={() => setShowNewChatModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Select any registered freelancer or client to start a direct message thread:
            </p>

            <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 border border-gray-100 rounded-xl">
              {availableToChat.map(u => (
                <div 
                  key={u.user_id}
                  onClick={() => {
                    setSelectedUserId(u.user_id);
                    setShowNewChatModal(false);
                  }}
                  className="p-3 flex items-center justify-between hover:bg-blue-50/50 cursor-pointer transition"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={u.profile_photo_url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`}
                      alt={u.full_name}
                      className="w-9 h-9 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <div className="text-xs font-bold text-gray-900">{u.full_name}</div>
                      <div className="text-[10px] text-gray-400 capitalize">{u.role} • {u.location || 'Nepal'}</div>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="text-xs font-bold text-primary-blue bg-blue-50 px-2.5 py-1 rounded hover:bg-blue-100 transition"
                  >
                    Chat
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowNewChatModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DIRECT HIRE CONTRACT MODAL */}
      {showHireModal && activeContact && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-150 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900 heading-font uppercase font-mono tracking-wider">
                  Hire {activeContact.full_name}
                </h3>
                <p className="text-xs text-gray-500">Initiate a direct escrow milestone offer</p>
              </div>
              <button 
                onClick={() => setShowHireModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {hireSuccessNotice ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{hireSuccessNotice}</span>
              </div>
            ) : (
              <form onSubmit={handleCreateDirectHire} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-mono">
                    Contract / Project Title
                  </label>
                  <input
                    type="text"
                    required
                    value={hireOffer.title}
                    onChange={e => setHireOffer(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Website Frontend Redesign & Brand Assets"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-mono">
                    Project Escrow Budget ($ USD)
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={hireOffer.budget}
                    onChange={e => setHireOffer(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="150"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue font-bold text-primary-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 font-mono">
                    Job Requirements / Scope Details
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={hireOffer.description}
                    onChange={e => setHireOffer(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={`Describe what you need ${activeContact.full_name} to build, deliverables, and timelines...`}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue"
                  />
                </div>

                <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-[11px] text-blue-800 space-y-1">
                  <div className="font-bold flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary-blue" />
                    <span>Escrow Payment Protection</span>
                  </div>
                  <p>Funds remain securely locked until deliverables are submitted and you confirm satisfaction.</p>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowHireModal(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition"
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

      {/* MODAL 3: REVIEW CREW MEMBER MODAL */}
      {showReviewModal && activeContact && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-150 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900 heading-font uppercase font-mono tracking-wider">
                  Review Crew: {activeContact.full_name}
                </h3>
                <p className="text-xs text-gray-400">Share your verified collaboration rating & feedback</p>
              </div>
              <button 
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewSubmittedSuccess(false);
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
                  Your feedback and star rating have been added to {activeContact.full_name}'s verified crew profile.
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
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
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
                        className="p-1 focus:outline-none transition hover:scale-110"
                      >
                        <Star 
                          className={`w-7 h-7 ${
                            starNum <= reviewRating
                              ? 'text-amber-400 fill-amber-400' 
                              : 'text-gray-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-bold text-gray-700 ml-2">
                      {reviewRating} out of 5 stars
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
                    placeholder={`Describe your collaboration with ${activeContact.full_name} (responsiveness, deliverable quality, technical skills)...`}
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

    </div>
  );
};
