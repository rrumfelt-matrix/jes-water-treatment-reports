import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { ValidationStatus } from '../types';

interface StatusIndicatorProps {
  status: ValidationStatus;
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  if (status === 'neutral') return null;
  if (status === 'good') return <CheckCircle className="w-4 h-4 text-green-500 inline ml-1" />;
  if (status === 'low') return <AlertCircle className="w-4 h-4 text-red-500 inline ml-1" />;
  if (status === 'high') return <AlertTriangle className="w-4 h-4 text-amber-500 inline ml-1" />;
  return null;
}
