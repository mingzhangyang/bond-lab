import { useState, useRef, useEffect } from 'react';
import { X, MessageSquare } from 'lucide-react';
import type { Messages } from '../../i18n';

type Category = 'bug' | 'suggestion' | 'other';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Messages;
  isDark: boolean;
  softPanelClass: string;
  settingsItemClass: string;
}

export function FeedbackModal({
  isOpen,
  onClose,
  messages,
  isDark,
  softPanelClass,
  settingsItemClass,
}: FeedbackModalProps) {
  const [category, setCategory] = useState<Category>('suggestion');
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categoryOptions: Array<{ key: Category; label: string }> = [
    { key: 'bug', label: messages.feedback.bug },
    { key: 'suggestion', label: messages.feedback.suggestion },
    { key: 'other', label: messages.feedback.other },
  ];

  const handleSubmit = () => {
    const categoryLabel = categoryOptions.find((o) => o.key === category)?.label ?? category;
    const subject = encodeURIComponent(`BondLab Feedback — ${categoryLabel}`);
    const body = encodeURIComponent(text.trim());
    window.open(`mailto:contact@orangely.xyz?subject=${subject}&body=${body}`, '_self');
    onClose();
    setText('');
    setCategory('suggestion');
  };

  const handleCancel = () => {
    onClose();
    setText('');
    setCategory('suggestion');
  };

  const activeChipClass = isDark
    ? 'bg-indigo-500/25 text-indigo-100'
    : 'bg-indigo-100 text-indigo-700';
  const submitClass = isDark
    ? 'bg-indigo-500/80 hover:bg-indigo-500 text-white'
    : 'bg-indigo-600 hover:bg-indigo-700 text-white';
  const textareaClass = isDark
    ? 'bg-white/5 border border-white/10 focus:border-indigo-400/60 placeholder:text-white/30 text-white'
    : 'bg-black/5 border border-black/10 focus:border-indigo-400/60 placeholder:text-black/30';

  return (
    <>
      <div
        className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm"
        onClick={handleCancel}
      />
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`relative w-full max-w-md rounded-2xl p-6 shadow-2xl pointer-events-auto ${softPanelClass}`}
          role="dialog"
          aria-modal="true"
          aria-label={messages.feedback.title}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} />
              <h2 className="text-base font-semibold">{messages.feedback.title}</h2>
            </div>
            <button
              className={`p-1.5 rounded-lg transition-colors ${settingsItemClass}`}
              onClick={handleCancel}
              aria-label={messages.ui.close}
            >
              <X size={16} />
            </button>
          </div>

          <p className="text-xs mb-2 opacity-60">{messages.feedback.categoryLabel}</p>
          <div className="flex gap-2 mb-4">
            {categoryOptions.map(({ key, label }) => (
              <button
                key={key}
                className={`flex-1 min-h-[36px] px-2 rounded-lg text-xs font-medium transition-colors ${
                  category === key ? activeChipClass : settingsItemClass
                }`}
                onClick={() => setCategory(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <textarea
            ref={textareaRef}
            className={`w-full h-28 px-3 py-2 rounded-xl text-sm resize-none outline-none transition-colors ${textareaClass}`}
            placeholder={messages.feedback.placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="flex gap-2 mt-4">
            <button
              className={`flex-1 min-h-[40px] rounded-xl text-sm font-medium transition-colors ${settingsItemClass}`}
              onClick={handleCancel}
            >
              {messages.feedback.cancel}
            </button>
            <button
              className={`flex-1 min-h-[40px] rounded-xl text-sm font-medium transition-colors ${submitClass}`}
              onClick={handleSubmit}
            >
              {messages.feedback.submit}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
