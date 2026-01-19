import { ChangeEvent } from 'react';
import { Plus } from 'lucide-react';
import { FormData, Boiler, SupportSystem, ClosedLoop } from '../types';
import { Section } from './Section';
import { InputField } from './InputField';
import { TextArea } from './TextArea';
import { SelectField } from './SelectField';
import { BoilerSection } from './BoilerSection';
import { SupportSystemSection } from './SupportSystemSection';
import { ClosedLoopSection } from './ClosedLoopSection';

const serviceFrequencyOptions = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi-weekly', label: 'Bi-Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

interface DataEntryFormProps {
  formData: FormData;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onAddBoiler: () => void;
  onUpdateBoiler: (id: string, field: keyof Boiler, value: string) => void;
  onRemoveBoiler: (id: string) => void;
  onAddSupportSystem: () => void;
  onUpdateSupportSystem: (id: string, field: keyof SupportSystem, value: string) => void;
  onRemoveSupportSystem: (id: string) => void;
  onAddClosedLoop: () => void;
  onUpdateClosedLoop: (id: string, field: keyof ClosedLoop, value: string) => void;
  onRemoveClosedLoop: (id: string) => void;
}

export function DataEntryForm({
  formData,
  onChange,
  onAddBoiler,
  onUpdateBoiler,
  onRemoveBoiler,
  onAddSupportSystem,
  onUpdateSupportSystem,
  onRemoveSupportSystem,
  onAddClosedLoop,
  onUpdateClosedLoop,
  onRemoveClosedLoop,
}: DataEntryFormProps) {
  return (
    <div className="space-y-4">
      {/* Header Info */}
      <Section title="Report Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={onChange}
          />
          <InputField
            label="Technician"
            name="technician"
            value={formData.technician}
            onChange={onChange}
            placeholder="Technician name"
          />
          <SelectField
            label="Service Frequency"
            name="serviceFrequency"
            value={formData.serviceFrequency}
            onChange={onChange}
            options={serviceFrequencyOptions}
          />
          <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-3">
            <input
              type="checkbox"
              id="includeCoverPage"
              name="includeCoverPage"
              checked={formData.includeCoverPage}
              onChange={(e) => onChange({
                ...e,
                target: {
                  ...e.target,
                  name: 'includeCoverPage',
                  value: e.target.checked ? 'true' : 'false',
                }
              } as React.ChangeEvent<HTMLInputElement>)}
              className="w-4 h-4 text-[#1e3a5f] border-slate-300 rounded focus:ring-[#1e3a5f]"
            />
            <label htmlFor="includeCoverPage" className="text-sm text-slate-700">
              Include cover page in PDF report
            </label>
          </div>
          <InputField
            label="Site Name"
            name="plantName"
            value={formData.plantName}
            onChange={onChange}
            placeholder="Site name"
          />
          <InputField
            label="Contact"
            name="attention"
            value={formData.attention}
            onChange={onChange}
            placeholder="Contact name"
          />
          <InputField
            label="Contact Phone"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            placeholder="Phone number"
          />
          <div className="sm:col-span-2 lg:col-span-1">
            <InputField
              label="Site Address"
              name="address"
              value={formData.address}
              onChange={onChange}
              placeholder="Address"
            />
          </div>
        </div>
      </Section>

      {/* Boilers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1e3a5f]">Boilers</h2>
          <button
            onClick={onAddBoiler}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2c5282] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Boiler
          </button>
        </div>
        {formData.boilers.map((boiler) => (
          <BoilerSection
            key={boiler.id}
            boiler={boiler}
            onUpdate={onUpdateBoiler}
            onRemove={onRemoveBoiler}
            canRemove={formData.boilers.length > 1}
          />
        ))}
      </div>

      {/* Support Systems Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1e3a5f]">Support Systems</h2>
          <button
            onClick={onAddSupportSystem}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2c5282] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add System
          </button>
        </div>
        {formData.supportSystems.map((system) => (
          <SupportSystemSection
            key={system.id}
            system={system}
            onUpdate={onUpdateSupportSystem}
            onRemove={onRemoveSupportSystem}
            canRemove={formData.supportSystems.length > 1}
          />
        ))}
      </div>

      {/* Closed Loops Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1e3a5f]">Closed Loops</h2>
          <button
            onClick={onAddClosedLoop}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2c5282] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Loop
          </button>
        </div>
        {formData.closedLoops.map((loop) => (
          <ClosedLoopSection
            key={loop.id}
            loop={loop}
            onUpdate={onUpdateClosedLoop}
            onRemove={onRemoveClosedLoop}
            canRemove={formData.closedLoops.length > 1}
          />
        ))}
      </div>

      {/* General Notes */}
      <Section title="General Notes">
        <TextArea
          name="generalNotes"
          value={formData.generalNotes}
          onChange={onChange}
          placeholder="Notes"
          rows={4}
        />
      </Section>
    </div>
  );
}
