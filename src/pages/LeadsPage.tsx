import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, ChevronLeft, ChevronRight, Trash2, PenSquare } from 'lucide-react';
import { useLeadStore } from '../store/leadStore';
import { DeleteConfirmationDialog } from '../components/common/DeleteConfirmationDialog';
import { SelectAllDialog } from '../components/common/SelectAllDialog';
import { BulkActionsMenu } from '../components/leads/BulkActionsMenu';
import { LeadsFilters } from '../components/leads/LeadsFilters';

export function LeadsPage() {
  const navigate = useNavigate();
  const { leads, deleteLead } = useLeadStore();
  const [deleteLeadId, setDeleteLeadId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [selectAllDialogOpen, setSelectAllDialogOpen] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  const handleLeadClick = (leadId: string) => {
    navigate(`/leads/${leadId}`);
  };

  const handleEditClick = (e: React.MouseEvent, leadId: string) => {
    e.stopPropagation();
    navigate(`/leads/${leadId}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent, leadId: string) => {
    e.stopPropagation();
    setDeleteLeadId(leadId);
  };

  const handleDeleteConfirm = () => {
    if (deleteLeadId) {
      deleteLead(deleteLeadId);
      setDeleteLeadId(null);
    }
  };

  const handleFiltersChange = (filters: any) => {
    // Apply filters to leads
    console.log('Filters changed:', filters);
  };

  const handleCheckboxClick = (e: React.MouseEvent, leadId: string) => {
    e.stopPropagation();
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const handleSelectAllClick = () => {
    if (selectedLeads.size === leads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectAllDialogOpen(true);
    }
  };

  const handleSelectPage = () => {
    const newSelected = new Set(leads.map(lead => lead.id));
    setSelectedLeads(newSelected);
    setSelectAllDialogOpen(false);
  };

  const handleSelectAll = () => {
    // In a real app, this would select all leads across all pages
    const newSelected = new Set(leads.map(lead => lead.id));
    setSelectedLeads(newSelected);
    setSelectAllDialogOpen(false);
  };

  const handleBulkExport = () => {
    // Implement export functionality
    console.log('Exporting leads:', Array.from(selectedLeads));
  };

  const handleBulkDelete = () => {
    setShowBulkDeleteDialog(true);
  };

  const handleBulkDeleteConfirm = () => {
    selectedLeads.forEach(id => deleteLead(id));
    setSelectedLeads(new Set());
    setShowBulkDeleteDialog(false);
  };

  const renderPersons = (lead: any) => {
    if (!lead.persons || lead.persons.length === 0) {
      return <div className="text-gray-400">No persons added</div>;
    }

    return (
      <div className="space-y-1">
        {lead.persons.map((p: any, index: number) => (
          <div key={p.person.id} className={index === 0 ? "font-medium" : "text-gray-500"}>
            {p.person.name}
            <span className="text-gray-400 text-sm ml-1">
              ({p.person.designation})
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your leads and track their progress</p>
            </div>
            <Link
              to="/leads/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Lead
            </Link>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search leads..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 ${
                  showFilters ? 'bg-gray-100' : 'bg-white'
                } hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <BulkActionsMenu
                selectedCount={selectedLeads.size}
                onExport={handleBulkExport}
                onDelete={handleBulkDelete}
              />
            </div>
          </div>

          {showFilters && (
            <div className="mt-6">
              <LeadsFilters onFiltersChange={handleFiltersChange} />
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    checked={selectedLeads.size > 0 && selectedLeads.size === leads.length}
                    ref={input => {
                      if (input) {
                        input.indeterminate = selectedLeads.size > 0 && selectedLeads.size < leads.length;
                      }
                    }}
                    onChange={handleSelectAllClick}
                  />
                </th>
                {['Job Title', 'Company Name', 'Relevant Persons', 'Company Location', 'Status', 'Actions'].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                    No leads yet
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => handleLeadClick(lead.id)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  >
                    <td className="w-12 px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        checked={selectedLeads.has(lead.id)}
                        onChange={(e) => handleCheckboxClick(e as any, lead.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lead.jobTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.companyName}</div>
                    </td>
                    <td className="px-6 py-4">
                      {renderPersons(lead)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{lead.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          lead.status === 'HIRED'
                            ? 'bg-green-100 text-green-800'
                            : lead.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800'
                            : lead.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      `}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => handleEditClick(e, lead.id)}
                          className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <PenSquare className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(e, lead.id)}
                          className="p-1 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                <span className="font-medium">{leads.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationDialog
        isOpen={!!deleteLeadId}
        onClose={() => setDeleteLeadId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
      />

      <DeleteConfirmationDialog
        isOpen={showBulkDeleteDialog}
        onClose={() => setShowBulkDeleteDialog(false)}
        onConfirm={handleBulkDeleteConfirm}
        title="Delete Selected Leads"
        message={`Are you sure you want to delete ${selectedLeads.size} selected leads? This action cannot be undone.`}
      />

      <SelectAllDialog
        isOpen={selectAllDialogOpen}
        onClose={() => setSelectAllDialogOpen(false)}
        onSelectPage={handleSelectPage}
        onSelectAll={handleSelectAll}
        currentPageCount={leads.length}
        totalCount={leads.length} // In a real app, this would be the total count across all pages
      />
    </div>
  );
}