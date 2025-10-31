'use client';

import { CodenameFilter as CodenameFilterType } from '../types/catalog';

interface CodenameFilterProps {
  codenames: CodenameFilterType[];
  onCodenameChange: (codenameId: string, checked: boolean) => void;
}

export default function CodenameFilter({ 
  codenames, 
  onCodenameChange 
}: CodenameFilterProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {codenames.map((codename) => (
          <label key={codename.id} className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={codename.checked}
              onChange={(e) => onCodenameChange(codename.id, e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <div className="ml-3 flex items-center gap-2 flex-1">
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                {codename.id.toUpperCase()}
              </span>
              <span className="text-sm text-gray-700">
                {codename.name}
              </span>
            </div>
          </label>
        ))}
      </div>

      {/* Search functionality */}
      <div className="mt-3">
        <input
          type="text"
          placeholder="Search codenames..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            // In a real app, this would filter the codename list
            console.log('Search codenames:', e.target.value);
          }}
        />
      </div>

      {/* Select all / Clear all */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => {
            codenames.forEach(codename => {
              if (!codename.checked) {
                onCodenameChange(codename.id, true);
              }
            });
          }}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          Select All
        </button>
        <span className="text-xs text-gray-400">|</span>
        <button
          onClick={() => {
            codenames.forEach(codename => {
              if (codename.checked) {
                onCodenameChange(codename.id, false);
              }
            });
          }}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}