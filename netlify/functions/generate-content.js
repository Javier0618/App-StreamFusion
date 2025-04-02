const fs = require("fs").promises
const path = require("path")
const fetch = require("node-fetch")

// API Key de TMDB
const API_KEY = "32e5e53999e380a0291d66fb304153fe"

// Rutas de plantillas
const TEMPLATES_DIR = path.join(__dirname, "../../templates")

exports.handler = async (event, context) => {
  // Configurar CORS para permitir solicitudes desde cualquier origen
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  }

  // Manejar solicitudes OPTIONS (preflight CORS)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Preflight exitoso" }),
    }
  }

  // Solo permitir solicitudes POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Método no permitido" }),
    }
  }

  try {
    console.log("Función invocada con evento:", JSON.stringify(event.body))

    // Obtener datos de la solicitud
    const data = JSON.parse(event.body)
    const { contentId } = data

    if (!contentId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Se requiere un ID de contenido" }),
      }
    }

    console.log(`Detectando tipo de contenido para ID: ${contentId}`)

    // Detectar tipo de contenido
    const contentType = await detectContentType(contentId)
    console.log(`Tipo de contenido detectado: ${contentType}`)

    // En un entorno real, aquí cargaríamos y procesaríamos la plantilla
    // Para esta demostración, simulamos que se ha procesado correctamente

    const fileName = `${contentType}-${contentId}.html`
    const url = `/content/${fileName}`

    // Devolver respuesta exitosa
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        contentType,
        fileName,
        url,
      }),
    }
  } catch (error) {
    console.error("Error en la función:", error)

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || "Error interno del servidor" }),
    }
  }
}

/**
 * Detecta si el contenido es una serie o película basado en su ID
 * @param {string} contentId - ID del contenido en TMDB
 * @returns {Promise<string>} - 'series' o 'peliculas'
 */
async function detectContentType(contentId) {
  try {
    console.log(`Consultando API de TMDB para película con ID: ${contentId}`)

    // Primero intentamos como película
    const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${contentId}?api_key=${API_KEY}`)
    console.log(`Respuesta de película: ${movieResponse.status}`)

    if (movieResponse.ok) {
      return "peliculas"
    }

    console.log(`Consultando API de TMDB para serie con ID: ${contentId}`)

    // Si no es película, intentamos como serie
    const seriesResponse = await fetch(`https://api.themoviedb.org/3/tv/${contentId}?api_key=${API_KEY}`)
    console.log(`Respuesta de serie: ${seriesResponse.status}`)

    if (seriesResponse.ok) {
      return "series"
    }

    // Si no es ninguno, lanzamos error
    throw new Error(`No se pudo determinar el tipo de contenido para el ID: ${contentId}`)
  } catch (error) {
    console.error(`Error al detectar tipo de contenido: ${error.message}`)
    throw new Error(`No se pudo determinar el tipo de contenido: ${error.message}`)
  }
}

/**
 * Procesa la plantilla reemplazando el ID del contenido
 * @param {string} template - Contenido de la plantilla
 * @param {string} contentId - ID del contenido
 * @param {string} contentType - Tipo de contenido ('series' o 'peliculas')
 * @returns {string} - Plantilla procesada
 */
function processTemplate(template, contentId, contentType) {
  let processedTemplate = template

  if (contentType === "series") {
    // Reemplazar el ID de serie de ejemplo (207468) por el ID real
    processedTemplate = template.replace(/const seriesId = 207468;/g, `const seriesId = ${contentId};`)
  } else {
    // Reemplazar el ID de película de ejemplo (786892) por el ID real
    processedTemplate = template.replace(/const movieId = 786892;/g, `const movieId = ${contentId};`)

    // También actualizar la URL del reproductor si es necesario
    processedTemplate = processedTemplate.replace(
      /data-src="https:\/\/unlimplayer\.top\/embed\/ovef0zibudjirg5"/g,
      `data-src="https://unlimplayer.top/embed/${contentId}"`,
    )
  }

  return processedTemplate
}
