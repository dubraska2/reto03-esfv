# ESFV — Requerimiento Energético, Generador Fotovoltaico y Regulador/Baterías

Aplicación web de una sola página que cubre tres etapas del dimensionamiento:

- **Reto 01:** caracteriza el consumo eléctrico de la instalación.
- **Reto 02:** dimensiona el generador fotovoltaico.
- **Reto 03:** dimensiona el regulador o inversor MPPT y, cuando aplica, el banco de baterías.

Incluye cuadro de cargas, perfil horario de 24 h, demanda máxima, energía diaria/mensual/anual, recurso solar (API PVWatts o base de datos local), potencia pico, catálogo comercial de paneles y configuración en cadenas. También verifica tensiones y corrientes del arreglo, tiene catálogo de reguladores, inversores y baterías, dimensiona el banco, calcula el balance de cierre y genera un informe técnico de una página.

## Versión

- **v1.3** (actual): corrección del Reto 03 tras la auditoría contra el TdR. El detalle está en [`CHANGELOG.md`](CHANGELOG.md).
- El Reto 02 y el Reto 03 se verifican contra el caso de prueba estandarizado del TdR con el botón **"Cargar caso de prueba"** de cada pestaña (ver [Caso de prueba estandarizado](#caso-de-prueba-estandarizado-reto-03)).

## Archivos del proyecto

| Archivo | Contenido |
|---|---|
| `index.html` | Aplicación completa (interfaz, estilos y lógica). Es el único archivo que se abre en el navegador. |
| `config.js` | Parámetros de conexión a PVWatts. Lleva **solo** la clave pública `DEMO_KEY`; la clave personal **no** va aquí (ver [Clave de NREL](#clave-de-nrel)). |
| `api/pvwatts.js` | Función serverless de Vercel que consulta PVWatts con la clave guardada en la variable de entorno `NREL_API_KEY`. |
| `recurso_solar.js` | Base de datos local con 5 casos guardados de irradiación mensual. |
| `catalogo_paneles.js` | Catálogo comercial de paneles fotovoltaicos (fichas técnicas STC). |
| `catalogo_equipos.js` | Catálogo de reguladores MPPT, inversores con entrada MPPT y baterías: los genéricos del TdR del Reto 03 más referencias comerciales con su ficha citada. |
| `pruebas.html` | Pruebas automáticas del caso estandarizado del Reto 03 (ver [Pruebas automáticas](#pruebas-automáticas)). |
| `CHANGELOG.md` | Historial de versiones. |

`index.html` carga los `.js` con rutas relativas, así que todos deben estar en la misma carpeta (y `pvwatts.js` dentro de `api/`).

## Cómo ejecutarlo

### Opción A — Página publicada en Vercel (recomendada)
El repositorio se despliega en Vercel sin build (Framework preset: *Other*). En Vercel, la consulta a PVWatts pasa por `api/pvwatts.js` y usa la clave personal configurada en el proyecto.

### Opción B — Abrir el archivo directamente
Doble clic sobre `index.html`. Todo funciona, y la consulta en línea a PVWatts usa `DEMO_KEY`. Esa clave es pública y tiene un límite de consultas bajo, por eso a veces responde con error 429; en ese caso la app pasa sola a la base de datos local.

### Opción C — Servidor local
```bash
python -m http.server 8080
```
Luego abre `http://localhost:8080/index.html`. Funciona igual que la opción B, también con `DEMO_KEY`.

## Recurso solar: casos guardados y API

En la pestaña **Generador FV**, el botón "Consultar recurso solar" funciona así:

| Selección en "Caso guardado" | Qué hace |
|---|---|
| Un caso (Uribia, Santa Marta, etc.) | Usa los datos de `recurso_solar.js` tal como están, **sin consultar la API**. |
| **— Coordenadas manuales —** | Consulta **PVWatts v8** (`developer.nlr.gov`) con la latitud, longitud, inclinación y azimut escritos. |

- **Nombre del lugar:** con coordenadas manuales, el nombre (municipio, departamento y país) se obtiene de OpenStreetMap (Nominatim). Si ese servicio no responde, se usa el departamento y el país que reporta PVWatts. El selector muestra entonces `— Coordenadas manuales —: Ciudad (HSP · inclinación°/azimut°)`.
- **Respaldo:** si la API falla (sin internet, límite de consultas, tiempo de espera de 30 s), la app usa el caso guardado más cercano y lo avisa en pantalla y en el informe.
- **Cambio de dominio:** NREL cambió de dominio. `developer.nrel.gov` ya no existe y la API responde en `developer.nlr.gov`.

### Casos guardados (`recurso_solar.js`)
- Valledupar, Cesar
- Córdoba
- Uribia, La Guajira
- Santa Marta, Magdalena
- Luruaco, Atlántico

**Uribia** es el caso de prueba estandarizado. Su HSP anual (5,8) y el HSP del mes de menor recurso (mayo, 5,2 kWh/m²·día) son **las condiciones especificadas en el TdR del Reto 02**, no una consulta a PVWatts. Los demás valores mensuales son ilustrativos y su promedio (≈ 6,41) no coincide con el anual. La app muestra esta aclaración al consultar el caso.

### Clave de NREL
- **Dónde va la clave personal:** en Vercel, en *Settings → Environment Variables*, con el nombre `NREL_API_KEY`. Después de crearla o cambiarla hay que hacer *Redeploy*.
- **Dónde no va:** nunca en `config.js` ni en ningún archivo del repositorio, porque cualquiera puede ver lo que está en GitHub y en la página publicada.
- **Cómo la usa la app:** primero intenta `api/pvwatts`. Si esa función no existe (archivo abierto con doble clic o servidor local) o no tiene clave configurada, consulta PVWatts directamente con `DEMO_KEY`.
- **Para comprobarla:** abre `https://<tu-proyecto>.vercel.app/api/pvwatts?lat=11.24&lon=-74.2&tilt=11&azimuth=180&system_capacity=4&array_type=1&module_type=0&losses=14.08`. Debe devolver JSON con datos.

## Catálogo de paneles

`catalogo_paneles.js` trae 8 referencias comerciales con distribución activa en Colombia: Canadian Solar, LONGi Solar, Jinko Solar, JA Solar, QCELLS, Trina Solar, Risen Energy y Astronergy/Chint Solar. Además incluye un módulo de referencia no comercial que se usa solo para el caso de prueba.

## Reto 03 — Regulador/Inversor MPPT y banco de baterías

La pestaña **Regulador/Baterías** hereda sin reingreso los datos del Reto 01 y del Reto 02 (RF-26). Usa el método de las sesiones 8 a 10 (Messenger y Abtahi, 2017; Chaaban, AE 868; Dobos, 2014).

### Ramas (RF-25)
La rama inicial depende del tipo de aplicación del Reto 01, y las ramas que no tienen sentido físico para ese tipo quedan deshabilitadas:

| Tipo de aplicación | Con almacenamiento | Sin almacenamiento |
|---|---|---|
| Off-grid / Híbrido off-grid | ✅ (inicial) | ❌ |
| Híbrido on-grid | ✅ (inicial) | ✅ |
| On-grid | ❌ | ✅ (inicial) |

Cambiar el tipo de aplicación conserva el panel elegido a mano y los valores de PR o tensión máxima que se fijaron a mano o que vienen del caso de prueba.

### Verificación del arreglo y del equipo (RF-28 a RF-31)
- **Tensiones:**
  - Voc en frío = Voc·[1+|β|(25−Tmín)]
  - Vmp en caliente = Vmp·[1−|β|(Tc−25)]
  - Vmp en frío = Vmp·[1+|β|(25−Tmín)]

  Se comparan contra la tensión máxima, la ventana MPPT del inversor o el arranque del regulador (V<sub>banco</sub> + 5 V).
- **Ns máximo por equipo** = ⌊V<sub>oc,máx</sub> / V<sub>oc,frío del módulo</sub>⌋. Aparece en una columna de las tablas de reguladores e inversores.
- **Corrientes:**
  - Corriente de salida al banco = P<sub>pico</sub> / V<sub>nominal</sub>, **sin** el factor 1,25.
  - Isc e Imp por entrada.
  - Corriente de diseño de conductores = **1,25 × Isc**, el factor del TdR (NTC 2050 art. 690-8). Como referencia también se muestra 1,56 × Isc, que añade el factor de servicio continuo.
- **Tensión de banco admitida:** cada regulador comercial declara las tensiones que acepta según su ficha (por ejemplo 12/24 V). Si el sistema usa otra tensión, el equipo no cumple.
- **Relación DC/AC** = P<sub>pico</sub> / P<sub>ac</sub>, con rango visible y configurable (1,0–1,3 por defecto). Alerta de recorte o de inversor sobredimensionado.
- **Veredicto por equipo** (cumple / alerta / no cumple) con el dato que falla y una **reconfiguración concreta** Ns × Np del mismo panel, que se aplica con un clic.
- **Botón "Ajustar automáticamente":** elige un equipo y una batería que cumplan o, si no hay ninguno, reconfigura el arreglo.

### Banco de baterías (RF-32 a RF-35)
- **Tensión nominal del sistema** (12/24/48 V): con ella se calculan la corriente del regulador, las corrientes de la tasa C y Ns = V<sub>nominal</sub> / V<sub>unidad</sub>.
- **Tensión real del banco** = Ns × V<sub>unidad</sub> (48 V con 4 AGM de 12 V; 51,2 V con una LFP de 51,2 V): con ella se calculan Cn [Ah], la energía instalada y el arranque.
- **Capacidad:** E<sub>CC</sub> = E<sub>d</sub> / η<sub>inv</sub>; Cn [Wh] = E<sub>CC</sub>·N / (DoD·f<sub>T</sub>); N<sub>p</sub> = ⌈Cn [Ah] / C<sub>unidad</sub>⌉; DoD final y DoD diario.
- **Validación:** autonomía ≤ 0, DoD fuera de 0–100 % o eficiencias fuera de 0–1 muestran el error y **ocultan** los resultados, en vez de mostrar valores inválidos.
- **Tasa C** de carga y de descarga frente a la ficha. **Tiempo de recuperación** t<sub>rec</sub> = N·E<sub>CC</sub> / (E<sub>prod</sub>·η<sub>bat</sub> − E<sub>CC</sub>), con aviso si el banco no se recupera con ese generador.
- **Comparación de tecnologías:** cada batería se dimensiona con su propio DoD de diseño y se reportan dos indicadores:
  - "kWh / año de servicio": menor es mejor.
  - "kWh entregados por kWh instalado": mayor es mejor.

### Balance de cierre (RF-34)
- **Cálculo:** E<sub>gen</sub> = E<sub>CC</sub> / η<sub>bat</sub> y P<sub>req</sub> = E<sub>gen</sub> / (HSP·PR), con el HSP anual y con el del mes crítico.
- **Margen o déficit** [%] = (P<sub>instalada</sub> − P<sub>req</sub>) / P<sub>req</sub> × 100.
- **Aceptar el ajuste:** amplía el generador con cadenas completas y **recalcula todo el componente** con el generador ampliado. Indica si el equipo elegido sigue cumpliendo, cuáles del catálogo cumplen, o que ninguno cumple, y en ese caso sugiere agregar un equipo o reducir el generador. El ajuste se puede deshacer.

### Catálogo de equipos (`catalogo_equipos.js`, RF-27)
- **Reguladores MPPT:** CTRL-A/B/C del TdR, Victron SmartSolar 150/100-Tr y 250/100-Tr, EPEVER Tracer AN 100 V/30 A, Morningstar TriStar MPPT 60, Phocos MPPT 100/40, Outback FlexMax 80 y Steca Tarom MPPT 6000-M.
- **Inversores:** INV-A/B/C del TdR, SMA Sunny Boy 2.0, Fronius Primo 3.0-1, Growatt MIN 2500TL-X, Huawei SUN2000-3KTL-L1, Solis S6-GR1P3K y GoodWe GW3000-NS.
- **Baterías:** AGM y LFP genéricas del TdR, Victron AGM 12 V/220 Ah, Trojan SAGM 12 205, Ritar RA12-200, Pylontech US5000, Dyness A48100 y BYD Battery-Box Premium LVS 4.0.

Cada entrada cita su ficha técnica y la fecha de consulta. Cuando la ficha no publica un dato (por ejemplo la eficiencia de ida y vuelta o una Isc independiente), la fuente lo dice y se adopta un valor conservador explícito.

## Caso de prueba estandarizado (Reto 03)

1. En la pestaña **Regulador/Baterías**, pulsa **"Cargar caso de prueba"**. Se fija el generador del TdR (4 × 550 Wp en 4s × 1p, 2,20 kWp), Ed 7,58 kWh/día, η<sub>inv</sub> 0,90, N = 2 días, f<sub>T</sub> = 1, HSP 5,8 / 5,2 y PR 0,70.
2. **Rama con almacenamiento** (tipo de aplicación off-grid): compara reguladores, banco AGM y LFP, tasa C y balance de cierre. Para LFP, elige la batería "LFP 51,2 V / 100 Ah" en la tabla.
3. **Rama sin almacenamiento:** en *Proyecto*, cambia el tipo de aplicación a **On-grid** o **Híbrido on-grid**. El generador y el PR del caso se conservan.

Valores que reporta la app con el caso:

| Magnitud | AGM 12 V/200 Ah (48 V) | LFP 51,2 V/100 Ah |
|---|---|---|
| Ns máx. CTRL-A / B / C | 2 / 4 / 4 | 2 / 4 / 4 |
| Veredicto CTRL-A / B / C | No cumple / Cumple / No cumple | igual |
| Corriente al banco | 45,83 A | 45,83 A |
| Cn | 33,69 kWh · 701,9 Ah | 21,06 kWh · 411,2 Ah |
| Ns × Np · baterías | 4 × 4 · 16 | 1 × 5 · 5 |
| Ah / kWh instalados | 800 Ah · 38,40 kWh | 500 Ah · 25,60 kWh |
| DoD final | 43,9 % | 65,8 % |
| Tasa C de carga / descarga | 0,057 / 0,026 C | 0,092 / 0,042 C |
| P<sub>req</sub> anual / mes crítico | 2,59 / 2,89 kWp | 2,25 / 2,51 kWp |
| Déficit anual / mes crítico | 15,16 % / 23,93 % | 2,43 % / 12,52 % |
| Recuperación | No se recupera | No se recupera |

Rama sin almacenamiento: INV-A tiene DC/AC 1,47 y **no cumple** (Imp 13,3 > 12 A, con alerta de recorte); INV-B tiene DC/AC 1,10 y **cumple**; INV-C tiene DC/AC 0,73 y queda en **alerta** por inversor sobredimensionado.

### Pruebas automáticas
`pruebas.html` verifica el caso estandarizado de forma automática:

1. Carga `index.html` sin mostrarlo.
2. Activa el caso de prueba.
3. Compara **59 resultados** de la app con los valores calculados a mano con las fórmulas del TdR §4, con la tolerancia del 1 % del §8.

Los resultados cubren el generador, los reguladores, los bancos AGM y LFP, los inversores, la comparación de tecnologías y el ajuste del balance. La página marca cada resultado con ✓ o ✗ y muestra un resumen.

Debe abrirse desde un servidor, no con doble clic, porque el navegador bloquea el acceso entre archivos `file://`:
- En Vercel: `https://<tu-proyecto>.vercel.app/pruebas.html`.
- En local: `python -m http.server 8080` y abrir `http://localhost:8080/pruebas.html`.

## Persistencia de proyectos

Los botones **Guardar** / **Cargar** exportan e importan el proyecto completo como un archivo `.json`:

- Reto 01: cargas y horarios.
- Reto 02: generador.
- Reto 03: rama, equipos, banco y ajuste del balance aceptado.

Un archivo de una versión anterior sigue cargando, y los campos nuevos se completan con valores por defecto.

## Uso de herramientas automáticas

Como admite el TdR (sección 8), en la auditoría y corrección de la versión 1.3 se usó un asistente de IA (Claude). Los cambios y su justificación están en [`CHANGELOG.md`](CHANGELOG.md).
