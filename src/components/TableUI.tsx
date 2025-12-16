import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

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

function prepareTableData(data: OpenMeteoResponse) {
  const { hourly } = data;
  const maxRows = 24; // Mostrar las primeras 24 horas
  
  return hourly.time.slice(0, maxRows).map((time, index) => ({
    id: index,
    label: new Date(time).toLocaleString('es-EC', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit' 
    }),
    value1: hourly.temperature_2m[index],
    value2: hourly.wind_speed_10m[index]
  }));
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  {
    field: 'label',
    headerName: 'Fecha/Hora',
    width: 150,
  },
  {
    field: 'value1',
    headerName: 'Temperatura (°C)',
    width: 150,
    type: 'number',
  },
  {
    field: 'value2',
    headerName: 'Viento (km/h)',
    width: 150,
    type: 'number',
  },
  {
    field: 'resumen',
    headerName: 'Resumen',
    description: 'No es posible ordenar u ocultar esta columna.',
    sortable: false,
    hideable: false,
    width: 200,
    valueGetter: (_, row) => `${row.label} - ${row.value1}°C - ${row.value2} km/h`,
  },
];

export default function TableUI() {
  const { data, loading, error } = useFetchData();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ height: 350, width: '100%', p: 2 }}>
        <Alert severity="error">Error al cargar los datos: {error}</Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ height: 350, width: '100%', p: 2 }}>
        <Alert severity="warning">No hay datos disponibles</Alert>
      </Box>
    );
  }

  const rows = prepareTableData(data);

  return (
    <Box sx={{ height: 450, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}