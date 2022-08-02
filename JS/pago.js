// RECUPERANDO DATOS DE LOCALSTORAGE
const importeTotal = localStorage.getItem('sumaTotal');

const prodEnTicket = JSON.parse(localStorage.getItem("carrito"));


//TRANSFORMACION DE OBJETO EN ARRAY
const arrayTicket = Object.entries(prodEnTicket);


// DECLARACION DE ARRAYS DE DATOS ESPECIFICOS
const nombres = []

const cantidad = []


arrayTicket.forEach(objetc =>{
    
    nombres.push(objetc[1].nombre)

    cantidad.push(objetc[1].cantidad)    
    
});



//FUNCIÓN PARA LLENAR TABLA CON LOS DATOS EXTRAIDOS DEL ARRAY
llenarTabla();

function llenarTabla() {

    let tbody = document.querySelector('#carrito-body-ticket');

    tbody.innerHTML = '';

    if (Object.keys(cantidad).length === 0) {

        tbody.innerHTML = '<tr><td colspan = 2>¡No hay ningun elemento en el carrito!</td></tr>';

        footer.innerHTML = hide 

    } else {

    let nombresTicket = nombres, cantidadTicket = cantidad;

    let cantItems = nombres.length;

    for (let i = 0; i < cantItems; i++) {

        let fila = document.createElement('tr');

        let celdaNombre = document.createElement('td');

        let celdaCantidad = document.createElement('td');

        let textNombre = document.createTextNode(nombresTicket[i]);

        let textcantidad = document.createTextNode(cantidadTicket[i]);

        celdaNombre.appendChild(textNombre);

        celdaNombre.classList.add('celdaProdTicket');
        
        celdaCantidad.appendChild(textcantidad);
        
        celdaCantidad.classList.add('celdaProdTicket');

        fila.appendChild(celdaNombre);
        
        fila.appendChild(celdaCantidad);

        tbody.appendChild(fila);
        
    }
    }
}



//FUNCION PARA MOSTRAR EL TOTAL DEL TICKET EN LA TABLA
darTotal()

function darTotal() {

    let CelTotal = document.querySelector('#footer');

    CelTotal.innerHTML = '';

    let totalPago = localStorage.getItem('sumaTotal');

    let fila = document.createElement('tr');

    let celdaTotal = document.createElement('td');
    
    celdaTotal.classList.add('total-ticket2');    

    let textTotal = document.createTextNode(totalPago); 

    celdaTotal.appendChild(textTotal);

    fila.appendChild(celdaTotal)

    CelTotal.appendChild(fila);
    
    celdaTotal.setAttribute("colspan","2");

}