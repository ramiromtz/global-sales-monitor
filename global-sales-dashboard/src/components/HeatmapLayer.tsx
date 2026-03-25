import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

interface HeatmapLayerProps {
    points: [number, number, number][];
}

export function HeatmapLayer({ points }: HeatmapLayerProps) {
    const map = useMap();
    useEffect(() => {
        if (!points || points.length === 0) return;
        // @ts-ignore
        const layer = L.heatLayer(points, {
            radius: 35,
            blur: 20,
            maxZoom: 10,
            minOpacity: 0.4,
            gradient: { 0.4: 'blue', 0.6: 'lime', 0.8: 'yellow', 1: 'red' }
        }).addTo(map);
        return () => { map.removeLayer(layer); };
    }, [points, map]);
    return null;
}
