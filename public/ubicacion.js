let map = null
let infoWindowMapa = null
let marcadorUsuario = null
let marcadoresReportesMapa = []
let incidentesGlobales = []
let directionsService = null
let directionsRenderer = null
let marcadorDestino = null
let str_reporte_vialidad = ""


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

        try {
            monitorearUbicacion()
            
            const ubicacion = await pedirUbicacion()
            const ubicacionActual = { lat: ubicacion.lat, lng: ubicacion.lng }

            map.setCenter(ubicacionActual)
            actualizarMarcadorUsuario(ubicacionActual)
        } catch (errorUbicacion) {
            console.error("Error inicial ubi:", errorUbicacion)
            mostrarErrorUbicacion(
                infoWindowMapa,
                UBICACION_INICIAL,
                true,
                errorUbicacion.message || "No se pudo obtener tu ubicación actual."
            )
        }

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

function monitorearUbicacion() {
    if (!("geolocation" in navigator)) return
    navigator.geolocation.watchPosition(
        pos => {
            const { latitude, longitude, accuracy } = pos.coords
            lat_global = latitude
            lng_global = longitude
            accuracy_global = accuracy
            timestamp_global = pos.timestamp
            const posNueva = { lat: latitude, lng: longitude }
            actualizarMarcadorUsuario(posNueva)
            enviarCoordenadas()
        },
        err => console.error("Error watchPosition:", err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
}

function actualizarMarcadorUsuario(posicion) {
    if (!map) return
    if (marcadorUsuario) {
        marcadorUsuario.setPosition(posicion)
    } else {
        marcadorUsuario = new google.maps.Marker({
            map,
            position: posicion,
            title: "Tu ubicación actual",
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: "#32ADE6",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#FFFFFF"
            }
        })
    }
}

function enviarCoordenadas() {
    const isDemoMode = localStorage.getItem('motus_demo_mode') === 'true';
    const targetUrl = isDemoMode 
        ? "/demo_reports.json" 
        : "https://lookitag.com/motus/controlador/recibir_ubicacion.php";

    const formData = new FormData()
    formData.append("latitud", lat_global || "")
    formData.append("longitud", lng_global || "")
    formData.append("marcadores", marcadores)

    const fetchOptions = isDemoMode ? { method: "GET" } : { method: "POST", body: formData };

    fetch(targetUrl, fetchOptions)
    .then(r => r.ok ? (isDemoMode ? r.json() : r.text()) : Promise.reject("Error en la petición"))
    .then(data => {
        let datos = []
        if (isDemoMode) {
            datos = data
        } else {
            if (typeof data === "string" && !data.toLowerCase().includes("error")) {
                try { datos = JSON.parse(data) } catch(e) { console.error("Error parseando:", e) }
            } else if (typeof data === "object") {
                datos = data
            } else {
                return
            }
        }
        incidentesGlobales = datos
        pintarReportesEnMapa(datos)
    })
    .catch(err => console.error("Error:", err))
}

let resumen_reportes_mapa = ""
function pintarReportesEnMapa(datos) {
    if (!Array.isArray(datos) || !map) return

    limpiarMarcadoresReportesMapa()

    resumen_reportes_mapa = ""

    const textos_reportes = []
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

    for (let objeto of datos) {
        const lat = Number(objeto.lat)
        const lng = Number(objeto.lng)

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            continue
        }

        const posicion = { lat, lng }

        const tipo = objeto.tipo || objeto.tipo_alerta || objeto.categoria || ""
        const colorMarcador = obtenerColorMarcador(tipo)

        const titulo = objeto.titulo || "Sin título"
        const descripcion = objeto.descripcion || "Sin descripción"
        const direccion = objeto.direccion_objeto || objeto.direccion || "Sin dirección"
        const fecha = objeto.fecha || "Sin fecha"

        if (!(titulo === "Sin título" && descripcion === "Sin descripción")) {
            textos_reportes.push(titulo + ": " + descripcion)
        }

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
    }

    resumen_reportes_mapa = textos_reportes.join("\n")

    console.log(resumen_reportes_mapa)

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

    reporteVialidad()
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

function reporteVialidad() {
    const formData = new FormData()
    formData.append("resumen", resumen_reportes_mapa)

    fetch("https://lookitag.com/motus/controlador/reporte_vialidad.php", {
        method: "POST",
        body: formData
    })
    .then(r => r.ok ? r.text() : Promise.reject("Error en la petición"))
    .then(body => {
        if (!body.toLowerCase().includes("error")) {
            str_reporte_vialidad = body
            // Emitir evento para que React lo capture
            window.dispatchEvent(new CustomEvent('vialidad-update', { detail: body }))
        }
    })
    .catch(err => console.error("Error vialidad:", err))
}

function establecerDestino(latLng) {
    if (marcadorDestino) marcadorDestino.setMap(null)
    marcadorDestino = new google.maps.Marker({
        position: latLng,
        map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#F21314",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#FFFFFF"
        }
    })
    calcularRuta(latLng)
}

function calcularRuta(destino) {
    if (!lat_global || !lng_global) return
    const origen = new google.maps.LatLng(lat_global, lng_global)
    const request = {
        origin: origen,
        destination: destino,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true
    }

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            let mejorRuta = result.routes[0]
            let tieneConflicto = detectarConflictoEnRuta(mejorRuta)

            if (tieneConflicto && result.routes.length > 1) {
                for (let i = 1; i < result.routes.length; i++) {
                    if (!detectarConflictoEnRuta(result.routes[i])) {
                        mejorRuta = result.routes[i]
                        tieneConflicto = false
                        break
                    }
                }
            }

            directionsRenderer.setDirections(result)
            directionsRenderer.setRouteIndex(result.routes.indexOf(mejorRuta))
        }
    })
}

function detectarConflictoEnRuta(ruta) {
    if (!incidentesGlobales || incidentesGlobales.length === 0) return false
    const path = ruta.overview_path
    for (let incidente of incidentesGlobales) {
        const ubiIncidente = new google.maps.LatLng(Number(incidente.lat), Number(incidente.lng))
        for (let point of path) {
            const distancia = google.maps.geometry.spherical.computeDistanceBetween(point, ubiIncidente)
            if (distancia < 150) return true
        }
    }
    return false
}