import { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    wind_speed_10m: number[];
  };
}

function useFetchData() {
  const URL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m';
  
  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await fetch(URL);
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading, error };
}

function prepareChartData(data: OpenMeteoResponse) {
  const { hourly } = data;
  const maxPoints = 24; // Mostrar las primeras 24 horas
  
  return {
    labels: hourly.time.slice(0, maxPoints).map(time => 
      new Date(time).toLocaleString('es-EC', { 
        hour: '2-digit',
        minute: '2-digit'
      })
    ),
    temperature: hourly.temperature_2m.slice(0, maxPoints),
    windSpeed: hourly.wind_speed_10m.slice(0, maxPoints)
  };
}

export default function ChartUI() {
  const { data, loading, error } = useFetchData();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 350 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando datos meteorológicos...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Error al cargar los datos: {error}</Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="warning">No hay datos disponibles</Alert>
      </Box>
    );
  }

  const chartData = prepareChartData(data);

  return (
    <Box>
      <Typography variant="h5" component="div" sx={{ mb: 2 }}>
        Pronóstico Meteorológico - Guayaquil
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Temperatura y velocidad del viento (próximas 24 horas)
      </Typography>
      <LineChart
        height={350}
        series={[
          { 
            data: chartData.temperature, 
            label: 'Temperatura (°C)',
            color: '#ff6b6b'
          },
          { 
            data: chartData.windSpeed, 
            label: 'Viento (km/h)',
            color: '#4ecdc4'
          },
        ]}
        xAxis={[{ 
          scaleType: 'point', 
          data: chartData.labels,
          tickLabelStyle: {
            angle: 45,
            textAnchor: 'start',
            fontSize: 10,
          }
        }]}
        margin={{ bottom: 80 }}
      />
    </Box>
  );
}