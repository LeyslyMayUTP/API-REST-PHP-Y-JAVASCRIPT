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

        const imagen = document.createElement('img');
        imagen.src = pcsData[i].estado === 'Disponible' ? 'img/ordenador1.png' : 'img/ordenador.png';
        imagen.alt = `PC ${pcsData[i].id_Pc}`;
        imagen.width = 100;
        imagen.height = 100;

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