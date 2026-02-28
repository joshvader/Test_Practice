'use client';

import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
}

export default function CodeEditor({ value, onChange, language = 'typescript' }: CodeEditorProps) {
  return (
    <div className="h-96 border border-gray-300 rounded-md overflow-hidden shadow-sm">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={onChange}
        theme="light"
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: 'on',
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}
