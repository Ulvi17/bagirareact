import React, { useState } from 'react';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    website: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to normalize website URL
  const normalizeWebsite = (website: string): string => {
    if (!website) return website;
    
    // Remove leading/trailing whitespace
    let normalized = website.trim();
    
    // If it doesn't start with http:// or https://, add https://
    if (!normalized.match(/^https?:\/\//)) {
      normalized = 'https://' + normalized;
    }
    
    // Ensure it has a valid domain structure
    if (!normalized.includes('.') || normalized.endsWith('.')) {
      return website; // Return original if invalid
    }
    
    return normalized;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Normalize the website URL before sending
      const normalizedWebsite = normalizeWebsite(formData.website);
      
      const response = await fetch('https://primary-w2wb-edtechstudio.up.railway.app/webhook/pilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          website: normalizedWebsite
        }),
      });

      if (response.ok) {
        // Success - close modal and reset form
        setFormData({ name: '', company: '', website: '' });
        onClose();
        alert('Заявка успешно отправлена!');
      } else {
        alert('Произошла ошибка при отправке заявки. Попробуйте еще раз.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Произошла ошибка при отправке заявки. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validate website field
  const isWebsiteValid = (website: string): boolean => {
    if (!website) return false;
    
    // Allow various formats: example.com, www.example.com, https://example.com
    const websiteRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?(\/.*)?$/;
    return websiteRegex.test(website);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray900 mb-6 pr-8">
          Присоединиться к пилотной программе Bagira AI
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ваше имя:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="например, Иван Иванов"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
              required
            />
          </div>

          {/* Company field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название компании:
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="например, ООО «Юридические Решения»"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
              required
            />
          </div>

          {/* Website field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Сайт компании:
            </label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="example.com или www.example.com"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
                formData.website && !isWebsiteValid(formData.website)
                  ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                  : 'border-gray-300 focus:ring-accent focus:border-accent'
              }`}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Поддерживаются форматы: example.com, www.example.com, https://example.com
            </p>
            {formData.website && !isWebsiteValid(formData.website) && (
              <p className="text-xs text-red-500 mt-1">
                Пожалуйста, введите корректный адрес сайта
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting || (formData.website && !isWebsiteValid(formData.website))}
            className="w-full bg-accent hover:bg-accentDark text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Отправляем...' : 'Отправить заявку'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinModal; 