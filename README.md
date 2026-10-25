# ESFV — Requerimiento Energético, Generador Fotovoltaico y Regulador/Baterías

Aplicación web de una sola página para caracterizar el consumo eléctrico de una instalación (**Reto 01**), dimensionar el generador fotovoltaico correspondiente (**Reto 02**) y dimensionar el regulador/inversor MPPT y, cuando aplica, el banco de baterías (**Reto 03**): cuadro de cargas, perfil horario de 24 h, demanda máxima, energía diaria/mensual/anual, recurso solar (API o base de datos local), potencia pico, catálogo comercial de paneles, configuración en cadenas, verificación de tensiones/corrientes del arreglo, catálogo de reguladores/inversores/baterías, dimensionamiento del banco, balance de cierre e informe técnico de una página.

## Versión

- **v1.2** — Reto 01 + Reto 02 + Reto 03 integrados en una sola interfaz continua.
- Motor de cálculo del Reto 02 validado numéricamente contra el caso de prueba estandarizado del documento de referencia (botón **"Cargar caso de prueba estandarizado"** dentro de la pestaña *Generador FV*).
- Motor de cálculo del Reto 03 (verificación del arreglo, corrientes, relación DC/AC, banco de baterías, balance de cierre, tasa C y recuperación) verificado de forma autoconsistente contra el caso de prueba estandarizado del Reto 03, que continúa el mismo generador validado del Reto 02 (botón **"Cargar caso de prueba"** dentro de la pestaña *Regulador/Baterías*).

## Archivos del proyecto

Deben estar **los cinco en la misma carpeta** (el HTML los carga como `<script src="...">` externos; si falta alguno, la aplicación no arrancará):

| Archivo | Contenido |
|---|---|
| `ESFV_Reto01_Reto02.html` | Aplicación completa (interfaz, estilos y lógica). Es el único archivo que se abre en el navegador. |
| `config.js` | Clave de API y parámetros de conexión al servicio de recurso solar. |
| `recurso_solar.js` | Base de datos local de respaldo (5 ubicaciones con irradiación mensual documentada). |
| `catalogo_paneles.js` | Catálogo comercial de paneles fotovoltaicos (fichas técnicas STC). |
| `catalogo_equipos.js` | Catálogo de reguladores MPPT, inversores con entrada MPPT y baterías (genéricos del TdR del Reto 03 + referencias comerciales reales). |

## Dependencias

- **Ninguna instalación**: no requiere Node, npm, build ni conexión a internet para funcionar en su modo básico.
- **Chart.js 4.4.4** va embebido dentro del propio HTML (no se descarga de ningún CDN), para que las gráficas del Reto 01 funcionen incluso sin internet o en redes restringidas.
- **Fuentes**: usa fuentes del sistema; si hay internet intenta cargar Google Fonts (Space Grotesk / Inter / JetBrains Mono) pero tiene alternativas de respaldo (`sans-serif`, `monospace`) si no hay conexión.
- Navegador moderno con soporte de ES2017+ (`fetch`, `async/await`, `URLSearchParams`). Probado en Chrome/Edge recientes.

## Cómo ejecutarlo

### Opción A — Abrir directamente (la más simple)
Doble clic sobre `ESFV_Reto01_Reto02.html`. Funciona para todo el Reto 01 y para el Reto 02 **con la base de datos local** sin ningún paso adicional.

### Opción B — Servidor local (recomendada si se quiere usar la API en línea)
Los navegadores bloquean por CORS las peticiones `fetch` hechas desde un archivo abierto con `file://`. Para que la consulta en línea del recurso solar tenga la mejor oportunidad de funcionar, sirve la carpeta con un servidor local y ábrela por `http://localhost`:

```bash
# Python 3 (ya viene instalado en la mayoría de sistemas)
cd carpeta-del-proyecto
python -m http.server 8080
# luego abre http://localhost:8080/ESFV_Reto01_Reto02.html
```

También funciona con la extensión "Live Server" de VS Code o cualquier servidor estático equivalente.

## Recurso solar: API en línea vs. base de datos local

El módulo "Recurso solar" del Reto 02 (pestaña **Generador FV**) intenta primero consultar una **API pública en línea** y, si falla por cualquier motivo (sin internet, CORS, error HTTP, tiempo de espera agotado), **cae automáticamente** a la base de datos local — sin interrumpir al usuario, mostrando un aviso en pantalla y dejándolo declarado también en el informe.

### Qué hace falta para que la API funcione
1. Conexión real a internet (no simulada/restringida) desde donde se abra el archivo.
2. Que el navegador permita la petición saliente: si se abre con doble clic (`file://`), usa la **Opción B** de arriba (servidor local) para mejorar la compatibilidad con CORS.
3. Una clave de API válida en `config.js` → `window.CONFIG.API_KEY`. El archivo trae por defecto `"DEMO_KEY"`, que es la clave pública de demostración de NREL (no es una credencial privada ni de pago): funciona, pero comparte un límite de peticiones por hora muy bajo con todo internet, así que es normal que falle con error 429. Para un uso más estable:
   - Regístrate gratis en https://developer.nrel.gov/signup/
   - Sustituye el valor `"DEMO_KEY"` en `config.js` por la clave personal que te envíen por correo.
4. No se requiere ninguna otra configuración: el endpoint, los parámetros por defecto y el tiempo de espera ya están definidos en `config.js`.

> **Nota de seguridad:** no se publica ninguna clave privada en este proyecto. `"DEMO_KEY"` es intencionalmente pública. Si vas a usar una clave personal, evita subir `config.js` con esa clave a un repositorio público; en un entorno de producción real, inyéctala por variable de entorno o paso de build en vez de dejarla escrita en el archivo.

### Qué hace falta para que el respaldo local funcione
**Nada adicional** — ya funciona de fábrica. `recurso_solar.js` trae 5 ubicaciones documentadas (nombre, coordenadas, inclinación, azimut, los 12 valores mensuales de irradiación y la fuente de cada dato):

- Uribia, La Guajira (calibrado para reproducir el caso de prueba estandarizado del Reto 02)
- Valledupar, Cesar
- Montería, Córdoba
- Santa Marta, Magdalena
- Luruaco, Atlántico

Si la coordenada declarada no coincide con ninguna, la aplicación usa automáticamente el caso guardado más cercano. Para agregar más ubicaciones, se edita `recurso_solar.js` siguiendo el mismo formato (no requiere tocar el HTML).

## Catálogo de paneles

`catalogo_paneles.js` trae 8 referencias comerciales (Canadian Solar, LONGi Solar, Jinko Solar, JA Solar, QCELLS, Trina Solar, Risen Energy, Astronergy/Chint Solar) — todas marcas con distribución comercial activa en el mercado colombiano de energía solar — más un módulo de referencia no comercial usado solo para verificar el caso de prueba estandarizado. Para ampliar el catálogo, se agregan más entradas a ese archivo con los mismos campos (potencia, Voc, Isc, Vmp, Imp, coeficientes de temperatura, dimensiones, eficiencia, fuente).

## Reto 03 — Regulador/Inversor MPPT y banco de baterías

La pestaña **Regulador/Baterías** hereda sin reingreso los datos del Reto 01 y del Reto 02 (energía diaria, demanda máxima, tipo de aplicación, módulo y configuración en cadenas elegidos) y añade:

- **Selector de rama** (con o sin almacenamiento), con valor inicial según el tipo de aplicación del Reto 01 (on-grid → sin almacenamiento; off-grid e híbridos → con almacenamiento) y recálculo inmediato al cambiarla.
- **Verificación del arreglo** (Voc en frío, Vmp en caliente y en frío contra la ventana MPPT o el arranque V_banco+5V, según corresponda) y de corrientes (salida al banco, Isc e Imp por entrada, corriente de diseño de conductores con el factor 1,25 mostrada aparte).
- **Catálogo editable** de reguladores MPPT y de inversores (`catalogo_equipos.js`), con veredicto cumple/alerta/no cumple por equipo, el dato que falla y una sugerencia de reconfiguración cuando corresponde.
- **Relación DC/AC** configurable (rango visible, 1,0–1,3 por defecto) con alerta de recorte esperado o de inversor sobredimensionado (rama sin almacenamiento).
- **Banco de baterías**: capacidad en Ah y kWh a partir de la autonomía, el DoD de diseño, el factor de temperatura y la tensión del banco (todas entradas visibles y editables); configuración serie-paralelo en unidades enteras, DoD al final de la autonomía y DoD diario, con aviso si el redondeo supera el DoD de diseño.
- **Balance de cierre**: recalcula la potencia pico requerida con las eficiencias del inversor y de la batería, la compara con la instalada (promedio anual y mes crítico), informa el margen o déficit en % y los módulos adicionales sugeridos, con un botón para ver el efecto de aceptar el ajuste.
- **Tasa C de carga/descarga** frente a la ficha de cada batería, **tiempo de recuperación** del banco tras agotar la autonomía (o el aviso de que no se recupera con ese generador) y **comparación de tecnologías** por energía nominal instalada por año de servicio.
- El **informe de una página** se amplía con la rama activa, el equipo elegido, el banco y el balance de cierre; **Guardar/Cargar** persiste también la configuración completa del Reto 02 y del Reto 03 (no solo el Reto 01).

### Catálogo de equipos

`catalogo_equipos.js` trae tres catálogos editables, ampliados con referencias comerciales reales con distribución activa en Colombia, cada una con características eléctricas distintas (tensión máxima, corriente, ventana MPPT) para garantizar que siempre exista al menos una configuración comercial válida, con o sin almacenamiento:

- **Reguladores MPPT** (10 equipos): los tres genéricos del TdR (CTRL-A/B/C, no comerciales) más siete referencias comerciales reales — Victron SmartSolar (dos variantes de tensión, 150 V y 250 V), EPEVER Tracer, Morningstar TriStar, Phocos CIS-MPPT, Outback Power FlexMax y Steca Tarom.
- **Inversores con entrada MPPT** (9 equipos): los tres genéricos del TdR (INV-A/B/C, no comerciales) más seis referencias comerciales reales — SMA Sunny Boy, Fronius Primo, Growatt MIN, Huawei SUN2000, Solis Mini y GoodWe NS.
- **Baterías** (8 equipos): las dos tecnologías genéricas del TdR (AGM y LFP, no comerciales) más tres referencias comerciales reales por tecnología — AGM: Victron, Trojan, Ritar Power; LFP: Pylontech, Dyness, BYD Battery-Box.

Para ampliar cualquiera de los tres catálogos basta con agregar más entradas al archivo con los mismos campos (documentados en la cabecera del propio archivo); no requiere tocar el HTML.

## Persistencia de proyectos

Los botones **Guardar** / **Cargar** del encabezado exportan e importan el proyecto completo (cargas y horarios del Reto 01, configuración del generador del Reto 02, y rama/equipo/banco del Reto 03) como un archivo `.json` independiente — no depende de ningún servidor ni base de datos externa. Un archivo guardado con una versión anterior (solo Reto 01) sigue cargando correctamente: los campos del Reto 02 y del Reto 03 se completan con sus valores por defecto.
