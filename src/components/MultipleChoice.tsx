'use client';

interface Question {
  id: string;
  question: string;
  options?: string[];
}

interface MultipleChoiceProps {
  question: Question;
  value?: string;
  onChange: (value: string) => void;
}

export default function MultipleChoice({ question, value, onChange }: MultipleChoiceProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-black text-cyan-100 tracking-wide">{question.question}</h3>
      <div className="space-y-2">
        {question.options?.map((option, index) => (
          <label
            key={index}
            className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
              value === index.toString()
                ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                : 'hover:bg-gray-50 border-gray-200'
            }`}
          >
            <input
              type="radio"
              name={question.id}
              value={index}
              checked={value === index.toString()}
              onChange={() => onChange(index.toString())}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-3 text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
