import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { User, LogOut } from 'lucide-react';
import { loginRequest, isAuthConfigured } from '../lib/auth';

export function Header() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const authConfigured = isAuthConfigured();

  const activeAccount = accounts[0];

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  return (
    <header className="bg-[#1e3a5f] shadow-lg sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={`${import.meta.env.BASE_URL}logo.avif`}
              alt="Jasper Equipment & Supply"
              className="h-12 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-white">Water Treatment Reports</h1>
              <p className="text-xs text-blue-200">Field Analysis System</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {authConfigured ? (
              isAuthenticated && activeAccount ? (
                <>
                  <div className="text-right mr-3 hidden sm:block">
                    <p className="text-sm font-medium text-white">{activeAccount.name}</p>
                    <p className="text-xs text-blue-200">{activeAccount.username}</p>
                  </div>
                  <div className="w-9 h-9 bg-blue-400/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-200" />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-2 p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-white text-[#1e3a5f] rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Sign In
                </button>
              )
            ) : (
              <div className="text-right mr-3">
                <p className="text-sm font-medium text-white">Demo Mode</p>
                <p className="text-xs text-blue-200">Auth not configured</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
