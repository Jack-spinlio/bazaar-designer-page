
import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  MoreVertical, 
  Bell, 
  Send, 
  FileText, 
  Smile, 
  Image as ImageIcon
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Types for our messages and conversations
interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  isCurrentUser: boolean;
  avatar?: string;
  initials: string;
  avatarBg: string;
}

interface ConversationPreview {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  initials: string;
  avatarBg: string;
  avatar?: string;
}

interface ProductCard {
  id: string;
  title: string;
  imageSrc: string;
  details: string[];
  price: number;
}

// Mock data for conversations with colorful backgrounds
const mockConversations: ConversationPreview[] = [
  { 
    id: '1', 
    name: 'Vanpoof', 
    lastMessage: 'You: Hey whats up', 
    timestamp: '15 Min', 
    initials: 'VP', 
    avatarBg: 'bg-orange-200',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  { 
    id: '2', 
    name: 'Zaet Designs', 
    lastMessage: "Hi, I'm sending you...", 
    timestamp: '12:36 PM', 
    initials: 'Z', 
    avatarBg: 'bg-yellow-300',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  { 
    id: '3', 
    name: 'Cowgirl', 
    lastMessage: 'Can you update th...', 
    timestamp: '12:36 PM', 
    initials: 'C', 
    avatarBg: 'bg-pink-200',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg' 
  },
  { 
    id: '4', 
    name: 'Nukeproof', 
    lastMessage: '$4.4 is too much f...', 
    timestamp: '12:36 PM', 
    initials: 'GK', 
    avatarBg: 'bg-blue-300',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
  },
  { 
    id: '5', 
    name: 'Mongoose', 
    lastMessage: 'Thanks for the sa...', 
    timestamp: '12:36 PM', 
    initials: 'MK', 
    avatarBg: 'bg-green-400',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
  },
  { 
    id: '6', 
    name: 'Vancough', 
    lastMessage: 'Payment of GHS 3...', 
    timestamp: '12:36 PM', 
    initials: 'VC', 
    avatarBg: 'bg-purple-200',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg'
  },
  { 
    id: '7', 
    name: 'Brown Bikes', 
    lastMessage: 'Amber where are...', 
    timestamp: '12:36 PM', 
    initials: 'B', 
    avatarBg: 'bg-indigo-300',
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
  },
];

// Mock product card data with updated image
const mockProductCard: ProductCard = {
  id: '1',
  title: 'Mens Urban eBike V4',
  imageSrc: 'https://dnauvvkfpmtquaysfdvm.supabase.co/storage/v1/object/public/models//Modmo.webp',
  details: [
    '7 Custom Components',
    'Components Compatible',
    'Expected Lead Time: 90 Days',
    'Quantity: 1,000'
  ],
  price: 1150
};

// Mock messages for the selected conversation
const mockMessages: Message[] = [
  {
    id: '1',
    content: "Hey, I've updated the design with your feedback.",
    senderId: 'designer',
    timestamp: new Date(),
    isCurrentUser: false,
    initials: 'ZD',
    avatarBg: 'bg-blue-300',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: '2',
    content: "Can you check it?",
    senderId: 'designer',
    timestamp: new Date(),
    isCurrentUser: false,
    initials: 'ZD',
    avatarBg: 'bg-blue-300',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: '3',
    content: "Looking good ❤️",
    senderId: 'supplier',
    timestamp: new Date(),
    isCurrentUser: true,
    initials: 'ME',
    avatarBg: 'bg-green-400',
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg'
  },
  {
    id: '4',
    content: "Let me discuss it in detail with our engineers.",
    senderId: 'supplier',
    timestamp: new Date(),
    isCurrentUser: true,
    initials: 'ME',
    avatarBg: 'bg-green-400',
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg'
  }
];

const MessagingPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<ConversationPreview | null>(mockConversations[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  
  // Reference to the messages container to scroll to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change, but not on initial load
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // We'll use a ref to track if this is the initial render
  const initialRender = useRef(true);

  useEffect(() => {
    // Only scroll to bottom if it's not the initial render
    if (!initialRender.current) {
      scrollToBottom();
    } else {
      initialRender.current = false;
    }
  }, [messages]);

  // Format conversation timestamp - e.g. "Thursday, March 24 • 6:21 PM"
  const formattedTimestamp = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options).replace(',', '').replace(' at ', ' • ');
  };

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: Date.now().toString(),
        content: newMessage,
        senderId: 'supplier',
        timestamp: new Date(),
        isCurrentUser: true,
        initials: 'ME',
        avatarBg: 'bg-green-400',
        avatar: 'https://randomuser.me/api/portraits/men/8.jpg'
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  // Handle pressing Enter to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden">
      <h1 className="text-2xl font-bold mb-4 border-b pb-4 px-4 pt-4">Messages</h1>
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Conversations list */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <Button className="bg-black hover:bg-black/90 rounded-full w-full text-white flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              New Chat
            </Button>
          </div>
          <ScrollArea className="flex-1">
            {mockConversations.map((convo) => (
              <div 
                key={convo.id}
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${selectedConversation?.id === convo.id ? 'bg-gray-50' : ''}`}
                onClick={() => setSelectedConversation(convo)}
              >
                <Avatar className={`h-12 w-12 ${convo.avatarBg}`}>
                  {convo.avatar ? (
                    <AvatarImage src={convo.avatar} alt={convo.name} />
                  ) : (
                    <AvatarFallback>{convo.initials}</AvatarFallback>
                  )}
                </Avatar>
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="font-semibold text-gray-900 truncate">{convo.name}</p>
                    <p className="text-xs text-gray-500">{convo.timestamp}</p>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{convo.lastMessage}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Right side - Chat window */}
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
          {selectedConversation ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
                <div className="flex items-center">
                  <Avatar className={`h-8 w-8 mr-3 ${selectedConversation.avatarBg}`}>
                    {selectedConversation.avatar ? (
                      <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                    ) : (
                      <AvatarFallback>{selectedConversation.initials}</AvatarFallback>
                    )}
                  </Avatar>
                  <h2 className="text-xl font-semibold">{selectedConversation.name}</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-gray-500 cursor-pointer" />
                  <MoreVertical className="h-5 w-5 text-gray-500 cursor-pointer" />
                </div>
              </div>

              {/* Chat messages - Using ScrollArea for proper scrolling */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {/* Product card */}
                  <div className="bg-gray-100 rounded-lg p-4 max-w-xl mx-auto my-4">
                    <div className="text-xs text-gray-500 mb-1">eBikes / VAE / Custom / Brand: @ Vanpoof</div>
                    <h3 className="font-semibold">{mockProductCard.title}</h3>
                    <div className="flex mt-2">
                      <img 
                        src={mockProductCard.imageSrc} 
                        alt="Product" 
                        className="w-1/2 h-40 object-cover rounded-md"
                      />
                      <div className="ml-4 flex-1">
                        <ul className="space-y-1">
                          {mockProductCard.details.map((detail, index) => (
                            <li key={index} className="flex items-start text-sm">
                              <span className="mr-2 mt-1 text-black">•</span>
                              {detail}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2">
                          <p className="font-semibold">$ {mockProductCard.price}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button className="flex-1 bg-black text-white">View</Button>
                      <Button variant="outline" className="flex-1">Copy Link</Button>
                    </div>
                  </div>

                  {/* Messages */}
                  {messages.map((message, index) => {
                    const isFirstMessageOfDay = index === 0 || 
                      messages[index - 1].timestamp.toDateString() !== message.timestamp.toDateString();
                    
                    return (
                      <React.Fragment key={message.id}>
                        {index === 2 && (
                          <div className="text-center my-4">
                            <span className="text-sm text-gray-500">{formattedTimestamp()}</span>
                          </div>
                        )}
                        <div 
                          className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          {!message.isCurrentUser && (
                            <Avatar className={`h-8 w-8 mr-2 ${message.avatarBg}`}>
                              {message.avatar ? (
                                <AvatarImage src={message.avatar} alt={message.initials} />
                              ) : (
                                <AvatarFallback>{message.initials}</AvatarFallback>
                              )}
                            </Avatar>
                          )}
                          <div 
                            className={`rounded-lg py-2 px-4 max-w-md ${
                              message.isCurrentUser 
                                ? 'bg-gray-200 text-gray-900' 
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            {message.content}
                          </div>
                          {message.isCurrentUser && (
                            <Avatar className={`h-8 w-8 ml-2 ${message.avatarBg}`}>
                              {message.avatar ? (
                                <AvatarImage src={message.avatar} alt={message.initials} />
                              ) : (
                                <AvatarFallback>{message.initials}</AvatarFallback>
                              )}
                            </Avatar>
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })}
                  {/* Empty div to scroll to */}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="relative flex items-center bg-gray-100 rounded-full">
                  <Button 
                    variant="ghost" 
                    className="rounded-full h-10 w-10 p-0 ml-1"
                  >
                    <FileText className="h-5 w-5 text-gray-500" />
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message"
                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <div className="flex items-center space-x-1 mr-2">
                    <Button 
                      variant="ghost" 
                      className="rounded-full h-10 w-10 p-0"
                    >
                      <Smile className="h-5 w-5 text-gray-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="rounded-full h-10 w-10 p-0"
                    >
                      <ImageIcon className="h-5 w-5 text-gray-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="rounded-full h-10 w-10 p-0"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-5 w-5 text-gray-500" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation from the list to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
