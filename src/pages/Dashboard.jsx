import mapboxgl from 'mapbox-gl';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card } from 'react-bootstrap';
import React, {useEffect, useRef, useState} from 'react'
import * as turf from '@turf/turf'

const mapStyles = [
  {label: 'Streets', value: 'mapbox://styles/mapbox/streets-v12'},
  {label: 'Outdoors', value: 'mapbox://styles/mapbox/outdoors-v12'},
  {label: 'Light', value: 'mapbox://styles/mapbox/light-v11'},
  {label: 'Dark', value: 'mapbox://styles/mapbox/dark-v11'},
  {label: 'Satellite', value: 'mapbox://styles/mapbox/satellite-v9'},
  {
    label: 'Satellite (Streets)',
    value: 'mapbox://styles/mapbox/satellite-streets-v12',
  },
  {label: 'Navigation (Day)', value: 'mapbox://styles/mapbox/navigation-day-v1'},
  {label: 'Navigation (Night)', value: 'mapbox://styles/mapbox/navigation-night-v1'},
  {label: 'Standard', value: 'mapbox://styles/mapbox/standard'},
]

const legendData2 = [
  {color: '#8B0000', indicator: '<5'},
  {color: '#ffa700', indicator: '6 - 10'},
  {color: '#F1ea3c', indicator: '11 - 15'},
  {color: '#9cdc2c', indicator: '16 - 20'},
  {color: '#2cba00', indicator: '>21'},
]
const Dashboard = () => {
  const [mapStyle, setMapStyle] = useState(mapStyles[4].value) // Default style is Satellite
 

  useEffect(() => {
    // Initialize Mapbox map
    mapboxgl.accessToken = 'pk.eyJ1IjoibHVkZmkiLCJhIjoiY2xoZWpwemM1MWxzbjN0b2FyaW5qdXJzNCJ9.c-SshhzMhRvnuUqku2LKEg';
    const map = new mapboxgl.Map({
      container: 'map',
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.3399, 48.8555],
      zoom: 12
  });

  const distanceContainer = document.getElementById('distance');

  // GeoJSON object to hold our measurement features
  const geojson = {
      'type': 'FeatureCollection',
      'features': []
  };

  // Used to draw a line between points
  const linestring = {
      'type': 'Feature',
      'geometry': {
          'type': 'LineString',
          'coordinates': []
      }
  };

  map.on('load', () => {
      map.addSource('geojson', {
          'type': 'geojson',
          'data': geojson
      });

      // Add styles to the map
      map.addLayer({
          id: 'measure-points',
          type: 'circle',
          source: 'geojson',
          paint: {
              'circle-radius': 5,
              'circle-color': '#000'
          },
          filter: ['in', '$type', 'Point']
      });
      map.addLayer({
          id: 'measure-lines',
          type: 'line',
          source: 'geojson',
          layout: {
              'line-cap': 'round',
              'line-join': 'round'
          },
          paint: {
              'line-color': '#000',
              'line-width': 2.5
          },
          filter: ['in', '$type', 'LineString']
      });

      map.on('click', (e) => {
          const features = map.queryRenderedFeatures(e.point, {
              layers: ['measure-points']
          });

          // Remove the linestring from the group
          // so we can redraw it based on the points collection.
          if (geojson.features.length > 1) geojson.features.pop();

          // Clear the distance container to populate it with a new value.
          distanceContainer.innerHTML = '';

          // If a feature was clicked, remove it from the map.
          if (features.length) {
              const id = features[0].properties.id;
              geojson.features = geojson.features.filter(
                  (point) => point.properties.id !== id
              );
          } else {
              const point = {
                  'type': 'Feature',
                  'geometry': {
                      'type': 'Point',
                      'coordinates': [e.lngLat.lng, e.lngLat.lat]
                  },
                  'properties': {
                      'id': String(new Date().getTime())
                  }
              };

              geojson.features.push(point);
          }

          if (geojson.features.length > 1) {
              linestring.geometry.coordinates = geojson.features.map(
                  (point) => point.geometry.coordinates
              );

              geojson.features.push(linestring);

              // Populate the distanceContainer with total distance
              const value = document.createElement('pre');
              const distance = turf.length(linestring);
              value.textContent = `Total distance: ${distance.toLocaleString()}km`;
              distanceContainer.appendChild(value);
          }

          map.getSource('geojson').setData(geojson);
      });
  });

  map.on('mousemove', (e) => {
      const features = map.queryRenderedFeatures(e.point, {
          layers: ['measure-points']
      });
      // Change the cursor to a pointer when hovering over a point on the map.
      // Otherwise cursor is a crosshair.
      map.getCanvas().style.cursor = features.length
          ? 'pointer'
          : 'crosshair';
  });

    // Add navigation controls to the map
    map.addControl(new mapboxgl.NavigationControl());

    // Cleanup function
    return () => {
      map.remove(); // Remove map instance when component unmounts
    };


    const canvas = map.getCanvasContainer();

    // Variable to hold the starting xy coordinates
    // when `mousedown` occured.
    let start;

    // Variable to hold the current xy coordinates
    // when `mousemove` or `mouseup` occurs.
    let current;

    // Variable for the draw box element.
    let box;

    // Add a custom vector tileset source. The tileset used in
    // this example contains a feature for every county in the U.S.
    // Each county contains four properties. For example:
    // {
    //     COUNTY: "Uintah County",
    //     FIPS: 49047,
    //     median-income: 62363,
    //     population: 34576
    // }
    map.addSource('counties', {
        'type': 'vector',
        'url': 'mapbox://mapbox.82pkq93d'
    });

    map.addLayer(
        {
            'id': 'counties',
            'type': 'fill',
            'source': 'counties',
            'source-layer': 'original',
            'paint': {
                'fill-outline-color': 'rgba(0,0,0,0.1)',
                'fill-color': 'rgba(0,0,0,0.1)'
            }
        },
        // Place polygons under labels, roads and buildings.
        'building'
    );

    map.addLayer(
        {
            'id': 'counties-highlighted',
            'type': 'fill',
            'source': 'counties',
            'source-layer': 'original',
            'paint': {
                'fill-outline-color': '#484896',
                'fill-color': '#6e599f',
                'fill-opacity': 0.75
            },
            'filter': ['in', 'FIPS', '']
        },
        // Place polygons under labels, roads and buildings.
        'building'
    );

    // Set `true` to dispatch the event before other functions
    // call it. This is necessary for disabling the default map
    // dragging behaviour.
    canvas.addEventListener('mousedown', mouseDown, true);

    // Return the xy coordinates of the mouse position
    function mousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return new mapboxgl.Point(
            e.clientX - rect.left - canvas.clientLeft,
            e.clientY - rect.top - canvas.clientTop
        );
    }

    function mouseDown(e) {
        // Continue the rest of the function if the shiftkey is pressed.
        if (!(e.shiftKey && e.button === 0)) return;

        // Disable default drag zooming when the shift key is held down.
        map.dragPan.disable();

        // Call functions for the following events
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('keydown', onKeyDown);

        // Capture the first xy coordinates
        start = mousePos(e);
    }

    function onMouseMove(e) {
        // Capture the ongoing xy coordinates
        current = mousePos(e);

        // Append the box element if it doesnt exist
        if (!box) {
            box = document.createElement('div');
            box.classList.add('boxdraw');
            canvas.appendChild(box);
        }

        const minX = Math.min(start.x, current.x),
            maxX = Math.max(start.x, current.x),
            minY = Math.min(start.y, current.y),
            maxY = Math.max(start.y, current.y);

        // Adjust width and xy position of the box element ongoing
        const pos = `translate(${minX}px, ${minY}px)`;
        box.style.transform = pos;
        box.style.width = maxX - minX + 'px';
        box.style.height = maxY - minY + 'px';
    }

    function onMouseUp(e) {
        // Capture xy coordinates
        finish([start, mousePos(e)]);
    }

    function onKeyDown(e) {
        // If the ESC key is pressed
        if (e.keyCode === 27) finish();
    }

    function finish(bbox) {
        // Remove these events now that finish has been called.
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('mouseup', onMouseUp);

        if (box) {
            box.parentNode.removeChild(box);
            box = null;
        }

        // If bbox exists. use this value as the argument for `queryRenderedFeatures`
        if (bbox) {
            const features = map.queryRenderedFeatures(bbox, {
                layers: ['counties']
            });

            if (features.length >= 1000) {
                return window.alert('Select a smaller number of features');
            }

            // Run through the selected features and set a filter
            // to match features with unique FIPS codes to activate
            // the `counties-highlighted` layer.
            const fips = features.map((feature) => feature.properties.FIPS);
            map.setFilter('counties-highlighted', ['in', 'FIPS', ...fips]);
        }

        map.dragPan.enable();
        
    }

    

  }, 
  []); // Empty dependency array ensures that this effect runs only once

  return (
    <div>
      <h1>Dashboard Page</h1>
      <div className="row g-5 g-xl-8">
        <div className="col-xl-3" style={{backgroundColor: 'lightblue'}} >
          <div className='card-header border-0 pt-5' >
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bold fs-3 mb-1'>CARBON SEQUESTRATION</span>

            </h3>

          </div>
          <div className='card-body'>
              <div className='mb-6'>
                <label className='form-label fw-bold required'>Basemap</label>
                <div>
                  <select
                    className='form-select form-select-solid'
                    data-fms-select2='true'
                    data-placeholder='Select Basemap'
                    data-allow-clear='true'
                    defaultValue={mapStyle}
                    //onChange={handleStyleChange}
                  >
                    <option value=''>Please select any Basemap</option>
                    {mapStyles.map((style) => (
                      <option key={style.value} value={style.value}>
                        {style.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Negeri Dropdown */}
              <div className='mb-6'>
                <label className='form-label fw-bold'>Select state</label>
                <div>
                  <select className='form-select form-select-solid' >
                    <option value=''>Please select any state</option>
                    {/* {negeriOptions.map((negeri) => (
                      <option key={negeri} value={negeri}>
                        {negeri}
                      </option>
                    ))} */}
                  </select>
                </div>
              </div>

              <div className='mb-6'>
                <label className='form-label fw-bold'>Select SBB location</label>
                <div>
                  <select className='form-select form-select-solid' >
                    <option value=''>Please select any SBB location</option>
                    {/* {sbbOptions.map((tileset) => (
                      <option key={tileset.coordinate} value={tileset.coordinate}>
                        {tileset.sbb}
                      </option>
                    ))} */}
                  </select>
                </div>

                {/* <div className='form-text'>Area = {selectedTileset.keluasan} ha</div> */}
              </div>

              
            </div>
          
        </div>
        
        <div className="col-xl-9">
          <div id="map" style={{ width: '100%', height: '600px' }}></div>
          <div id="distance" class="distance-container"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
