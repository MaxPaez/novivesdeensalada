// SE CAPTURA EL TEMPLSTE DE LOS PRODUCTOS
const templateProd = document.getElementById('template-prod').content;

const contenedorProdPrincipal = document.querySelector('.contenedor-productosPrincipal');

const contenedorProdGuarnicion = document.querySelector('.contenedor-productosGuarnicion');

const contenedorProdBebidas = document.querySelector('.contenedor-productosBebidas');

const fragment = document.createDocumentFragment();



//FUNCIÓN ASINCRÓNICA CON LA CUAL TOMAR LOS PRODUCTOS DE LAS DISTINTAS CATEGORÍAS DE LOS JSON
const getProducts = async (url, container) => {

    try {

        const response = await fetch(url);

        const data = await response.json();

        loadProducts(data, container);

    } catch (error) {

        console.log(error);

    }

}



// PARA AGREGAR LOS PRODUCTOS AL DOM
const loadProducts = (products, container) => {

    Object.values(products).forEach(producto => {

        templateProd.querySelector('.nombre-prod').textContent = producto.nombre;

        templateProd.querySelector('.div-precio-boton .precio').textContent = producto.precio;

        templateProd.querySelector('.contenedor-img img').setAttribute('alt', producto.nombre);

        templateProd.querySelector('.contenedor-img img').setAttribute('src', producto.srcImg);

        const clone = templateProd.cloneNode(true);

        fragment.appendChild(clone);

    })
    container.appendChild(fragment);
}


//SECCIÓN  PLATO PRINCIPAL
getProducts("/data/platoprincipal.json", contenedorProdPrincipal)

//SECCIÓN GUARNICIÓN
getProducts("/data/guarnicion.json", contenedorProdGuarnicion)

//SECCIÓN BEBIDAS
getProducts("/data/bebida.json", contenedorProdBebidas)



//NOTIFICACIÓN AL AGREGAR UN PRODUCTO AL CARRITO CON TOASTIFY
const cartelAlAgregar = (contenedor) => {
    

    contenedor.addEventListener('click', (e) => {

        if (e.target.classList.contains('boton')) {

            Toastify({
                text: "Has agregado un producto al carrito",
                duration: 2000,
                gravity: "bottom",
                positin: "right",
                style: {
                    background: "hsla(250, 70%, 50%, 0.7)"
                }
                
            }).showToast();
        }
    })
}

// cartelAlAgregar(contenedorProdPrincipal)
cartelAlAgregar(contenedorProdPrincipal);
cartelAlAgregar(contenedorProdGuarnicion);
cartelAlAgregar(contenedorProdBebidas);




// CARRITO DE COMPRA
let carrito = {};

const templateTabla = document.getElementById('agregar-producto-al-carro').content;

const tbodyCarrito = document.getElementById('carrito-body');

const fragmentTabla = document.createDocumentFragment();

const templateFoot = document.getElementById('tfooter').content;

const tfootCarrito = document.getElementById('footer');

let carritoStorage = window.localStorage;





//BOTON PARA AGREGAR PRODUCTOS DE LAS DISTINTAS CATEGORÍAS AL CARRITO
contenedorProdPrincipal.addEventListener('click', e => {

    //OPERADOR LÓGICO AND
    if (e.target.textContent === "Agregar") {

        setCarrito(e.target.parentElement.parentElement);

    }

    e.stopPropagation();

})

contenedorProdGuarnicion.addEventListener('click', e => {

    //OPERADOR LÓGICO AND
    if (e.target.textContent === "Agregar") {

        setCarrito(e.target.parentElement.parentElement)

    }

    e.stopPropagation();

})

contenedorProdBebidas.addEventListener('click', e => {

    //OPERADOR LÓGICO AND
    if (e.target.textContent === "Agregar") {

        setCarrito(e.target.parentElement.parentElement);

    }

    e.stopPropagation();

});



//FUNCIÓN GUARDAR Y CARGAR EN LOCALSTORAGE
function guardarCarritoEnLocalStorage() {

    carritoStorage.setItem('carrito', JSON.stringify(carrito));

}

//SI EL CARRITO NO ESTÁ VACÍO CARGA LA INFORMACIÓN GUARDADA
function cargarCarritoDeLocalStorage() {

    if (carritoStorage.getItem('carrito') !== null) {

        carrito = JSON.parse(carritoStorage.getItem('carrito'));

    }

}



// AL ELEGIR DOS O MAS VECES EL MISMO PRODUCTO SE SUMA A LA CANTIDAD
const setCarrito = i => {

    const entCarrito = {

        nombre: i.querySelector('.nombre-prod').textContent,

        precio: i.querySelector('.div-precio-boton .precio').textContent,

        cantidad: 1
    }

    if (carrito.hasOwnProperty(entCarrito.nombre)) {

        carrito[entCarrito.nombre].cantidad += 1;

    } else {

        //SPREAD
        carrito[entCarrito.nombre] = { ...entCarrito }

    }

    pintarTabla(carrito);

}



// SE IMPRIMEN LOS PRODUCTOS EN LA TABLA
const pintarTabla = objetoCarrito => {

    Object.values(objetoCarrito).forEach(objeto => {

        const armarTabla = templateTabla.cloneNode(true);

        armarTabla.getElementById('producto').textContent = objeto.nombre;

        armarTabla.getElementById('cant').textContent = objeto.cantidad;

        armarTabla.getElementById('precio-uni').textContent = objeto.precio;

        let precioTotal = parseFloat(objeto.precio) * objeto.cantidad;

        armarTabla.getElementById('precio-total-prod').textContent = precioTotal.toFixed(2);

        fragmentTabla.appendChild(armarTabla);
    });

    tbodyCarrito.innerHTML = '';

    tbodyCarrito.appendChild(fragmentTabla);

    guardarCarritoEnLocalStorage()

    pintarFooter();

}



// SE OCULTA EL FOOTER DE LA TABLA SI NO HAY PRODUCTOS SELECCIONADOS
// SE IMPRIME EN EL FOTER EL VALOR TOTAL DE LA COMPRA
// SE ESTABLECE BOTON DE VACIAR CARRITO
// EL BOTÓN DE REALIZAR PAGO GUARDA EN LOCALSTORAGE EL TOTAL DE LA COMPRA, HACE JSON DEL OBJETO QUE CONTIENE LOS PRODUCTOS DEL CARRITO
const pintarFooter = () => {

    tfootCarrito.innerHTML = '';

    if (Object.keys(carrito).length === 0) {

        tfootCarrito.innerHTML = '<tr><td colspan = 4>¡No hay ningun elemento en el carrito!</td></tr>';

    } else {

        const total = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + (cantidad * precio), 0);

        templateFoot.getElementById('total-a-pagar').textContent = total.toFixed(2);

        const tablFoot = templateFoot.cloneNode(true);

        fragment.appendChild(tablFoot);

        tfootCarrito.appendChild(fragment);


        //BOTÓN VACIAR CARRITO_STORAGE

        const botonVaciar = document.getElementById('vaciar-tabla');

        botonVaciar.addEventListener('click', () => {

            //LIBRERÍA SWEETALERT
            Swal.fire({

                title: '¿Estás seguro/a?',
                text: "No podrás recuperar los productos del carrito",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'rgb(92, 206, 39)',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, vaciar carrito',
                cancelButtonText: 'Cancelar',

            }).then((result) => {

                if (result.isConfirmed) {

                    Swal.fire(

                        'Borrado',
                        'Tu carrito ha quedado vacío',
                        'success'

                    )

                    carrito = {};

                    localStorage.clear()

                    pintarTabla(carrito);

                    pintarFooter();

                    guardarCarritoEnLocalStorage()

                }
            })
        })

        //BOTÓN DE PAGO
        const botonPago = document.getElementById('pagarCompra');

        botonPago.addEventListener('click', () => {

            localStorage.setItem('sumaTotal', total);

            Swal.fire({

                title: '¿Has terminado tu compra?',
                text: "No podrás agregar más productos al carrito",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'rgb(92, 206, 39)',
                cancelButtonColor: 'hsla(250, 70%, 50%, 0.7)',
                confirmButtonText: 'Si, terminé mi compra',
                cancelButtonText: 'Quiero seguir comprando',

            }).then((result) => {

                if (result.isConfirmed) {

                    Swal.fire({

                        text: 'Esperamos que disfrutes tu comida',
                        confirmButtonColor: 'hsla(250, 70%, 50%, 0.7)',
                        confirmButtonText: 'Ok',

                    })
                        .then((result) => {


                            if (result) {

                                window.location.href = "/html/finalizarCompra.html";

                            }

                        })

                }
            }

            )

        });

    }
}



//BOTONES PARA AGREGAR O SACAR PRODUCTOS DIRECTAMENTE DE LA TABLA
tbodyCarrito.addEventListener('click', e => {

    if (e.target.classList.contains('button')) {

        aumentarDisminuir(e.target);

    }

});


const aumentarDisminuir = boton => {

    if (boton.textContent === '+') {

        const indicador = boton.parentElement.parentElement.firstElementChild.textContent;

        Object.values(carrito).forEach(elemento => {

            if (elemento.nombre === indicador) {

                carrito[elemento.nombre].cantidad++;

            }

        });

    }

    if (boton.textContent === '-') {

        const indicador = boton.parentElement.parentElement.firstElementChild.textContent;

        Object.values(carrito).forEach(elemento => {

            if (elemento.nombre === indicador) {

                carrito[elemento.nombre].cantidad--;

                if (carrito[elemento.nombre].cantidad === 0) {

                    delete carrito[elemento.nombre];

                }

            }

        });

    }

    pintarTabla(carrito);

    pintarFooter();

}


//CARGAR CARRITO AL VOLVER A LA PÁGINA
cargarCarritoDeLocalStorage();
pintarTabla(carrito);