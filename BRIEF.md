# Brief · Monitoreo de Inversión Publicitaria por País y Programa

## Problema que resuelve
ADIPA invierte en publicidad (Meta/Google Ads) por país y por programa académico, con un presupuesto estimado mensual para cada combinación. Hoy no siempre es fácil saber, de un vistazo, si un programa/país se está acercando o pasando su presupuesto, ni si a nivel agregado la inversión mensual está siendo mayor que los ingresos que genera. Esto se traduce en decisiones de gasto tomadas tarde o sin visibilidad clara.

## Usuario principal y roles
- **PMO**: revisa el ritmo de gasto de su(s) país(es), por tipo de programa, versus el presupuesto y el tiempo transcurrido del período, y decide si continuar, alertar o bajar la inversión en algún programa.
- **Especialista**: revisa una vista agregada de inversión, venta e indicador %Inv/Ventas por país y por mes (LATAM), y decide si se debe ajustar el presupuesto del mes siguiente.
- **Sistema (automático)**: trae los datos de gasto, venta e inversión (en esta versión, datos de ejemplo/mock en vez de conexión real a BigQuery/Meta/Google Ads) y calcula los indicadores.

## Pantallas / piezas (lista, en orden del journey)
1. **Pantalla PMO — Control de Gasto (por país)**
   - Selector de país (Chile / México / Colombia) y de mes/período.
   - Resumen del período: días transcurridos, estado de ritmo (EN RITMO / alerta), gasto acumulado, proyección al cierre, saldo disponible.
   - Barras de pacing: tiempo transcurrido vs. presupuesto consumido vs. proyección al cierre.
   - Tabla "Pacing por tipo de programa": Tipo de Programa | Presupuesto | Gasto Actual | Promedio Diario | Proyección Cierre | Diferencia | % Ritmo (con semáforo de color).
2. **Pantalla Especialista — Inversión LATAM**
   - Resumen general: Inversión total LATAM, Venta total LATAM, % ROAS.
   - Inversión por plataforma: Meta, Google, Seminario.
   - Desglose mensual: Mes | Inversión | Venta Total | ROAS% | % Inv/Ventas (con semáforo verde/rojo según umbral).
3. **Estado "Sin datos"**
   Se muestra en lugar de la tabla (o en la fila correspondiente) cuando no llegó información de un país/programa ese día, junto con la fecha de la última actualización disponible. No se debe mostrar como gasto o inversión igual a cero.

## Datos por pantalla (qué entra, qué sale)

**Pantalla PMO (Control de Gasto)**
- Entra: presupuesto del período por país/programa; gasto acumulado; días transcurridos y totales del período (datos mock).
- Sale: % gastado, % tiempo transcurrido, proyección al cierre, diferencia (presupuesto - proyección), color de ritmo (azul/naranja/rojo) a nivel país y a nivel programa.

**Pantalla Especialista (Inversión LATAM)**
- Entra: inversión y venta mensual por país/plataforma (datos mock).
- Sale: % ROAS, % Inv/Ventas calculado, color de alerta (verde si %Inv/Ventas ≤ 9%, rojo si > 9%).

**Estado "Sin datos"**
- Entra: fecha/hora de la última actualización exitosa.
- Sale: mensaje visible de "última actualización: [fecha]" en vez de valores en cero.

## Reglas de negocio (los "si... entonces...")
1. Si la proyección de gasto al cierre del período es menor al 95% del presupuesto, entonces el estado de ritmo se marca **azul** (en ritmo).
2. Si la proyección de gasto al cierre está entre 95% y 100% del presupuesto, o lo supera levemente con ritmo controlado, entonces se marca **naranja** (alerta de revisión).
3. Si la proyección de gasto al cierre supera el presupuesto Y el ritmo de gasto se aceleró más de 10% por sobre el avance del tiempo del período, entonces se marca **rojo** (riesgo de sobregasto, requiere decisión de reducir o justificar).
4. Si el %Inv/Ventas de un país o mes es mayor a 9%, entonces se marca en **rojo** en la vista de Especialista (ineficiencia, se está invirtiendo más de lo normal respecto a lo que genera).
5. Si el %Inv/Ventas es igual o menor a 9%, entonces se marca en **verde** (dentro de lo normal).
6. Si no llegaron datos de un país/programa en la actualización del día, entonces se muestra el estado "Sin datos" con la fecha de la última actualización disponible, en vez de mostrar valores en cero.
7. Las decisiones de bajar o ajustar inversión (PMO en Meta/Google Ads, Especialista en presupuesto del mes siguiente) se ejecutan fuera de esta app; la app solo informa y alerta, no modifica pautas ni presupuestos directamente.

## Fuera de alcance (qué NO se construye en esta versión)
1. Conexión real a BigQuery, Meta Ads API o Google Ads API — se usan datos de ejemplo (mock) en esta versión.
2. Edición o ajuste de presupuestos/pautas dentro de la app (eso se sigue haciendo directamente en Meta/Google Ads, fuera de esta herramienta).
3. Notificaciones automáticas (correo, Slack, etc.) cuando algo pasa a naranja o rojo — en esta versión el usuario debe entrar a revisar.
4. Vistas de "Inversión País", "Inversión Mensual" y "Desglose por Producto" (Plataforma, Prog. Sincrónicos, Prog. Asincrónicos) del dashboard real — esta versión solo cubre "Control de Gasto" (PMO) e "Inversión LATAM" (Especialista).
5. Login o control de acceso por rol — en esta versión ambas vistas (PMO y Especialista) son navegables libremente, sin autenticación.
6. Edición manual de datos dentro de la app (carga de presupuestos, etc.) — los datos de ejemplo vienen predefinidos.

## Retrospectiva

**1. ¿Qué pregunta te hizo dar cuenta de algo que no tenías claro del flujo?**
Al pensar en el camino de error, la pregunta de "¿qué pasa si el dashboard no logra traer los datos ese día?" hizo evidente que hoy ese caso no está bien resuelto: mostrar un valor en cero puede confundirse con "no hay gasto" cuando en realidad es "no llegó la información", y eso podría llevar a una decisión equivocada.

**2. ¿Qué diferencia hubo entre el mapa inicial y lo construido?**
El mapa inicial se centraba solo en el camino "feliz" (ver datos y decidir). Al formalizarlo se agregó explícitamente el estado de "sin datos" como una pantalla propia, y se dejó más claro que la app es puramente informativa: las decisiones de ajustar presupuesto o pauta se ejecutan siempre fuera de la herramienta, no dentro de ella.

**3. Si se hiciera de verdad para ADIPA, ¿cuál sería el primer riesgo o pieza faltante?**
El mayor riesgo es la dependencia de la disponibilidad de BigQuery y de las APIs de Meta/Google Ads: si falla la sincronización (token expirado, cambio de esquema, cuota excedida) y no hay un aviso claro de "datos desactualizados", un PMO o Especialista podría tomar una decisión de presupuesto basándose en información vieja sin saberlo. La pieza faltante más importante para una versión real sería un indicador confiable de frescura de datos y, eventualmente, una alerta automática cuando la sincronización falla.
