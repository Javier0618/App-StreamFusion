// Elementos del DOM
const contentForm = document.getElementById("content-form")
const contentIdInput = document.getElementById("content-id")
const resultContainer = document.getElementById("result")
const resultContent = document.getElementById("result-content")
const previewLink = document.getElementById("preview-link")
const loadingIndicator = document.getElementById("loading")

// Manejar el envío del formulario
contentForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  // Obtener el ID del contenido
  const contentId = contentIdInput.value.trim()

  if (!contentId) {
    showResult("Por favor, ingresa un ID de contenido válido.", "error")
    return
  }

  try {
    // Mostrar indicador de carga
    loadingIndicator.classList.remove("hidden")
    resultContainer.classList.add("hidden")

    console.log("Enviando solicitud a la función de Netlify...")

    // Llamar a la función de Netlify para generar el contenido
    const response = await fetch("/.netlify/functions/generate-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contentId }),
    })

    console.log("Respuesta recibida:", response.status)

    const responseData = await response.json()
    console.log("Datos de respuesta:", responseData)

    if (!response.ok) {
      throw new Error(responseData.error || "Error al procesar la solicitud")
    }

    // Mostrar resultado
    showResult(
      `✅ Contenido detectado como: <strong>${responseData.contentType === "series" ? "Serie" : "Película"}</strong><br>
       📄 Página generada: <strong>${responseData.fileName}</strong>`,
      "success",
    )

    // Mostrar enlace de vista previa
    previewLink.innerHTML = `
      <div class="preview-link">
        <a href="${responseData.url}" target="_blank">Ver página generada</a>
      </div>
    `
  } catch (error) {
    console.error("Error en la solicitud:", error)
    showResult(`❌ Error: ${error.message}`, "error")
  } finally {
    // Ocultar indicador de carga
    loadingIndicator.classList.add("hidden")
  }
})

// Función para mostrar el resultado
function showResult(message, type) {
  resultContainer.classList.remove("hidden", "success", "error")
  resultContainer.classList.add(type)
  resultContent.innerHTML = message
  resultContainer.scrollIntoView({ behavior: "smooth" })
}
