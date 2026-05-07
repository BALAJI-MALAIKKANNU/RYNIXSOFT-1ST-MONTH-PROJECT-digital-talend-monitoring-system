import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { auth } from '../lib/firebase';
import { socket } from '../lib/socket';
import { Send } from 'lucide-react';
import Button from '../components/ui/Button';

const Messages = () => {
  const [contacts, setContacts] = useState([]);
  const [currentUserMongoId, setCurrentUserMongoId] = useState(null);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const allUsers = res.data;
        const me = allUsers.find(u => u.firebaseUid === auth.currentUser.uid);
        setCurrentUserMongoId(me._id);
        
        // Admins see all users. Users see only Admins.
        const visibleContacts = me.role === 'admin' 
          ? allUsers.filter(u => u._id !== me._id)
          : allUsers.filter(u => u.role === 'admin' && u._id !== me._id);
          
        setContacts(visibleContacts);
      } catch (err) {
        console.error("Failed to load contacts", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeContact) return;
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/messages/${activeContact._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    fetchMessages();
  }, [activeContact]);

  useEffect(() => {
    const handleReceive = (msg) => {
      if (activeContact && (msg.sender._id === activeContact._id || msg.sender === activeContact._id)) {
        setMessages(prev => [...prev, msg]);
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    };
    socket.on('receive_message', handleReceive);
    return () => socket.off('receive_message', handleReceive);
  }, [activeContact]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;
    
    const token = await auth.currentUser.getIdToken();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/messages`, {
        receiverId: activeContact._id,
        content: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  if (loading) return <div className="w-full h-[60vh] flex items-center justify-center"><div className="loader"></div></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-[calc(100vh-120px)] flex bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/30">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-brand">Messages</h2>
          <p className="text-xs text-muted">Real-time communication</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map(contact => (
            <div 
              key={contact._id} 
              onClick={() => setActiveContact(contact)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors flex items-center gap-3 ${activeContact?._id === contact._id ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase shrink-0">
                {contact.fullName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-semibold text-brand text-sm truncate">{contact.fullName}</h4>
                <p className="text-xs text-muted capitalize">{contact.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 flex flex-col bg-[#F8FAFC]">
        {activeContact ? (
          <>
            <div className="p-4 bg-white border-b border-gray-100 shadow-sm flex items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase">
                {activeContact.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-brand">{activeContact.fullName}</h3>
                <p className="text-xs text-green-500 font-medium">Online</p>
              </div>
            </div>
            
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.map((msg, i) => {
                const isMe = typeof msg.sender === 'object' ? msg.sender._id === currentUserMongoId : msg.sender === currentUserMongoId;
                return (
                  <div key={msg._id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'}`}>
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 h-11 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm"
              />
              <Button type="submit" className="h-11 w-11 !p-0 flex items-center justify-center shrink-0">
                <Send size={18} className="ml-1" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Send size={32} className="text-gray-300" />
            </div>
            <p>Select a contact to start messaging</p>
          </div>
        )}
      </div>

    </motion.div>
  );
};

export default Messages;
