import { useState, useRef } from 'react';
import { ChevronDown, Download, Trash2 } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';

interface BulkActionsMenuProps {
  selectedCount: number;
  onExport: () => void;
  onDelete: () => void;
}

export function BulkActionsMenu({ selectedCount, onExport, onDelete }: BulkActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsOpen(false));

  if (selectedCount === 0) {
    return (
      <button
        disabled
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-400 bg-gray-50 cursor-not-allowed"
      >
        <span>Bulk Actions</span>
        <ChevronDown className="ml-2 h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span>Bulk Actions ({selectedCount})</span>
        <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <button
              onClick={() => {
                onExport();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Selected
            </button>
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </button>
          </div>
        </div>
      )}
    </div>
  );
}