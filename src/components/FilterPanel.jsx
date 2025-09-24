import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FilterPanel = ({
  filters,
  onFilterChange,
  lightMode,
  onReset,
  locations = [],
  categories = [],
  sessionTypes = [],
}) => {
  const [search, setSearch] = useState("");
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

  const filterOptions = (options) => {
    if (!search) return options;
    return options.filter((opt) =>
      opt.name.toLowerCase().includes(search.toLowerCase())
    );
  };

  const handleCheckboxChange = (key, value) => {
    let current = filters[key] || [];
    if (current.includes(value)) {
      current = current.filter((v) => v !== value);
    } else {
      current = [...current, value];
    }
    onFilterChange({
      ...filters,
      [key]: current,
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) =>
    Array.isArray(value) ? value.length > 0 : value !== ""
  );

  const renderCheckboxList = (label, key, options) => {
    const filtered = filterOptions(options);
    const showAll = expanded[key];
    const visible = showAll ? filtered : filtered.slice(0, 5);
    const remaining = filtered.length - visible.length;
    const isCollapsed = collapsed[key];
    return (
      <div>
        <button
          className="flex items-center justify-between w-full mb-2 focus:outline-none"
          onClick={() => setCollapsed((c) => ({ ...c, [key]: !c[key] }))}
          type="button"
        >
          <span
            className={`font-semibold text-sm ${
              lightMode ? "text-gray-800" : "text-gray-200"
            }`}
          >
            {label}
          </span>
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-200 ${
              lightMode ? "text-gray-500" : "text-gray-400"
            } ${isCollapsed ? "-rotate-90" : "rotate-0"}`}
          />
        </button>
        {!isCollapsed && (
          <div className="space-y-2">
            {visible.map((option) => (
              <label
                key={option.id}
                className={`flex items-center gap-2 text-sm cursor-pointer ${
                  lightMode ? "text-gray-700" : "text-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={
                    Array.isArray(filters[key])
                      ? filters[key].includes(option.id)
                      : false
                  }
                  onChange={() => handleCheckboxChange(key, option.id)}
                  className={`w-5 h-5 rounded border ${
                    lightMode
                      ? "border-gray-300 focus:ring-blue-500"
                      : "border-gray-600 focus:ring-blue-400"
                  }`}
                />
                <span>{option.name}</span>
              </label>
            ))}
            {remaining > 0 && !showAll && (
              <button
                className="text-sixth text-xs font-medium hover:underline ml-1"
                onClick={() => setExpanded((e) => ({ ...e, [key]: true }))}
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
    <div
      className={`w-full rounded-xl shadow-md border p-5 flex flex-col gap-4 ${
        lightMode ? "bg-white border-gray-200" : "bg-gray-900 border-gray-700"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`font-bold text-lg ${
            lightMode ? "text-gray-900" : "text-gray-100"
          }`}
        >
          FILTERS
        </span>
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
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className={`w-full mb-2 px-3 py-2 border rounded-lg text-sm outline-none ${
          lightMode
            ? "border-gray-200 bg-white text-gray-900"
            : "border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400"
        }`}
      />
      {/* Checkbox lists */}
      {renderCheckboxList("Location", "location", locations)}
      {renderCheckboxList("Category", "category", categories)}
      {renderCheckboxList("Session Type", "sessionType", sessionTypes)}
    </div>
  );
};

export default FilterPanel;
