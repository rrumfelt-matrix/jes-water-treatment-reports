import { Trash2 } from 'lucide-react';
import { ClosedLoop } from '../types';
import { InputField } from './InputField';
import { TextArea } from './TextArea';

interface ClosedLoopSectionProps {
  loop: ClosedLoop;
  onUpdate: (id: string, field: keyof ClosedLoop, value: string) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export function ClosedLoopSection({ loop, onUpdate, onRemove, canRemove }: ClosedLoopSectionProps) {
  const handleChange = (field: keyof ClosedLoop) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onUpdate(loop.id, field, e.target.value);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 bg-[#1e3a5f] flex items-center justify-between">
        <input
          type="text"
          value={loop.name}
          onChange={(e) => onUpdate(loop.id, 'name', e.target.value)}
          className="bg-transparent text-white font-semibold border-none outline-none focus:ring-2 focus:ring-white/30 rounded px-2 py-1 -ml-2"
          placeholder="Loop Name"
        />
        {canRemove && (
          <button
            onClick={() => onRemove(loop.id)}
            className="text-red-300 hover:text-red-100 transition-colors p-1"
            title="Remove loop"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          <InputField
            label="pH"
            name={`loop-${loop.id}-ph`}
            value={loop.ph}
            onChange={handleChange('ph')}
            placeholder="0"
            field="loopPh"
          />
          <InputField
            label="Cond"
            name={`loop-${loop.id}-cond`}
            value={loop.cond}
            onChange={handleChange('cond')}
            placeholder="0"
          />
          <InputField
            label="NO2 Hot"
            name={`loop-${loop.id}-no2Hot`}
            value={loop.no2Hot}
            onChange={handleChange('no2Hot')}
            placeholder="0"
            field="loopNo2Hot"
          />
          <InputField
            label="NO2 Cold"
            name={`loop-${loop.id}-no2Cold`}
            value={loop.no2Cold}
            onChange={handleChange('no2Cold')}
            placeholder="0"
            field="loopNo2Cold"
          />
        </div>
        <TextArea
          label="Notes"
          name={`loop-${loop.id}-notes`}
          value={loop.notes}
          onChange={handleChange('notes')}
          placeholder="Notes"
          rows={1}
        />
      </div>
    </div>
  );
}
