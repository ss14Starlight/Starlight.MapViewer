import MapLoader from "./MapLoader";
import MapSelector from "./MapSelector";
import GridSelector from "./GridSelector";
import Markers from "./Markers";
import Config from "./Config.js";

//Load configuration
Config.loadConfiguration("config.json").then(() => {
	let map = null;
	const query = new URLSearchParams(window.location.search);
	const defaultMap = window.config.defaultMap;

	const mapId = query.has('map') ? query.get('map').toLowerCase() : defaultMap;
	const hideSelector = query.has('no-selector');

	function getMarkers()
	{
		return query.has('markers') ? Markers.parseMarkerList(query.get('markers')) : [];
	}

	function onMapChangedHandler(selectedMap, map) {
		const url = new URL(window.location);
		url.searchParams.set('map',selectedMap.id);
		window.history.pushState({}, '', url);
		map.addLayer(Markers.drawMarkerLayer(getMarkers()));
	}

	MapLoader.loadMap(mapId).then((loadedMap) => {
		map = loadedMap
		
		if (!hideSelector) {
            const gridSelector = new GridSelector({map: loadedMap, gridLayers: loadedMap.get('gridLayers')});
            map.addControl(gridSelector);
            
            const mapSelector = new MapSelector({selected: { name: loadedMap.get('map-name'), id: mapId }, onMapChanged: onMapChangedHandler, gridSelectorInstance: gridSelector});
            map.addControl(mapSelector);
            
            const mapList = mapSelector.element.querySelector('#map-selector-maps');
            const gridElement = gridSelector.element;
            
            const resizeObserver = new ResizeObserver(() => {
                const mapSelectorWidth = mapSelector.element.offsetWidth;
                gridElement.style.left = `${mapSelectorWidth + 20}px`;
            });

            resizeObserver.observe(mapSelector.element);
        }
		
		map.addLayer(Markers.drawMarkerLayer(getMarkers()));
		window.olmap = map;
	});
});