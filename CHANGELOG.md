# Historial de versiones

Formato: cada versión lista lo **nuevo**, lo **corregido** y los cambios de **catálogo y datos**. Las referencias "RF-xx" y "§x" remiten al TdR del Reto 03.

## v1.3 — 2026-10-26

Auditoría del Reto 03 contra el TdR (métodos de cálculo, RF-25 a RF-36, criterios de evaluación y caso de prueba estandarizado), seguida de estas correcciones.

### Recurso solar y API
- **Corregido:** NREL cambió de dominio, `developer.nrel.gov` dejó de existir y la consulta fallaba siempre. Ahora se usa `developer.nlr.gov`.
- **Corregido:** se quitó el proxy público `corsproxy.io`. No hacía falta, porque la API acepta consultas del navegador, y además recibía la clave en cada consulta.
- **Corregido:** el tiempo de espera de 9 s era menor que lo que tarda PVWatts. La app abandonaba la consulta y usaba en silencio los datos locales. Ahora espera 30 s.
- **Nuevo:** un caso guardado usa la base local sin consultar la API, y "Coordenadas manuales" consulta la API.
- **Nuevo:** nombre del lugar consultado (municipio, departamento y país) con OpenStreetMap, para cualquier coordenada, y etiqueta `Ciudad (HSP · inclinación°/azimut°)` en el selector.
- **Corregido:** la tarjeta "Irradiación media anual" mostraba el mes de menor recurso cuando se elegía ese criterio. Ahora muestra siempre el promedio anual e indica aparte qué HSP se usa para dimensionar.

### Seguridad (§8: "credenciales en el repositorio")
- **Corregido:** `config.js` tenía la clave personal de NREL y estaba publicado en GitHub. Ahora solo lleva `DEMO_KEY`.
- **Nuevo:** la función `api/pvwatts.js` (Vercel) consulta PVWatts con la clave guardada en la variable de entorno `NREL_API_KEY`. La clave que quedó en el historial de git debe revocarse en developer.nlr.gov.

### Ramas (RF-25)
- **Corregido:** cambiar el tipo de aplicación borraba el panel elegido a mano y reemplazaba el PR y la tensión máxima por los valores típicos, aunque fueran datos fijados. Con eso, la rama sin almacenamiento del caso de prueba evaluaba otro generador. Ahora se conservan el panel elegido a mano y los valores fijados.
- **Nuevo:** en el caso de prueba, una nota indica qué tipo de aplicación elegir para evaluar la otra rama.

### Verificación del arreglo y del equipo (RF-28 a RF-31)
- **Nuevo:** columna "Ns máx." por equipo en las tablas de reguladores e inversores (antes solo aparecía en el informe y solo para el equipo elegido).
- **Nuevo:** verificación de la tensión de banco que admite cada regulador según su ficha (por ejemplo 12/24 V).
- **Nuevo:** reconfiguración concreta Ns × Np del mismo panel cuando un equipo no admite el arreglo, con un botón para aplicarla.
- **Revisado:** la corriente de diseño de conductores se mantiene en **1,25 × 1,25 × Isc** (21,9 A en el caso de prueba). Primero se cambió a 1,25 × Isc, por la frase "con el factor 1,25" del TdR del Reto 03, pero se revirtió: el TdR del Reto 02 (§7.3, ec. 3) define I<sub>diseño</sub> = 1,25 · 1,25 · Isc según la NTC 2050 art. 690-8, y así el Reto 02 y el Reto 03 muestran el mismo valor. Ahora la leyenda y el informe declaran el factor aplicado.
- **Corregido:** el texto del aviso de área en la tabla de paneles (Reto 02) ahora dice "⚠ en la columna Área: el arreglo ocupa más que el área disponible declarada (RF-22)".

### Banco de baterías (RF-32, RF-33, RF-35)
- **Corregido:** un mismo campo de tensión servía para la corriente del regulador y para el Cn [Ah]. Con LFP de 51,2 V daba Cn = 438,7 Ah en vez de 411,2 Ah y tasa C de carga de 0,086 en vez de 0,092. Ahora se separan:
  - la **tensión nominal del sistema** (corriente del regulador, tasa C y Ns);
  - la **tensión real del banco** (Ns × V<sub>unidad</sub>: Cn [Ah], energía instalada y arranque V<sub>bat</sub> + 5 V).
- **Corregido:** la comparación de tecnologías y la selección automática de batería dimensionaban todas las baterías con el DoD de la batería elegida. Ahora cada tecnología usa su propio DoD de diseño.
- **Corregido:** la interpretación de "kWh / año de servicio" estaba invertida y favorecía a AGM. Ahora indica que menor es mejor, y se agregó "kWh entregados por kWh instalado" (comparación por energía entregada, sesión 10).
- **Corregido:** con entradas fuera de rango la app seguía calculando y mostraba valores infinitos como "0,00". Ahora oculta los resultados y el informe lo indica. En toda la app, `fmt()` muestra "—" para valores no numéricos.

### Balance de cierre (RF-34)
- **Corregido:** "Aceptar ajuste" solo mostraba un texto, revisaba únicamente la Isc del equipo elegido y anunciaba un número de módulos distinto del que agregaba. En el caso AGM afirmaba que CTRL-B seguía cumpliendo, aunque la corriente al banco subía a 91,7 A (> 80 A). Ahora:
  - amplía el generador con cadenas completas;
  - **recalcula todo el componente** (equipos, corrientes, banco, tasa C, recuperación, balance e informe);
  - revisa todo el catálogo;
  - se puede deshacer.
- **Nuevo:** se declara la base del porcentaje: (P<sub>instalada</sub> − P<sub>req</sub>) / P<sub>req</sub>.

### Catálogo y datos (criterio "catálogo verificable")
- **Baterías:**
  - Pylontech Force H2 (alta tensión, 96 V) se reemplazó por **Pylontech US5000** (48 V / 100 Ah).
  - BYD LVS: 50 Ah / 2,56 kWh → **78 Ah / 4,0 kWh**.
  - Dyness A48100: 51,2 V → **48 V**.
- **Inversores:** se corrigieron la ventana MPPT, la Imp y la Isc según la ficha de SMA Sunny Boy 2.0, Fronius Primo 3.0-1, Growatt MIN 2500TL-X, Huawei SUN2000-3KTL-L1, Solis S6-GR1P3K y GoodWe GW3000-NS.
- **Reguladores:**
  - Isc de Victron 150/100 y 250/100 (70 A), Outback FlexMax 80 (80 A) y Steca Tarom 6000-M (60 A, Voc 200 V).
  - Isc de Morningstar TriStar 60 y EPEVER Tracer AN, limitada a su corriente máxima.
  - "Phocos CIS-MPPT 40" → **Phocos MPPT 100/40** (Voc 95 V, 12/24 V).
- **Uribia (`recurso_solar.js`):** se documentó que el HSP anual 5,8 y el del mes de menor recurso 5,2 son condiciones especificadas en el TdR del Reto 02, no una consulta a PVWatts.

### Pruebas y documentación
- **Nuevo:** `pruebas.html` con 77 pruebas automáticas sobre dos ejemplos de respuesta conocida:
  - el caso estandarizado del TdR (59 pruebas: generador, reguladores, bancos AGM y LFP, inversores, comparación de tecnologías y ajuste del balance);
  - el ejemplo 1 de la Sesión 10 (18 pruebas contra las respuestas publicadas por el docente; sistema de 24 V con AGM y LFP de 25,6 V).

  La tolerancia es del 1 %, o igual al redondeo cuando la respuesta publicada viene redondeada.
- **Nuevo:** README actualizado y este CHANGELOG.

## v1.2

Las versiones v1.2 y anteriores se resumen a partir del README previo; no tienen fecha registrada.

- Reto 01, Reto 02 y Reto 03 integrados en una sola interfaz.
- Reto 03: selector de rama, verificación del arreglo y de corrientes, catálogo de reguladores, inversores y baterías, banco de baterías, balance de cierre, tasa C, recuperación, comparación de tecnologías e informe ampliado.

## v1.1

- Reto 02: recurso solar (PVWatts con respaldo local), potencia pico, catálogo de paneles, configuración en cadenas y caso de prueba estandarizado.

## v1.0

- Reto 01: cuadro de cargas, perfil horario de 24 h, demanda máxima, energía diaria/mensual/anual, costos, informe y guardar/cargar proyecto.
