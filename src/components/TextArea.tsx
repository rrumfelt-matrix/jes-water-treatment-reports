import { ChangeEvent } from 'react';

interface TextAreaProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}

export function TextArea({ label, name, value, onChange, placeholder, rows = 2 }: TextAreaProps) {
  return (
    <div className="flex flex-col">
      {label && <label className="text-xs font-medium text-slate-600 mb-1">{label}</label>}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
      />
    </div>
  );
}
