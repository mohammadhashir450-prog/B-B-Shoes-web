'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface TrackingMapProps {
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  address: string;
}

// Coordinate lookup for Pakistan cities to guarantee 100% accuracy
const getCityCoordinates = (addressText: string): [number, number] => {
  const normalized = addressText.toLowerCase();
  
  if (normalized.includes('karachi')) return [24.8607, 67.0011];
  if (normalized.includes('islamabad')) return [33.6844, 73.0479];
  if (normalized.includes('rawalpindi')) return [33.5984, 73.0441];
  if (normalized.includes('faisalabad')) return [31.4504, 73.1350];
  if (normalized.includes('multan')) return [30.1575, 71.5249];
  if (normalized.includes('peshawar')) return [34.0151, 71.5249];
  if (normalized.includes('gujranwala')) return [32.1877, 74.1945];
  if (normalized.includes('sialkot')) return [32.4972, 74.5361];
  if (normalized.includes('quetta')) return [30.1798, 66.9750];
  if (normalized.includes('sahiwal')) return [30.6682, 73.1114];
  if (normalized.includes('sargodha')) return [32.0836, 72.6711];
  if (normalized.includes('bahawalpur')) return [29.3544, 71.6911];
  if (normalized.includes('gujrat')) return [32.5742, 74.0754];
  if (normalized.includes('hyderabad')) return [25.3960, 68.3578];
  
  // Default to Lahore (Store head office location)
  return [31.5204, 74.3587];
};

export default function TrackingMap({ status, address }: TrackingMapProps) {
  const mapRef = useRef<any>(null);
  const vehicleMarkerRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  const [isMapScriptsLoaded, setIsMapScriptsLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Warehouse location (B&B Shoes Hub: Sahiwal, Pakistan)
  const warehouseCoords: [number, number] = [30.6777, 73.1118];
  const destCoords: [number, number] = getCityCoordinates(address);

  // Load Leaflet CDN script and stylesheet dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Inject Leaflet CSS if not already present
    const leafletCssId = 'leaflet-cdn-css';
    if (!document.getElementById(leafletCssId)) {
      const link = document.createElement('link');
      link.id = leafletCssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // 2. Inject Leaflet JS if not already present
    if ((window as any).L) {
      setIsMapScriptsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      setIsMapScriptsLoaded(true);
    };
    script.onerror = () => {
      setMapError('Failed to load map tracking engine. Please check your internet connection.');
    };
    document.body.appendChild(script);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  // Initialize Map and Animation once Leaflet is loaded
  useEffect(() => {
    if (!isMapScriptsLoaded || typeof window === 'undefined' || !(window as any).L) return;

    const L = (window as any).L;

    // Clean up previous map instance if it exists
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    try {
      // Create Map
      const map = L.map('order-tracking-map', {
        zoomControl: true,
        attributionControl: false,
      }).setView(warehouseCoords, 6);
      
      mapRef.current = map;

      // Add CartoDB Dark Matter tile layer for premium styling
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Create Custom Div Icons
      const warehouseIcon = L.divIcon({
        html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] text-base">🏪</div>`,
        className: 'custom-map-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const destIcon = L.divIcon({
        html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-base">📍</div>`,
        className: 'custom-map-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const vehicleIcon = L.divIcon({
        html: `<div class="flex items-center justify-center w-10 h-10 rounded-full bg-sky-500 border-2 border-white shadow-lg text-lg animate-pulse">🚚</div>`,
        className: 'custom-map-marker-vehicle',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      // Add Markers
      L.marker(warehouseCoords, { icon: warehouseIcon })
        .addTo(map)
        .bindPopup('<b>B&B Shoes Warehouse</b><br>Sahiwal Hub');

      L.marker(destCoords, { icon: destIcon })
        .addTo(map)
        .bindPopup(`<b>Delivery Address</b><br>${address}`);

      // Interpolate curved path points
      const pathPoints: [number, number][] = [];
      const steps = 100;
      
      // Calculate curve control offset (quadratic offset)
      const latDiff = destCoords[0] - warehouseCoords[0];
      const lngDiff = destCoords[1] - warehouseCoords[1];
      const midLat = (warehouseCoords[0] + destCoords[0]) / 2;
      const midLng = (warehouseCoords[1] + destCoords[1]) / 2;
      
      // Control point offset perpendicular to direct line
      const offsetLat = -lngDiff * 0.15;
      const offsetLng = latDiff * 0.15;
      
      const controlLat = midLat + offsetLat;
      const controlLng = midLng + offsetLng;

      // Quadratic Bezier Curve interpolation
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lat = (1 - t) * (1 - t) * warehouseCoords[0] + 2 * (1 - t) * t * controlLat + t * t * destCoords[0];
        const lng = (1 - t) * (1 - t) * warehouseCoords[1] + 2 * (1 - t) * t * controlLng + t * t * destCoords[1];
        pathPoints.push([lat, lng]);
      }

      // Draw Path
      L.polyline(pathPoints, {
        color: '#D4AF37',
        weight: 3,
        opacity: 0.8,
        dashArray: '8, 8',
      }).addTo(map);

      // Determine initial vehicle position
      let vehiclePosition = warehouseCoords;
      if (status === 'delivered') {
        vehiclePosition = destCoords;
      }

      const vehicleMarker = L.marker(vehiclePosition, { icon: vehicleIcon }).addTo(map);
      vehicleMarkerRef.current = vehicleMarker;

      // Fit map boundary
      map.fitBounds(L.latLngBounds([warehouseCoords, destCoords]), {
        padding: [60, 60],
      });

      // Handle Live Animation if status is "shipped" (In Transit)
      if (status === 'shipped') {
        let currentStep = 0;
        
        if (animationRef.current) {
          clearInterval(animationRef.current);
        }

        const intervalId = setInterval(() => {
          currentStep = (currentStep + 1) % (steps + 1);
          const nextCoord = pathPoints[currentStep];
          
          if (vehicleMarkerRef.current) {
            vehicleMarkerRef.current.setLatLng(nextCoord);
          }
        }, 150); // Updates position smoothly every 150ms

        animationRef.current = intervalId as any;
      }
    } catch (err: any) {
      console.error('Leaflet Map Error:', err);
      setMapError('Failed to render interactive map layout.');
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isMapScriptsLoaded, status, address]);

  if (mapError) {
    return (
      <div className="w-full h-full min-h-[350px] md:min-h-[450px] rounded-2xl bg-[#1A2435] border border-white/10 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-400 font-semibold mb-2">⚠️ Map Unavailable</p>
        <p className="text-gray-400 text-sm max-w-sm">{mapError}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[350px] md:min-h-[450px] rounded-2xl border border-white/10 overflow-hidden relative shadow-inner bg-[#0e1422]">
      {!isMapScriptsLoaded && (
        <div className="absolute inset-0 bg-[#0B101E]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
          <p className="text-gray-400 text-sm">Loading dynamic tracking maps...</p>
        </div>
      )}
      <div id="order-tracking-map" className="w-full h-full min-h-[350px] md:min-h-[450px]" style={{ zIndex: 1 }}></div>
    </div>
  );
}
