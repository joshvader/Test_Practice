'use client';

interface Question {
  id: string;
  question: string;
  placeholder?: string;
  type?: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox';
  options?: string[];
}

interface TextQuestionProps {
  question: Question;
  value?: string;
  onChange: (value: string) => void;
}

export default function TextQuestion({ question, value, onChange }: TextQuestionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-black text-cyan-100 tracking-wide">{question.question}</h3>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder}
        className="w-full h-32 p-3 border border-cyan-500/30 rounded-sm bg-black/40 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all resize-y text-cyan-100 placeholder:text-cyan-800"
      />
    </div>
  );
}
