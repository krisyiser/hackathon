let map = null
let infoWindowMapa = null
let marcadorUsuario = null
let marcadoresReportesMapa = []
let incidentesGlobales = []
let directionsService = null
let directionsRenderer = null
let marcadorDestino = null

let lat_global = null
let lng_global = null
let accuracy_global = null
let timestamp_global = null

const marcadores = ["seguridad", "emergencia", "obstruccion", "saturacion", "entorno"]

const GOOGLE_MAPS_API_KEY = "AIzaSyBEXm0irWiTFBPH4536b5T9qftzeqO4kbs"
const UBICACION_INICIAL = { lat: 19.4326, lng: -99.1332 }

function cargarGoogleMaps() {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            resolve()
            return
        }

        const scriptExistente = document.querySelector('script[data-google-maps="1"]')

        if (scriptExistente) {
            scriptExistente.addEventListener("load", () => resolve())
            scriptExistente.addEventListener("error", () => reject(new Error("No se pudo cargar Google Maps")))
            return
        }

        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=weekly&libraries=geometry`
        script.async = true
        script.defer = true
        script.setAttribute("data-google-maps", "1")

        script.onload = () => resolve()
        script.onerror = () => reject(new Error("No se pudo cargar Google Maps"))

        document.head.appendChild(script)
    })
}

async function initMap() {
    try {
        await cargarGoogleMaps()

        map = new google.maps.Map(document.getElementById("mapa"), {
            center: UBICACION_INICIAL,
            zoom: 15
        })

        infoWindowMapa = new google.maps.InfoWindow()
        
        // Inicializar servicios de ruta
        directionsService = new google.maps.DirectionsService()
        directionsRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: false,
            polylineOptions: {
                strokeColor: "#32ADE6",
                strokeWeight: 6,
                strokeOpacity: 0.8
            }
        })
        directionsRenderer.setMap(map)

        // Evento de clic para destino
        map.addListener("click", (e) => {
            const destino = e.latLng
            establecerDestino(destino)
        })

        try {
            const ubicacion = await pedirUbicacion()

            const ubicacionActual = {
                lat: ubicacion.lat,
                lng: ubicacion.lng
            }

            map.setCenter(ubicacionActual)

            marcadorUsuario = new google.maps.Marker({
                map,
                position: ubicacionActual,
                title: "Tu ubicación actual"
            })

            infoWindowMapa.setPosition(ubicacionActual)
            infoWindowMapa.setContent("Tu ubicación actual")
            infoWindowMapa.open(map, marcadorUsuario)
        } catch (errorUbicacion) {
            mostrarErrorUbicacion(
                infoWindowMapa,
                UBICACION_INICIAL,
                true,
                errorUbicacion.message || "No se pudo obtener tu ubicación actual."
            )
        }
    } catch (errorMapa) {
        console.error("Error cargando Google Maps:", errorMapa)
    }
}

function mostrarErrorUbicacion(infoWindow, posicion, navegadorSoportaGeo, mensajePersonalizado = "") {
    if (!infoWindow || !map) return

    infoWindow.setPosition(posicion)
    infoWindow.setContent(
        mensajePersonalizado ||
        (
            navegadorSoportaGeo
                ? "No se pudo obtener tu ubicación actual."
                : "Tu navegador no soporta geolocalización."
        )
    )
    infoWindow.open(map)
}

function pedirUbicacion(options = {}) {
    const defaultOptions = {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
    }

    const geoOptions = { ...defaultOptions, ...options }

    return new Promise(async (resolve, reject) => {
        if (!("geolocation" in navigator)) {
            reject({
                code: "GEO_NOT_SUPPORTED",
                message: "Este navegador no soporta geolocalización."
            })
            return
        }

        if ("permissions" in navigator && navigator.permissions?.query) {
            try {
                const status = await navigator.permissions.query({ name: "geolocation" })

                if (status.state === "denied") {
                    if (typeof btn_dar_permisos !== "undefined" && btn_dar_permisos) {
                        btn_dar_permisos.style.visibility = "visible"
                    }

                    reject({
                        code: "PERMISSION_DENIED",
                        message: "Permiso de ubicación denegado. Actívalo en la configuración del navegador."
                    })
                    return
                }
            } catch (e) {
                console.warn("No se pudo consultar permissions API:", e)
            }
        }

        navigator.geolocation.getCurrentPosition(
            pos => {
                const { latitude, longitude, accuracy } = pos.coords

                lat_global = latitude
                lng_global = longitude
                accuracy_global = accuracy
                timestamp_global = pos.timestamp

                console.log("Ubicación guardada:", {
                    lat_global,
                    lng_global,
                    accuracy_global,
                    timestamp_global
                })

                enviarCoordenadas()

                resolve({
                    lat: latitude,
                    lng: longitude,
                    accuracy,
                    timestamp: pos.timestamp
                })
            },
            err => {
                const erroresGeo = {
                    1: { code: "PERMISSION_DENIED", message: "El usuario denegó el permiso de ubicación." },
                    2: { code: "POSITION_UNAVAILABLE", message: "No se pudo obtener la ubicación (señal/GPS/Wi-Fi)." },
                    3: { code: "TIMEOUT", message: "Se agotó el tiempo intentando obtener la ubicación." }
                }

                reject(
                    erroresGeo[err.code] || {
                        code: "GEO_ERROR",
                        message: err.message || "Error de geolocalización."
                    }
                )
            },
            geoOptions
        )
    })
}

function enviarCoordenadas() {
    let check_evidencia = 0

    if (lat_global != null && lat_global !== "") check_evidencia = 1
    else lat_global = ""

    if (lng_global != null && lng_global !== "") check_evidencia = 1
    else lng_global = ""

    const formData = new FormData()
    formData.append("latitud", lat_global)
    formData.append("longitud", lng_global)
    formData.append("marcadores", marcadores)

    const isDemoMode = localStorage.getItem('motus_demo_mode') === 'true';
    const targetUrl = isDemoMode 
        ? "/demo_reports.json" 
        : "https://lookitag.com/motus/controlador/recibir_ubicacion.php";

    const fetchOptions = isDemoMode ? { method: "GET" } : { method: "POST", body: formData };

    fetch(targetUrl, fetchOptions)
    .then(r => r.ok ? r.text() : Promise.reject("Error en la petición"))
    .then(body => {
        console.log("Respuesta backend:", body)

        if (!body.toLowerCase().includes("error")) {
            let datos = JSON.parse(body)

            console.log("Datos parseados:", datos)
            console.log("Mapa:", map)

            for (let objeto of datos) {
                console.log("Objeto:", objeto)
            }

            incidentesGlobales = datos // Guardar para el motor de rutas
            pintarReportesEnMapa(datos)
        } else {
            console.log("Respuesta con error")
            console.log(body)
        }
    })
    .catch(err => console.error("Error:", err))
}
function pintarReportesEnMapa(datos) {
    if (!Array.isArray(datos) || !map) return

    limpiarMarcadoresReportesMapa()

    const bounds = new google.maps.LatLngBounds()
    let hayElementos = false

    if (lat_global != null && lat_global !== "" && lng_global != null && lng_global !== "") {
        const posicionUsuario = {
            lat: Number(lat_global),
            lng: Number(lng_global)
        }

        if (Number.isFinite(posicionUsuario.lat) && Number.isFinite(posicionUsuario.lng)) {
            bounds.extend(posicionUsuario)
            hayElementos = true
        }
    }

    const tipologiasDemo = ["seguridad", "emergencia", "obstruccion", "saturacion", "entorno"]
    datos.forEach((objeto, index) => {
        const lat = Number(objeto.lat)
        const lng = Number(objeto.lng)

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            return
        }

        const posicion = { lat, lng }

        let tipo = objeto.tipo || objeto.tipo_alerta || objeto.categoria || ""
        if (!tipo) {
            tipo = tipologiasDemo[index % tipologiasDemo.length]
        }
        const colorMarcador = obtenerColorMarcador(tipo)

        const titulo = objeto.titulo || "Sin título"
        const descripcion = objeto.descripcion || "Sin descripción"
        const direccion = objeto.direccion_objeto || objeto.direccion || "Sin dirección"
        const fecha = objeto.fecha || "Sin fecha"

        const marker = new google.maps.Marker({
            map,
            position: posicion,
            title: titulo,
            icon: crearIconoMarcador(colorMarcador)
        })

        marker.addListener("click", () => {
            if (!infoWindowMapa) {
                infoWindowMapa = new google.maps.InfoWindow()
            }

            infoWindowMapa.setContent(`
                <div style="max-width:260px;">
                    <div style="font-weight:bold; color:${colorMarcador}; margin-bottom:8px;">
                        ${escapeHtml(tipo || "Sin tipo")}
                    </div>

                    <strong>${escapeHtml(titulo)}</strong>
                    <br><br>
                    <strong>Descripción:</strong> ${escapeHtml(descripcion)}
                    <br>
                    <strong>Dirección:</strong> ${escapeHtml(direccion)}
                    <br>
                    <strong>Fecha:</strong> ${escapeHtml(fecha)}
                </div>
            `)

            infoWindowMapa.open({
                anchor: marker,
                map
            })
        })

        marcadoresReportesMapa.push(marker)
        bounds.extend(posicion)
        hayElementos = true
    })

    if (hayElementos) {
        map.fitBounds(bounds)

        google.maps.event.addListenerOnce(map, "bounds_changed", () => {
            if (map.getZoom() > 16) {
                map.setZoom(16)
            }
        })
    } else {
        map.setCenter(UBICACION_INICIAL)
        map.setZoom(15)
    }
}

function limpiarMarcadoresReportesMapa() {
    for (let marker of marcadoresReportesMapa) {
        marker.setMap(null)
    }

    marcadoresReportesMapa = []
}

function escapeHtml(texto) {
    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;")
}

document.addEventListener("DOMContentLoaded", () => {
    initMap()
})

function normalizarTipoMarcador(tipo) {
    return String(tipo || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
}

function obtenerColorMarcador(tipo) {
    const tipoNormalizado = normalizarTipoMarcador(tipo)

    if (tipoNormalizado.includes("seguridad")) return "#F21314"
    if (tipoNormalizado.includes("emergencia")) return "#FF6B00"
    if (tipoNormalizado.includes("obstruccion")) return "#F2FD14"
    if (tipoNormalizado.includes("saturacion")) return "#02D701"
    if (tipoNormalizado.includes("entorno")) return "#14C9D9"

    return "#3B82F6"
}

function crearIconoMarcador(color) {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24">
            <path fill="${color}" stroke="#1a1a1a" stroke-width="1.2"
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="3.2" fill="#ffffff"/>
        </svg>
    `

    return {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
        scaledSize: new google.maps.Size(42, 42),
        anchor: new google.maps.Point(21, 42)
    }
}

function establecerDestino(latLng) {
    if (marcadorDestino) {
        marcadorDestino.setPosition(latLng)
    } else {
        marcadorDestino = new google.maps.Marker({
            position: latLng,
            map: map,
            icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            },
            title: "Destino"
        })
    }

    if (lat_global && lng_global) {
        calcularRuta(
            { lat: lat_global, lng: lng_global },
            latLng
        )
    }
}

function calcularRuta(origen, destino) {
    const request = {
        origin: origen,
        destination: destino,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true
    }

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            
            // BUSCAR UNA RUTA QUE EVITE INCIDENTES
            let mejorRuta = result.routes[0]
            let hayRutaLimpia = false

            for (let i = 0; i < result.routes.length; i++) {
                const rutaActual = result.routes[i]
                if (!detectarConflictoEnRuta(rutaActual)) {
                    mejorRuta = rutaActual
                    hayRutaLimpia = true
                    break
                }
            }

            // Aplicar la mejor opción encontrada
            const temporalResult = { ...result, routes: [mejorRuta] }
            directionsRenderer.setDirections(temporalResult)
            
            const route = mejorRuta.legs[0]
            
            let statusText = hayRutaLimpia 
                ? '<strong style="color:#02D701;">RUTA SEGURA OPTIMIZADA</strong>' 
                : '<strong style="color:#FF6B00;">RUTA DIRECTA (PRECAUCIÓN INCIDENTES)</strong>'

            infoWindowMapa.setContent(`
                <div style="padding:10px; font-family:sans-serif;">
                    ${statusText}
                    <div style="font-size:12px; color:#444; margin-top:5px;">
                        Distancia: <b>${route.distance.text}</b><br>
                        Tiempo: <b>${route.duration.text}</b>
                    </div>
                    ${!hayRutaLimpia ? '<div style="font-size:9px; color:red; margin-top:5px;">Aviso: No se encontraron rutas alternativas sin incidentes.</div>' : ''}
                </div>
            `)
            infoWindowMapa.open(map, marcadorDestino)
        } else {
            console.error("No se pudo calcular la ruta:", status)
        }
    })
}

function detectarConflictoEnRuta(ruta) {
    if (!incidentesGlobales || incidentesGlobales.length === 0) return false

    const RADIUS_UMBRAL = 150 // metros para considerar que "pasa por" el incidente
    const path = ruta.overview_path

    for (let incidente of incidentesGlobales) {
        const posIncidente = new google.maps.LatLng(Number(incidente.lat), Number(incidente.lng))
        
        for (let punto of path) {
            const distancia = google.maps.geometry.spherical.computeDistanceBetween(punto, posIncidente)
            if (distancia < RADIUS_UMBRAL) {
                console.warn("Conflicto detectado con incidente:", incidente.titulo)
                return true 
            }
        }
    }
    return false
}