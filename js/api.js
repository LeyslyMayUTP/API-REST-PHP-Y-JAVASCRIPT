/* Esta función permite realizar una solicitud GET a la URL especificada
en este caso a traves de la palabra clave fetch
----- 04 de febrero de 2024*/
function funFetchData() {
    return fetch('http://localhost/P4JS_MayLeysly_ITI8A/api/index.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        });
}