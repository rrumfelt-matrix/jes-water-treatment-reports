import { ChangeEvent } from 'react';
import { getValidationStatus } from '../lib/controlLimits';
import { StatusIndicator } from './StatusIndicator';

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  field?: string;
  unit?: string;
}

export function InputField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  field,
  unit,
}: InputFieldProps) {
  const status = field ? getValidationStatus(value, field) : 'neutral';

  const borderClass =
    status === 'low' || status === 'high'
      ? 'border-red-300 bg-red-50'
      : status === 'good'
        ? 'border-green-300 bg-green-50'
        : 'border-slate-300';

  return (
    <div className="flex flex-col">
      <label className="text-xs font-medium text-slate-600 mb-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${borderClass}`}
        />
        {field && (
          <span className="absolute right-8 top-2">
            <StatusIndicator status={status} />
          </span>
        )}
        {unit && <span className="absolute right-3 top-2 text-xs text-slate-400">{unit}</span>}
      </div>
    </div>
  );
}
