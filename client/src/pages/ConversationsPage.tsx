import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n';
import { Conversation, DoctorProfile } from '../types';

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [doctors, setDoctors] = useState<Array<{ id: string; email: string; profile: { fullName: string; specialty: string } }>>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await apiClient.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      const data = await apiClient.getDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Failed to load doctors:', error);
    }
  };

  const handleNewConversation = async () => {
    if (user?.role === 'PATIENT') {
      await loadDoctors();
      setShowNewConversation(true);
    }
  };

  const createConversation = async (doctorId: string) => {
    try {
      const conversation = await apiClient.createConversation(doctorId);
      setShowNewConversation(false);
      navigate(`/app/conversations/${conversation.id}`);
    } catch (error) {
      console.error('Failed to create conversation:', error);
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
    return participant.role === 'PATIENT' ? t('rolePatient') : participant.role.charAt(0) + participant.role.slice(1).toLowerCase();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const locale = language === 'zh-HK' ? 'zh-HK' : 'en-US';

    if (days === 0) {
      return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return t('yesterday');
    } else if (days < 7) {
      return date.toLocaleDateString(locale, { weekday: 'short' });
    }
    return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
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

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-gradient-to-r from-teal-50/50 to-cyan-50/50">
        <h1 className="text-xl font-semibold text-neutral-800">{t('conversations')}</h1>
        {user?.role === 'PATIENT' && (
          <button
            onClick={handleNewConversation}
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-healthcare text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('newConversation')}
          </button>
        )}
      </div>

      {showNewConversation && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-neutral-100 bg-gradient-to-r from-teal-50 to-cyan-50">
              <h2 className="text-lg font-semibold text-neutral-800">{t('startConversation')}</h2>
              <p className="text-sm text-neutral-500 mt-1">{t('selectDoctor')}</p>
            </div>
            <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
              {doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => createConversation(doctor.id)}
                  className="w-full p-4 text-left border border-neutral-100 rounded-xl hover:bg-teal-50 hover:border-teal-200 transition-all flex items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center border-2 border-teal-200 group-hover:border-teal-300">
                    <span className="text-teal-700 font-semibold">{doctor.profile.fullName.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">{doctor.profile.fullName}</p>
                    <p className="text-sm text-neutral-500">{doctor.profile.specialty}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-4 border-t border-neutral-100 bg-neutral-50">
              <button
                onClick={() => setShowNewConversation(false)}
                className="w-full py-2.5 border border-neutral-200 rounded-xl text-neutral-700 hover:bg-neutral-100 transition-colors font-medium"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500 p-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-teal-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-lg font-medium text-neutral-700">{t('noConversations')}</p>
            {user?.role === 'PATIENT' && (
              <p className="text-sm mt-2 text-neutral-500">{t('startWithDoctor')}</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => navigate(`/app/conversations/${conversation.id}`)}
                className="w-full p-4 flex items-start gap-4 hover:bg-teal-50/50 transition-colors text-left group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center flex-shrink-0 border-2 border-teal-200 group-hover:border-teal-300">
                  <span className="text-teal-700 font-semibold text-lg">
                    {getParticipantName(conversation.otherParticipant).charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-neutral-800 truncate group-hover:text-teal-700">
                      {getParticipantName(conversation.otherParticipant)}
                    </h3>
                    {conversation.lastMessage && (
                      <span className="text-xs text-neutral-400 ml-2 flex-shrink-0">
                        {formatTime(conversation.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-teal-600 font-medium">
                    {getParticipantDetails(conversation.otherParticipant)}
                  </p>
                  {conversation.lastMessage && (
                    <p className="text-sm text-neutral-500 truncate mt-1">
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
