import { useState, useEffect, useRef, FormEvent, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n';
import { Conversation, Message, DoctorProfile } from '../types';

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useAuth(); // Keep auth context active
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const loadConversation = useCallback(async () => {
    if (!id) return;
    try {
      const data = await apiClient.getConversation(id);
      setConversation(data);
    } catch (error) {
      console.error('Failed to load conversation:', error);
      navigate('/app/conversations');
    }
  }, [id, navigate]);

  const loadMessages = useCallback(async () => {
    if (!id) return;
    try {
      const data = await apiClient.getMessages(id);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadConversation();
      loadMessages();

      // Poll for new messages every 5 seconds
      const interval = setInterval(() => {
        loadMessages();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [id, loadConversation, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !id || isSending) return;

    setIsSending(true);
    try {
      let message: Message;
      if (selectedFile) {
        message = await apiClient.sendMessageWithAttachment(
          id,
          newMessage.trim() || (language === 'zh-HK' ? '已發送檔案' : 'Sent a file'),
          selectedFile
        );
      } else {
        message = await apiClient.sendMessage(id, newMessage.trim());
      }
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert(t('fileSizeLimit'));
        return;
      }
      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert(t('fileTypeLimit'));
        return;
      }
      setSelectedFile(file);
    }
  };

  const getParticipantName = (participant: Conversation['otherParticipant']) => {
    if (participant.profile) {
      return 'fullName' in participant.profile ? participant.profile.fullName : 'Unknown';
    }
    return participant.email;
  };

  const getParticipantDetails = (participant: Conversation['otherParticipant']) => {
    if (participant.role === 'DOCTOR' && participant.profile) {
      const profile = participant.profile as DoctorProfile;
      return profile.specialty || t('roleDoctor');
    }
    if (participant.role === 'PATIENT' && participant.profile) {
      return t('rolePatient');
    }
    return participant.role.charAt(0) + participant.role.slice(1).toLowerCase();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'zh-HK' ? 'zh-HK' : 'en-US';
    return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const locale = language === 'zh-HK' ? 'zh-HK' : 'en-US';

    if (date.toDateString() === today.toDateString()) {
      return t('today');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('yesterday');
    }
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach((message) => {
      const dateKey = new Date(message.createdAt).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    return groups;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-neutral-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-600"></div>
          <p className="text-sm text-neutral-500">{language === 'zh-HK' ? '載入中...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return null;
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-neutral-100 flex items-center gap-4 bg-gradient-to-r from-teal-50/50 to-cyan-50/50">
        <button
          onClick={() => navigate('/app/conversations')}
          className="md:hidden p-2 hover:bg-teal-100 rounded-xl transition-colors text-neutral-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center flex-shrink-0 border-2 border-teal-200">
          <span className="text-teal-700 font-semibold text-lg">
            {getParticipantName(conversation.otherParticipant).charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="font-semibold text-neutral-800">
            {getParticipantName(conversation.otherParticipant)}
          </h2>
          <p className="text-sm text-teal-600 font-medium">
            {getParticipantDetails(conversation.otherParticipant)}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
        {Object.entries(messageGroups).map(([dateKey, dateMessages]) => (
          <div key={dateKey}>
            <div className="flex justify-center mb-4">
              <span className="px-4 py-1.5 bg-white border border-neutral-200 rounded-full text-xs font-medium text-neutral-600 shadow-sm">
                {formatDate(dateMessages[0].createdAt)}
              </span>
            </div>
            <div className="space-y-3">
              {dateMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      message.isOwnMessage
                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-br-md shadow-healthcare'
                        : 'bg-white text-neutral-800 rounded-bl-md shadow-sm border border-neutral-100'
                    }`}
                  >
                    {!message.isOwnMessage && (
                      <p className="text-xs font-semibold text-teal-600 mb-1">
                        {message.sender.fullName}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                    {message.attachmentUrl && (
                      <a
                        href={message.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 mt-2 text-sm ${
                          message.isOwnMessage ? 'text-teal-100 hover:text-white' : 'text-teal-600 hover:text-teal-700'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                          />
                        </svg>
                        {message.attachmentName || t('attachment')}
                      </a>
                    )}
                    <p
                      className={`text-xs mt-1.5 ${
                        message.isOwnMessage ? 'text-teal-200' : 'text-neutral-400'
                      }`}
                    >
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-100 bg-white">
        {selectedFile && (
          <div className="mb-3 p-3 bg-teal-50 rounded-xl flex items-center justify-between border border-teal-100">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium text-teal-700 truncate">{selectedFile.name}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="text-teal-600 hover:text-teal-800 p-1 hover:bg-teal-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-neutral-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors"
            title={t('sendFile')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('typeMessage')}
            className="flex-1 px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-neutral-50 hover:bg-white transition-colors"
          />
          <button
            type="submit"
            disabled={(!newMessage.trim() && !selectedFile) || isSending}
            className="p-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-healthcare"
          >
            {isSending ? (
              <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
