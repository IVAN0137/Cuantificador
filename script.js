// Inicialización cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    // Configuración de pestañas
    setupTabs()
  
    // Inicializar calculadoras
    initTabiqueCalculator()
    initColadosCalculator()
    initCimbraCalculator()
    initEscuadraCalculator()
  })
  
  // Configuración del sistema de pestañas
  function setupTabs() {
    const tabButtons = document.querySelectorAll(".tab-btn")
    const tabContents = document.querySelectorAll(".tab-content")
  
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remover clase activa de todos los botones y contenidos
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        tabContents.forEach((content) => content.classList.remove("active"))
  
        // Agregar clase activa al botón seleccionado
        button.classList.add("active")
  
        // Mostrar el contenido correspondiente
        const tabId = button.getAttribute("data-tab")
        document.getElementById(tabId).classList.add("active")
      })
    })
  }
  
  // ==================== CALCULADORA DE TABIQUES ====================
  function initTabiqueCalculator() {
    // Referencias a elementos del DOM
    const tipoTabique = document.getElementById("tipo-tabique")
    const largoMuro = document.getElementById("largo-muro")
    const altoMuro = document.getElementById("alto-muro")
    const agregarDescuento = document.getElementById("agregar-descuento")
    const areasDescuento = document.getElementById("areas-descuento")
    const calcularBtn = document.getElementById("calcular-tabique")
  
    // Datos de referencia para diferentes tipos de tabique
    const datosTabiques = {
      ladrillo: {
        nombre: "Ladrillo Rojo",
        dimensiones: { largo: 0.28, alto: 0.07, ancho: 0.14 },
        piezasPorM2: 50,
        materialAdicional: "Mortero: 0.031 m³/m², Cemento: 10.5 kg/m², Arena: 0.045 m³/m²",
      },
      block: {
        nombre: "Block de Concreto",
        dimensiones: { largo: 0.4, alto: 0.2, ancho: 0.15 },
        piezasPorM2: 12.5,
        materialAdicional: "Mortero: 0.028 m³/m², Cemento: 9.5 kg/m², Arena: 0.042 m³/m²",
      },
      tabicon: {
        nombre: "Tabicón",
        dimensiones: { largo: 0.4, alto: 0.2, ancho: 0.1 },
        piezasPorM2: 12.5,
        materialAdicional: "Mortero: 0.025 m³/m², Cemento: 8.5 kg/m², Arena: 0.038 m³/m²",
      },
      tablaroca: {
        nombre: "Tablaroca",
        dimensiones: { largo: 2.44, alto: 1.22, ancho: 0.013 },
        piezasPorM2: 0.34,
        materialAdicional: "Perfiles: 2.5 m/m², Tornillos: 15 pzas/m², Pasta: 1 kg/m²",
      },
    }
  
    // Agregar área de descuento
    agregarDescuento.addEventListener("click", () => {
      const areaDiv = document.createElement("div")
      areaDiv.className = "area-descuento"
      areaDiv.innerHTML = `
              <input type="number" class="descuento-ancho" placeholder="Ancho (m)" min="0" step="0.01">
              <input type="number" class="descuento-alto" placeholder="Alto (m)" min="0" step="0.01">
              <button class="btn-remove"><i class="fas fa-times"></i></button>
          `
  
      // Agregar evento para eliminar esta área
      const removeBtn = areaDiv.querySelector(".btn-remove")
      removeBtn.addEventListener("click", () => {
        areaDiv.remove()
      })
  
      areasDescuento.appendChild(areaDiv)
    })
  
    // Calcular tabique
    calcularBtn.addEventListener("click", () => {
      // Validar entradas
      if (!largoMuro.value || !altoMuro.value) {
        alert("Por favor ingrese las dimensiones del muro.")
        return
      }
  
      // Calcular área total
      const largo = Number.parseFloat(largoMuro.value)
      const alto = Number.parseFloat(altoMuro.value)
      let areaTotal = largo * alto
  
      // Restar áreas de descuento
      const descuentos = document.querySelectorAll(".area-descuento")
      descuentos.forEach((descuento) => {
        const anchoDesc = Number.parseFloat(descuento.querySelector(".descuento-ancho").value) || 0
        const altoDesc = Number.parseFloat(descuento.querySelector(".descuento-alto").value) || 0
        if (anchoDesc && altoDesc) {
          areaTotal -= anchoDesc * altoDesc
        }
      })
  
      // Asegurar que el área no sea negativa
      areaTotal = Math.max(0, areaTotal)
  
      // Obtener datos del tipo de tabique seleccionado
      const tipoSeleccionado = tipoTabique.value
      const datosTabique = datosTabiques[tipoSeleccionado]
  
      // Calcular cantidad de piezas
      const cantidadPiezas = Math.ceil(areaTotal * datosTabique.piezasPorM2)
  
      // Mostrar resultados
      document.getElementById("area-total").textContent = `${areaTotal.toFixed(2)} m²`
      document.getElementById("cantidad-piezas").textContent = cantidadPiezas
      document.getElementById("material-adicional").textContent = datosTabique.materialAdicional
    })
  }
  
  // ==================== CALCULADORA DE COLADOS ====================
  function initColadosCalculator() {
    // Referencias a elementos del DOM
    const tipoColado = document.getElementById("tipo-colado")
    const dimensionesColado = document.getElementById("dimensiones-colado")
    const largoColado = document.getElementById("largo-colado")
    const anchoColado = document.getElementById("ancho-colado")
    const espesorColado = document.getElementById("espesor-colado")
    const resistenciaConcreto = document.getElementById("resistencia-concreto")
    const calcularBtn = document.getElementById("calcular-colado")
  
    // Datos de referencia para diferentes resistencias de concreto
    const datosConcreto = {
      f150: {
        nombre: "f'c = 150 kg/cm²",
        cemento: 6, // bultos por m³
        arena: 0.5, // m³ por m³ de concreto
        grava: 0.8, // m³ por m³ de concreto
      },
      f200: {
        nombre: "f'c = 200 kg/cm²",
        cemento: 7,
        arena: 0.5,
        grava: 0.8,
      },
      f250: {
        nombre: "f'c = 250 kg/cm²",
        cemento: 8,
        arena: 0.5,
        grava: 0.8,
      },
      f300: {
        nombre: "f'c = 300 kg/cm²",
        cemento: 9,
        arena: 0.5,
        grava: 0.8,
      },
    }
  
    // Cambiar campos según el tipo de colado
    tipoColado.addEventListener("change", () => {
      const tipo = tipoColado.value
  
      // Mantener los campos básicos para todos los tipos
      dimensionesColado.innerHTML = `
              <div class="form-group">
                  <label for="largo-colado">Largo (m):</label>
                  <input type="number" id="largo-colado" min="0" step="0.01">
              </div>
              <div class="form-group">
                  <label for="ancho-colado">Ancho (m):</label>
                  <input type="number" id="ancho-colado" min="0" step="0.01">
              </div>
              <div class="form-group">
                  <label for="espesor-colado">Espesor/Alto (m):</label>
                  <input type="number" id="espesor-colado" min="0" step="0.01">
              </div>
          `
  
      // Agregar campos específicos según el tipo
      if (tipo === "columna") {
        // Para columnas, podemos cambiar las etiquetas
        const anchoLabel = dimensionesColado.querySelector('label[for="ancho-colado"]')
        anchoLabel.textContent = "Sección (m):"
      } else if (tipo === "zapata") {
        // Para zapatas, podemos agregar un campo adicional
        dimensionesColado.innerHTML += `
                  <div class="form-group">
                      <label for="cantidad-zapatas">Cantidad de zapatas:</label>
                      <input type="number" id="cantidad-zapatas" min="1" value="1">
                  </div>
              `
      }
    })
  
    // Calcular colado
    calcularBtn.addEventListener("click", () => {
      // Obtener valores
      const tipo = tipoColado.value
      const largo = Number.parseFloat(document.getElementById("largo-colado").value) || 0
      const ancho = Number.parseFloat(document.getElementById("ancho-colado").value) || 0
      const espesor = Number.parseFloat(document.getElementById("espesor-colado").value) || 0
      const cantidadZapatas = Number.parseFloat(document.getElementById("cantidad-zapatas")?.value) || 1
  
      // Validar entradas
      if (largo <= 0 || ancho <= 0 || espesor <= 0) {
        alert("Por favor ingrese dimensiones válidas.")
        return
      }
  
      // Calcular volumen según el tipo
      let volumen = 0
  
      switch (tipo) {
        case "losa":
          volumen = largo * ancho * espesor
          break
        case "columna":
          volumen = largo * ancho * ancho * espesor // Para columna cuadrada
          break
        case "zapata":
          volumen = largo * ancho * espesor * cantidadZapatas
          break
        case "cimiento":
          volumen = largo * ancho * espesor
          break
        default:
          volumen = largo * ancho * espesor
      }
  
      // Obtener datos de la resistencia seleccionada
      const resistenciaSeleccionada = resistenciaConcreto.value
      const datosResistencia = datosConcreto[resistenciaSeleccionada]
  
      // Calcular materiales
      const cemento = volumen * datosResistencia.cemento
      const arena = volumen * datosResistencia.arena
      const grava = volumen * datosResistencia.grava
  
      // Mostrar resultados
      document.getElementById("volumen-concreto").textContent = `${volumen.toFixed(2)} m³`
      document.getElementById("cantidad-cemento").textContent = `${Math.ceil(cemento)} bultos`
      document.getElementById("cantidad-arena").textContent = `${arena.toFixed(2)} m³`
      document.getElementById("cantidad-grava").textContent = `${grava.toFixed(2)} m³`
    })
  }
  
  // ==================== CALCULADORA DE CIMBRA ====================
  function initCimbraCalculator() {
    // Referencias a elementos del DOM
    const tipoCimbra = document.getElementById("tipo-cimbra")
    const dimensionesCimbra = document.getElementById("dimensiones-cimbra")
    const largoCimbra = document.getElementById("largo-cimbra")
    const anchoCimbra = document.getElementById("ancho-cimbra")
    const altoCimbra = document.getElementById("alto-cimbra")
    const grupoAltoCimbra = document.getElementById("grupo-alto-cimbra")
    const calcularBtn = document.getElementById("calcular-cimbra")
  
    // Cambiar campos según el tipo de cimbra
    tipoCimbra.addEventListener("change", () => {
      const tipo = tipoCimbra.value
  
      // Mostrar/ocultar campo de alto según el tipo
      if (tipo === "losa") {
        grupoAltoCimbra.style.display = "none"
      } else {
        grupoAltoCimbra.style.display = "block"
      }
    })
  
    // Calcular cimbra
    calcularBtn.addEventListener("click", () => {
      // Obtener valores
      const tipo = tipoCimbra.value
      const largo = Number.parseFloat(largoCimbra.value) || 0
      const ancho = Number.parseFloat(anchoCimbra.value) || 0
      const alto = Number.parseFloat(altoCimbra.value) || 0
  
      // Validar entradas
      if (largo <= 0 || ancho <= 0 || (tipo !== "losa" && alto <= 0)) {
        alert("Por favor ingrese dimensiones válidas.")
        return
      }
  
      // Calcular área de contacto según el tipo
      let areaContacto = 0
  
      switch (tipo) {
        case "losa":
          areaContacto = largo * ancho
          break
        case "muro":
          areaContacto = largo * alto * 2 // Dos caras del muro
          break
        case "columna":
          // Para columna cuadrada (4 caras)
          areaContacto = ancho * alto * 4
          break
        default:
          areaContacto = largo * ancho
      }
  
      // Calcular materiales
      // Factores aproximados:
      // - 2.5 pt de madera por m² de contacto
      // - 0.3 kg de clavos por m² de contacto
      const maderaRequerida = areaContacto * 2.5
      const cantidadClavos = areaContacto * 0.3
  
      // Mostrar resultados
      document.getElementById("area-contacto").textContent = `${areaContacto.toFixed(2)} m²`
      document.getElementById("madera-requerida").textContent = `${maderaRequerida.toFixed(2)} pt`
      document.getElementById("cantidad-clavos").textContent = `${cantidadClavos.toFixed(2)} kg`
    })
  }
  
  // ==================== CALCULADORA DE ESCUADRA ====================
  function initEscuadraCalculator() {
    // Referencias a elementos del DOM
    const metodoEscuadra = document.getElementById("metodo-escuadra")
    const inputsEscuadra = document.getElementById("inputs-escuadra")
    const calcularBtn = document.getElementById("calcular-escuadra")
    const canvas = document.getElementById("escuadra-canvas")
    const ctx = canvas.getContext("2d")
  
    // Cambiar campos según el método seleccionado
    metodoEscuadra.addEventListener("change", () => {
      const metodo = metodoEscuadra.value
  
      switch (metodo) {
        case "3-4-5":
          inputsEscuadra.innerHTML = `
                      <div class="form-group">
                          <label for="factor-escala">Factor de escala:</label>
                          <input type="number" id="factor-escala" min="1" value="1" step="0.1">
                          <small>Multiplica el triángulo 3-4-5 por este factor</small>
                      </div>
                  `
          break
        case "catetos":
          inputsEscuadra.innerHTML = `
                      <div class="form-group">
                          <label for="cateto-a-input">Cateto A (m):</label>
                          <input type="number" id="cateto-a-input" min="0" step="0.01">
                      </div>
                      <div class="form-group">
                          <label for="cateto-b-input">Cateto B (m):</label>
                          <input type="number" id="cateto-b-input" min="0" step="0.01">
                      </div>
                  `
          break
        case "angulo":
          inputsEscuadra.innerHTML = `
                      <div class="form-group">
                          <label for="longitud-base">Longitud de base (m):</label>
                          <input type="number" id="longitud-base" min="0" step="0.01">
                      </div>
                      <div class="form-group">
                          <label for="angulo-input">Ángulo (grados):</label>
                          <input type="number" id="angulo-input" min="0" max="90" value="90" step="1">
                      </div>
                  `
          break
      }
    })
  
    // Disparar el evento change para inicializar los campos
    metodoEscuadra.dispatchEvent(new Event("change"))
  
    // Calcular escuadra
    calcularBtn.addEventListener("click", () => {
      const metodo = metodoEscuadra.value
      let catetoA = 0
      let catetoB = 0
      let hipotenusa = 0
      let angulo = 90 // Por defecto
  
      switch (metodo) {
        case "3-4-5":
          const factorEscala = Number.parseFloat(document.getElementById("factor-escala").value) || 1
          catetoA = 3 * factorEscala
          catetoB = 4 * factorEscala
          hipotenusa = 5 * factorEscala
          break
        case "catetos":
          catetoA = Number.parseFloat(document.getElementById("cateto-a-input").value) || 0
          catetoB = Number.parseFloat(document.getElementById("cateto-b-input").value) || 0
  
          if (catetoA <= 0 || catetoB <= 0) {
            alert("Por favor ingrese valores válidos para los catetos.")
            return
          }
  
          hipotenusa = Math.sqrt(catetoA * catetoA + catetoB * catetoB)
          break
        case "angulo":
          const longitudBase = Number.parseFloat(document.getElementById("longitud-base").value) || 0
          angulo = Number.parseFloat(document.getElementById("angulo-input").value) || 90
  
          if (longitudBase <= 0) {
            alert("Por favor ingrese una longitud de base válida.")
            return
          }
  
          catetoA = longitudBase
          catetoB = longitudBase * Math.tan((angulo * Math.PI) / 180)
          hipotenusa = Math.sqrt(catetoA * catetoA + catetoB * catetoB)
          break
      }
  
      // Mostrar resultados
      document.getElementById("cateto-a").textContent = `${catetoA.toFixed(2)} m`
      document.getElementById("cateto-b").textContent = `${catetoB.toFixed(2)} m`
      document.getElementById("hipotenusa").textContent = `${hipotenusa.toFixed(2)} m`
      document.getElementById("angulo").textContent = `${angulo}°`
  
      // Dibujar en el canvas
      dibujarEscuadra(ctx, catetoA, catetoB, hipotenusa)
    })
  
    // Inicializar el canvas
    limpiarCanvas(ctx, canvas.width, canvas.height)
  }
  
  // Función para dibujar la escuadra en el canvas
  function dibujarEscuadra(ctx, catetoA, catetoB, hipotenusa) {
    // Limpiar canvas
    limpiarCanvas(ctx, ctx.canvas.width, ctx.canvas.height)
  
    // Calcular escala para ajustar al canvas
    const maxDimension = Math.max(catetoA, catetoB)
    const escala = (ctx.canvas.width - 60) / maxDimension
  
    // Punto de origen (esquina inferior izquierda con margen)
    const origenX = 30
    const origenY = ctx.canvas.height - 30
  
    // Dibujar ejes
    ctx.strokeStyle = "#ccc"
    ctx.lineWidth = 1
    ctx.beginPath()
  
    // Eje X
    ctx.moveTo(origenX, origenY)
    ctx.lineTo(origenX + catetoA * escala + 20, origenY)
  
    // Eje Y
    ctx.moveTo(origenX, origenY)
    ctx.lineTo(origenX, origenY - catetoB * escala - 20)
  
    ctx.stroke()
  
    // Dibujar triángulo
    ctx.strokeStyle = "#3498db"
    ctx.lineWidth = 3
    ctx.beginPath()
  
    // Cateto A (base)
    ctx.moveTo(origenX, origenY)
    ctx.lineTo(origenX + catetoA * escala, origenY)
  
    // Cateto B (altura)
    ctx.moveTo(origenX + catetoA * escala, origenY)
    ctx.lineTo(origenX + catetoA * escala, origenY - catetoB * escala)
  
    // Hipotenusa
    ctx.moveTo(origenX + catetoA * escala, origenY - catetoB * escala)
    ctx.lineTo(origenX, origenY)
  
    ctx.stroke()
  
    // Dibujar medidas
    ctx.fillStyle = "#2c3e50"
    ctx.font = "12px Arial"
  
    // Medida Cateto A
    ctx.fillText(`${catetoA.toFixed(2)} m`, origenX + (catetoA * escala) / 2, origenY + 20)
  
    // Medida Cateto B
    ctx.fillText(`${catetoB.toFixed(2)} m`, origenX + catetoA * escala + 20, origenY - (catetoB * escala) / 2)
  
    // Medida Hipotenusa
    const hipoX = origenX + (catetoA * escala) / 2
    const hipoY = origenY - (catetoB * escala) / 2
    ctx.fillText(`${hipotenusa.toFixed(2)} m`, hipoX - 40, hipoY)
  
    // Dibujar símbolo de ángulo recto
    ctx.strokeStyle = "#e74c3c"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(origenX + catetoA * escala - 15, origenY)
    ctx.lineTo(origenX + catetoA * escala - 15, origenY - 15)
    ctx.lineTo(origenX + catetoA * escala, origenY - 15)
    ctx.stroke()
  }
  
  // Función para limpiar el canvas
  function limpiarCanvas(ctx, width, height) {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, width, height)
  }
  
  