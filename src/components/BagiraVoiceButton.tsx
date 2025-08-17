import { useEffect, useRef, useState } from 'react';

interface BagiraVoiceButtonProps {
  className?: string;
}

// Global VAPI instance to avoid re-initialization
let globalVapiInstance: any = null;
let globalSupabaseInstance: any = null;
let isInitializing = false;
let initPromise: Promise<void> | null = null;

// Preload critical resources immediately
const preloadResources = () => {
  // Preload VAPI script with high priority
  if (!document.querySelector('script[data-vapi-preload]')) {
    const vapiPreload = document.createElement('link');
    vapiPreload.rel = 'preload';
    vapiPreload.as = 'script';
    vapiPreload.href = 'https://esm.sh/@vapi-ai/web';
    vapiPreload.setAttribute('data-vapi-preload', 'true');
    vapiPreload.crossOrigin = 'anonymous';
    document.head.appendChild(vapiPreload);
  }

  // Preload Supabase with high priority
  if (!document.querySelector('script[data-supabase-preload]')) {
    const supabasePreload = document.createElement('link');
    supabasePreload.rel = 'preload';
    supabasePreload.as = 'script';
    supabasePreload.href = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
    supabasePreload.setAttribute('data-supabase-preload', 'true');
    supabasePreload.crossOrigin = 'anonymous';
    document.head.appendChild(supabasePreload);
  }

  // Don't preload FontAwesome - load it on-demand to avoid CORS issues
};

// Start preloading immediately when module loads
preloadResources();

const BagiraVoiceButton: React.FC<BagiraVoiceButtonProps> = ({ className = '' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [callId, setCallId] = useState('');
  const [isVapiReady, setIsVapiReady] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const vapiRef = useRef<any>(null);
  const supabaseRef = useRef<any>(null);

  // Ultra-fast VAPI initialization with parallel loading
  const initializeVapi = async (): Promise<void> => {
    if (globalVapiInstance && globalSupabaseInstance) {
      return Promise.resolve();
    }

    if (isInitializing && initPromise) {
      return initPromise;
    }

    if (isInitializing) {
      return new Promise((resolve) => {
        const checkReady = () => {
          if (globalVapiInstance && globalSupabaseInstance) {
            resolve();
          } else {
            setTimeout(checkReady, 25); // Even faster checking
          }
        };
        checkReady();
      });
    }

    isInitializing = true;
    initPromise = new Promise(async (resolve, reject) => {
      try {
        // Parallel resource loading for maximum speed
        const loadPromises = [];

        // Load FontAwesome if not already loaded (on-demand to avoid CORS issues)
        if (!document.querySelector('script[src*="font-awesome"]')) {
          const fontAwesomeScript = document.createElement('script');
          fontAwesomeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js';
          fontAwesomeScript.defer = true;
          fontAwesomeScript.crossOrigin = 'anonymous';
          document.head.appendChild(fontAwesomeScript);
          
          // Wait for FontAwesome to load with timeout
          loadPromises.push(new Promise<void>((resolveFA) => {
            let attempts = 0;
            const maxAttempts = 50; // 500ms timeout
            
            const checkFA = () => {
              attempts++;
              if ((window as any).FontAwesome || document.querySelector('script[src*="font-awesome"]')?.getAttribute('data-loaded')) {
                resolveFA();
              } else if (attempts < maxAttempts) {
                setTimeout(checkFA, 10);
              } else {
                console.warn('⚠️ FontAwesome loading timeout, continuing without it');
                resolveFA(); // Continue anyway
              }
            };
            checkFA();
          }));
        }

        // Load Vapi and Supabase scripts with parallel execution
        if (!window.Vapi || !window.Supabase) {
          const vapiScript = document.createElement('script');
          vapiScript.type = 'module';
          vapiScript.innerHTML = `
            import Vapi from "https://esm.sh/@vapi-ai/web";
            import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
            
            window.Vapi = Vapi;
            window.Supabase = { createClient };
            
            // Mark as loaded for faster checking
            document.querySelector('script[data-vapi-script]')?.setAttribute('data-loaded', 'true');
          `;
          vapiScript.setAttribute('data-vapi-script', 'true');
          document.head.appendChild(vapiScript);

          // Wait for scripts to load with ultra-responsive checking
          loadPromises.push(new Promise<void>((resolveScripts) => {
            const checkScripts = () => {
              if (window.Vapi && window.Supabase) {
                resolveScripts();
              } else {
                setTimeout(checkScripts, 10); // Check every 10ms for maximum responsiveness
              }
            };
            checkScripts();
          }));
        }

        // Wait for all resources to load in parallel
        await Promise.all(loadPromises);

        const VAPI_PUBLIC_KEY = "58f89212-0e94-4123-8f9e-3bc0dde56fe0";
        const SUPABASE_URL = "https://wirwojaiknnvtpzaxzjv.supabase.co";
        const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpcndvamFpa25udnRwemF4emp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NjE3ODcsImV4cCI6MjA2NjUzNzc4N30.XyhklppW2bvJQ7qFv4SWaDaGK_M_YoGFAiOIFo2tW1c";
        const CHANNEL = "bagheera:new-call";

        // Create instances immediately with error handling
        try {
          globalVapiInstance = new window.Vapi(VAPI_PUBLIC_KEY);
          
          // Handle Krisp filter errors gracefully
          globalVapiInstance.on('error', (error: any) => {
            if (error?.message?.includes('Krisp') || error?.message?.includes('mic processor')) {
              console.warn('⚠️ Audio processing issue detected, continuing with basic functionality');
              // Continue without advanced audio processing
            }
          });
          
        } catch (error) {
          console.error('❌ Failed to create VAPI instance:', error);
          throw error;
        }
        
        try {
          globalSupabaseInstance = window.Supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
        } catch (error) {
          console.error('❌ Failed to create Supabase instance:', error);
          throw error;
        }

        // Set up Vapi event listeners
        globalVapiInstance.on('call-start', (call: any) => {
          setIsActive(true);
          setIsLoading(false);
          if (call && (call.id || call.callId)) {
            setCallId(call.id || call.callId);
          }
        });

        globalVapiInstance.on('call-end', () => {
          setIsActive(false);
          setIsLoading(false);
        });

        globalVapiInstance.on('error', () => {
          setIsActive(false);
          setIsLoading(false);
        });

        globalVapiInstance.on('message', (msg: any) => {
          const TRIGGER_PHRASES = [
            "please type your phone number below to confirm.",
            "введите номер телефона"
          ];
          
          if (msg.type === 'transcript' && 
              msg.role === 'assistant' && 
              msg.transcriptType === 'final' && 
              msg.transcript) {
            
            const transcript = msg.transcript.toLowerCase();
            console.log('🔍 Received transcript:', msg.transcript);
            console.log('🔍 Role:', msg.role, 'Type:', msg.transcriptType);
            
            const isTriggered = TRIGGER_PHRASES.some(phrase => {
              const phraseLower = phrase.toLowerCase();
              const includes = transcript.includes(phraseLower);
              console.log(`🔍 Checking phrase: "${phrase}" -> "${phraseLower}" -> ${includes ? '✅ MATCH!' : '❌ no match'}`);
              return includes;
            });
            
            if (isTriggered) {
              console.log('🎯 Trigger phrase detected:', msg.transcript);
              console.log('🚀 Opening phone number modal...');
              setIsModalOpen(true);
            } else {
              console.log('❌ No trigger phrase found in transcript');
            }
          }
        });

        // Set up Supabase Realtime
        globalSupabaseInstance.channel(CHANNEL)
          .on('broadcast', { event: 'call-created' }, ({ payload }: any) => {
            setCallId(payload.callId);
            console.log('🔔 callId via RT:', payload.callId);
          })
          .subscribe((s: string) => {
            if (s === 'SUBSCRIBED') console.log('✅ Supabase listener active');
          });

        resolve();
      } catch (error) {
        console.error('Failed to load dependencies:', error);
        reject(error);
      } finally {
        isInitializing = false;
      }
    });

    return initPromise;
  };

  useEffect(() => {
    // Start VAPI initialization immediately when component mounts
    initializeVapi().then(() => {
      vapiRef.current = globalVapiInstance;
      supabaseRef.current = globalSupabaseInstance;
      setIsVapiReady(true);
      console.log('🚀 VAPI initialized successfully');
    }).catch((error) => {
      console.error('❌ VAPI initialization failed:', error);
    });
  }, []);

  const handleButtonClick = async () => {
    if (isLoading || !isVapiReady) return;
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
    <>
      {/* Floating Voice Button */}
      <button
        id="vapi-button"
        onClick={handleButtonClick}
        disabled={!isVapiReady}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full border-0 outline-0 
                   flex items-center justify-center cursor-pointer z-[9999] transition-all duration-200
                   ${!isVapiReady ? 'bg-gray-500 cursor-not-allowed opacity-50' : 'bg-black hover:scale-110 hover:-translate-y-1'}
                   ${isLoading ? 'pointer-events-none opacity-60' : ''}
                   ${isActive ? 'bg-[#dc3545]' : ''}
                   ${isActive || isLoading || !isVapiReady ? '' : 'animate-float'}
                   ${className}`}
        aria-label={isVapiReady ? "Start voice assistant" : "Voice assistant initializing..."}
      >
        {!isVapiReady ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span 
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                         text-xs font-semibold text-white tracking-wider pointer-events-none
                         ${isActive ? 'hidden' : 'block'}`}
            >
              Bagira AI
            </span>
            <i 
              className={`fas fa-phone-slash text-white text-2xl absolute
                         transition-all duration-200
                         ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
            />
          </>
        )}
      </button>

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
    </>
  );
};

export default BagiraVoiceButton; 