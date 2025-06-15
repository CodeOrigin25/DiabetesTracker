import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User, FileText, BarChart2, Upload, Activity } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-blue-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Activity className="h-8 w-8 text-white" />
              <span className="ml-2 text-white text-xl font-semibold">DiabetesTracker</span>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-100 hover:bg-blue-600'
                  }`
                }
              >
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-100 hover:bg-blue-600'
                  }`
                }
              >
                <User className="mr-3 h-5 w-5" />
                Profile
              </NavLink>
              <NavLink
                to="/records"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-100 hover:bg-blue-600'
                  }`
                }
              >
                <FileText className="mr-3 h-5 w-5" />
                Health Records
              </NavLink>
              <NavLink
                to="/analyze"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-100 hover:bg-blue-600'
                  }`
                }
              >
                <Upload className="mr-3 h-5 w-5" />
                Analyze Documents
              </NavLink>
              <NavLink
                to="/analysis"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-100 hover:bg-blue-600'
                  }`
                }
              >
                <BarChart2 className="mr-3 h-5 w-5" />
                Analysis
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;