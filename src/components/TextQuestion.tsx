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
      <h3 className="text-lg font-medium text-gray-900">{question.question}</h3>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder}
        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-y text-black"
      />
    </div>
  );
}
