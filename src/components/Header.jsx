export default function Header({ setIsLoggedIn, setSidebarOpen, sidebarOpen }) {
  const adminData = JSON.parse(localStorage.getItem("adminData"));

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg w-full h-16">
      <div className="flex items-center justify-between p-4 h-full mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-white focus:outline-none"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <div className="text-lg sm:text-xl font-semibold text-white">
            Admin Dashboard
          </div>
        </div>
        
        <div className="flex items-center space-x-3 sm:space-x-6">
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-medium text-sm sm:text-base">
                {adminData?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="ml-2 sm:ml-3 text-left hidden sm:block">
              <p className="text-xs sm:text-sm font-medium text-white">{adminData?.name || "Admin"}</p>
              <p className="text-xs text-white/80">Administrator</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-indigo-600 bg-white rounded-md hover:bg-white/90 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            <span className="hidden xs:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}