import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { auth } from '../lib/firebase';
import { socket } from '../lib/socket';
import { Send, Check, CheckCheck, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { toast } from 'react-hot-toast';

const Messages = () => {
  const [contacts, setContacts] = useState([]);
  const [currentUserMongoId, setCurrentUserMongoId] = useState(null);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

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

        // Fetch unread counts
        const unreadRes = await axios.get(`${import.meta.env.VITE_API_URL}/messages/unread/count`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnreadCounts(unreadRes.data);

      } catch (err) {
        console.error("Failed to load contacts", err);
      } finally {
        setLoading(false);
      }
    };
    init();

    socket.on('online_users', (users) => setOnlineUsers(users));
    
    return () => socket.off('online_users');
  }, []);

  const markAsRead = async (contactId) => {
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.put(`${import.meta.env.VITE_API_URL}/messages/${contactId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCounts(prev => ({ ...prev, [contactId]: 0 }));
      setMessages(prev => prev.map(m => (!m.read && m.sender === contactId) ? { ...m, read: true } : m));
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

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
        
        // Mark as read upon opening chat
        if (unreadCounts[activeContact._id] > 0 || res.data.some(m => !m.read && (m.sender._id === activeContact._id || m.sender === activeContact._id))) {
          markAsRead(activeContact._id);
        }
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
        // Mark read immediately if chat is open
        markAsRead(activeContact._id);
      } else {
        // Increment unread count for the sender
        const senderId = msg.sender._id || msg.sender;
        setUnreadCounts(prev => ({ ...prev, [senderId]: (prev[senderId] || 0) + 1 }));
      }
    };

    const handleRead = ({ readerId }) => {
      if (activeContact && activeContact._id === readerId) {
        setMessages(prev => prev.map(m => m.read ? m : { ...m, read: true }));
      }
    };

    const handleDelete = (msgId) => {
      setMessages(prev => prev.map(m => m._id === msgId ? { ...m, isDeleted: true, content: '🚫 This message was deleted' } : m));
    };

    const handleTyping = ({ senderId }) => {
      if (activeContact && activeContact._id === senderId) setIsTyping(true);
    };

    const handleStopTyping = ({ senderId }) => {
      if (activeContact && activeContact._id === senderId) setIsTyping(false);
    };

    socket.on('receive_message', handleReceive);
    socket.on('messages_read', handleRead);
    socket.on('message_deleted', handleDelete);
    socket.on('user_typing', handleTyping);
    socket.on('user_stop_typing', handleStopTyping);

    return () => {
      socket.off('receive_message', handleReceive);
      socket.off('messages_read', handleRead);
      socket.off('message_deleted', handleDelete);
      socket.off('user_typing', handleTyping);
      socket.off('user_stop_typing', handleStopTyping);
    };
  }, [activeContact]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    if (activeContact) {
      socket.emit('typing', { senderId: currentUserMongoId, receiverId: activeContact._id });
      
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', { senderId: currentUserMongoId, receiverId: activeContact._id });
      }, 1500);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;
    
    const token = await auth.currentUser.getIdToken();
    try {
      socket.emit('stop_typing', { senderId: currentUserMongoId, receiverId: activeContact._id });
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

  const deleteMessage = async (msgId) => {
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.delete(`${import.meta.env.VITE_API_URL}/messages/${msgId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(prev => prev.map(m => m._id === msgId ? { ...m, isDeleted: true, content: '🚫 This message was deleted' } : m));
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  if (loading) return <div className="w-full h-[60vh] flex items-center justify-center"><div className="loader"></div></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-[calc(100vh-120px)] flex bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      
      {/* Sidebar */}
      <div className={`border-r border-gray-100 flex-col bg-gray-50/30 w-full md:w-80 shrink-0 ${activeContact ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-brand">Messages</h2>
          <p className="text-xs text-muted">Real-time communication</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map(contact => {
            const isOnline = onlineUsers.includes(contact._id);
            const unreadCount = unreadCounts[contact._id] || 0;
            return (
              <div 
                key={contact._id} 
                onClick={() => setActiveContact(contact)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors flex items-center gap-3 relative ${activeContact?._id === contact._id ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase shrink-0">
                    {contact.fullName.charAt(0)}
                  </div>
                  {isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                </div>
                <div className="overflow-hidden flex-1">
                  <h4 className="font-semibold text-brand text-sm truncate">{contact.fullName}</h4>
                  <p className="text-xs text-muted capitalize">{contact.role}</p>
                </div>
                {unreadCount > 0 && (
                  <div className="w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-col bg-[#F8FAFC] flex-1 ${!activeContact ? 'hidden md:flex' : 'flex'}`}>
        {activeContact ? (
          <>
            <div className="p-4 bg-white border-b border-gray-100 shadow-sm flex items-center gap-3 z-10 shrink-0">
              <button onClick={() => setActiveContact(null)} className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase shrink-0">
                {activeContact.fullName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-brand truncate">{activeContact.fullName}</h3>
                {isTyping ? (
                  <p className="text-xs text-indigo-500 font-medium italic animate-pulse">typing...</p>
                ) : (
                  <p className={`text-xs font-medium ${onlineUsers.includes(activeContact._id) ? 'text-green-500' : 'text-gray-400'}`}>
                    {onlineUsers.includes(activeContact._id) ? 'Online' : 'Offline'}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.map((msg, i) => {
                const isMe = typeof msg.sender === 'object' ? msg.sender._id === currentUserMongoId : msg.sender === currentUserMongoId;
                return (
                  <div key={msg._id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}>
                    <div className="flex items-center gap-2 max-w-full">
                      {isMe && !msg.isDeleted && (
                        <button onClick={() => deleteMessage(msg._id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity rounded-full hover:bg-gray-100 shrink-0">
                          <Trash2 size={14} />
                        </button>
                      )}
                      <div className={`max-w-[85%] md:max-w-[70%] p-3 rounded-2xl text-sm shadow-sm break-words ${msg.isDeleted ? 'bg-gray-100 text-gray-400 italic' : isMe ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'}`}>
                        {msg.content}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      {isMe && !msg.isDeleted && (
                        msg.read ? <CheckCheck size={14} className="text-blue-500" /> : <Check size={14} className="text-gray-400" />
                      )}
                    </div>
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
                onChange={handleInputChange}
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
