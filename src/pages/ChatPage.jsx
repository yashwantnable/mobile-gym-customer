import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, Search, Paperclip, Smile } from 'lucide-react';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  const trainers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      specialization: 'HIIT & Cardio',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      online: true,
      lastMessage: 'Great session today! Keep up the good work 💪',
      lastMessageTime: '2 min ago',
      unreadCount: 2
    },
    {
      id: 2,
      name: 'Mike Chen',
      specialization: 'Strength Training',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
      online: true,
      lastMessage: 'Remember to focus on your form during deadlifts',
      lastMessageTime: '1 hour ago',
      unreadCount: 0
    },
    {
      id: 3,
      name: 'Emma Davis',
      specialization: 'Yoga & Flexibility',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100',
      online: false,
      lastMessage: 'See you at tomorrow\'s yoga session!',
      lastMessageTime: '2 days ago',
      unreadCount: 0
    },
    {
      id: 4,
      name: 'Alex Rodriguez',
      specialization: 'Functional Training',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
      online: false,
      lastMessage: 'Thanks for the feedback on the workout!',
      lastMessageTime: '1 week ago',
      unreadCount: 0
    }
  ];

  const chatMessages = {
    1: [
      {
        id: 1,
        senderId: 1,
        senderName: 'Sarah Johnson',
        message: 'Hi! How are you feeling after today\'s HIIT session?',
        timestamp: '10:30 AM',
        isTrainer: true
      },
      {
        id: 2,
        senderId: 'user',
        senderName: 'You',
        message: 'I\'m feeling great! A bit tired but energized at the same time 😊',
        timestamp: '10:32 AM',
        isTrainer: false
      },
      {
        id: 3,
        senderId: 1,
        senderName: 'Sarah Johnson',
        message: 'That\'s exactly how you should feel! Your performance has really improved over the past few weeks.',
        timestamp: '10:33 AM',
        isTrainer: true
      },
      {
        id: 4,
        senderId: 'user',
        senderName: 'You',
        message: 'Thank you! I can definitely feel myself getting stronger. What should I focus on for next session?',
        timestamp: '10:35 AM',
        isTrainer: false
      },
      {
        id: 5,
        senderId: 1,
        senderName: 'Sarah Johnson',
        message: 'Great question! Let\'s work on increasing the intensity a bit and maybe add some burpees to challenge your endurance.',
        timestamp: '10:36 AM',
        isTrainer: true
      },
      {
        id: 6,
        senderId: 1,
        senderName: 'Sarah Johnson',
        message: 'Great session today! Keep up the good work 💪',
        timestamp: '2 min ago',
        isTrainer: true
      }
    ],
    2: [
      {
        id: 1,
        senderId: 2,
        senderName: 'Mike Chen',
        message: 'Hey! I noticed you were struggling a bit with the deadlift form today.',
        timestamp: '2:00 PM',
        isTrainer: true
      },
      {
        id: 2,
        senderId: 'user',
        senderName: 'You',
        message: 'Yeah, I felt like I wasn\'t quite getting it right. Any tips?',
        timestamp: '2:02 PM',
        isTrainer: false
      },
      {
        id: 3,
        senderId: 2,
        senderName: 'Mike Chen',
        message: 'Remember to focus on your form during deadlifts. Keep your back straight, engage your core, and drive through your heels.',
        timestamp: '1 hour ago',
        isTrainer: true
      }
    ]
  };

  const filteredTrainers = trainers.filter(trainer =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, chatMessages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: '600px' }}>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Trainers</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search trainers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Trainers List */}
            <div className="flex-1 overflow-y-auto">
              {filteredTrainers.map(trainer => (
                <div
                  key={trainer.id}
                  onClick={() => setSelectedChat(trainer.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedChat === trainer.id ? 'bg-primary-50 border-primary-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={trainer.avatar}
                        alt={trainer.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {trainer.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {trainer.name}
                        </h3>
                        {trainer.unreadCount > 0 && (
                          <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {trainer.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{trainer.specialization}</p>
                      <p className="text-sm text-gray-600 truncate">{trainer.lastMessage}</p>
                      <p className="text-xs text-gray-400 mt-1">{trainer.lastMessageTime}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={trainers.find(t => t.id === selectedChat)?.avatar}
                        alt={trainers.find(t => t.id === selectedChat)?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {trainers.find(t => t.id === selectedChat)?.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {trainers.find(t => t.id === selectedChat)?.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {trainers.find(t => t.id === selectedChat)?.specialization}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Video className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages[selectedChat]?.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.isTrainer ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isTrainer
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-primary-600 text-white'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.isTrainer ? 'text-gray-500' : 'text-primary-100'
                          }`}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                      />
                      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <Smile className="h-5 w-5" />
                      </button>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Select a trainer to start chatting</h3>
                  <p className="text-gray-500">Choose from your trainers on the left to begin a conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;