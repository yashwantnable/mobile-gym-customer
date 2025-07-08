import  { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FilterPanel = ({ filters, onFilterChange, onReset, locations, categories, sessionTypes }) => {
    // State for search, expanded lists, and collapsed sections
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState({
        location: false,
        category: false,
        sessionType: false,
    });
    const [collapsed, setCollapsed] = useState({
        location: true,
        category: true,
        sessionType: true,
    });

    // Filter options by search
    const filterOptions = (options) => {
        if (!search) return options;
        return options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));
    };

    // Handle checkbox change
    const handleCheckboxChange = (key, value) => {
        let current = filters[key] || [];
        if (current.includes(value)) {
            current = current.filter(v => v !== value);
        } else {
            current = [...current, value];
        }
        onFilterChange({
            ...filters,
            [key]: current
        });
    };

    // Handle clear all
    const hasActiveFilters = Object.values(filters).some(
        value => Array.isArray(value) ? value.length > 0 : value !== ''
    );

    // Render checkbox list with show more and collapse/expand
    const renderCheckboxList = (label, key, options) => {
        const filtered = filterOptions(options);
        const showAll = expanded[key];
        const visible = showAll ? filtered : filtered.slice(0, 5);
        const remaining = filtered.length - visible.length;
        const isCollapsed = collapsed[key];
        return (
            <div className="">
                <button
                    className="flex items-center justify-between w-full mb-2 focus:outline-none"
                    onClick={() => setCollapsed(c => ({ ...c, [key]: !c[key] }))}
                    type="button"
                >
                    <span className="font-semibold text-gray-800 text-sm">{label}</span>
                    <ChevronDown
                        className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}
                    />
                </button>
                {!isCollapsed && (
                    <div className="space-y-2">
                        {visible.map(option => (
                            <label key={option} className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={Array.isArray(filters[key]) ? filters[key].includes(option) : false}
                                    onChange={() => handleCheckboxChange(key, option)}
                                    className="w-5 h-5 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                        {remaining > 0 && !showAll && (
                            <button
                                className="text-sixth text-xs font-medium hover:underline ml-1"
                                onClick={() => setExpanded(e => ({ ...e, [key]: true }))}
                            >
                                +{remaining} more
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-md border border-gray-200 p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg text-gray-900">FILTERS</span>
                {hasActiveFilters && (
                    <button
                        onClick={onReset}
                        className="text-sixth text-sm font-semibold hover:underline"
                    >
                        Clear all
                    </button>
                )}
            </div>
            {/* Search box */}
            <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full mb-2 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"
            />
            {/* Checkbox lists with collapse/expand */}
            {renderCheckboxList('Location', 'location', locations)}
            {renderCheckboxList('Category', 'category', categories)}
            {renderCheckboxList('Session Type', 'sessionType', sessionTypes)}
        </div>
    );
};

export default FilterPanel;