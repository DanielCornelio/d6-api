const urlApi = 'https://mindicador.cl/api/';
const pesosCLP = document.querySelector('#inputMoneda')
const monedaSeleccionada = document.querySelector('#monedas');
const resultado = document.querySelector('.resultado')
const buscarBtn = document.querySelector('.buscar')

const showError = (texto) =>{
    const alertError = `
            <div class="alert">
                <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
                ${texto}
            </div>
        `
    return alertError;
}

const getApi = async () => {
    try {
        const res = await fetch(urlApi);
        const data = await res.json();
        return data;
    } catch (error) {
        resultado.innerHTML = showError('Error al cargar los datos');
    }
}

const renderizarMonedas = async ()=>{
    let pesosCLPValue = pesosCLP.value
    let monedaSeleccionadaValue = monedaSeleccionada.value

    if(!pesosCLPValue){
        resultado.innerHTML = showError('Ingresa un valor valido');
        return;
    }
    if (!monedaSeleccionadaValue) {
        resultado.innerHTML = showError('Por favor, selecciona una moneda');
        return;
    }

    const moneda = await getApi();

    if (!moneda || !moneda[monedaSeleccionadaValue]) {
        resultado.innerHTML = showError('Moneda no encontrada');
        return;
    }
    
    
    
    const valorMoneda = moneda[monedaSeleccionadaValue].valor;
    const conversion = pesosCLPValue / valorMoneda;

    let template = `<h2>${pesosCLPValue} CLP son ${conversion.toFixed(4)} ${monedaSeleccionada.options[monedaSeleccionada.selectedIndex].text}</h2>`

    pesosCLP.value = '';
    monedaSeleccionada.value = '';

    resultado.innerHTML = template;


}



buscarBtn.addEventListener('click', renderizarMonedas)