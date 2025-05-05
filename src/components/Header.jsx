export default function Header({ setIsLoggedIn }) {
  const adminData = JSON.parse(localStorage.getItem("adminData"));

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    setIsLoggedIn(false);

    window.location.href = "/login";
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="text-lg font-medium text-gray-800">
          Welcome, {adminData?.name || "Admin"}
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
