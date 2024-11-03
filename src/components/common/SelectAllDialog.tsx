import { useState } from 'react';

interface SelectAllDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPage: () => void;
  onSelectAll: () => void;
  currentPageCount: number;
  totalCount: number;
}

export function SelectAllDialog({
  isOpen,
  onClose,
  onSelectPage,
  onSelectAll,
  currentPageCount,
  totalCount
}: SelectAllDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Select All Leads</h3>
              <div className="mt-4 space-y-4">
                <button
                  onClick={onSelectPage}
                  className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <p className="font-medium text-gray-900">Select {currentPageCount} leads on this page</p>
                  <p className="text-sm text-gray-500">Only select leads from the current page</p>
                </button>
                <button
                  onClick={onSelectAll}
                  className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <p className="font-medium text-gray-900">Select all {totalCount} leads</p>
                  <p className="text-sm text-gray-500">Select leads from all pages</p>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}