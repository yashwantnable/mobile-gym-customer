import React from 'react';

// TODO: Replace with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = '';

const MapView = ({ address, coordinates }) => {
    // If you have coordinates, use them for the map
    let mapUrl = null;
    let directionsUrl = null;
    if (GOOGLE_MAPS_API_KEY && (coordinates || address)) {
        if (coordinates && coordinates.lat && coordinates.lng) {
            mapUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${coordinates.lat},${coordinates.lng}`;
            directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
        } else if (address) {
            mapUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address)}`;
            directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
        }
    } else if (address) {
        directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    }

    return (
        <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex flex-col items-center justify-center">
            {mapUrl ? (
                <iframe
                    title="Class Location Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={mapUrl}
                    allowFullScreen
                />
            ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
                    <span className="text-lg font-semibold mb-2">Map Unavailable</span>
                    <span className="text-sm">Add your Google Maps API key to enable the map.</span>
                    {address && (
                        <span className="text-xs mt-2">Location: {address}</span>
                    )}
                </div>
            )}
            {directionsUrl && (
                <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block px-3 py-1 bg-sixth text-white rounded shadow hover:bg-sixth/90 text-xs font-semibold"
                >
                    Get Directions
                </a>
            )}
        </div>
    );
};

export default MapView; 