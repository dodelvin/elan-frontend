/**
 * HelpScreen.tsx
 * --------------
 * Support center. Search input, expandable FAQ accordion, contact methods
 * card (email / live chat / phone), and three quick-action buttons at the
 * bottom (tutorials / report problem / request feature).
 *
 * Route: /help
 *
 * Note: FAQs and contact info are placeholders. Phase 4 fetches FAQs from
 * GET /api/help/faqs and submits problem reports / feature requests via
 * POST /api/help/feedback.
 *
 * Contains:
 *   - <HelpScreen />
 */

import { useState } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ChevronLeft, ChevronDown, ChevronUp, Mail, MessageCircle, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * HelpScreen
 * ----------
 * No props. Tracks which FAQ is currently expanded (or null when all closed).
 */
export function HelpScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  void t;  // reserved for the upcoming translation pass

  // Index of the currently-expanded FAQ, or null when all are collapsed.
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Variables related to the FAQ accordion entries.
  const faqs = [
    {
      question: 'How do I track my daily activities?',
      answer: 'Navigate to the Daily Tracker page and use the + buttons to log your steps, water intake, sleep hours, and mindfulness minutes. Your data is automatically saved.'
    },
    {
      question: 'Can I customize my goals?',
      answer: 'Yes! Go to Settings > Goals to set custom targets for steps, water intake, sleep, and workout frequency based on your personal wellness journey.'
    },
    {
      question: 'How do I connect with the community?',
      answer: 'Visit the Community tab to share your progress, join challenges, and interact with other wellness enthusiasts. Tap the heart icon to like posts or comment to start conversations.'
    },
    {
      question: 'Are meditation sessions available offline?',
      answer: 'Once downloaded, selected meditation sessions can be accessed offline. Look for the download icon next to each session in the Meditation library.'
    },
    {
      question: 'How can I view my progress over time?',
      answer: 'The Analytics page shows your weekly and monthly trends for all tracked activities. You can view charts for steps, sleep, workouts, and mindfulness practice.'
    },
    {
      question: 'Is my health data secure?',
      answer: 'Absolutely. All your data is encrypted and stored securely. We never share your personal health information with third parties without your explicit consent.'
    }
  ];

  // Variables related to the contact methods card.
  const contactMethods = [
    { icon: Mail,          label: 'Email Support', value: 'support@elan-wellness.com' },
    { icon: MessageCircle, label: 'Live Chat',     value: 'Available 9AM-5PM EST'     },
    { icon: Phone,         label: 'Phone',         value: '1-800-ELAN-WELL'           }
  ];

  return (
    <MobileLayout>
      <div className="px-6 pt-12 pb-24">
        {/* Header with back button */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/settings')} className="text-[var(--color-darkest)]">
            <ChevronLeft size={24} />
          </button>
          <h4>Help & Support</h4>
        </div>

        {/* Search box (UI only — no behavior wired) */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search for help..."
            className="w-full px-4 py-3 rounded-full border border-[var(--color-light)] bg-white focus:outline-none focus:border-[var(--color-primary)] transition-colors text-body2"
          />
        </div>

        {/* FAQ accordion — only one open at a time */}
        <div className="mb-6">
          <h6 className="mb-4">Frequently Asked Questions</h6>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h6 className="flex-1 pr-4">{faq.question}</h6>
                  {openFaq === index ? (
                    <ChevronUp size={20} className="text-[var(--color-mid-dark)] flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-[var(--color-mid-dark)] flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="mt-3 pt-3 border-t border-[var(--color-lighter)]">
                    <p className="text-body2 text-[var(--color-dark)]">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Contact methods card */}
        <div className="mb-6">
          <h6 className="mb-4">Contact Us</h6>
          <Card>
            <div className="space-y-4">
              {contactMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <div key={method.label} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-lighter)] flex items-center justify-center">
                      <Icon size={20} className="text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <p className="text-subtitle2 mb-1">{method.label}</p>
                      <p className="text-body2 text-[var(--color-mid-dark)]">{method.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Quick actions — placeholders */}
        <div className="space-y-3">
          <Button fullWidth variant="outline">View Tutorial Videos</Button>
          <Button fullWidth variant="outline">Report a Problem</Button>
          <Button fullWidth variant="outline">Request a Feature</Button>
        </div>
      </div>
    </MobileLayout>
  );
}
