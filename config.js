window.CONFIG = {
  // Clave pública de demostración de NREL. La clave personal NO va aquí: en Vercel se
  // guarda en la variable de entorno NREL_API_KEY y la usa api/pvwatts.js.
  API_KEY: "DEMO_KEY",
  PVWATTS_BASE_URL: "https://developer.nlr.gov/api/pvwatts/v8.json",
  PVWATTS_TIMEOUT_MS: 30000,
  PVWATTS_DEFAULTS: {
    system_capacity: 4,
    module_type: 0,
    array_type: 1,
    losses: 14.08
  }
};