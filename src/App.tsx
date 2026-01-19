import { useState, useEffect, ChangeEvent } from 'react';
import { useMsal } from '@azure/msal-react';
import { FileText, Download } from 'lucide-react';
import { Header } from './components/Header';
import { DataEntryForm } from './components/DataEntryForm';
import { ReportPreview } from './components/ReportPreview';
import {
  FormData,
  Boiler,
  SupportSystem,
  ClosedLoop,
  initialFormData,
  createBoiler,
  createSupportSystem,
  createClosedLoop,
} from './types';
import { generatePDF } from './lib/pdfGenerator';
import { isAuthConfigured, getExpectedTenantId } from './lib/auth';
import { formatPhoneNumberOnInput } from './lib/formatters';

function App() {
  const { accounts } = useMsal();
  const authConfigured = isAuthConfigured();
  const expectedTenantId = getExpectedTenantId();

  // Check if user is authenticated AND from the correct tenant AND has correct email domain
  const allowedDomain = 'jasperequipment.com';
  const validAccount = accounts.find(acc => {
    const email = acc.username?.toLowerCase() || '';
    return acc.tenantId === expectedTenantId && email.endsWith(`@${allowedDomain}`);
  });
  const isAuthorized = authConfigured && !!validAccount;
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Load form data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('waterTreatmentFormData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure arrays exist for backward compatibility
        const migrated: FormData = {
          ...initialFormData,
          ...parsed,
          boilers: parsed.boilers?.length ? parsed.boilers : initialFormData.boilers,
          supportSystems: parsed.supportSystems?.length ? parsed.supportSystems : initialFormData.supportSystems,
          closedLoops: parsed.closedLoops?.length ? parsed.closedLoops : initialFormData.closedLoops,
        };
        setFormData(migrated);
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save form data to localStorage on change
  useEffect(() => {
    localStorage.setItem('waterTreatmentFormData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Handle boolean checkbox values
    if (name === 'includeCoverPage') {
      setFormData((prev) => ({ ...prev, [name]: value === 'true' }));
    } else if (name === 'phone') {
      // Format phone number as user types
      setFormData((prev) => ({ ...prev, [name]: formatPhoneNumberOnInput(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGeneratePDF = async () => {
    await generatePDF(formData);
  };

  // Boiler handlers
  const handleAddBoiler = () => {
    setFormData((prev) => ({
      ...prev,
      boilers: [...prev.boilers, createBoiler(`Boiler ${prev.boilers.length + 1}`)],
    }));
  };

  const handleUpdateBoiler = (id: string, field: keyof Boiler, value: string) => {
    setFormData((prev) => ({
      ...prev,
      boilers: prev.boilers.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
    }));
  };

  const handleRemoveBoiler = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      boilers: prev.boilers.filter((b) => b.id !== id),
    }));
  };

  // Support System handlers
  const handleAddSupportSystem = () => {
    setFormData((prev) => ({
      ...prev,
      supportSystems: [...prev.supportSystems, createSupportSystem(`System ${prev.supportSystems.length + 1}`)],
    }));
  };

  const handleUpdateSupportSystem = (id: string, field: keyof SupportSystem, value: string) => {
    setFormData((prev) => ({
      ...prev,
      supportSystems: prev.supportSystems.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
  };

  const handleRemoveSupportSystem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      supportSystems: prev.supportSystems.filter((s) => s.id !== id),
    }));
  };

  // Closed Loop handlers
  const handleAddClosedLoop = () => {
    setFormData((prev) => ({
      ...prev,
      closedLoops: [...prev.closedLoops, createClosedLoop(`Loop ${prev.closedLoops.length + 1}`)],
    }));
  };

  const handleUpdateClosedLoop = (id: string, field: keyof ClosedLoop, value: string) => {
    setFormData((prev) => ({
      ...prev,
      closedLoops: prev.closedLoops.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    }));
  };

  const handleRemoveClosedLoop = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      closedLoops: prev.closedLoops.filter((l) => l.id !== id),
    }));
  };

  // Show login prompt if auth is configured but user is not authorized (authenticated + correct tenant)
  if (authConfigured && !isAuthorized) {
    const hasWrongTenantAccount = accounts.length > 0 && !validAccount;

    const handleLogin = () => {
      import('./lib/auth').then(({ msalInstance, loginRequest }) => {
        msalInstance.loginRedirect(loginRequest);
      });
    };

    const handleLogout = () => {
      import('./lib/auth').then(({ msalInstance }) => {
        msalInstance.logoutRedirect();
      });
    };

    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-4">
          <img
            src={`${import.meta.env.BASE_URL}logo.avif`}
            alt="Jasper Equipment & Supply"
            className="h-20 w-auto mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">Water Treatment Reports</h2>
          {hasWrongTenantAccount ? (
            <>
              <p className="text-red-600 mb-4">
                Access denied. This application is only available to Jasper Equipment & Supply employees.
              </p>
              <p className="text-slate-500 text-sm mb-6">
                You are signed in with an unauthorized account.
              </p>
              <button
                onClick={handleLogout}
                className="w-full px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <p className="text-slate-600 mb-6">
                Sign in with your Jasper Equipment Microsoft account to continue.
              </p>
              <button
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2c5282] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                </svg>
                Sign in with Microsoft
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      {/* Tab Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'form'
                  ? 'border-[#1e3a5f] text-[#1e3a5f]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <FileText className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
              Form
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'preview'
                  ? 'border-[#1e3a5f] text-[#1e3a5f]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <FileText className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
              Preview
            </button>
          </div>
          <button
            onClick={handleGeneratePDF}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors bg-[#1e3a5f] text-white hover:bg-[#2c5282]"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === 'form' ? (
          <DataEntryForm
            formData={formData}
            onChange={handleChange}
            onAddBoiler={handleAddBoiler}
            onUpdateBoiler={handleUpdateBoiler}
            onRemoveBoiler={handleRemoveBoiler}
            onAddSupportSystem={handleAddSupportSystem}
            onUpdateSupportSystem={handleUpdateSupportSystem}
            onRemoveSupportSystem={handleRemoveSupportSystem}
            onAddClosedLoop={handleAddClosedLoop}
            onUpdateClosedLoop={handleUpdateClosedLoop}
            onRemoveClosedLoop={handleRemoveClosedLoop}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[calc(100vh-180px)]">
            <ReportPreview formData={formData} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
