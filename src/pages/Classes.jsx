import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import SmallCalendar from '../components/SmallCalendar';
import FilterPanel from '../components/FilterPanel';
import WeekView from '../components/WeekView';
import ClassModal from '../components/ClassModal';
import PackageSelectModal from '../components/PackageSelectModal';
import { generateDummyData } from '../dummyData';

const mockPackages = [
    {
        id: 'pkg1',
        name: '10-Class Pass',
        type: 'class',
        remaining: 7,
        total: 10,
        description: 'Attend any 10 classes of your choice.',
        duration: 'Valid for 3 months',
        features: [
            '10 classes to use anytime',
            'Book any class type',
            'Priority booking',
            'Free guest pass'
        ],
        image: '/public/Logos/fitness-logo.png',
    },
    {
        id: 'pkg2',
        name: 'Day Pass',
        type: 'day',
        remaining: 3,
        total: 5,
        description: 'Unlimited classes per day, up to 5 days.',
        duration: 'Valid until midnight',
        features: [
            'Access to all classes today',
            'No booking limits',
            'Perfect for trying us out'
        ],
        image: '/public/Logos/liveness-logo-red.png',
    }
];

const Classes = () => {
    const [userPackages, setUserPackages] = useState([]);
    const [selectedPackageId, setSelectedPackageId] = useState('');
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showPackageModal, setShowPackageModal] = useState(false);
    const [activePackageId, setActivePackageId] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedClass, setSelectedClass] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [classes, setClasses] = useState([]);
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [filters, setFilters] = useState({
        location: '',
        category: '',
        sessionType: ''
    });

    // On mount, fetch packages and open modal if none active
    useEffect(() => {
        setUserPackages(mockPackages);
        if (!activePackageId && mockPackages.length > 0) {
            setShowPackageModal(true);
        }
    }, []);

    // Keep selectedPackage in sync
    useEffect(() => {
        setSelectedPackage(userPackages.find(pkg => pkg.id === selectedPackageId) || null);
    }, [selectedPackageId, userPackages]);

    // When a package is activated, set as active and selected, close modal, reset class selection
    const handleActivatePackage = (pkgId) => {
        setActivePackageId(pkgId);
        setSelectedPackageId(pkgId);
        setShowPackageModal(false);
        setSelectedClass(null);
        setShowModal(false);
    };

    // Open class modal for any class, regardless of package selection
    const handleClassClick = (classItem) => {
        setSelectedClass(classItem);
        setShowModal(true);
    };

    // Filter classes based on selected date and filters
    useEffect(() => {
        let filtered = classes.filter(cls => {
            const classDate = new Date(cls.date);
            const isSameDate = classDate.toDateString() === selectedDate.toDateString();
            const matchesLocation = !filters.location || cls.location === filters.location;
            const matchesCategory = !filters.category || cls.category === filters.category;
            const matchesSessionType = !filters.sessionType || cls.sessionType === filters.sessionType;
            return isSameDate && matchesLocation && matchesCategory && matchesSessionType;
        });
        setFilteredClasses(filtered);
    }, [selectedDate, filters, classes]);

    // On mount, load dummy classes
    useEffect(() => {
        const dummyClasses = generateDummyData();
        setClasses(dummyClasses);
        setFilteredClasses(dummyClasses);
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedClass(null);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const resetFilters = () => {
        setFilters({
            location: '',
            category: '',
            sessionType: ''
        });
    };

    const getUniqueValues = (field) => {
        return [...new Set(classes.map(cls => cls[field]))].filter(Boolean);
    };

    return (
        <div className="min-h-screen bg-primary">
            {/* Package Select Modal (always open if no active package or when user clicks button) */}
            {showPackageModal && (
                <PackageSelectModal
                    packages={userPackages}
                    activePackageId={activePackageId}
                    onActivate={handleActivatePackage}
                    onClose={() => setShowPackageModal(false)}
                />
            )}
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Package Info and Button */}
                <div className="mb-6">
                    <div className="mb-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                        {selectedPackage ? (
                            <>
                                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                                    <span className="font-semibold text-gray-800">{selectedPackage.name}</span>
                                    <span>{selectedPackage.description}</span>
                                    <span className="font-medium text-sixth">
                                        {selectedPackage.type === 'class'
                                            ? `${selectedPackage.remaining} of ${selectedPackage.total} classes left`
                                            : `${selectedPackage.remaining} of ${selectedPackage.total} days left`}
                                    </span>
                                </div>
                                <button
                                    className="px-4 py-2 rounded-lg bg-sixth text-white font-semibold text-sm shadow hover:bg-sixth/80 transition-colors"
                                    onClick={() => setShowPackageModal(true)}
                                >
                                    Change Package
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="flex-1 text-sm text-gray-500 font-medium">No package selected</div>
                                <button
                                    className="px-4 py-2 rounded-lg bg-sixth text-white font-semibold text-sm shadow hover:bg-sixth/80 transition-colors"
                                    onClick={() => setShowPackageModal(true)}
                                >
                                    Choose Package
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Sidebar - Header, Small Calendar + Filter Panel */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        {/* Sidebar Header and Description */}
                        <div className="mb-2">
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">Class Schedule</h2>
                            <p className="text-sm text-gray-500">Browse and filter available classes. Select a class to view details, buy, or join using your package.</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">Calendar</h2>
                            </div>
                            <div className="p-4">
                                <SmallCalendar
                                    selectedDate={selectedDate}
                                    onDateSelect={handleDateSelect}
                                    classesData={classes}
                                />
                            </div>
                        </div>
                        <FilterPanel
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onReset={resetFilters}
                            locations={getUniqueValues('location')}
                            categories={getUniqueValues('category')}
                            sessionTypes={getUniqueValues('sessionType')}
                        />
                    </div>
                    {/* Main Content - Week View */}
                    <div className="lg:col-span-9">
                        {/* Mobile Filters */}
                        {showFilters && (
                            <div className="lg:hidden mb-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <FilterPanel
                                        filters={filters}
                                        onFilterChange={handleFilterChange}
                                        onReset={resetFilters}
                                        locations={getUniqueValues('location')}
                                        categories={getUniqueValues('category')}
                                        sessionTypes={getUniqueValues('sessionType')}
                                    />
                                </div>
                            </div>
                        )}
                        {/* Week View */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-[100vh]">
                            <div className="px-4 py-3 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg  text-gray-900 font-bold">
                                        Schedule for {selectedDate.toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </h2>
                                    <div className="text-sm text-gray-500">
                                        {filteredClasses.length} classes found
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-hidden">
                                <WeekView
                                    classes={filteredClasses}
                                    selectedDate={selectedDate}
                                    onClassClick={handleClassClick}
                                    selectedPackage={selectedPackage}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Class Details Modal */}
            {showModal && selectedClass && (
                <ClassModal
                    classData={selectedClass}
                    onClose={handleCloseModal}
                    selectedPackage={selectedPackage}
                />
            )}
        </div>
    )
}

export default Classes;
