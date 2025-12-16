import { useEffect, useState } from 'react';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

// Estrategia para convertir la opción seleccionada en un objeto
const CITY_COORDS: Record<string, { latitude: number; longitude: number }> = {
  'Guayaquil': { latitude: -2.1962, longitude: -79.8862 },
  'Quito': { latitude: -0.1807, longitude: -78.4678 },
  'Manta': { latitude: -0.9677, longitude: -80.7089 },
  'Cuenca': { latitude: -2.9001, longitude: -79.0059 }
};

// Tipo del prop: string | null
export default function useFetchData(selectedOption: string | null) {

    const [data, setData] = useState<OpenMeteoResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                
                // Parametrice la opción seleccionada en la URL del requerimiento asíncrono
                const cityConfig = selectedOption != null ? CITY_COORDS[selectedOption] : CITY_COORDS["Guayaquil"];
                const URL = `https://api.open-meteo.com/v1/forecast?latitude=${cityConfig.latitude}&longitude=${cityConfig.longitude}&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m`;
                
                const response = await fetch(URL);
                const json = await response.json();
                setData(json);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        })();
    }, [selectedOption]); // El efecto secundario depende de la opción seleccionada

    return { data, loading, error };

}