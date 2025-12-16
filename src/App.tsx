//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from'/vite.svg'
import AlertUI from './components/AlertUI';
import './App.css'
import { Grid } from '@mui/material';
import HeaderUI from './components/HeaderUI';
import SelectorUI from "./components/SelectorUI";
import IndicatorUI from './components/IndicatorUI';
import useFetchData from './hooks/useFetchData';
import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';
import { useState } from 'react';

function App() {
   const { data, loading, error } = useFetchData();
   // Utilice una variable de estado para almacenar la opción seleccionada por el usuario
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
   return (
      <Grid container spacing={5} justifyContent="center" alignItems="center">

         {/* Encabezado */}
         <Grid size={{ xs: 12, md: 12 }}><HeaderUI/></Grid>

         {/* Alertas */}
         <Grid size={{ xs: 12, md: 12 }} container justifyContent="right" alignItems="center">
            <AlertUI description="No se preveen lluvias"/>
         </Grid>

         {/* Selector */}
         <Grid size={{ xs: 12, md: 3  }}><SelectorUI/></Grid>


         {/* Indicadores */}
             <Grid container size={{ xs: 12, md: 9 }} >

                 <Grid size={{ xs: 12, md: 3 }}>
                     {loading ? (
                        <IndicatorUI title='Temperatura (2m)' description='Cargando...' />
                     ) : error ? (
                        <IndicatorUI title='Temperatura (2m)' description='Error' />
                     ) : data && (
                        <IndicatorUI
                           title='Temperatura (2m)'
                           description={ `${data.current.temperature_2m} ${data.current_units.temperature_2m}` }
                        />
                     )}
                 </Grid>

                 <Grid size={{ xs: 12, md: 3 }}>
                     {loading ? (
                        <IndicatorUI title='Temperatura aparente' description='Cargando...' />
                     ) : error ? (
                        <IndicatorUI title='Temperatura aparente' description='Error' />
                     ) : data && (
                        <IndicatorUI
                           title='Temperatura aparente'
                           description={ `${data.current.apparent_temperature} ${data.current_units.apparent_temperature}` }
                        />
                     )}
                 </Grid>

                 <Grid size={{ xs: 12, md: 3 }}>
                     {loading ? (
                        <IndicatorUI title='Velocidad del viento' description='Cargando...' />
                     ) : error ? (
                        <IndicatorUI title='Velocidad del viento' description='Error' />
                     ) : data && (
                        <IndicatorUI
                           title='Velocidad del viento'
                           description={ `${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}` }
                        />
                     )}
                 </Grid>

                 <Grid size={{ xs: 12, md: 3 }}>
                     {loading ? (
                        <IndicatorUI title='Humedad relativa' description='Cargando...' />
                     ) : error ? (
                        <IndicatorUI title='Humedad relativa' description='Error' />
                     ) : data && (
                        <IndicatorUI
                           title='Humedad relativa'
                           description={ `${data.current.relative_humidity_2m} ${data.current_units.relative_humidity_2m}` }
                        />
                     )}
                 </Grid>

             </Grid>

         {/* Gráfico */}
         <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: "none", md: "block"} }}><ChartUI /></Grid>

         {/* Tabla */}
         <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: "none", md: "block"} }}><TableUI /></Grid>

         {/* Información adicional */}
         <Grid size={{ xs: 12, md: 12 }}>Elemento: Información adicional</Grid>

      </Grid>
   );
}

export default App;