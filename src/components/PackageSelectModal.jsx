import React, { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

const PackageSelectModal = ({ packages, activePackageId, onActivate, onClose }) => {
    const [activating, setActivating] = useState('');

    const handleActivate = (pkgId) => {
        setActivating(pkgId);
        setTimeout(() => {
            onActivate(pkgId);
            setActivating('');
        }, 500); // Simulate async
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-blue-100 p-0">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-sixth rounded-t-2xl">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Select Your Package</h2>
                        <p className="text-white text-sm opacity-90">Choose a package to activate for booking classes</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
                        <X className="h-7 w-7" />
                    </button>
                </div>
                {/* Packages Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8 py-8">
                    {packages.map(pkg => {
                        const isActive = pkg.id === activePackageId;
                        return (
                            <div
                                key={pkg.id}
                                className={`relative flex flex-col items-center bg-white rounded-xl border-2 ${isActive ? 'border-sixth shadow-lg' : 'border-gray-200'} p-6 transition-all duration-200`}
                            >
                                {/* Image */}
                                <div className="w-16 h-16 mb-3 flex items-center justify-center rounded-full bg-gray-50 overflow-hidden border border-gray-200">
                                    <img src={pkg.image} alt={pkg.name} className="object-contain w-12 h-12" />
                                </div>
                                {/* Title & Description */}
                                <h3 className="text-lg font-bold text-gray-800 mb-1 text-center">{pkg.name}</h3>
                                <div className="text-xs text-gray-500 mb-2 text-center">{pkg.description}</div>
                                {/* Duration */}
                                <div className="text-xs text-sixth font-semibold mb-2">{pkg.duration}</div>
                                {/* Features */}
                                <ul className="mb-4 space-y-1 w-full">
                                    {pkg.features.map((f, i) => (
                                        <li key={i} className="flex items-center text-xs text-gray-700">
                                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" /> {f}
                                        </li>
                                    ))}
                                </ul>
                                {/* Activate Button */}
                                <button
                                    className={`w-full px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow ${isActive ? 'bg-sixth text-white cursor-default' : 'bg-sixth text-white '} ${activating === pkg.id ? 'opacity-70' : ''}`}
                                    disabled={isActive || activating === pkg.id}
                                    onClick={() => handleActivate(pkg.id)}
                                >
                                    {isActive ? 'Active' : activating === pkg.id ? 'Activating...' : 'Activate'}
                                </button>
                                {/* Active badge */}
                                {isActive && (
                                    <span className="absolute top-3 right-3 bg-sixth text-white text-xs font-bold px-3 py-1 rounded-full shadow">Active</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PackageSelectModal; 