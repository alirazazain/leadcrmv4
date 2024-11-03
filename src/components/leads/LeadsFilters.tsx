import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

// Mock data for teams and users
const mockTeams = [
  { id: '1', name: 'Sales Team Alpha' },
  { id: '2', name: 'Business Development' },
  { id: '3', name: 'Enterprise Solutions' },
  { id: '4', name: 'SMB Team' },
];

const mockUsers = [
  { id: '1', name: 'John Doe', teamId: '1' },
  { id: '2', name: 'Jane Smith', teamId: '1' },
  { id: '3', name: 'Mike Johnson', teamId: '2' },
  { id: '4', name: 'Sarah Williams', teamId: '2' },
  { id: '5', name: 'Robert Brown', teamId: '3' },
  { id: '6', name: 'Emily Davis', teamId: '3' },
  { id: '7', name: 'David Wilson', teamId: '4' },
  { id: '8', name: 'Lisa Anderson', teamId: '4' },
];

const sourceOptions = [
  'LinkedIn',
  'Addusjobs',
  'Adzuna',
  'Angelist',
  'Bebee',
  'Career Builder',
  'GlassDoor',
  'Google Careers',
  'Google Jobs',
];

const dateRangeOptions = [
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 days', value: '7days' },
  { label: 'Last 30 days', value: '30days' },
  { label: 'Custom Range', value: 'custom' },
];

interface FiltersState {
  team: string;
  user: string;
  dateRange: string;
  startDate: Date | null;
  endDate: Date | null;
  source: string;
  country: string;
}

interface LeadsFiltersProps {
  onFiltersChange: (filters: FiltersState) => void;
}

export function LeadsFilters({ onFiltersChange }: LeadsFiltersProps) {
  const [filters, setFilters] = useState<FiltersState>({
    team: '',
    user: '',
    dateRange: '',
    startDate: null,
    endDate: null,
    source: '',
    country: '',
  });

  const [availableUsers, setAvailableUsers] = useState(mockUsers);
  const [countrySearchResults, setCountrySearchResults] = useState<string[]>([]);
  const [isCustomDate, setIsCustomDate] = useState(false);

  // Update available users when team changes
  useEffect(() => {
    if (filters.team) {
      const filteredUsers = mockUsers.filter(user => user.teamId === filters.team);
      setAvailableUsers(filteredUsers);
      // Reset user selection if current user is not in the new team
      if (!filteredUsers.find(u => u.id === filters.user)) {
        setFilters(prev => ({ ...prev, user: '' }));
      }
    } else {
      setAvailableUsers(mockUsers);
    }
  }, [filters.team]);

  // Notify parent component when filters change
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleDateRangeChange = (value: string) => {
    setIsCustomDate(value === 'custom');
    setFilters(prev => ({ ...prev, dateRange: value }));
  };

  const handleCountrySearch = (query: string) => {
    // Mock country search - in real app, this would call an API
    const mockCountries = [
      'United States',
      'United Kingdom',
      'Canada',
      'Australia',
      'Germany',
      'France',
      'Spain',
      'Italy',
      'Japan',
      'India',
    ];

    const results = mockCountries.filter(country =>
      country.toLowerCase().includes(query.toLowerCase())
    );
    setCountrySearchResults(results);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Team Filter */}
        <div>
          <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
            Team
          </label>
          <select
            id="team"
            value={filters.team}
            onChange={(e) => setFilters(prev => ({ ...prev, team: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Teams</option>
            {mockTeams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {/* User Filter */}
        <div>
          <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
            User
          </label>
          <select
            id="user"
            value={filters.user}
            onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Users</option>
            {availableUsers.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* Source Filter */}
        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
            Source
          </label>
          <select
            id="source"
            value={filters.source}
            onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Sources</option>
            {sourceOptions.map(source => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="col-span-2">
          <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <div className="flex gap-4">
            <select
              id="dateRange"
              value={filters.dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Time</option>
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {isCustomDate && (
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <input
                    type="date"
                    value={filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      startDate: e.target.value ? new Date(e.target.value) : null
                    }))}
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <span className="text-gray-500">to</span>
                <div className="relative">
                  <input
                    type="date"
                    value={filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      endDate: e.target.value ? new Date(e.target.value) : null
                    }))}
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Country Filter */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <div className="relative">
            <input
              type="text"
              id="country"
              value={filters.country}
              onChange={(e) => {
                const value = e.target.value;
                setFilters(prev => ({ ...prev, country: value }));
                handleCountrySearch(value);
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search country..."
            />
            {filters.country && countrySearchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                <ul className="py-1 max-h-48 overflow-auto">
                  {countrySearchResults.map((country) => (
                    <li
                      key={country}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setFilters(prev => ({ ...prev, country }));
                        setCountrySearchResults([]);
                      }}
                    >
                      {country}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}