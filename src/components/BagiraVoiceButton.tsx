import { useEffect, useRef, useState } from 'react';

interface BagiraVoiceButtonProps {
  className?: string;
}

const BagiraVoiceButton: React.FC<BagiraVoiceButtonProps> = ({ className = '' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [callId, setCallId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const vapiRef = useRef<any>(null);
  const supabaseRef = useRef<any>(null);

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
              const TRIGGER_PHRASE = "please type your phone number below to confirm.";
              if (msg.type === 'transcript' && 
                  msg.role === 'assistant' && 
                  msg.transcriptType === 'final' && 
                  msg.transcript?.toLowerCase().includes(TRIGGER_PHRASE)) {
                setIsModalOpen(true);
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

  const handleButtonClick = async () => {
    if (isLoading) return;
    if (isActive) {
      setIsLoading(true);
      vapiRef.current?.stop();
      return;
    }
    
    setIsLoading(true);
    try {
      await vapiRef.current?.start(undefined, undefined, "07c34a29-6c47-4f09-8737-7be62bb72de5");
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
      
      alert('Thank you! We have received your info.');
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
        className={`fixed bottom-6 right-6 w-16 h-16 bg-black rounded-full border-0 outline-0 
                   flex items-center justify-center cursor-pointer z-[9999] transition-transform duration-200
                   hover:scale-110 hover:-translate-y-1
                   ${isLoading ? 'pointer-events-none opacity-60' : ''}
                   ${isActive ? 'bg-[#dc3545]' : ''}
                   ${isActive || isLoading ? '' : 'animate-float'}
                   ${className}`}
        aria-label="Start voice assistant"
      >
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
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[10000]"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-[#182a46] p-6 rounded-lg w-90 max-w-md shadow-lg">
            <div className="text-xl font-semibold mb-5 text-center text-white">
              Confirm your booking
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
                placeholder="Name"
                className="w-full p-3 rounded-md border border-gray-300 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/30"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="Phone (+xxx)"
                className="w-full p-3 rounded-md border border-gray-300 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/30"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="you@example.com"
                className="w-full p-3 rounded-md border border-gray-300 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/30"
              />
              <button
                type="submit"
                disabled={isSubmitting || !callId}
                className="w-full p-3 bg-black text-white font-semibold rounded-md border-none cursor-pointer transition-colors duration-150 hover:bg-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending…' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BagiraVoiceButton; 