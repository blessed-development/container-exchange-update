import { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Circle, CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ZipCodeSearch from '@/components/shared/ZipCodeSearch';

const DEFAULT_VIEW = {
  latitude: 39.8283,
  longitude: -98.5795,
  deltaLatitude: 22,
  deltaLongitude: 38,
  zoom: 4,
};

const toFiniteNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const getMapView = (location) => {
  const latitude = toFiniteNumber(location?.latitude);
  const longitude = toFiniteNumber(location?.longitude);

  if (latitude === null || longitude === null) return DEFAULT_VIEW;

  return {
    latitude,
    longitude,
    deltaLatitude: 0.075,
    deltaLongitude: 0.12,
    zoom: 11,
  };
};

const getAreaLabel = (location) => {
  const city = location?.city || location?.detectedCity;
  const state = location?.stateCode || location?.state || location?.detectedState;

  if (!city) return 'Choose your ZIP / postal code to view your delivery area';

  return state ? `${city}, ${state}` : city;
};

const DELIVERY_AREA_RADIUS_METERS = 48280;

function MapViewSync({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, map, zoom]);

  return null;
}

export default function DeliveryAreaMap({ location }) {
  const view = getMapView(location);
  const { latitude, longitude, zoom } = view;
  const center = [latitude, longitude];
  const hasSelectedArea = view !== DEFAULT_VIEW;
  const areaLabel = getAreaLabel(location);

  return (
    <section className="overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
      <div className="flex items-center gap-3 px-5 py-4 sm:px-6 sm:py-5">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MapPin className="h-5 w-5" aria-hidden="true" />
        </span>

        <div>
          <p className="text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-primary">
            Delivery Area
          </p>
          <h2 className="mt-0.5 text-lg font-bold tracking-tight text-foreground">
            {areaLabel}
          </h2>
        </div>
      </div>

      <div className="border-t border-border bg-muted/30 p-4 sm:p-5">
        <ZipCodeSearch
          variant="calculator"
          appearance="calculator"
          showAction={false}
          showCurrentLocationControl
          placeholder="Search ZIP / postal code"
        />

        <p className="mt-3 px-1 text-xs leading-relaxed text-muted-foreground">
          Search for a ZIP or postal code, or use your current location to update pricing and delivery availability.
        </p>

        <div className="mt-4 overflow-hidden rounded-[20px] border border-border bg-muted">
        <MapContainer
          center={center}
          zoom={zoom}
          dragging={false}
          scrollWheelZoom={false}
          touchZoom={false}
          doubleClickZoom={false}
          boxZoom={false}
          keyboard={false}
          zoomControl={false}
          className="h-[280px] w-full rounded-[20px] bg-muted sm:h-[340px]"
          aria-label={hasSelectedArea ? `Delivery area map near ${areaLabel}` : 'Delivery area map'}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapViewSync center={center} zoom={zoom} />
          {hasSelectedArea && (
            <>
              <Circle
                center={center}
                radius={DELIVERY_AREA_RADIUS_METERS}
                pathOptions={{
                  color: '#51b7e6',
                  fillColor: '#7ed3f7',
                  fillOpacity: 0.35,
                  weight: 0,
                }}
              />
              <CircleMarker
                center={center}
                radius={9}
                pathOptions={{ color: '#0b1c2d', fillColor: '#0b1c2d', fillOpacity: 1, weight: 3 }}
              >
                <Popup>{areaLabel}</Popup>
              </CircleMarker>
            </>
          )}
        </MapContainer>
        </div>

        {hasSelectedArea && (
          <p className="mt-3 text-center text-xs font-medium text-muted-foreground">
            Showing the delivery area around <span className="text-foreground">{areaLabel}</span>
          </p>
        )}
      </div>
    </section>
  );
}
