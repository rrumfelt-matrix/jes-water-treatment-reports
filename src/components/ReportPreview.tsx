import { useEffect, useState, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { FormData } from '../types';
import { getPDFBlobUrl } from '../lib/pdfGenerator';

interface ReportPreviewProps {
  formData: FormData;
}

export function ReportPreview({ formData }: ReportPreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const previousUrlRef = useRef<string | null>(null);

  const regeneratePdf = useCallback(async () => {
    setIsLoading(true);
    // Revoke previous URL to free memory
    if (previousUrlRef.current) {
      URL.revokeObjectURL(previousUrlRef.current);
    }
    try {
      const url = await getPDFBlobUrl(formData);
      previousUrlRef.current = url;
      setPdfUrl(url);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
    setIsLoading(false);
  }, [formData]);

  useEffect(() => {
    regeneratePdf();

    // Cleanup on unmount
    return () => {
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, [regeneratePdf]);

  return (
    <div className="h-full">
      {isLoading ? (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <span>Generating preview...</span>
        </div>
      ) : pdfUrl ? (
        <iframe src={pdfUrl} className="w-full h-full border-0" title="PDF Preview" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-500">
          Failed to load preview
        </div>
      )}
    </div>
  );
}
