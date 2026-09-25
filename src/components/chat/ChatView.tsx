/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, Search, MessagesSquare, CheckCheck, User, MessageCircle, AlertCircle } from 'lucide-react';

interface ChatViewProps {
  onNavigate: (page: string, params?: any) => void;
  otherUserId?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ onNavigate, otherUserId }) => {
  const { messages, users, currentUser, sendMessage } = useApp();

  if (!currentUser) {
    onNavigate('auth');
    return null;
  }

  // Active selection
  const [selectedUserId, setSelectedUserId] = useState<string | null>(otherUserId || null);
  const [typedMessage, setTypedMessage] = useState('');
  const [searchContact, setSearchContact] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Derive distinct contacts based on direct messages
  const chatUsers = useMemoUsers();

  function useMemoUsers() {
    // Collect all user IDs who have chatted with the currentUser
    const chatterIds = new Set<string>();
    messages.forEach(m => {
      if (m.sender_id === currentUser?.user_id) {
        chatterIds.add(m.receiver_id);
      } else if (m.receiver_id === currentUser?.user_id) {
        chatterIds.add(m.sender_id);
      }
    });

    // Make sure otherUserId is in the side channel list if passed
    if (otherUserId) {
      chatterIds.add(otherUserId);
    }

    return users.filter(u => chatterIds.has(u.user_id) && u.user_id !== currentUser?.user_id);
  }

  // Pick first contact if none selected
  useEffect(() => {
    if (!selectedUserId && chatUsers.length > 0) {
      setSelectedUserId(chatUsers[0].user_id);
    }
  }, [chatUsers, selectedUserId]);

  const activeContact = users.find(u => u.user_id === selectedUserId);

  // Active messages thread
  const activeThread = messages.filter(m => 
    (m.sender_id === currentUser.user_id && m.receiver_id === selectedUserId) ||
    (m.sender_id === selectedUserId && m.receiver_id === currentUser.user_id)
  );

  // Scroll to bottom
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedUserId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage || !selectedUserId) return;

    sendMessage(selectedUserId, typedMessage);
    const content = typedMessage;
    setTypedMessage('');

    // Trigger AI simulated response auto reply after 1.5 seconds!
    setTimeout(() => {
      // Pick random simulated responses based on category/freelancer roles
      const responses = [
        `Thanks for the update! I am checking the deliverables folder now.`,
        `Got it. I will expedite the tasks and upload code results to the escrow workspace shortly.`,
        `That sounds perfect. Let me refine the design specifications to align accordingly.`,
        `Excellent! Could you review the job detailed milestones so I can begin drafting codes?`,
        `I have synchronized my browser tab and verified the deposit in the escrow. Working diligently!`
      ];
      const randomMsg = responses[Math.floor(Math.random() * responses.length)];
      
      // Send message back
      sendMessage(currentUser.user_id, randomMsg, selectedUserId);
    }, 1500);
  };

  const filteredContacts = chatUsers.filter(u => 
    u.full_name.toLowerCase().includes(searchContact.toLowerCase())
  );

  return (
    <div className="bg-white min-h-[calc(100vh-80px)] flex border-t border-gray-150">
      
      {/* SIDEBAR THREAD INDEX column */}
      <div className="w-full sm:w-80 border-r border-gray-150 flex flex-col justify-between shrink-0">
        
        {/* Contact list search */}
        <div className="p-4 border-b border-gray-100 space-y-3 text-left">
          <h3 className="text-sm font-bold text-gray-950 heading-font uppercase font-mono tracking-wider">Inbox Messenger</h3>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-300" />
            <input
              type="text"
              value={searchContact}
              onChange={e => setSearchContact(e.target.value)}
              placeholder="Filter contacts..."
              className="w-full pl-9 pr-3 py-2 border border-gray-150 rounded-lg text-xs"
            />
          </div>
        </div>

        {/* Contact listing container */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {filteredContacts.length === 0 ? (
            <div className="py-12 text-center text-gray-400 space-y-1">
              <MessagesSquare className="w-8 h-8 mx-auto text-gray-300" />
              <p className="text-xs font-semibold">No active conversations found</p>
            </div>
          ) : (
            filteredContacts.map(contact => {
              const isSelected = contact.user_id === selectedUserId;
              
              // Get last message text in thread
              const thread = messages.filter(m => 
                (m.sender_id === currentUser.user_id && m.receiver_id === contact.user_id) ||
                (m.sender_id === contact.user_id && m.receiver_id === currentUser.user_id)
              );
              const lastMsg = thread[thread.length - 1];

              return (
                <div 
                  key={contact.user_id}
                  onClick={() => setSelectedUserId(contact.user_id)}
                  className={`p-4 flex items-start space-x-3 cursor-pointer transition select-none ${
                    isSelected ? 'bg-blue-50/40 text-primary-blue' : 'hover:bg-gray-50'
                  }`}
                >
                  <img
                    src={contact.profile_photo_url}
                    alt={contact.full_name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-150"
                  />
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{contact.full_name}</h4>
                      <span className="text-[9px] text-gray-400 font-mono">Real-time</span>
                    </div>
                    <p className="text-[11px] text-gray-450 mt-1 truncate font-medium">
                      {lastMsg ? lastMsg.message_text : `Initiate custom contract interview...`}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Info panel */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-450 leading-relaxed font-semibold text-left">
          <span>💡 Real-time synchronization is active! Other tabs will auto-sync instantly.</span>
        </div>

      </div>

      {/* ACTIVE MESSAGE LOGS COLUMN */}
      <div className="flex-1 flex flex-col justify-between bg-gray-50/20">
        
        {activeContact ? (
          <>
            {/* THREAD CONTAINER HEADER */}
            <div className="bg-white border-b border-gray-150 px-6 py-4 flex items-center justify-between text-left">
              <div className="flex items-center space-x-3">
                <img
                  src={activeContact.profile_photo_url}
                  alt={activeContact.full_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 heading-font">{activeContact.full_name}</h3>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
                    <span className="text-[10px] text-gray-450 uppercase font-mono font-semibold">Active simulated bot responder</span>
                  </div>
                </div>
              </div>

              <div className="hidden sm:block">
                <button
                  onClick={() => {
                    if (activeContact.role === 'freelancer') {
                      onNavigate('freelancer_profile', { userId: activeContact.user_id });
                    } else {
                      onNavigate('client_profile', { userId: activeContact.user_id });
                    }
                  }}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-150 rounded text-[11px] font-bold text-gray-600 transition"
                >
                  View Profile card
                </button>
              </div>
            </div>

            {/* MESSAGES LIST BOX */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {activeThread.length === 0 && (
                <div className="py-12 text-center text-gray-450 space-y-2">
                  <MessageCircle className="w-10 h-10 text-gray-300 mx-auto" />
                  <p className="text-xs font-semibold">Start the negotiation conversation!</p>
                  <p className="text-[10px] text-gray-400">Introduce your scope, timelines, or ask about skill capabilities.</p>
                </div>
              )}

              {activeThread.map((msg) => {
                const isSentByMe = msg.sender_id === currentUser.user_id;
                return (
                  <div 
                    key={msg.message_id} 
                    className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                  >
                    <div className="max-w-sm sm:max-w-md text-left">
                      <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm font-medium ${
                        isSentByMe 
                          ? 'bg-primary-blue text-white rounded-tr-none' 
                          : 'bg-white border border-gray-150 text-gray-800 rounded-tl-none'
                      }`}>
                        {msg.message_text}
                      </div>
                      <div className={`flex items-center space-x-1.5 text-[9px] mt-1.5 ${isSentByMe ? 'justify-end text-primary-blue' : 'justify-start text-gray-400'}`}>
                        <span className="font-mono font-semibold">Real-time</span>
                        {isSentByMe && <CheckCheck className="w-3.5 h-3.5 text-[#10B981]" />}
                      </div>
                    </div>
                  </div>
                );
              })}

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
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-primary-blue hover:bg-blue-950 text-white rounded-lg transition shrink-0 flex items-center justify-center shadow"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center p-6 text-gray-400 space-y-2">
            <MessagesSquare className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold heading-font">No active messaging chat chosen</h3>
            <p className="text-xs text-gray-400">Select a contact profile thumbnail on the left sidebar list to write and review conversation history.</p>
          </div>
        )}

      </div>

    </div>
  );
};
