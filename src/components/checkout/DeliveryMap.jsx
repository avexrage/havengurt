import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const STORE_LOCATION = [-7.3548982, 109.9067464];
const FREE_RADIUS_KM = 2;
const MAX_RADIUS_KM = 4;

function LocationMarker({ position, setPosition, setDistance }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            const dist = map.distance(e.latlng, STORE_LOCATION) / 1000; // distance in km
            setDistance(dist);
        },
    });

    return position === null ? null : (
        <Marker position={position}>
            <Popup>Your selected location</Popup>
        </Marker>
    );
}

export const DeliveryMap = ({ onLocationSelect }) => {
    const [position, setPosition] = useState(null);
    const [distance, setDistance] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (distance !== null) {
            if (distance > MAX_RADIUS_KM) {
                setError(`Location is too far (${distance.toFixed(2)} km). Max delivery radius is ${MAX_RADIUS_KM} km.`);
                onLocationSelect({ valid: false, distance, fee: 0 });
            } else {
                setError(null);
                const fee = distance <= FREE_RADIUS_KM ? 0 : 10000; // Example fee: 10k if > 2km
                onLocationSelect({ valid: true, distance, fee });
            }
        }
    }, [distance, onLocationSelect]);

    return (
        <div className="space-y-4">
            <div className="h-[400px] rounded-xl overflow-hidden border border-gray-200 shadow-inner relative z-0">
                <MapContainer center={STORE_LOCATION} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Store Marker */}
                    <Marker position={STORE_LOCATION}>
                        <Popup>
                            <b>Havengurt Store</b><br />
                            We are here!
                        </Popup>
                    </Marker>

                    {/* Zones */}
                    <Circle
                        center={STORE_LOCATION}
                        radius={FREE_RADIUS_KM * 1000}
                        pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.1 }}
                    />
                    <Circle
                        center={STORE_LOCATION}
                        radius={MAX_RADIUS_KM * 1000}
                        pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.05 }}
                    />

                    <LocationMarker position={position} setPosition={setPosition} setDistance={setDistance} />
                </MapContainer>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
                <h4 className="font-bold text-brand-black mb-2">Delivery Zones:</h4>
                <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500 opacity-50 border border-green-600"></span>
                        <span>0 - {FREE_RADIUS_KM} km: <b>Free Delivery</b></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500 opacity-20 border border-red-600"></span>
                        <span>{FREE_RADIUS_KM} - {MAX_RADIUS_KM} km: <b>Standard Fee</b></span>
                    </div>
                </div>

                {distance !== null && (
                    <div className={`mt-3 p-3 rounded-lg ${error ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-brand-blue border border-blue-100'}`}>
                        <p><strong>Distance:</strong> {distance.toFixed(2)} km</p>
                        {error ? (
                            <p className="font-bold">{error}</p>
                        ) : (
                            <>
                                <p className="mb-2"><strong>Delivery Fee:</strong> {distance <= FREE_RADIUS_KM ? 'FREE' : 'Rp 10.000'}</p>
                                <div className="mt-3 pt-3 border-t border-blue-200/50">
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-1">Address Details</label>
                                    <textarea
                                        placeholder="e.g. House number, color of the gate, nearby landmarks..."
                                        className="w-full p-2 rounded-md border border-blue-200 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                                        rows="2"
                                        onChange={(e) => onLocationSelect({ valid: true, distance, fee: distance <= FREE_RADIUS_KM ? 0 : 10000, addressDetail: e.target.value })}
                                    ></textarea>
                                </div>
                            </>
                        )}
                    </div>
                )}
                {distance === null && <p className="text-gray-500 italic">Click on the map to select your delivery location.</p>}
            </div>
        </div>
    );
};
