import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

import {
  APIProvider,
  Map as GoogleMap,
  useMap,
  AdvancedMarker,
  Pin
} from '@vis.gl/react-google-maps';

import { MarkerClusterer } from '@googlemaps/markerclusterer';
// import { Circle } from '../components/circle.jsx';

const locations = [
  { key: 'angmokioave4', location: { lat: 1.3719339031581705, lng: 103.8377046327772 } },
  { key: 'bedoknorthave3', location: { lat: 1.329387635474367, lng: 103.93390097273472 } },
  { key: 'bedoksouthroad', location: { lat: 1.32049533978258, lng: 103.9369144650983 } },
  { key: 'bishanstreet12', location: { lat: 1.3470033240826567, lng: 103.84944257423788 } },
  { key: 'bedoknorthroad', location: { lat: 1.3277575641580286, lng: 103.94080257126191 } },
  { key: 'bishanstreet11', location: { lat: 1.344940123064029, lng: 103.85406411204261 } },
  { key: 'marineterrace', location: { lat: 1.3036756455144092, lng: 103.91498880211455 } },
  { key: 'stirlingroad', location: { lat: 1.2906807065721564, lng: 103.80238989136242 } },
  { key: 'lor1toapayoh', location: { lat: 1.3313376821113498, lng: 103.84253081857834 } },
  { key: 'tampinesstreet43', location: { lat: 1.3604735113247912, lng: 103.95209935982567 } },
  { key: 'tampinesstreet11', location: { lat: 1.3453535960854766, lng: 103.94629305522237 } },
  { key: 'woodlandsave6', location: { lat: 1.4416377375177665, lng: 103.80116026999342 } },
  { key: 'tampinesstreet33', location: { lat: 1.3544672377229992, lng: 103.96090388960548 } },
  { key: 'toapayoheast', location: { lat: 1.3339469704960452, lng: 103.85555929200405 } },
  { key: 'teckwhyecresent', location: { lat: 1.3829376924984693, lng: 103.75339026751617 } },
  { key: 'bedoksouthave2', location: { lat: 1.3228178444757153, lng: 103.93913486559622 } },
  { key: 'boonlaydrive', location: { lat: 1.3453145432964986, lng: 103.71214499176746 } },
];

const PoiMarkers = ({ pois, initialCenter, initialName }) => {
  const map = useMap();
  const [markers, setMarkers] = useState({});
  const clusterer = useRef(null);
  const [circleCenter, setCircleCenter] = useState(null);
  const infoWindowRef = useRef(null);

  const formatLabel = (key) => {
    if (!key) return '';
    let s = key;
    s = s.replace(/(\d+)/g, ' $1');
    s = s.replace(/ave/g, ' Ave');
    s = s.replace(/street/g, ' Street');
    s = s.replace(/road/g, ' Road');
    s = s.replace(/drive/g, ' Drive');
    s = s.replace(/lor/g, 'Lor ');
    s = s.replace(/tampines/g, 'Tampines ');
    s = s.replace(/toapayoh/g, 'Toa Payoh ');
    s = s.replace(/_/g, ' ');
    s = s.replace(/\s+/g, ' ').trim();
    s = s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return s;
  };

  const handleClick = useCallback((ev, poi) => {
    if (!map) return;
    if (!ev?.latLng) return;
    console.log('marker clicked: ', ev.latLng.toString());
    map.panTo(ev.latLng);
    setCircleCenter(ev.latLng);

    // show lat/lng in an InfoWindow at the clicked location
    try {
      const lat = ev.latLng.lat();
      const lng = ev.latLng.lng();
      const name = (poi && poi.name) ? poi.name : formatLabel(poi?.key);
      const content = `<div style="font-size:14px"><strong>${name || 'Location'}</strong><br/>Lat: ${lat.toFixed(6)}<br/>Lng: ${lng.toFixed(6)}</div>`;
      if (infoWindowRef.current) {
        infoWindowRef.current.setContent(content);
        infoWindowRef.current.setPosition(ev.latLng);
        infoWindowRef.current.open({ map });
      }
    } catch (e) {
      // ignore if latLng methods are not available
    }
  }, [map]);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
    if (!infoWindowRef.current) {
      infoWindowRef.current = new google.maps.InfoWindow();
    }
    // If a center was passed (via navigation), open the info window there
    if (initialCenter && infoWindowRef.current) {
      try {
        const latLng = new google.maps.LatLng(initialCenter.lat, initialCenter.lng);
        map.panTo(latLng);
        setCircleCenter(latLng);
        const name = initialName || formatLabel(initialCenter.key || 'Location');
        const content = `<div style="font-size:14px"><strong>${name}</strong><br/>Lat: ${initialCenter.lat.toFixed ? initialCenter.lat.toFixed(6) : initialCenter.lat}<br/>Lng: ${initialCenter.lng.toFixed ? initialCenter.lng.toFixed(6) : initialCenter.lng}</div>`;
        infoWindowRef.current.setContent(content);
        infoWindowRef.current.setPosition(latLng);
        infoWindowRef.current.open({ map });
      } catch (e) {
        // ignore
      }
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker, key) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers(prev => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {/* <Circle
        radius={800}
        center={circleCenter}
        strokeColor={'#0c4cb3'}
        strokeOpacity={1}
        strokeWeight={3}
        fillColor={'#3b82f6'}
        fillOpacity={0.3}
      /> */}
      {pois.map((poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={marker => setMarkerRef(marker, poi.key)}
          clickable={true}
          onClick={(ev) => handleClick(ev, poi)}
        >
          <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker>
      ))}
    </>
  );
};

function Map() {
  const { state, search } = useLocation();
  // prefer navigation state, but fall back to URL ?eventId= and localStorage
  let initialCenter = state?.center;
  let initialName = state?.name;

  if (!initialCenter) {
    try {
      const params = new URLSearchParams(search || window.location.search);
      const eventId = params.get('eventId');
      if (eventId) {
        const raw = localStorage.getItem('events');
        if (raw) {
          const all = JSON.parse(raw);
          const ev = all.find(e => String(e.id) === String(eventId));
          if (ev && ev.lat != null && ev.lng != null) {
            initialCenter = { lat: Number(ev.lat), lng: Number(ev.lng) };
            initialName = ev.title || ev.venue || initialName;
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }

  return (
    <Box>
      <h1 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Interactive Community Fridge Map</h1>

      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.') }>
        <GoogleMap
          defaultZoom={13}
          defaultCenter={initialCenter || { lat: 1.3696187128049564, lng: 103.7999958732937 }}
          onCameraChanged={(ev) =>
            console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
          }
          mapId='f4e052ff9c5fc70ae47e3a36'
          style={{ height: '60vh', width: '100%' }}
        >
          <PoiMarkers pois={locations} initialCenter={initialCenter} initialName={initialName} />
        </GoogleMap>
      </APIProvider>
    </Box>
  );
}

export default Map