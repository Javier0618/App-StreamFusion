const fs = require("fs").promises
const path = require("path")
const fetch = require("node-fetch")

// API Key de TMDB
const API_KEY = "32e5e53999e380a0291d66fb304153fe"

// Rutas de plantillas
const TEMPLATES_DIR = path.join(__dirname, "../../templates")

exports.handler = async (event, context) => {
  // Solo permitir solicitudes POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método no permitido" }),
    }
  }

  try {
    // Obtener datos de la solicitud
    const data = JSON.parse(event.body)
    const { contentId } = data

    if (!contentId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Se requiere un ID de contenido" }),
      }
    }

    // Detectar tipo de contenido
    const contentType = await detectContentType(contentId)

    // Cargar plantilla
    const templatePath = path.join(TEMPLATES_DIR, `${contentType}.html`)
    const template = await fs.readFile(templatePath, "utf-8")

    // Procesar plantilla
    const processedTemplate = processTemplate(template, contentId, contentType)

    // Guardar archivo generado
    const outputDir = path.join(__dirname, "../../public/content")
    await fs.mkdir(outputDir, { recursive: true })

    const fileName = `${contentType}-${contentId}.html`
    const outputPath = path.join(outputDir, fileName)
    await fs.writeFile(outputPath, processedTemplate)

    // Devolver respuesta exitosa
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        contentType,
        fileName,
        url: `/content/${fileName}`,
      }),
    }
  } catch (error) {
    console.error("Error:", error)

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
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
    // Primero intentamos como película
    const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${contentId}?api_key=${API_KEY}`)

    if (movieResponse.ok) {
      return "peliculas"
    }

    // Si no es película, intentamos como serie
    const seriesResponse = await fetch(`https://api.themoviedb.org/3/tv/${contentId}?api_key=${API_KEY}`)

    if (seriesResponse.ok) {
      return "series"
    }

    // Si no es ninguno, lanzamos error
    throw new Error(`No se pudo determinar el tipo de contenido para el ID: ${contentId}`)
  } catch (error) {
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

