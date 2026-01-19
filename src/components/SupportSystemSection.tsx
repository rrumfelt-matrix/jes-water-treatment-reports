import { Trash2 } from 'lucide-react';
import { SupportSystem } from '../types';
import { InputField } from './InputField';
import { TextArea } from './TextArea';

interface SupportSystemSectionProps {
  system: SupportSystem;
  onUpdate: (id: string, field: keyof SupportSystem, value: string) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export function SupportSystemSection({ system, onUpdate, onRemove, canRemove }: SupportSystemSectionProps) {
  const handleChange = (field: keyof SupportSystem) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onUpdate(system.id, field, e.target.value);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 bg-[#1e3a5f] flex items-center justify-between">
        <input
          type="text"
          value={system.name}
          onChange={(e) => onUpdate(system.id, 'name', e.target.value)}
          className="bg-transparent text-white font-semibold border-none outline-none focus:ring-2 focus:ring-white/30 rounded px-2 py-1 -ml-2"
          placeholder="System Name"
        />
        {canRemove && (
          <button
            onClick={() => onRemove(system.id)}
            className="text-red-300 hover:text-red-100 transition-colors p-1"
            title="Remove system"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3 mb-3">
          <InputField
            label="Cond"
            name={`system-${system.id}-cond`}
            value={system.cond}
            onChange={handleChange('cond')}
            placeholder="0"
          />
          <InputField
            label="pH"
            name={`system-${system.id}-ph`}
            value={system.ph}
            onChange={handleChange('ph')}
            placeholder="0"
            field="systemPh"
          />
          <InputField
            label="TrH"
            name={`system-${system.id}-trh`}
            value={system.trh}
            onChange={handleChange('trh')}
            placeholder="0"
            field="systemTrh"
          />
        </div>
        <TextArea
          label="Notes"
          name={`system-${system.id}-notes`}
          value={system.notes}
          onChange={handleChange('notes')}
          placeholder="Notes"
          rows={1}
        />
      </div>
    </div>
  );
}
