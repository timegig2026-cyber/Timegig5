import React, { useState } from 'react';
import { X, Flag, CheckCircle2 } from 'lucide-react';
import { Contact } from '../types';

interface ReportContactModalProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (reason: string, details: string) => void;
}

const REPORT_REASONS = [
  { id: 'spam', title: 'Spam or unwanted advertising', desc: 'Repetitive messages or automated links' },
  { id: 'harassment', title: 'Harassment or offensive behavior', desc: 'Bullying, threats, or abusive language' },
  { id: 'inappropriate', title: 'Inappropriate content or media', desc: 'Graphic, explicit, or harmful material' },
  { id: 'scam', title: 'Scam, fraud, or phishing', desc: 'Attempting to steal money or credentials' },
  { id: 'impersonation', title: 'Impersonation or fake account', desc: 'Pretending to be someone else' },
  { id: 'other', title: 'Other issue', desc: 'Something else not listed above' },
];

export const ReportContactModal: React.FC<ReportContactModalProps> = ({
  contact,
  isOpen,
  onClose,
  onSubmitReport,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('spam');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(selectedReason, details);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedReason('spam');
      setDetails('');
      onClose();
    }, 1400);
  };

  return (
    <div
      id="report-contact-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="report-contact-modal-card"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-neutral-100 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          id="close-report-modal-button"
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div id="report-success-state" className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-3" />
            <h4 className="text-lg font-semibold text-neutral-900">Report Submitted</h4>
            <p className="text-sm text-neutral-500 mt-1 max-w-xs">
              Thank you for reporting. We will review this issue promptly.
            </p>
          </div>
        ) : (
          <form id="report-contact-form" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 mb-2 text-rose-600">
              <Flag className="w-5 h-5" />
              <h3 id="report-modal-title" className="text-lg font-semibold text-neutral-900">
                Report {contact.name}
              </h3>
            </div>
            <p className="text-xs text-neutral-500 mb-4">
              Select the reason that best describes the issue. Your report will be kept confidential.
            </p>

            {/* Radio Options */}
            <div className="space-y-2 mb-4">
              {REPORT_REASONS.map((reason) => {
                const isChecked = selectedReason === reason.id;
                return (
                  <label
                    key={reason.id}
                    id={`report-option-${reason.id}`}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'border-neutral-900 bg-neutral-50/80 shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason.id}
                      checked={isChecked}
                      onChange={() => setSelectedReason(reason.id)}
                      className="mt-0.5 accent-neutral-900 h-4 w-4 text-neutral-900"
                    />
                    <div className="flex-1">
                      <span className="block text-sm font-medium text-neutral-900 leading-tight">
                        {reason.title}
                      </span>
                      <span className="block text-xs text-neutral-400 mt-0.5">
                        {reason.desc}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Optional details text area */}
            <div className="mb-5">
              <label htmlFor="report-details-input" className="block text-xs font-medium text-neutral-600 mb-1.5">
                Additional information (optional)
              </label>
              <textarea
                id="report-details-input"
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what happened or add context..."
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                id="cancel-report-button"
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 text-sm font-medium rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                id="submit-report-button"
                type="submit"
                className="flex-1 py-2.5 px-4 text-sm font-medium rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
