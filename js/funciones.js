function funMostrarPc() {
    const cantidadPcs = parseInt(document.getElementById("pcId").value);

    // Realizar la petición GET a la API REST sin especificar un ID
    fetch(`http://localhost/P4JS_MayLeysly_ITI8A/api/index.php`)
        .then(response => response.json())
        .then(data => {
            // Manipular los datos obtenidos
            if (data.error) {
                console.error(data.error);
            } else {
                funMostrarImagenes(data, cantidadPcs);
            }
        })
        .catch(error => console.error('Error:', error));
}

function funMostrarImagenes(pcsData, cantidadPcs) {
    const pcImageDiv = document.getElementById('pcImage');
    const totalsDiv = document.getElementById('totals');

    pcImageDiv.innerHTML = '';  // Limpiar contenido anterior
    totalsDiv.innerHTML = 'Totales Disponibles: 0 | Totales Fuera de Servicio: 0';  // Reiniciar totales

    // Verificar si el número ingresado es mayor que el número de PCs
    if (cantidadPcs > pcsData.length) {
        pcImageDiv.innerHTML = alert('Número de ordenadores sobrepasado');
        return;
    }

    let disponibles = 0;
    let fueraDeServicio = 0;

    // Iterar sobre los datos y mostrar las imágenes
    for (let i = 0; i < cantidadPcs && i < pcsData.length; i++) {
        const pcContainer = document.createElement('div');
        pcContainer.className = 'pc-container';
        pcContainer.setAttribute('data-id', pcsData[i].id_Pc);

        //PRACTICA 5 
        /* Se le asigno a la constante un atributo para llamar al id de
        estado de los ordenadores ----- 13 de febrero de 2024 */
        pcContainer.setAttribute('data-estado', pcsData[i].estado);

        const imagen = document.createElement('img');
        imagen.src = pcsData[i].estado === 'Disponible' ? 'img/ordenador1.png' : 'img/ordenador.png';
        imagen.alt = `PC ${pcsData[i].id_Pc}`;
        imagen.width = 100;
        imagen.height = 100;


        //PRACTICA 6
        /* Se le asigna el evento mousedown al contenedor de la imagen, con el fin 
        de prepararla para moverla al momento de presionar el boton del mouse. También 
        se asigna la distancia del mouse tanto horizontal como vertical. 
        ----- 19 de febrero de 2024*/
        pcContainer.addEventListener('mousedown', function(){
            let shiftX = event.clientX - pcContainer.getBoundingClientRect().left;
            let shiftY = event.clientY - pcContainer.getBoundingClientRect().top;

            /* Absolute nos permite posicionar en cualquier parte del DOM al contenedor 
            y zIndex nos permite posicionarlo sobre otros elementos.
            ----- 19 de febrero de 2024*/
            pcContainer.style.position = 'absolute';
            pcContainer.style.zIndex = 1000;
            document.body.append(pcContainer);

            moveAt(event.pageX, event.pageY);

            /* Función que ctualiza las coordenadas del contenedor en función de las 
            coordenadas del mouse. ----- 19 de febrero de 2024*/
            function moveAt(pageX, pageY){
                pcContainer.style.left = pageX - shiftX + 'px';
                pcContainer.style.top = pageY - shiftY + 'px';
            }

            /* Función que se ejecuta cuando se mueve el mouse. Esta función llama 
            a funMoveAt() con las coordenadas actuales del mouse. ----- 19 de febrero 
            de 2024*/
            function onMouseMove(event){
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            /* Se le asigna al contenedor el evento onmouseup que permite que se
            detenga el arrastre cuando se suelta el botón del mouse. -----
            19 de febrero de 2024 */
            pcContainer.onmouseup = function(){
                document.removeEventListener('mousemove', onMouseMove);
                pcContainer.onmouseup = null;
                funCambiarEstadoPC(pcsData[i].id_Pc, pcContainer);
            };
        });

        /* Esto evita que el navegador realice acciones predeterminadas relacionadas 
        con el arrastre del contenedor. ----- 19 de febrero de 2024 */
        pcContainer.ondragstart = function(){
            return false;
        };

        const pcInfoCard = document.createElement('div');
        pcInfoCard.className = 'pc-info-card';
        pcInfoCard.innerHTML = `
            <p><strong>Nombre:</strong> ${pcsData[i].nombre}</p>
            <p><strong>Modelo:</strong> ${pcsData[i].modelo}</p>
            <p><strong>Número de Serie:</strong> ${pcsData[i].numSerie}</p>
            <p><strong>Teclado:</strong> ${pcsData[i].teclado}</p>
            <p><strong>Mouse:</strong> ${pcsData[i].mouse}</p>
            <p><strong>Observaciones:</strong> ${pcsData[i].observaciones}</p>
            <p><strong>Estado:</strong> ${pcsData[i].estado}</p>
        `;

        pcContainer.appendChild(imagen);
        pcContainer.appendChild(pcInfoCard);

        pcContainer.addEventListener('mouseover', () => funMostrarDatosPc(pcInfoCard));
        pcContainer.addEventListener('mouseout', () => funOcultarDatosPc(pcInfoCard));

        //PRACTICA 5
        /* Se agrego un evento para cambiar el estado y la imagen de los ordenadores
        al darle clic. ----- 13 de febrero de 2024*/
        pcContainer.addEventListener('click', (event) => {
            // Evitar que el clic en la imagen active el arrastre
            event.stopPropagation();
            
            // Llamar a la función para cambiar el estado de la PC
            funCambiarEstadoPC(pcsData[i].id_Pc, pcContainer);
        });

        pcImageDiv.appendChild(pcContainer);

        // Actualizar el contador
        if (pcsData[i].estado === 'Disponible') {
            disponibles++;
        } else {
            fueraDeServicio++;
        }
    }

    // Mostrar totales
    funUpdateTotals(disponibles, fueraDeServicio);
}

//PRACTICA 5
/* Se creo una función para actualizar el estado de los ordenadores
----- 13 de febrero de 2024*/
function funCambiarEstadoPC(id_pc, pcContainer) {
    // Verificar que el contenedor de imagen tenga los atributos necesarios
    if (!pcContainer || !pcContainer.hasAttribute('data-id') || !pcContainer.hasAttribute('data-estado')) {
        console.error('Error: El contenedor de imagen no tiene los atributos necesarios.');
        return;
    }

    // Obtener el estado actual del contenedor de la imagen
    const estadoActual = pcContainer.getAttribute('data-estado');

    // Determinar el nuevo estado
    const nuevoEstado = estadoActual === 'Disponible' ? 'Fuera de Servicio' : 'Disponible';

    // Actualizar el estado en el contenedor de la imagen
    pcContainer.setAttribute('data-estado', nuevoEstado);

    // Obtener la imagen dentro del contenedor
    const imagen = pcContainer.querySelector('img');

    // Verificar que se encontró la imagen
    if (!imagen) {
        console.error('Error: No se encontró la imagen dentro del contenedor.');
        return;
    }

    // Determinar la nueva imagen
    const nuevaImagen = nuevoEstado === 'Disponible' ? 'img/ordenador1.png' : 'img/ordenador.png';

    // Actualizar la imagen
    imagen.src = nuevaImagen;

    // Enviar solicitud PUT a la API REST para actualizar el estado en la base de datos
    fetch(`http://localhost/P4JS_MayLeysly_ITI8A/api/index.php?id_Pc=${id_pc}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            estado: nuevoEstado
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error(data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

function funMostrarDatosPc(pcInfoCard) {
    pcInfoCard.style.display = 'block';
}

function funOcultarDatosPc(pcInfoCard) {
    pcInfoCard.style.display = 'none';
}

function funAcomodarPcs() {
    const disponibles = document.querySelectorAll('.pc-container[data-estado="Disponible"]');
    const fueraDeServicio = document.querySelectorAll('.pc-container[data-estado="Fuera de Servicio"]');

    funAcomodarEnFilas('Disponibles', disponibles);
    funAcomodarEnFilas('Fuera de Servicio', fueraDeServicio);
}

function funAcomodarEnFilas(estado, pcs) {
    const pcImageDiv = document.getElementById("pcImage");
    const pcContainers = document.querySelectorAll(".pc-container");

    // Limpiar el contenido anterior
    pcImageDiv.innerHTML = "";

    const totalsDiv = document.getElementById("totals");

    const filas = Math.ceil(pcContainers.length / 10);

    for (let i = 0; i < filas; i++) {
        const filaDiv = document.createElement("div");
        filaDiv.className = "fila";

        for (let j = 0; j < 10; j++) {
            const index = i * 10 + j;
            if (index < pcContainers.length) {
                filaDiv.appendChild(pcContainers[index].cloneNode(true));
            }
        }

        pcImageDiv.appendChild(filaDiv);
    }

    console.log("Acomodo en filas completado.");
}

function funMostrarDatosPc(pcInfoCard) {
    pcInfoCard.style.display = 'block';
}

function funOcultarDatosPc(pcInfoCard) {
    pcInfoCard.style.display = 'none';
}