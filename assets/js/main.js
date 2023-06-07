// Creamos las variables que corresponden a los elemento html que iremos utilizando en diferentes funciones.
const section = document.querySelector('.tienda');
const modalContainer = document.querySelector('.carrito__container');
let modal = document.querySelectorAll('.carrito');
const imagenCarrito = document.querySelector('.imagen__carrito')
let carrito = (JSON.parse(localStorage.getItem('carrito'))) || [];

// Creamos la funcion que fetchea los datos provistos en un json en otro archivo y para cada uno de ellos
// crea una card que se agregara a 'section'.
const getData = async () => {
    const response = await fetch('../assets/js/productos.js');
    const data = await response.json();
    data.forEach(producto => {
        let card = document.createElement('div');
        card.setAttribute('class','tienda__producto');
        let divImg = document.createElement('div');
        divImg.setAttribute('class','tienda__producto__imagen');
        let img = document.createElement('img');
        img.setAttribute('src',producto['img']);
        img.setAttribute('alt',producto['alt']);
        divImg.appendChild(img);
        let nombre = document.createElement('h3');
        nombre.setAttribute('class','tienda__producto__nombre');
        nombre.innerHTML = `${producto["nombre"]}`;
        let descripcion = document.createElement('div');
        descripcion.setAttribute('class','tienda__producto__descripcion');
        descripcion.innerHTML = `${producto["descripcion"]}`;
        let precio = document.createElement('div');
        precio.setAttribute('class','tienda__producto__precio');
        precio.innerHTML = `$${producto["precio"]}`;
        card.appendChild(divImg);
        card.appendChild(nombre);
        card.appendChild(descripcion);
        card.appendChild(precio);
        let contenedorSelect = document.createElement('div');
        contenedorSelect.setAttribute('class','tienda__producto__botones');
        let cantidad = cantidadCreador(producto);
        contenedorSelect.appendChild(cantidad);
        let agregarCarrito = document.createElement('button');
        agregarCarrito.setAttribute('class','boton');
        agregarCarrito.innerHTML = 'Añadir al carrito';
        agregarCarrito.addEventListener('click', ()=> {
            let cantidadElegida = parseInt(cantidad.options[cantidad.selectedIndex].value);
            let [carritoExistente, indiceProducto] = verificarEnCarrito(producto);
            if (carritoExistente) {
                carrito[indiceProducto]["cantidad"] += cantidadElegida;
                if (carrito[indiceProducto]["cantidad"] >= 10) {
                    carrito[indiceProducto]["cantidad"] = 10;
                };
                carrito[indiceProducto]["precioUnidad"] = producto["precio"];
                localStorage.setItem('carrito',JSON.stringify(carrito));
            } else {
                let nuevoProducto = {"id": producto["id"],"nombre": producto["nombre"], "cantidad": cantidadElegida,"precioUnidad": producto["precio"]};
                carrito.push(nuevoProducto);
                localStorage.setItem('carrito',JSON.stringify(carrito));
            }
            carritoNotificacion();
        });
        card.appendChild(contenedorSelect);
        card.appendChild(agregarCarrito);
        section.appendChild(card);
    });
};

// Creamos una funcion que busque en los productos existentes del carrito por coincidencias para devolver True o False (uso un for in en vez de un forEach porque este ultimo no me permitio retornar correctamente una vez
// encontrada la igualdad en el if)
const verificarEnCarrito = (producto)=> {
    let carritoExistente = false;
    indice = 0;
    for (const element of carrito) {
        if (element["id"] == producto["id"]) {
            carritoExistente = true;
            return [carritoExistente, indice];
        };
        indice ++;
    };
    return [carritoExistente, indice];
};

// Creamos la funcion que nos retornara un select con las opciones correspondientes al tipo de producto a mostrar.
const cantidadCreador = (producto)=> {
    if (producto['categorias'].includes('Alimento')) {
        let cantidad = document.createElement('select');
        cantidad.setAttribute('class','cantidad');
        for (let i = 1; i <= 10; i++) {
            let opcion = document.createElement('option');
            opcion.setAttribute('value',i);
            opcion.innerHTML = `${i} kg.`;
            cantidad.appendChild(opcion);
        };
        return cantidad
    } else {
        let cantidad = document.createElement('select');
        for (let i = 1; i <= 10; i++) {
            let opcion = document.createElement('option');
            opcion.setAttribute('value',i);
            opcion.innerHTML = `${i} unidad(es)`;
            cantidad.appendChild(opcion);
        };
        return cantidad
    };
};

// Creamos la funcion que mostrara las notificaciones al anadir un producto al carrito, usando Toastify.
const carritoNotificacion = ()=> {
    Toastify({
        text: "El producto ha sido añadido al carrito 🛒",
        className: "toasty",
        close: true,
        gravity: "bottom",
        position: "center",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #2F3133, #22B0D4)"
        },
        onClick: function(){
            verCarrito();
            classToggle();
        },
        duration: 1500
        }).showToast();
};

// Creamos la funcion que creara todos los elementos del carrito cuando el usuario quiera verlos.
const verCarrito = ()=> {
    let costoTotal = 0;
    let modal = document.createElement('modal');
    modalContainer.innerHTML = '';
    modal.setAttribute('class','carrito');
    let botonCerrar = document.createElement('div')
    botonCerrar.setAttribute('class','carrito__cerrar');
    botonCerrar.innerHTML = '<b>X</b>';
    botonCerrar.addEventListener('click',()=> {
        classToggle();
    });
    let titulo = document.createElement('h2');
    titulo.innerHTML = 'Carrito 🛒';
    modal.appendChild(botonCerrar);
    modal.appendChild(titulo);
    if (carrito.length <= 0) {
        let aviso = document.createElement('h3');
        aviso.innerHTML = 'Aún no tienes productos en tu carrito.';
        modal.appendChild(aviso);
        modalContainer.appendChild(modal);
    } else {
        let cabecera = document.createElement('div');
        cabecera.setAttribute('class','carrito__producto container-fluid text-center');
        let productoCabecera = document.createElement('b');
        productoCabecera.setAttribute('class','carrito__producto__nombre col-4');
        productoCabecera.innerHTML = 'Producto';
        let precioCabecera = document.createElement('b');
        precioCabecera.setAttribute('class','carrito__producto__unidad col-2');
        precioCabecera.innerHTML = 'Precio Unidad';
        let cantidadCabecera = document.createElement('b');
        cantidadCabecera.setAttribute('class','col-2');
        cantidadCabecera.innerHTML = 'Cantidad';
        let totalCabecera = document.createElement('b');
        totalCabecera.setAttribute('class','carrito__producto__total col-2');
        totalCabecera.innerHTML = 'Total por Producto';
        let vacioCabecera1 = document.createElement('b');
        vacioCabecera1.setAttribute('class','col-1');
        vacioCabecera1.innerHTML = '';
        let vacioCabecera2 = document.createElement('b');
        vacioCabecera2.setAttribute('class','col-1');
        vacioCabecera2.innerHTML = '';
        cabecera.appendChild(productoCabecera);
        cabecera.appendChild(precioCabecera);
        cabecera.appendChild(cantidadCabecera);
        cabecera.appendChild(totalCabecera);
        cabecera.appendChild(vacioCabecera1);
        cabecera.appendChild(vacioCabecera2);
        modal.appendChild(cabecera);
        carrito.forEach(producto => {
            let totalParcial = producto['precioUnidad'] * producto["cantidad"];
            costoTotal += totalParcial;
            let productoContenedor = document.createElement('div');
            productoContenedor.setAttribute('class','carrito__producto container-fluid text-center');
            let nombre = document.createElement('b');
            nombre.setAttribute('class','carrito__producto__nombre col-4');
            nombre.innerHTML = producto['nombre'];
            let precioUnidad =  document.createElement('p');
            precioUnidad.setAttribute('class','carrito__producto__unidad col-2');
            precioUnidad.innerHTML = `$${producto['precioUnidad']}`;
            let cantidadContainer = document.createElement('div');
            cantidadContainer.setAttribute('class','col-2');
            let cantidad = document.createElement('select');
            for (let i = 1; i <11; i++) {
                let opcion = document.createElement('option');
                opcion.setAttribute('value',i);
                opcion.innerHTML = i;
                if (i == producto["cantidad"]) {
                    opcion.setAttribute('selected','true');
                }
                cantidad.appendChild(opcion);
            };
            cantidadContainer.appendChild(cantidad);
            let total = document.createElement('p');
            total.setAttribute('class','carrito__producto__total col-2');
            total.innerHTML = `$${totalParcial}`;
            let botonModificar = document.createElement('button');
            botonModificar.setAttribute('class','boton col-1');
            botonModificar.innerHTML = 'Modificar';
            botonModificar.addEventListener('click',()=>{
                let nuevaCantidad = parseInt(cantidad.options[cantidad.selectedIndex].value);
                let nuevoTotalParcial = parseInt(producto['precioUnidad']) * nuevaCantidad;
                costoTotal -= producto['cantidad'] * producto['precioUnidad'];
                producto['cantidad'] = nuevaCantidad;
                localStorage.setItem('carrito',JSON.stringify(carrito));
                costoTotal += nuevoTotalParcial;
                total.innerHTML = `$${nuevoTotalParcial}`;
                document.querySelector('.carrito__total').innerHTML = `Total de la compra: <b>$${costoTotal}</b>`;
            });
            let botonEliminar = document.createElement('button');
            botonEliminar.setAttribute('class','boton eliminar__producto col-1');
            botonEliminar.innerHTML = 'Eliminar';
            botonEliminar.addEventListener('click',()=> {
                modal.removeChild(hr);
                modal.removeChild(productoContenedor);
                let indice = verificarEnCarrito(producto)[1];
                let nuevoTotalParcial = producto['cantidad'] * producto['precioUnidad'];
                costoTotal -= nuevoTotalParcial;
                document.querySelector('.carrito__total').innerHTML = `Total de la compra: <b>$${costoTotal}</b>`;
                carrito.splice(indice,1);
                localStorage.setItem('carrito',JSON.stringify(carrito));
            });
            productoContenedor.appendChild(nombre);
            productoContenedor.appendChild(precioUnidad);
            productoContenedor.appendChild(cantidadContainer);
            productoContenedor.appendChild(total);
            productoContenedor.appendChild(botonModificar);
            productoContenedor.appendChild(botonEliminar);
            modal.appendChild(productoContenedor);
            let hr = document.createElement('hr');
            modal.appendChild(hr);
        });
        let totalCarrito = document.createElement('h3');
        totalCarrito.setAttribute('class','carrito__total');
        totalCarrito.innerHTML = `Total de la compra: <b>$${costoTotal}</b>`;
        let botonesContainer = document.createElement('div');
        botonesContainer.setAttribute('class','carrito__botones');
        let botonVaciar = document.createElement('button');
        botonVaciar.setAttribute('class','boton vaciar');
        botonVaciar.innerHTML = 'Vaciar Carrito';
        botonVaciar.addEventListener('click',()=> {
            carrito = [];
            localStorage.clear();
            verCarrito();
        })
        let botonConfirmar = document.createElement('button');
        botonConfirmar.setAttribute('class','boton confirmar');
        botonConfirmar.innerHTML = 'Confirmar Compra';
        botonesContainer.appendChild(botonVaciar);
        botonesContainer.appendChild(botonConfirmar);
        modal.appendChild(totalCarrito);
        modal.appendChild(botonesContainer);
        modalContainer.appendChild(modal);
    };
};

// Creamos una funcion que active y desactive el modal
const classToggle = ()=> {
    modalContainer.classList.toggle('carrito__inactivo');
};

// Creamos el eventListener que permitira cerrar el modal si se toca en cualquier lado excepto en el modal REVISAAAAAAAAAAAAAAAAR
const cerrarCarrito = ()=> {
    document.addEventListener('click', function (event) {
        if (!modalContainer.classList.contains('carrito__inactivo')) {
            let clickDentro = false;
            modal.forEach(element => {
                element.contains(event.target) && (clickDentro = true);
            });
            if (!clickDentro) {
                classToggle();
            };
        };
    });
};

// Creamos el event listener para abrir el carrito al presionar sobre la imagen del mismo
imagenCarrito.addEventListener('click',()=> {
    verCarrito();
    classToggle();
});

getData();