const urlApi = 'https://mindicador.cl/api/';
const inputMoneda = document.querySelector('#inputMoneda')
const moneda = document.querySelector('#monedas');
const buscarBtn = document.querySelector('.buscar');
const resultado = document.querySelector('.resultado');

// Función para obtener datos de la API
const getApi = async (moneda) => {
    try {
        const res = await fetch(urlApi + moneda);
        if (!res.ok) {
            throw new Error('Error al obtener los datos');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        resultado.innerHTML = '<p>Error al cargar los datos</p>';
        return null;
    }
};

const convertirMoneda = (valorMoneda)=>{
    const valorInput = inputMoneda.value.trim()
    console.log(valorInput)
    console.log(typeof(valorInput))
     // Validar si el campo de entrada está vacío o no es un número
     if (!valorInput || isNaN(valorInput) || valorInput === "") {
        console.log('ingresa valor valido')
        resultado.innerHTML = '<p>Por favor, ingresa un valor numérico válido</p>';
        return;
    }
    const total = valorInput * valorMoneda
    return total
}
// Función para renderizar los datos de la moneda seleccionada
const renderMonedas = async () => {
    const seleccionMoneda = moneda.value;

    // Verificar si se seleccionó una moneda
    if (!seleccionMoneda) {
        resultado.innerHTML = '<p>Por favor, selecciona una moneda</p>';
        return;
    }

    // Obtener datos de la API
    const monedas = await getApi(seleccionMoneda);

    // Verificar si los datos son válidos
    if (!monedas || !monedas.serie) {
        resultado.innerHTML = '<p>No se encontraron datos para la moneda seleccionada</p>';
        return;
    }

    // Crear el template con los datos
    let template = '';
    const eleccion = monedas
    const valor = eleccion.serie[0].valor; // Obtener el valor más reciente
    const fecha = new Date(eleccion.serie[0].fecha).toLocaleDateString();
   
    const totalConvertido = convertirMoneda(valor);
    if (totalConvertido !== null) {
    template += `
        <p>${eleccion.nombre}</p>
        <p>Valor: ${totalConvertido}</p>
        <p>Fecha: ${fecha}</p>
    `;}

    // Mostrar el resultado en el DOM
    resultado.innerHTML = template;
};



// Escuchar el evento click en el botón "buscar"
buscarBtn.addEventListener('click', () => renderMonedas());