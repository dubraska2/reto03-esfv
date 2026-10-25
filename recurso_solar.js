window.BASE_DATOS_SOLAR = {
  fuente: "PVWatts.",
  fechaConsulta: "2026-10-02",
  casos: [
    {
      id: "valledupar",
      nombre: "Valledupar",
      lat: 10.4671523,          // Latitud en grados decimales
      lon: -73.2702468,         // Longitud en grados decimales
      hspAnual: 6.06,           // Irradiación media anual en kWh/m²/día
      hspMensual: [             // Irradiación por mes en kWh/m²/día (Ene - Dic)
        7.18, 6.99, 6.53, 5.96, 5.31, 5.37, 5.3, 5.67, 5.76, 5.79, 5.94, 6.87
      ],
      tilt: 20.0,               // Inclinación óptima en grados
      azimuth: 180.0,            // Azimut en grados (180 = Sur)
      fuente: "PVWatts",
      fechaConsulta: "2026-10-02"
    },
    {
      id: "cordoba",
      nombre: "Córdoba",
      lat: 7.4691429,
      lon: -76.1945168,
      hspAnual: 4.49,
      hspMensual: [
        4.22, 4.29, 4.44, 4.1, 4.16, 4.06, 4.36, 4.64, 4.83, 5.02, 5.08, 4.71
      ],
      tilt: 20.0,
      azimuth: 180.0,
      fuente: "PVWatts",
      fechaConsulta: "2026-10-02"
    },
    {
      id: "uribia",
      nombre: "Uribia",
      lat: 12.18,
      lon: -71.28,
      hspAnual: 5.8,
      hspMensual: [
        6.75, 7.22, 7.1, 6.41, 5.2, 5.96, 6.16, 6.47, 6.46, 6.3, 6.36, 6.57
      ],
      tilt: 20.0,
      azimuth: 180.0,
      fuente: "PVWatts",
      fechaConsulta: "2026-10-02"
    },
    {
      id: "santa_marta",
      nombre: "Santa Marta",
      lat: 11.248183,
      lon: -74.203033,
      hspAnual: 6.00,
      hspMensual: [
        6.87, 7.15, 6.76, 6, 5.38, 5.16, 5.27, 5.45, 5.78, 5.66, 5.96, 6.56
      ],
      tilt: 20.0,
      azimuth: 180.0,
      fuente: "PVWatts",
      fechaConsulta: "2026-10-02"
    },
    {
      id: "luruaco",
      nombre: "Luruaco",
      lat: 10.6433473,
      lon: -75.1614189,
      hspAnual: 5.53,
      hspMensual: [
        6.74, 7.06, 6.31, 5.48, 4.6, 4.81, 5.01, 5, 4.91, 4.85, 5.34, 6.23
      ],
      tilt: 20.0,
      azimuth: 180.0,
      fuente: "PVWatts",
      fechaConsulta: "2026-10-02"
    }
  ]
};