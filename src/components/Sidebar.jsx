import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
      </div>
      <nav className="mt-6">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => 
            `flex items-center px-4 py-2 ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/pending-retailers"
          className={({ isActive }) => 
            `flex items-center px-4 py-2 ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`
          }
        >
          Pending Retailers
        </NavLink>
        <NavLink
          to="/all-retailers"
          className={({ isActive }) => 
            `flex items-center px-4 py-2 ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`
          }
        >
          All Retailers
        </NavLink>
      </nav>
    </div>
  );
}