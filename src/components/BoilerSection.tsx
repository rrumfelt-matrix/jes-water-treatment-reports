import { Trash2 } from 'lucide-react';
import { Boiler } from '../types';
import { InputField } from './InputField';
import { TextArea } from './TextArea';

interface BoilerSectionProps {
  boiler: Boiler;
  onUpdate: (id: string, field: keyof Boiler, value: string) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export function BoilerSection({ boiler, onUpdate, onRemove, canRemove }: BoilerSectionProps) {
  const handleChange = (field: keyof Boiler) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onUpdate(boiler.id, field, e.target.value);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 bg-[#1e3a5f] flex items-center justify-between">
        <input
          type="text"
          value={boiler.name}
          onChange={(e) => onUpdate(boiler.id, 'name', e.target.value)}
          className="bg-transparent text-white font-semibold border-none outline-none focus:ring-2 focus:ring-white/30 rounded px-2 py-1 -ml-2"
          placeholder="Boiler Name"
        />
        {canRemove && (
          <button
            onClick={() => onRemove(boiler.id)}
            className="text-red-300 hover:text-red-100 transition-colors p-1"
            title="Remove boiler"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-3">
          <InputField
            label="pH"
            name={`boiler-${boiler.id}-ph`}
            value={boiler.ph}
            onChange={handleChange('ph')}
            placeholder="0"
            field="boilerPh"
          />
          <InputField
            label="SO3"
            name={`boiler-${boiler.id}-so3`}
            value={boiler.so3}
            onChange={handleChange('so3')}
            placeholder="0"
            field="boilerSo3"
          />
          <InputField
            label="P-Alk"
            name={`boiler-${boiler.id}-pAlk`}
            value={boiler.pAlk}
            onChange={handleChange('pAlk')}
            placeholder="0"
            field="boilerPAlk"
          />
          <InputField
            label="M-Alk"
            name={`boiler-${boiler.id}-mAlk`}
            value={boiler.mAlk}
            onChange={handleChange('mAlk')}
            placeholder="0"
            field="boilerMAlk"
          />
          <InputField
            label="OH-Alk"
            name={`boiler-${boiler.id}-ohAlk`}
            value={boiler.ohAlk}
            onChange={handleChange('ohAlk')}
            placeholder="0"
            field="boilerOhAlk"
          />
          <InputField
            label="Cond"
            name={`boiler-${boiler.id}-cond`}
            value={boiler.cond}
            onChange={handleChange('cond')}
            placeholder="0"
            field="boilerCond"
          />
          <InputField
            label="Fluor"
            name={`boiler-${boiler.id}-fluor`}
            value={boiler.fluor}
            onChange={handleChange('fluor')}
            placeholder="0"
            field="boilerFluor"
          />
        </div>
        <TextArea
          label="Notes"
          name={`boiler-${boiler.id}-notes`}
          value={boiler.notes}
          onChange={handleChange('notes')}
          placeholder="Notes"
        />
      </div>
    </div>
  );
}
