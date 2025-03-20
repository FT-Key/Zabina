// Usuarios

export function validarNombreUsuario(nombreUsuario) {
  const regex =
    /^(?=.*[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ])[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\d\-_\.]{3,30}$/;
  return regex.test(nombreUsuario);
}

export function validarContraseniaUsuario(contraseniaUsuario) {
  const regex =
    /^(?=.*[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ])(?=.*\d)[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\d_]{6,30}$/;
  return regex.test(contraseniaUsuario);
}

export function validarCorreoElectronico(correoUsuario) {
  const regex = /^[a-zA-Z0-9_]{3,40}@[a-zA-Z0-9_]+\.[a-zA-Z0-9]+$/;
  return regex.test(correoUsuario);
}

export function validarNombre(nombre) {
  const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ]{2,}$/;
  return nombreRegex.test(nombre);
}

export function validarApellido(apellido) {
  const apellidoRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ]{2,}$/;
  return apellidoRegex.test(apellido);
}

export function validarFotoPerfil(cadena) {
  // Expresión regular para URLs absolutas
  const regexURL = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;
  // Expresión regular para rutas locales
  const regexLocal = /^(\.\/|\.\.\/).*\/.*\.(?:png|jpg|jpeg|gif|webp)$/i;
  // Expresión regular para rutas google
  const regexGoogle = /^https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9\/._-]+=[a-zA-Z0-9=-]+$/i;
  // Expresión regular para URLs de via.placeholder.com con tamaños entre 100 y 5000
  const regexPlaceholder = /^https:\/\/via\.placeholder\.com\/([1-9]\d{2,3}|10000)x([1-9]\d{2,3}|10000)$/;
  const regexPicsum = /^https:\/\/picsum\.photos\/(?:id\/\d+\/)?(?:seed\/\w+\/)?(\d{2,4})(?:\/(\d{2,4}))?(?:\.(?:jpg|webp))?(?:\/?(?:\?(?:random=\d+|grayscale|blur=\d+|blur|grayscale&blur=\d+)|&?random=\d+|&?grayscale|&?blur=\d+|&?blur)*)?$/i;

  return regexURL.test(cadena) || regexLocal.test(cadena) || regexPlaceholder.test(cadena) || regexPicsum.test(cadena) || regexGoogle.test(cadena);
}

export function validarDireccion(direccion) {
  const { calle, ciudad, estado, codigoPostal, pais } = direccion;
  return calle && ciudad && estado && codigoPostal && pais;
}

export function validarCalle(calle) {
  const regex = /^[A-Za-z0-9\s,'-]*$/;
  return regex.test(calle);
}

export function validarCiudad(ciudad) {
  const regex = /^[a-zA-Z\s]*$/;
  return regex.test(ciudad);
}

export function validarEstado(estado) {
  const regex = /^[a-zA-Z\s]*$/;
  return regex.test(estado);
}

export function validarCodigoPostal(codigoPostal) {
  const regex = /^[0-9]{5}(?:-[0-9]{4})?$/;
  return regex.test(codigoPostal);
}

export function validarTelefono(telefono) {
  const regex = /^[0-9]{10,15}$/;
  const testPhone = /^\d{3}-\d{4}$/;
  return regex.test(telefono) || testPhone.test(telefono);
}

export function validarPreferencias(preferencias) {
  const { idioma, tema } = preferencias;
  return idioma && tema;
}

export function validarPreguntasDeSeguridad(preguntasSeguridad) {
  const { pregunta, respuesta } = preguntasSeguridad;

  return Boolean(pregunta && respuesta);
}

export function validarRespuesta(respuesta) {
  const regex = /^[a-zA-Z0-9\s]*$/;
  return regex.test(respuesta);
}

export function validarBiografia(biografia) {
  return biografia && biografia.length <= 500;
}

export function validarEnlacesRedesSociales(enlacesRedesSociales) {
  const { twitter, linkedin } = enlacesRedesSociales;
  const regex = /^(https?:\/\/)?([\w\-]+)\.([a-z]{2,6})(\/[\w\-]*)*$/i;
  return regex.test(twitter) && regex.test(linkedin);
}

export function validarSelect(opcion, opcionesValidas) {
  return opcionesValidas.includes(opcion);
}

// Productos

export function validarNombreProducto(cadena) {
  const regex = /^[A-ZÁÉÍÓÚÑÜ0-9][A-Za-zÁÉÍÓÚÑÜáéíóúñü0-9\s,'-:()!?]*$/;
  return regex.test(cadena);
}

export function validarPrecio(cadena) {
  const regex = /^\d+(\.\d{1,2})?$/;
  return regex.test(cadena);
}

export function validarDescripcion(cadena) {
  const regex = /^[A-Za-zÁÉÍÓÚÑÜáéíóúñü0-9\s,'-:()!?."%&$#@\n]*$/;
  return regex.test(cadena);
}

export function validarCategoria(cadena) {
  const regex = /^([A-Za-zÁÉÍÓÚÑÜáéíóúñü0-9\s,'-]+,)*[A-Za-zÁÉÍÓÚÑÜáéíóúñü0-9\s,'-]+$/;
  return regex.test(cadena);
}

export function validarStock(cadena) {
  const regex = /^\d+$/;
  return regex.test(cadena);
}

export function validarProveedor(cadena) {
  const regex = /^[A-Za-zÁÉÍÓÚÑÜáéíóúñü\s,'&.-]+$/;
  return regex.test(cadena);
}

export const validarCodigoDeBarras = (codigo, strict = false) => {
  // Verificar que tenga exactamente 13 caracteres
  if (!/^\d{13}$/.test(codigo)) {
    return false;
  }

  // Si strict es false, solo verificamos solo la cantidad de dígitos
  if (!strict) {
    return true;
  }

  const digitos = codigo.split('').map(Number);

  // Calcular el dígito de control
  let suma = 0;
  for (let i = 0; i < 12; i++) {
    // Los dígitos en posiciones impares se suman normalmente,
    // los de posiciones pares se multiplican por 3.
    suma += i % 2 === 0 ? digitos[i] : digitos[i] * 3;
  }

  const digitoControlCalculado = (10 - (suma % 10)) % 10;

  // Verificar si el dígito de control coincide con el último dígito del código
  return digitoControlCalculado === digitos[12];
};

export function validarImagenURL(cadena) {
  // Expresión regular para URLs absolutas
  const regexURL = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;
  // Expresión regular para rutas locales
  const regexLocal = /^(\.\/|\.\.\/).*\/.*\.(?:png|jpg|jpeg|gif|webp)$/i;
  // Expresión regular para URLs de via.placeholder.com con tamaños entre 100 y 5000
  const regexPlaceholder = /^https:\/\/via\.placeholder\.com\/([1-9]\d{2,3}|10000)(x([1-9]\d{2,3}|10000))?$/;
  const regexPicsum = /^https:\/\/picsum\.photos\/(?:id\/\d+\/)?(?:seed\/\w+\/)?(\d{2,4})(?:\/(\d{2,4}))?(?:\.(?:jpg|webp))?(?:\/?(?:\?(?:random=\d+|grayscale|blur=\d+|blur|grayscale&blur=\d+)|&?random=\d+|&?grayscale|&?blur=\d+|&?blur)*)?$/i;

  return regexURL.test(cadena) || regexLocal.test(cadena) || regexPlaceholder.test(cadena) || regexPicsum.test(cadena);
}

export function validarCalificaciones(cadena) {
  const regex = /^(?:[0-4](?:,[0-9])?|5)$/;
  return regex.test(cadena);
}

export function validarGarantia(cadena) {
  const regex = /^\d{1,2}\s*(mes|meses|año|años)$/;

  if (cadena.toLowerCase() === 'sin garantía' || cadena.toLowerCase() === 'sin garantia') {
    return true;
  }

  const meses = cadena.match(/^(\d{1,2})\s*(mes|meses)$/);
  if (meses) {
    const numMeses = parseInt(meses[1], 10);
    if (numMeses >= 1 && numMeses <= 12) {
      return true;
    }
  }

  return regex.test(cadena);
}

export function validarFecha(fecha) {
  const fechaTest = new Date();
  if (Object.prototype.toString.call(fechaTest) !== "[object Date]" || isNaN(fechaTest)) {
    return false;
  }
  return true;
}

export function validarDescuento(cadena) {
  const regex = /^([0-9]|[1-9][0-9]|100)(\.\d{1,2})?%?$/;
  return regex.test(cadena);
}

export function validarNombreContacto(nombre) {
  const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{4,}$/;
  return nombreRegex.test(nombre);
}

export function validarEmailContacto(email) {
  const emailRegex = /^[a-zA-Z0-9]{4,}@[a-zA-Z0-9]{3,}\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validarTelefonoContacto(telefono) {
  const telefonoRegex = /^\d{7,15}$/;
  return telefonoRegex.test(telefono) || telefono === "";
}

export function validarAsuntoContacto(asunto) {
  return asunto.length >= 3;
}

export function validarMensajeContacto(mensaje) {
  return mensaje.length >= 10;
}

// Animales

export function validarNombreAnimal(nombre) {
  const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,}$/;
  return nombreRegex.test(nombre);
}

export function validarTipoAnimal(tipo) {
  const tiposValidos = ['Perro', 'Gato', 'Ave', 'Conejo', 'Reptil', 'Otro'];
  return tiposValidos.includes(tipo);
}

export function validarRazaAnimal(raza) {
  const razaRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,}$/;
  return razaRegex.test(raza);
}

export function validarEdadAnimal(edad) {
  return typeof Number(edad) === "number" && edad > 0;
}

export function validarDescripcionAnimal(descripcion) {
  return descripcion.length >= 10 && descripcion.length <= 200;
}

export function validarPesoAnimal(peso) {
  return typeof Number(peso) === "number" && peso > 0;
}

export function validarGeneroAnimal(genero) {
  const generosValidos = ['Macho', 'Hembra'];
  return generosValidos.includes(genero);
}

export function validarImagenAnimal(imagenUrl) {
  const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;
  return urlRegex.test(imagenUrl);
}

// Donaciones

export function validarDonacion(cadena) {
  const regex = /^[1-9]\d{2,}$/;
  return regex.test(cadena);
}

//Comentarios

export const esComentarioValido = (comentario) => {
  return comentario.trim().length >= 10 && comentario.trim().length <= 300;
};


export const esCalificacionValida = (calificacion) => {
  return calificacion >= 0 && calificacion <= 5;
};
