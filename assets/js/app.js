const urlApi = 'https://mindicador.cl/api/';
const pesosCLP = document.querySelector('#inputMoneda')
const monedaSeleccionada = document.querySelector('#monedas');
const resultado = document.querySelector('.resultado')
const buscarBtn = document.querySelector('.buscar')
let chartInstance = null;

const showError = (texto) =>{
    const alertError = `
            <div class="alert">
                <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
                ${texto}
            </div>
        `
    return alertError;
}

const getApi = async (moneda) => {
    try {
        const res = await fetch(urlApi+moneda);
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

    const moneda = await getApi(monedaSeleccionadaValue);

    if (!moneda || !moneda.serie) {
        resultado.innerHTML = showError('Moneda no encontrada');
        return;
    }
        
    const valorMoneda = moneda.serie[0].valor;
    const conversion = pesosCLPValue / valorMoneda;

    drawChart(moneda.serie.slice(0, 10));
    
    let template = `<h2>${pesosCLPValue} CLP son ${conversion.toFixed(4)} ${monedaSeleccionada.options[monedaSeleccionada.selectedIndex].text}</h2>`

    pesosCLP.value = '';
    monedaSeleccionada.value = '';

    resultado.innerHTML = template;


}



buscarBtn.addEventListener('click', renderizarMonedas)


function drawChart(data) {
    const contentChart = document.querySelector('.content-chart')
    contentChart.style.display = "block";

    let canvas = document.getElementById('exchangeChart');
    if (!canvas) {
        console.error("Canvas no encontrado");
        return;
    }
    let ctx = canvas.getContext('2d');
    
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    let labels = data.map(d => new Date(d.fecha).toLocaleDateString());
    let values = data.map(d => d.valor);
    
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.reverse(),
            datasets: [{
                label: 'Historial últimos 10 días',
                data: values.reverse(),
                borderColor: '#008f7a',
                fill: true
            }]
        }
    });
}