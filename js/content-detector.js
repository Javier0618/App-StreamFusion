// API Key de TMDB
const API_KEY = "32e5e53999e380a0291d66fb304153fe"

// Plantillas
const TEMPLATES = {
  series: "/templates/series.html",
  peliculas: "/templates/peliculas.html",
}

/**
 * Detecta si el contenido es una serie o película basado en su ID
 * @param {string} contentId - ID del contenido en TMDB
 * @returns {Promise<string>} - 'series' o 'peliculas'
 */
export async function detectContentType(contentId) {
  try {
    // Primero intentamos como película
    const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${contentId}?api_key=${API_KEY}`)

    if (movieResponse.ok) {
      console.log(`✅ El contenido ${contentId} es una película`)
      return "peliculas"
    }

    // Si no es película, intentamos como serie
    const seriesResponse = await fetch(`https://api.themoviedb.org/3/tv/${contentId}?api_key=${API_KEY}`)

    if (seriesResponse.ok) {
      console.log(`✅ El contenido ${contentId} es una serie`)
      return "series"
    }

    // Si no es ninguno, lanzamos error
    throw new Error(`No se pudo determinar el tipo de contenido para el ID: ${contentId}`)
  } catch (error) {
    console.error(`❌ Error al detectar tipo de contenido: ${error.message}`)
    throw new Error(`No se pudo determinar el tipo de contenido. Verifica que el ID sea válido.`)
  }
}

/**
 * Carga la plantilla correspondiente
 * @param {string} templatePath - Ruta a la plantilla
 * @returns {Promise<string>} - Contenido de la plantilla
 */
async function loadTemplate(templatePath) {
  try {
    const response = await fetch(templatePath)

    if (!response.ok) {
      throw new Error(`No se pudo cargar la plantilla (${response.status})`)
    }

    return await response.text()
  } catch (error) {
    console.error(`❌ Error al cargar la plantilla: ${error.message}`)
    throw new Error("No se pudo cargar la plantilla. Verifica que los archivos existan.")
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

/**
 * Genera una página de contenido basada en el tipo y ID
 * @param {string} contentId - ID del contenido
 * @param {string} contentType - Tipo de contenido ('series' o 'peliculas')
 * @returns {Promise<Object>} - Información sobre la página generada
 */
export async function generateContentPage(contentId, contentType) {
  try {
    // Cargar la plantilla correspondiente
    const templatePath = TEMPLATES[contentType]
    const template = await loadTemplate(templatePath)

    // Procesar la plantilla
    const processedTemplate = processTemplate(template, contentId, contentType)

    // En un entorno real, aquí guardaríamos el archivo
    // Para esta demostración, simulamos que se ha guardado correctamente

    const fileName = `${contentType}-${contentId}.html`
    const url = `/preview/${fileName}`

    // Simular una llamada a Netlify Function para guardar el archivo
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      fileName,
      url,
      contentType,
    }
  } catch (error) {
    console.error(`❌ Error al generar la página: ${error.message}`)
    throw error
  }
}

