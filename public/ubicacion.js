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
                    btn_dar_permisos.style.visibility = "visible"
                    reject({
                        code: "PERMISSION_DENIED",
                        message: "Permiso de ubicación denegado. Actívalo en la configuración del navegador."
                    })
                    return
                }
            } catch (e) { }
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude, accuracy } = pos.coords

                // ✅ Guardar en globales
                lat_global = latitude
                lng_global = longitude
                accuracy_global = accuracy
                timestamp_global = pos.timestamp

                // ✅ Imprimir en consola
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
            (err) => {
                const map = {
                    1: { code: "PERMISSION_DENIED", message: "El usuario denegó el permiso de ubicación." },
                    2: { code: "POSITION_UNAVAILABLE", message: "No se pudo obtener la ubicación (señal/GPS/Wi-Fi)." },
                    3: { code: "TIMEOUT", message: "Se agotó el tiempo intentando obtener la ubicación." }
                }
                reject(map[err.code] || { code: "GEO_ERROR", message: err.message || "Error de geolocalización." })

            },
            geoOptions
        )
    })
}

pedirUbicacion()

marcadores=["seguridad","emergencia","obstruccion","saturacion","entorno"]

function enviarCoordenadas() {
    let check_evidencia = 0 // <- resetea cada envío

    if (lat_global != null && lat_global !== "") check_evidencia = 1
    else lat_global = ""

    if (lng_global != null && lng_global !== "") check_evidencia = 1
    else lng_global = ""

    const formData = new FormData()
    formData.append("latitud", lat_global)
    formData.append("longitud", lng_global)
    formData.append("marcadores", marcadores)

    fetch("controlador/recibir_ubicacion.php", { method: "POST", body: formData })
        .then(r => r.ok ? r.text() : Promise.reject("Error en la petición"))
        .then(body => {
            if (!body.includes("error")) {
                console.log(body)
                // ok
            } else {
                // error
                console.log("!!!!!")
                console.log(body)
            }
        })
        .catch(err => console.error("Error:", err))
}
