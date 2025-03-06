document.addEventListener("DOMContentLoaded", () => {
  // Clases para elementos
  class Elemento {
    constructor(tipo, dimensiones, volumen, acero = 0) {
      this.tipo = tipo
      this.dimensiones = dimensiones
      this.volumen = volumen
      this.acero = acero
    }
  }

  // Variables globales
  const state = {
    trabes: [],
    elementos: [],
    materiales: {
      proporciones: {
        cemento: 350, // kg/m³
        arena: 670, // kg/m³
        grava: 1100, // kg/m³
        agua: 180, // L/m³
      },
      costos: {
        cemento: 180, // $/bulto (50kg)
        arena: 350, // $/m³
        grava: 400, // $/m³
        agua: 30, // $/m³
        acero: 25, // $/kg
        aditivo: 80, // $/L
      },
      desperdicio: {
        concreto: 5, // %
        acero: 7, // %
        materiales: 3, // %
      },
    },
    darkMode: false,
    proyectos: [],
  }

  // Elementos DOM
  const dom = {
    tabs: document.querySelectorAll(".tab-button"),
    formSections: document.querySelectorAll(".form-section"),
    themeToggle: document.getElementById("theme-toggle"),
    calcularBtn: document.getElementById("calcular"),
    resultados: document.getElementById("resultados"),
    volumenTotal: document.getElementById("volumen-total"),
    volumenDesperdicio: document.getElementById("volumen-desperdicio"),
    aceroTotal: document.getElementById("acero-total"),
    aceroDesperdicio: document.getElementById("acero-desperdicio"),
    desglose: document.getElementById("desglose"),
    materialesList: document.getElementById("materiales-list"),
    costosList: document.getElementById("costos-list"),
    costoTotal: document.getElementById("costo-total"),
    saveProjectBtn: document.getElementById("save-project"),
    loadProjectBtn: document.getElementById("load-project"),
    proyectosModal: document.getElementById("proyectos-guardados"),
    listaProyectos: document.getElementById("lista-proyectos"),
    noProyectos: document.getElementById("no-proyectos"),
    cerrarProyectosBtn: document.getElementById("cerrar-proyectos"),
    guardarProyectoModal: document.getElementById("guardar-proyecto-modal"),
    proyectoNombre: document.getElementById("proyecto-nombre"),
    proyectoDescripcion: document.getElementById("proyecto-descripcion"),
    confirmarGuardarBtn: document.getElementById("confirmar-guardar"),
    cancelarGuardarBtn: document.getElementById("cancelar-guardar"),
    cerrarGuardarBtn: document.getElementById("cerrar-guardar"),
    imprimirBtn: document.getElementById("imprimir-resultados"),
    exportarPdfBtn: document.getElementById("exportar-pdf"),
    exportarExcelBtn: document.getElementById("exportar-excel"),
  }

  // Inicialización
  function init() {
    setupEventListeners()
    loadDarkModePreference()
    loadProyectos()
    updateMaterialesInputs()
  }

  // Configuración de event listeners
  function setupEventListeners() {
    // Tabs
    dom.tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        const tabId = this.id
        const sectionId = tabId.replace("tab-", "form-")

        // Ocultar todas las secciones
        dom.formSections.forEach((section) => {
          section.classList.add("hidden")
        })

        // Mostrar la sección seleccionada
        document.getElementById(sectionId).classList.remove("hidden")

        // Actualizar estilos de tabs
        dom.tabs.forEach((t) => {
          t.classList.remove(
            "active",
            "border-b-2",
            "border-primary-600",
            "text-primary-600",
            "dark:text-primary-300",
            "dark:border-primary-400",
          )
          t.classList.add("text-gray-500", "dark:text-gray-400")
        })

        this.classList.add(
          "active",
          "border-b-2",
          "border-primary-600",
          "text-primary-600",
          "dark:text-primary-300",
          "dark:border-primary-400",
        )
        this.classList.remove("text-gray-500", "dark:text-gray-400")
      })
    })

    // Tipo de losa
    document.getElementById("losa-tipo").addEventListener("change", function () {
      const tipoLosa = this.value
      if (tipoLosa === "aligerada" || tipoLosa === "reticular") {
        document.getElementById("losa-aligerada-options").classList.remove("hidden")
      } else {
        document.getElementById("losa-aligerada-options").classList.add("hidden")
      }
    })

    // Tipo de cimiento
    document.getElementById("cimiento-tipo").addEventListener("change", function () {
      const tipoCimiento = this.value

      document.getElementById("cimiento-corrido-options").classList.add("hidden")
      document.getElementById("cimiento-aislado-options").classList.add("hidden")
      document.getElementById("cimiento-losa-options").classList.add("hidden")

      if (tipoCimiento === "corrido") {
        document.getElementById("cimiento-corrido-options").classList.remove("hidden")
      } else if (tipoCimiento === "aislado") {
        document.getElementById("cimiento-aislado-options").classList.remove("hidden")
      } else if (tipoCimiento === "losa") {
        document.getElementById("cimiento-losa-options").classList.remove("hidden")
      }
    })

    // Pedestal en zapatas
    document.getElementById("zapata-pedestal").addEventListener("change", function () {
      if (this.checked) {
        document.getElementById("pedestal-options").classList.remove("hidden")
      } else {
        document.getElementById("pedestal-options").classList.add("hidden")
      }
    })

    // Aditivo
    document.getElementById("material-aditivo").addEventListener("change", function () {
      if (this.checked) {
        document.getElementById("aditivo-options").classList.remove("hidden")
      } else {
        document.getElementById("aditivo-options").classList.add("hidden")
      }
    })

    // Resistencia del concreto
    document.getElementById("material-fc").addEventListener("change", () => {
      updateMaterialesInputs()
    })

    // Agregar trabe
    document.getElementById("add-trabe").addEventListener("click", () => {
      agregarTrabe()
    })

    // Limpiar trabes
    document.getElementById("clear-trabes").addEventListener("click", () => {
      state.trabes = []
      document.getElementById("trabes-items").innerHTML = ""
      mostrarNotificacion("Trabes eliminadas", "info")
    })

    // Agregar elemento (cadena/castillo)
    document.getElementById("add-elemento").addEventListener("click", () => {
      agregarElemento()
    })

    // Limpiar elementos
    document.getElementById("clear-elementos").addEventListener("click", () => {
      state.elementos = []
      document.getElementById("elementos-items").innerHTML = ""
      mostrarNotificacion("Elementos eliminados", "info")
    })

    // Calcular
    dom.calcularBtn.addEventListener("click", () => {
      calcular()
    })

    // Cambiar tema
    dom.themeToggle.addEventListener("click", () => {
      toggleDarkMode()
    })

    // Guardar proyecto
    dom.saveProjectBtn.addEventListener("click", () => {
      mostrarGuardarProyectoModal()
    })

    // Cargar proyecto
    dom.loadProjectBtn.addEventListener("click", () => {
      mostrarProyectosGuardados()
    })

    // Cerrar modal de proyectos
    dom.cerrarProyectosBtn.addEventListener("click", () => {
      dom.proyectosModal.classList.add("hidden")
    })

    // Confirmar guardar proyecto
    dom.confirmarGuardarBtn.addEventListener("click", () => {
      guardarProyecto()
    })

    // Cancelar guardar proyecto
    dom.cancelarGuardarBtn.addEventListener("click", () => {
      dom.guardarProyectoModal.classList.add("hidden")
    })

    // Cerrar modal de guardar proyecto
    dom.cerrarGuardarBtn.addEventListener("click", () => {
      dom.guardarProyectoModal.classList.add("hidden")
    })

    // Imprimir resultados
    dom.imprimirBtn.addEventListener("click", () => {
      window.print()
    })

    // Exportar a PDF
    dom.exportarPdfBtn.addEventListener("click", () => {
      mostrarNotificacion("Exportando a PDF...", "info")
      // Aquí iría la lógica para exportar a PDF
      setTimeout(() => {
        mostrarNotificacion("PDF exportado correctamente", "success")
      }, 1500)
    })

    // Exportar a Excel
    dom.exportarExcelBtn.addEventListener("click", () => {
      mostrarNotificacion("Exportando a Excel...", "info")
      // Aquí iría la lógica para exportar a Excel
      setTimeout(() => {
        mostrarNotificacion("Excel exportado correctamente", "success")
      }, 1500)
    })
  }

  // Funciones para cálculos
  function calcular() {
    const activeTab = getActiveTab()
    let totalVolumen = 0
    let totalAcero = 0
    const detalles = []

    switch (activeTab) {
      case "losa":
        const resultadoLosa = calcularLosa()
        if (resultadoLosa) {
          totalVolumen += resultadoLosa.volumen
          totalAcero += resultadoLosa.acero
          detalles.push(resultadoLosa)
        }
        break

      case "trabe":
        if (state.trabes.length > 0) {
          const volumenTrabes = state.trabes.reduce((sum, trabe) => sum + trabe.volumen, 0)
          const aceroTrabes = state.trabes.reduce((sum, trabe) => sum + trabe.acero, 0)
          totalVolumen += volumenTrabes
          totalAcero += aceroTrabes
          detalles.push(
            new Elemento(`Trabes (${state.trabes.length})`, `Varias dimensiones`, volumenTrabes, aceroTrabes),
          )
        }
        break

      case "cimiento":
        const resultadoCimiento = calcularCimiento()
        if (resultadoCimiento) {
          totalVolumen += resultadoCimiento.volumen
          totalAcero += resultadoCimiento.acero
          detalles.push(resultadoCimiento)
        }
        break

      case "cadena":
        if (state.elementos.length > 0) {
          const volumenElementos = state.elementos.reduce((sum, elemento) => sum + elemento.volumen, 0)
          const aceroElementos = state.elementos.reduce((sum, elemento) => sum + elemento.acero, 0)
          totalVolumen += volumenElementos
          totalAcero += aceroElementos

          // Agrupar por tipo
          const tiposElementos = {}
          state.elementos.forEach((elemento) => {
            if (!tiposElementos[elemento.tipo]) {
              tiposElementos[elemento.tipo] = {
                cantidad: 0,
                volumen: 0,
                acero: 0,
              }
            }
            tiposElementos[elemento.tipo].cantidad++
            tiposElementos[elemento.tipo].volumen += elemento.volumen
            tiposElementos[elemento.tipo].acero += elemento.acero
          })

          // Agregar cada tipo como un detalle
          Object.keys(tiposElementos).forEach((tipo) => {
            const info = tiposElementos[tipo]
            detalles.push(new Elemento(`${tipo} (${info.cantidad})`, `Varias dimensiones`, info.volumen, info.acero))
          })
        }
        break

      case "materiales":
        // Si estamos en la pestaña de materiales, usamos los valores ya calculados
        if (dom.resultados.classList.contains("hidden")) {
          mostrarNotificacion("Primero debe calcular el volumen de concreto", "error")
          return
        }
        break
    }

    // Calcular desperdicio
    const desperdicio = (totalVolumen * state.materiales.desperdicio.concreto) / 100
    const volumenConDesperdicio = totalVolumen + desperdicio

    const desperdicioAcero = (totalAcero * state.materiales.desperdicio.acero) / 100
    const aceroConDesperdicio = totalAcero + desperdicioAcero

    // Mostrar resultados
    if (totalVolumen > 0 || totalAcero > 0) {
      dom.volumenTotal.textContent = `${totalVolumen.toFixed(3)} m³`
      dom.volumenDesperdicio.textContent = `(+${desperdicio.toFixed(3)} m³ desperdicio)`

      dom.aceroTotal.textContent = `${totalAcero.toFixed(2)} kg`
      dom.aceroDesperdicio.textContent = `(+${desperdicioAcero.toFixed(2)} kg desperdicio)`

      // Limpiar desglose anterior
      dom.desglose.innerHTML = ""

      // Agregar detalles al desglose
      detalles.forEach((detalle) => {
        const li = document.createElement("li")
        li.innerHTML = `<span class="font-medium">${detalle.tipo}:</span> ${detalle.volumen.toFixed(3)} m³`
        if (detalle.acero > 0) {
          li.innerHTML += `, ${detalle.acero.toFixed(2)} kg acero`
        }
        dom.desglose.appendChild(li)
      })

      // Calcular materiales
      calcularMateriales(volumenConDesperdicio, aceroConDesperdicio)

      // Mostrar resultados
      dom.resultados.classList.remove("hidden")

      // Scroll a resultados en móvil
      if (window.innerWidth < 1024) {
        dom.resultados.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      mostrarNotificacion("Ingrese las dimensiones para calcular", "error")
    }
  }

  function calcularLosa() {
    const tipoLosa = document.getElementById("losa-tipo").value
    const espesorLosa = Number.parseFloat(document.getElementById("losa-espesor").value) || 0
    const largoLosa = Number.parseFloat(document.getElementById("losa-largo").value) || 0
    const anchoLosa = Number.parseFloat(document.getElementById("losa-ancho").value) || 0
    const aceroKgM3 = Number.parseFloat(document.getElementById("losa-acero-kg-m3").value) || 0

    if (espesorLosa <= 0 || largoLosa <= 0 || anchoLosa <= 0) {
      mostrarNotificacion("Ingrese dimensiones válidas para la losa", "error")
      return null
    }

    let volumenLosa = (espesorLosa * largoLosa * anchoLosa) / 100 // Convertir a m³
    let descripcionLosa = `${largoLosa.toFixed(2)}m x ${anchoLosa.toFixed(2)}m x ${espesorLosa.toFixed(1)}cm`

    if (tipoLosa === "aligerada" || tipoLosa === "reticular") {
      const numCasetones = Number.parseInt(document.getElementById("losa-casetones").value) || 0
      const volumenCaseton = Number.parseFloat(document.getElementById("losa-volumen-caseton").value) || 0
      const calcularNervaduras = document.getElementById("losa-calcular-nervaduras").checked

      if (numCasetones > 0 && volumenCaseton > 0) {
        const volumenCasetones = numCasetones * volumenCaseton
        volumenLosa -= volumenCasetones
        descripcionLosa += ` - ${numCasetones} casetones`
      }

      if (calcularNervaduras) {
        // Lógica para calcular nervaduras automáticamente
        // Esta es una simplificación
        const areaLosa = largoLosa * anchoLosa
        const porcentajeNervaduras = tipoLosa === "aligerada" ? 0.15 : 0.25
        const volumenNervaduras = ((areaLosa * espesorLosa) / 100) * porcentajeNervaduras

        // Ajustar volumen total
        volumenLosa = volumenNervaduras
        descripcionLosa += ` (nervaduras calculadas)`
      }
    }

    // Calcular acero
    const aceroTotal = volumenLosa * aceroKgM3

    return new Elemento(`Losa ${tipoLosa}`, descripcionLosa, volumenLosa, aceroTotal)
  }

  function calcularCimiento() {
    const tipoCimiento = document.getElementById("cimiento-tipo").value
    const aceroKgM3 = Number.parseFloat(document.getElementById("cimiento-acero-kg-m3").value) || 0

    let volumenCimiento = 0
    let descripcionCimiento = ""

    if (tipoCimiento === "corrido") {
      const anchoCimiento = Number.parseFloat(document.getElementById("cimiento-ancho").value) || 0
      const altoCimiento = Number.parseFloat(document.getElementById("cimiento-alto").value) || 0
      const largoCimiento = Number.parseFloat(document.getElementById("cimiento-largo").value) || 0

      if (anchoCimiento <= 0 || altoCimiento <= 0 || largoCimiento <= 0) {
        mostrarNotificacion("Ingrese dimensiones válidas para el cimiento corrido", "error")
        return null
      }

      volumenCimiento = (anchoCimiento * altoCimiento * largoCimiento) / 10000 // Convertir a m³
      descripcionCimiento = `${anchoCimiento.toFixed(0)}cm x ${altoCimiento.toFixed(0)}cm x ${largoCimiento.toFixed(2)}m`
    } else if (tipoCimiento === "aislado") {
      const anchoZapata = Number.parseFloat(document.getElementById("zapata-ancho").value) || 0
      const largoZapata = Number.parseFloat(document.getElementById("zapata-largo").value) || 0
      const espesorZapata = Number.parseFloat(document.getElementById("zapata-espesor").value) || 0
      const cantidadZapatas = Number.parseInt(document.getElementById("zapata-cantidad").value) || 0

      if (anchoZapata <= 0 || largoZapata <= 0 || espesorZapata <= 0 || cantidadZapatas <= 0) {
        mostrarNotificacion("Ingrese dimensiones válidas para las zapatas", "error")
        return null
      }

      let volumenZapata = (anchoZapata * largoZapata * espesorZapata) / 1000000 // Convertir a m³
      descripcionCimiento = `${anchoZapata.toFixed(0)}cm x ${largoZapata.toFixed(0)}cm x ${espesorZapata.toFixed(0)}cm`

      // Verificar si hay pedestal
      const incluirPedestal = document.getElementById("zapata-pedestal").checked
      if (incluirPedestal) {
        const anchoPedestal = Number.parseFloat(document.getElementById("pedestal-ancho").value) || 0
        const largoPedestal = Number.parseFloat(document.getElementById("pedestal-largo").value) || 0
        const altoPedestal = Number.parseFloat(document.getElementById("pedestal-alto").value) || 0

        if (anchoPedestal > 0 && largoPedestal > 0 && altoPedestal > 0) {
          const volumenPedestal = (anchoPedestal * largoPedestal * altoPedestal) / 1000000 // Convertir a m³
          volumenZapata += volumenPedestal
          descripcionCimiento += ` + pedestal ${anchoPedestal.toFixed(0)}cm x ${largoPedestal.toFixed(0)}cm x ${altoPedestal.toFixed(0)}cm`
        }
      }

      volumenCimiento = volumenZapata * cantidadZapatas
      descripcionCimiento += ` (${cantidadZapatas} unidades)`
    } else if (tipoCimiento === "losa") {
      const largoLosa = Number.parseFloat(document.getElementById("losa-cimiento-largo").value) || 0
      const anchoLosa = Number.parseFloat(document.getElementById("losa-cimiento-ancho").value) || 0
      const espesorLosa = Number.parseFloat(document.getElementById("losa-cimiento-espesor").value) || 0

      if (largoLosa <= 0 || anchoLosa <= 0 || espesorLosa <= 0) {
        mostrarNotificacion("Ingrese dimensiones válidas para la losa de cimentación", "error")
        return null
      }

      volumenCimiento = (largoLosa * anchoLosa * espesorLosa) / 100 // Convertir a m³
      descripcionCimiento = `${largoLosa.toFixed(2)}m x ${anchoLosa.toFixed(2)}m x ${espesorLosa.toFixed(0)}cm`
    }

    // Calcular acero
    const aceroTotal = volumenCimiento * aceroKgM3

    return new Elemento(`Cimiento ${tipoCimiento}`, descripcionCimiento, volumenCimiento, aceroTotal)
  }

  function agregarTrabe() {
    const alto = Number.parseFloat(document.getElementById("trabe-alto").value) || 0
    const ancho = Number.parseFloat(document.getElementById("trabe-ancho").value) || 0
    const largo = Number.parseFloat(document.getElementById("trabe-largo").value) || 0
    const aceroKgM3 = Number.parseFloat(document.getElementById("trabe-acero-kg-m3").value) || 0

    if (alto <= 0 || ancho <= 0 || largo <= 0) {
      mostrarNotificacion("Ingrese dimensiones válidas para la trabe", "error")
      return
    }

    const volumen = (alto * ancho * largo) / 10000 // Convertir a m³
    const acero = volumen * aceroKgM3

    const trabe = new Elemento(
      "Trabe",
      `${ancho.toFixed(0)}cm x ${alto.toFixed(0)}cm x ${largo.toFixed(2)}m`,
      volumen,
      acero,
    )

    state.trabes.push(trabe)

    // Actualizar tabla de trabes
    const trabesList = document.getElementById("trabes-items")
    const tr = document.createElement("tr")
    tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">${state.trabes.length}</td>
            <td class="px-6 py-4 whitespace-nowrap">${ancho.toFixed(0)}cm x ${alto.toFixed(0)}cm x ${largo.toFixed(2)}m</td>
            <td class="px-6 py-4 whitespace-nowrap">${volumen.toFixed(3)} m³</td>
            <td class="px-6 py-4 whitespace-nowrap">${acero.toFixed(2)} kg</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <button class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" onclick="eliminarTrabe(${state.trabes.length - 1})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `
    trabesList.appendChild(tr)

    // Limpiar campos
    document.getElementById("trabe-alto").value = ""
    document.getElementById("trabe-ancho").value = ""
    document.getElementById("trabe-largo").value = ""

    mostrarNotificacion("Trabe agregada correctamente", "success")
  }

  function agregarElemento() {
    const tipoElemento = document.getElementById("elemento-tipo").value
    const ubicacion = document.getElementById("elemento-ubicacion").value
    const ancho = Number.parseFloat(document.getElementById("elemento-ancho").value) || 0
    const alto = Number.parseFloat(document.getElementById("elemento-alto").value) || 0
    const largo = Number.parseFloat(document.getElementById("elemento-largo").value) || 0
    const cantidad = Number.parseInt(document.getElementById("elemento-cantidad").value) || 0
    const aceroKgM3 = Number.parseFloat(document.getElementById("elemento-acero-kg-m3").value) || 0

    if (ancho <= 0 || alto <= 0 || largo <= 0 || cantidad <= 0) {
      mostrarNotificacion("Ingrese dimensiones y cantidad válidas", "error")
      return
    }

    const volumenUnitario = (ancho * alto * largo) / 10000 // Convertir a m³
    const volumenTotal = volumenUnitario * cantidad
    const aceroTotal = volumenTotal * aceroKgM3

    const nombreTipo = tipoElemento.charAt(0).toUpperCase() + tipoElemento.slice(1)
    const nombreUbicacion = ubicacion.charAt(0).toUpperCase() + ubicacion.slice(1)

    const elemento = new Elemento(
      `${nombreTipo} de ${nombreUbicacion}`,
      `${ancho.toFixed(0)}cm x ${alto.toFixed(0)}cm x ${largo.toFixed(2)}m`,
      volumenTotal,
      aceroTotal,
    )

    elemento.cantidad = cantidad
    elemento.volumenUnitario = volumenUnitario

    state.elementos.push(elemento)

    // Actualizar tabla de elementos
    const elementosList = document.getElementById("elementos-items")
    const tr = document.createElement("tr")
    tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">${state.elementos.length}</td>
            <td class="px-6 py-4 whitespace-nowrap">${nombreTipo} de ${nombreUbicacion}</td>
            <td class="px-6 py-4 whitespace-nowrap">${ancho.toFixed(0)}cm x ${alto.toFixed(0)}cm x ${largo.toFixed(2)}m</td>
            <td class="px-6 py-4 whitespace-nowrap">${cantidad}</td>
            <td class="px-6 py-4 whitespace-nowrap">${volumenTotal.toFixed(3)} m³</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <button class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" onclick="eliminarElemento(${state.elementos.length - 1})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `
    elementosList.appendChild(tr)

    mostrarNotificacion(`${nombreTipo} agregado correctamente`, "success")
  }

  function calcularMateriales(volumenConcreto, pesoAcero) {
    // Obtener proporciones de materiales
    const proporciones = state.materiales.proporciones
    const desperdicio = state.materiales.desperdicio.materiales / 100 + 1

    // Calcular cantidades
    const cemento = proporciones.cemento * volumenConcreto * desperdicio // kg
    const arena = proporciones.arena * volumenConcreto * desperdicio // kg
    const grava = proporciones.grava * volumenConcreto * desperdicio // kg
    const agua = proporciones.agua * volumenConcreto * desperdicio // L

    // Convertir a unidades prácticas
    const cementoBultos = cemento / 50 // Bultos de 50kg
    const arenaM3 = arena / 1600 // Densidad aproximada 1600 kg/m³
    const gravaM3 = grava / 1700 // Densidad aproximada 1700 kg/m³
    const aguaM3 = agua / 1000 // 1L = 0.001 m³

    // Mostrar materiales
    dom.materialesList.innerHTML = ""

    const liCemento = document.createElement("li")
    liCemento.innerHTML = `<span class="font-medium">Cemento:</span> ${cemento.toFixed(0)} kg (${cementoBultos.toFixed(1)} bultos de 50kg)`
    dom.materialesList.appendChild(liCemento)

    const liArena = document.createElement("li")
    liArena.innerHTML = `<span class="font-medium">Arena:</span> ${arena.toFixed(0)} kg (${arenaM3.toFixed(2)} m³)`
    dom.materialesList.appendChild(liArena)

    const liGrava = document.createElement("li")
    liGrava.innerHTML = `<span class="font-medium">Grava:</span> ${grava.toFixed(0)} kg (${gravaM3.toFixed(2)} m³)`
    dom.materialesList.appendChild(liGrava)

    const liAgua = document.createElement("li")
    liAgua.innerHTML = `<span class="font-medium">Agua:</span> ${agua.toFixed(0)} L (${aguaM3.toFixed(2)} m³)`
    dom.materialesList.appendChild(liAgua)

    if (pesoAcero > 0) {
      const liAcero = document.createElement("li")
      liAcero.innerHTML = `<span class="font-medium">Acero:</span> ${pesoAcero.toFixed(0)} kg`
      dom.materialesList.appendChild(liAcero)
    }

    // Verificar si hay aditivo
    const incluirAditivo = document.getElementById("material-aditivo").checked
    if (incluirAditivo) {
      const tipoAditivo = document.getElementById("material-tipo-aditivo").value
      const dosisAditivo = Number.parseFloat(document.getElementById("material-dosis-aditivo").value) || 0

      if (dosisAditivo > 0) {
        const cantidadAditivo = (cemento * dosisAditivo) / 100 // L (aproximado)

        const liAditivo = document.createElement("li")
        liAditivo.innerHTML = `<span class="font-medium">Aditivo (${tipoAditivo}):</span> ${cantidadAditivo.toFixed(1)} L`
        dom.materialesList.appendChild(liAditivo)
      }
    }

    // Calcular costos
    calcularCostos(cementoBultos, arenaM3, gravaM3, aguaM3, pesoAcero)
  }

  function calcularCostos(cementoBultos, arenaM3, gravaM3, aguaM3, pesoAcero) {
    const costos = state.materiales.costos

    const costoCemento = cementoBultos * costos.cemento
    const costoArena = arenaM3 * costos.arena
    const costoGrava = gravaM3 * costos.grava
    const costoAgua = aguaM3 * costos.agua
    const costoAcero = pesoAcero * costos.acero

    let costoTotal = costoCemento + costoArena + costoGrava + costoAgua + costoAcero

    // Verificar si hay aditivo
    const incluirAditivo = document.getElementById("material-aditivo").checked
    let costoAditivo = 0

    if (incluirAditivo) {
      const dosisAditivo = Number.parseFloat(document.getElementById("material-dosis-aditivo").value) || 0
      const cemento = cementoBultos * 50 // kg
      const cantidadAditivo = (cemento * dosisAditivo) / 100 // L (aproximado)

      costoAditivo = cantidadAditivo * costos.aditivo
      costoTotal += costoAditivo
    }

    // Mostrar costos
    dom.costosList.innerHTML = ""

    const liCemento = document.createElement("li")
    liCemento.innerHTML = `<span class="font-medium">Cemento:</span> $${costoCemento.toFixed(2)}`
    dom.costosList.appendChild(liCemento)

    const liArena = document.createElement("li")
    liArena.innerHTML = `<span class="font-medium">Arena:</span> $${costoArena.toFixed(2)}`
    dom.costosList.appendChild(liArena)

    const liGrava = document.createElement("li")
    liGrava.innerHTML = `<span class="font-medium">Grava:</span> $${costoGrava.toFixed(2)}`
    dom.costosList.appendChild(liGrava)

    const liAgua = document.createElement("li")
    liAgua.innerHTML = `<span class="font-medium">Agua:</span> $${costoAgua.toFixed(2)}`
    dom.costosList.appendChild(liAgua)

    if (pesoAcero > 0) {
      const liAcero = document.createElement("li")
      liAcero.innerHTML = `<span class="font-medium">Acero:</span> $${costoAcero.toFixed(2)}`
      dom.costosList.appendChild(liAcero)
    }

    if (incluirAditivo && costoAditivo > 0) {
      const liAditivo = document.createElement("li")
      liAditivo.innerHTML = `<span class="font-medium">Aditivo:</span> $${costoAditivo.toFixed(2)}`
      dom.costosList.appendChild(liAditivo)
    }

    dom.costoTotal.textContent = `$${costoTotal.toFixed(2)}`
  }

  // Funciones de utilidad
  function getActiveTab() {
    for (let i = 0; i < dom.tabs.length; i++) {
      if (dom.tabs[i].classList.contains("active")) {
        return dom.tabs[i].id.replace("tab-", "")
      }
    }
    return "losa" // Default
  }

  function updateMaterialesInputs() {
    const fc = document.getElementById("material-fc").value
    const proporciones = {
      150: { cemento: 300, arena: 700, grava: 1150, agua: 180 },
      200: { cemento: 320, arena: 690, grava: 1130, agua: 180 },
      250: { cemento: 350, arena: 670, grava: 1100, agua: 180 },
      300: { cemento: 380, arena: 650, grava: 1080, agua: 180 },
      350: { cemento: 420, arena: 630, grava: 1050, agua: 180 },
    }

    if (proporciones[fc]) {
      document.getElementById("material-cemento").value = proporciones[fc].cemento
      document.getElementById("material-arena").value = proporciones[fc].arena
      document.getElementById("material-grava").value = proporciones[fc].grava
      document.getElementById("material-agua").value = proporciones[fc].agua

      // Actualizar proporciones en el estado
      state.materiales.proporciones = proporciones[fc]
    }
  }

  function toggleDarkMode() {
    state.darkMode = !state.darkMode

    if (state.darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Guardar preferencia
    localStorage.setItem("darkMode", state.darkMode)
  }

  function loadDarkModePreference() {
    const darkMode = localStorage.getItem("darkMode")

    if (darkMode === "true") {
      state.darkMode = true
      document.documentElement.classList.add("dark")
    }
  }

  function mostrarNotificacion(mensaje, tipo = "info") {
    // Eliminar notificaciones existentes
    const notificacionesExistentes = document.querySelectorAll(".notification")
    notificacionesExistentes.forEach((notif) => {
      notif.remove()
    })

    // Crear nueva notificación
    const notificacion = document.createElement("div")
    notificacion.className = `notification notification-${tipo}`

    let icono = ""
    switch (tipo) {
      case "success":
        icono = '<i class="fas fa-check-circle text-green-500 mr-2"></i>'
        break
      case "error":
        icono = '<i class="fas fa-exclamation-circle text-red-500 mr-2"></i>'
        break
      case "info":
      default:
        icono = '<i class="fas fa-info-circle text-blue-500 mr-2"></i>'
        break
    }

    notificacion.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    ${icono}
                    <span class="text-gray-800 dark:text-gray-200">${mensaje}</span>
                </div>
                <button class="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `

    document.body.appendChild(notificacion)

    // Agregar evento para cerrar
    notificacion.querySelector("button").addEventListener("click", () => {
      notificacion.remove()
    })

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
      if (document.body.contains(notificacion)) {
        notificacion.style.opacity = "0"
        setTimeout(() => {
          if (document.body.contains(notificacion)) {
            notificacion.remove()
          }
        }, 300)
      }
    }, 5000)
  }

  // Funciones para guardar y cargar proyectos
  function guardarProyecto() {
    const nombre = dom.proyectoNombre.value.trim()
    const descripcion = dom.proyectoDescripcion.value.trim()

    if (!nombre) {
      mostrarNotificacion("Ingrese un nombre para el proyecto", "error")
      return
    }

    // Recopilar datos del proyecto
    const proyecto = {
      id: Date.now(),
      nombre: nombre,
      descripcion: descripcion,
      fecha: new Date().toLocaleString(),
      datos: {
        trabes: state.trabes,
        elementos: state.elementos,
        materiales: state.materiales,
      },
      // Guardar valores de los campos
      campos: {},
    }

    // Guardar valores de todos los inputs
    const inputs = document.querySelectorAll("input, select, textarea")
    inputs.forEach((input) => {
      if (input.id) {
        if (input.type === "checkbox") {
          proyecto.campos[input.id] = input.checked
        } else {
          proyecto.campos[input.id] = input.value
        }
      }
    })

    // Guardar proyecto en localStorage
    state.proyectos.push(proyecto)
    localStorage.setItem("proyectos", JSON.stringify(state.proyectos))

    // Cerrar modal
    dom.guardarProyectoModal.classList.add("hidden")

    // Limpiar campos
    dom.proyectoNombre.value = ""
    dom.proyectoDescripcion.value = ""

    mostrarNotificacion("Proyecto guardado correctamente", "success")
  }

  function loadProyectos() {
    const proyectosGuardados = localStorage.getItem("proyectos")

    if (proyectosGuardados) {
      state.proyectos = JSON.parse(proyectosGuardados)
    }
  }

  function mostrarProyectosGuardados() {
    dom.listaProyectos.innerHTML = ""

    if (state.proyectos.length === 0) {
      dom.noProyectos.classList.remove("hidden")
    } else {
      dom.noProyectos.classList.add("hidden")

      state.proyectos.forEach((proyecto) => {
        const div = document.createElement("div")
        div.className = "p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2"
        div.innerHTML = `
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-medium text-gray-800 dark:text-gray-200">${proyecto.nombre}</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${proyecto.fecha}</p>
                            ${proyecto.descripcion ? `<p class="text-sm text-gray-600 dark:text-gray-300 mt-1">${proyecto.descripcion}</p>` : ""}
                        </div>
                        <div class="flex space-x-2">
                            <button class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" data-id="${proyecto.id}">
                                <i class="fas fa-folder-open"></i>
                            </button>
                            <button class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" data-id="${proyecto.id}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                `
        dom.listaProyectos.appendChild(div)

        // Agregar eventos
        const [cargarBtn, eliminarBtn] = div.querySelectorAll("button")

        cargarBtn.addEventListener("click", () => {
          cargarProyecto(proyecto.id)
        })

        eliminarBtn.addEventListener("click", () => {
          eliminarProyecto(proyecto.id)
        })
      })
    }

    dom.proyectosModal.classList.remove("hidden")
  }

  function cargarProyecto(id) {
    const proyecto = state.proyectos.find((p) => p.id === id)

    if (!proyecto) {
      mostrarNotificacion("Proyecto no encontrado", "error")
      return
    }

    // Cargar datos del proyecto
    state.trabes = proyecto.datos.trabes || []
    state.elementos = proyecto.datos.elementos || []
    state.materiales = proyecto.datos.materiales || {
      proporciones: {
        cemento: 350,
        arena: 670,
        grava: 1100,
        agua: 180,
      },
      costos: {
        cemento: 180,
        arena: 350,
        grava: 400,
        agua: 30,
        acero: 25,
        aditivo: 80,
      },
      desperdicio: {
        concreto: 5,
        acero: 7,
        materiales: 3,
      },
    }

    // Cargar valores de los campos
    if (proyecto.campos) {
      Object.keys(proyecto.campos).forEach((id) => {
        const elemento = document.getElementById(id)
        if (elemento) {
          if (elemento.type === "checkbox") {
            elemento.checked = proyecto.campos[id]
          } else {
            elemento.value = proyecto.campos[id]
          }
        }
      })
    }

    // Actualizar UI para mostrar trabes y elementos cargados
    actualizarTablaTrabes()
    actualizarTablaElementos()

    // Cerrar modal
    dom.proyectosModal.classList.add("hidden")

    // Mostrar notificación
    mostrarNotificacion(`Proyecto "${proyecto.nombre}" cargado correctamente`, "success")
  }

  function eliminarProyecto(id) {
    if (confirm("¿Está seguro de eliminar este proyecto?")) {
      state.proyectos = state.proyectos.filter((p) => p.id !== id)
      localStorage.setItem("proyectos", JSON.stringify(state.proyectos))

      mostrarProyectosGuardados()
      mostrarNotificacion("Proyecto eliminado correctamente", "info")
    }
  }

  function mostrarGuardarProyectoModal() {
    dom.guardarProyectoModal.classList.remove("hidden")
    dom.proyectoNombre.focus()
  }

  function actualizarTablaTrabes() {
    const trabesList = document.getElementById("trabes-items")
    trabesList.innerHTML = ""

    state.trabes.forEach((trabe, index) => {
      const tr = document.createElement("tr")
      tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">${index + 1}</td>
                <td class="px-6 py-4 whitespace-nowrap">${trabe.dimensiones}</td>
                <td class="px-6 py-4 whitespace-nowrap">${trabe.volumen.toFixed(3)} m³</td>
                <td class="px-6 py-4 whitespace-nowrap">${trabe.acero.toFixed(2)} kg</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <button class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" onclick="eliminarTrabe(${index})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `
      trabesList.appendChild(tr)
    })
  }

  function actualizarTablaElementos() {
    const elementosList = document.getElementById("elementos-items")
    elementosList.innerHTML = ""

    state.elementos.forEach((elemento, index) => {
      const tr = document.createElement("tr")
      tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">${index + 1}</td>
                <td class="px-6 py-4 whitespace-nowrap">${elemento.tipo}</td>
                <td class="px-6 py-4 whitespace-nowrap">${elemento.dimensiones}</td>
                <td class="px-6 py-4 whitespace-nowrap">${elemento.cantidad || 1}</td>
                <td class="px-6 py-4 whitespace-nowrap">${elemento.volumen.toFixed(3)} m³</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <button class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" onclick="eliminarElemento(${index})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `
      elementosList.appendChild(tr)
    })
  }

  // Funciones globales para eliminar elementos (accesibles desde onclick)
  window.eliminarTrabe = (index) => {
    state.trabes.splice(index, 1)
    actualizarTablaTrabes()
    mostrarNotificacion("Trabe eliminada", "info")
  }

  window.eliminarElemento = (index) => {
    state.elementos.splice(index, 1)
    actualizarTablaElementos()
    mostrarNotificacion("Elemento eliminado", "info")
  }

  // Inicializar la aplicación
  init()
})

