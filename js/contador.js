function funUpdateTotals(disponibles, fueraDeServicio) {
    const totalsDiv = document.getElementById('totals');
    totalsDiv.innerHTML = `Totales Disponibles: ${disponibles} | Totales Fuera de Servicio: ${fueraDeServicio}`;
}