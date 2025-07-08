import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LuMapPin } from "react-icons/lu";
// Fix for default marker icons
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Child component - Just displays the location marker
function LocationMarker({ position, address }) {
  const map = useMap();

  // Center map when position changes
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position, map]);

  if (!position) return null;

  return (
    <Marker position={position} icon={DefaultIcon}>
      <Popup>
        {address ? (
          <>
            <strong>Your Location:</strong>
            <br />
            {address.fullAddress}
            <br />
            <br />
            <strong>City:</strong> {address.city}
            <br />
            <strong>Postal Code:</strong> {address.pincode}
          </>
        ) : (
          "Locating address..."
        )}
      </Popup>
    </Marker>
  );
}

// Parent component - Contains the button and logic
export default function ParentControlledMap({ setAddress, address }) {
  const [position, setPosition] = useState(null);

  const mapRef = useRef();

  const handleLocate = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPosition = L.latLng(latitude, longitude);
          setPosition(newPosition);
          console.log("new", newPosition);

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();

            const city =
              data.address.city || data.address.town || data.address.village;
            const pincode = data.address.postcode;

            console.log("Address details:", {
              city,
              pincode,
              fullAddress: data.display_name,
            });

            setAddress({
              city,
              pincode,
              fullAddress: data.display_name,
              coordinates: {
                type: "Point",
                coordinates: [newPosition.lng, newPosition.lat],
              },
              _id: address?._id,
            });
          } catch (error) {
            console.error("Geocoding error:", error);
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          alert("Could not get your location");
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation not supported");
    }
  };

  return (
    <div className="flex flex-col h-[60vh]">
      {/* Button container outside the map with Tailwind classes */}
      <div className="p-4  flex justify-between items-center">
        <button
          onClick={handleLocate}
          className="px-4 py-2 flex gap-1 items-center bg-white cursor-pointer border-2 border-gray-200 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <LuMapPin />
          <span>Locate Me</span>
        </button>
      </div>

      {/* Map container takes remaining space */}
      <div className="flex-1">
        <MapContainer
          center={[20, 77]}
          zoom={5}
          className="h-[80%] w-full"
          whenCreated={(map) => {
            mapRef.current = map;
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker position={position} address={address} />
        </MapContainer>
      </div>
    </div>
  );
}
