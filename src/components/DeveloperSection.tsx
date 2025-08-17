import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { MicrophoneIcon, PhoneIcon } from '@heroicons/react/24/solid';

// Add window type declarations
declare global {
  interface Window {
    Vapi: any;
    Supabase: {
      createClient: (url: string, key: string) => any;
    };
  }
}

interface DeveloperSectionProps {
  onJoinClick: () => void;
}

const DeveloperSection: React.FC<DeveloperSectionProps> = ({ onJoinClick }) => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [callId, setCallId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const vapiRef = useRef<any>(null);
  const supabaseRef = useRef<any>(null);

  useScrollReveal(sectionRef);

  useEffect(() => {
    // Load FontAwesome
    const fontAwesomeScript = document.createElement('script');
    fontAwesomeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js';
    fontAwesomeScript.defer = true;
    document.head.appendChild(fontAwesomeScript);

    // Load Vapi and Supabase scripts
    const loadScripts = async () => {
      try {
        // Load Vapi script
        const vapiScript = document.createElement('script');
        vapiScript.type = 'module';
        vapiScript.innerHTML = `
          import Vapi from "https://esm.sh/@vapi-ai/web";
          import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
          
          window.Vapi = Vapi;
          window.Supabase = { createClient };
        `;
        document.head.appendChild(vapiScript);

        // Wait for scripts to load
        setTimeout(() => {
          if (window.Vapi && window.Supabase) {
            const VAPI_PUBLIC_KEY = "58f89212-0e94-4123-8f9e-3bc0dde56fe0";
            const SUPABASE_URL = "https://wirwojaiknnvtpzaxzjv.supabase.co";
            const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpcndvamFpa25udnRwemF4emp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NjE3ODcsImV4cCI6MjA2NjUzNzc4N30.XyhklppW2bvJQ7qFv4SWaDaGK_M_YoGFAiOIFo2tW1c";
            const CHANNEL = "bagheera:new-call";

            vapiRef.current = new window.Vapi(VAPI_PUBLIC_KEY);
            supabaseRef.current = window.Supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

            // Set up Vapi event listeners
            vapiRef.current.on('call-start', (call: any) => {
              setIsActive(true);
              setIsLoading(false);
              if (call && (call.id || call.callId)) {
                setCallId(call.id || call.callId);
              }
            });

            vapiRef.current.on('call-end', () => {
              setIsActive(false);
              setIsLoading(false);
            });

            vapiRef.current.on('error', () => {
              setIsActive(false);
              setIsLoading(false);
            });

            vapiRef.current.on('message', (msg: any) => {
              const TRIGGER_PHRASES = [
                "please type your phone number below to confirm.",
                "введите номер телефона"
              ];
              
              if (msg.type === 'transcript' && 
                  msg.role === 'assistant' && 
                  msg.transcriptType === 'final' && 
                  msg.transcript) {
                
                const transcript = msg.transcript.toLowerCase();
                console.log('🔍 [DeveloperSection] Received transcript:', msg.transcript);
                console.log('🔍 [DeveloperSection] Role:', msg.role, 'Type:', msg.transcriptType);
                
                const isTriggered = TRIGGER_PHRASES.some(phrase => {
                  const phraseLower = phrase.toLowerCase();
                  const includes = transcript.includes(phraseLower);
                  console.log(`🔍 [DeveloperSection] Checking phrase: "${phrase}" -> "${phraseLower}" -> ${includes ? '✅ MATCH!' : '❌ no match'}`);
                  return includes;
                });
                
                if (isTriggered) {
                  console.log('🎯 [DeveloperSection] Trigger phrase detected:', msg.transcript);
                  console.log('🚀 [DeveloperSection] Opening phone number modal...');
                  setIsModalOpen(true);
                } else {
                  console.log('❌ [DeveloperSection] No trigger phrase found in transcript');
                }
              }
            });

            // Set up Supabase Realtime
            supabaseRef.current.channel(CHANNEL)
              .on('broadcast', { event: 'call-created' }, ({ payload }: any) => {
                setCallId(payload.callId);
                console.log('🔔 callId via RT:', payload.callId);
              })
              .subscribe((s: string) => {
                if (s === 'SUBSCRIBED') console.log('✅ Supabase listener active');
              });
          }
        }, 1000);

      } catch (error) {
        console.error('Failed to load dependencies:', error);
      }
    };

    loadScripts();
  }, []);

  const handlePhoneClick = async () => {
    if (isLoading) return;
    if (isActive) {
      setIsLoading(true);
      vapiRef.current?.stop();
      return;
    }
    
    setIsLoading(true);
    try {
      await vapiRef.current?.start(undefined, undefined, "36f1f2ac-bb5b-4249-a2da-753eeb98f0b4");
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callId) {
      alert('Call ID not captured. Please try again.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('callId', callId);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email);

      await fetch('https://primary-w2wb-edtechstudio.up.railway.app/webhook/toolCall', {
        method: 'POST',
        body: formDataToSend,
        mode: 'no-cors'
      });
      
              alert('Спасибо! Мы получили вашу информацию.');
      setFormData({ name: '', phone: '', email: '' });
      setCallId('');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Submit error', err);
      alert('Sending failed. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <section 
      ref={sectionRef}
      id="demo"
      className="bg-black py-12 sm:py-16 lg:py-20"
      data-reveal
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <p className="text-accent text-sm font-medium mb-4 uppercase tracking-wide">
              
            </p>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6 leading-tight">
              Bagira AI<br />
              Попробуйте сами<br />
            </h2>
            
            <p className="text-base sm:text-lg text-gray-300 mb-6 lg:mb-8 leading-relaxed">
            Узнайте, как Bagira AI взаимодействует<br />
             с потенциальными клиентами. <br />
             Нажмите на телефон <br />
             и запишитесь на консультацию.<br />
            </p>
            
            <Button 
              variant="primary" 
              className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
              onClick={onJoinClick}
            >
              {t('demo.cta')}
            </Button>
          </div>

          {/* Right Column - Illustration */}
          <div className="relative mt-8 lg:mt-0">
            <div className="flex items-center justify-center">
              {/* Phone with Bagira AI integration */}
              <div 
                className={`relative cursor-pointer group transition-all duration-200 ${
                  isLoading ? 'pointer-events-none opacity-60' : ''
                }`} 
                onClick={handlePhoneClick}
              >
                <img 
                  src="/phone.svg"
                  alt="Phone illustration" 
                  className={`h-48 sm:h-64 lg:h-80 w-auto transition-transform duration-200 ${
                    isActive ? 'scale-105' : 'group-hover:scale-105'
                  }`}
                />
                {/* Bagira AI overlay on phone */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`rounded-full w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 backdrop-blur-sm border border-white/20 transition-all duration-200 flex items-center justify-center ${
                    isActive ? 'bg-red-600/80' : 'bg-black/80'
                  }`}>
                    {isActive ? (
                      <PhoneIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                    ) : (
                      <MicrophoneIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* See what being built text */}
            <div className="mt-8 lg:mt-12 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Инновации</h3>
              <h3 className="text-xl sm:text-2xl font-bold text-white">в юридическом мире</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[10000]"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-[#182a46] p-6 rounded-lg w-90 max-w-md shadow-lg">
            <div className="text-xl font-semibold mb-5 text-center text-white">
              Подтвердите вашу заявку
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <input
                type="hidden"
                value={callId}
                readOnly
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Имя"
                className="w-full p-3 rounded-md border border-gray-300 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/30"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="Телефон (+xxx)"
                className="w-full p-3 rounded-md border border-gray-300 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/30"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Электронная почта"
                className="w-full p-3 rounded-md border border-gray-300 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/30"
              />
              <button
                type="submit"
                disabled={isSubmitting || !callId}
                className="w-full p-3 bg-black text-white font-semibold rounded-md border-none cursor-pointer transition-colors duration-150 hover:bg-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Отправляем...' : 'Отправить'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default DeveloperSection; 