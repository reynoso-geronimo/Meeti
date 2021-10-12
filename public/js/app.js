import { OpenStreetMapProvider } from "leaflet-geosearch";

const lat = -33.689844;
const lng = -59.676162;
const map = L.map("mapa").setView([lat, lng], 15);
let markers = new L.FeatureGroup().addTo(map);
let marker;

document.addEventListener("DOMContentLoaded", () => {
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  //buscar la direccion
  const buscador = document.querySelector("#formbuscador");
  buscador.addEventListener("input", buscarDireccion);
});

function buscarDireccion(e) {
  if (e.target.value.length > 8) {
  
    //limpiar pin anterior
    markers.clearLayers();

    //utilizar el provider y geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    const provider = new OpenStreetMapProvider();
    provider.search({ query: e.target.value }).then((resultado) => {
      geocodeService.reverse().latlng(resultado[0].bounds[0], 15).run(function (error, result) {
        llenarInputs(result)


          map.setView(resultado[0].bounds[0], 15);

          //agregar el pin
          marker = new L.marker(resultado[0].bounds[0], {
            draggable: true,
            autoPan: true,
          })

            .bindPopup(resultado[0].label)
            .openPopup();
          //asignar al contenedor makers
          markers.clearLayers();
          markers.addLayer(marker);
          //detectar movimiento del marker
          marker.on("moveend", function (e) {
            marker = e.target;
            const posicion = marker.getLatLng();
            map.panTo(new L.LatLng(posicion.lat, posicion.lng));
            //reverse geocoding cuando el usuario reubica el ping
            geocodeService.reverse().latlng(posicion,15).run(function(error,result){
            
              marker.bindPopup(result.address.LongLabel)
              llenarInputs(result)
            })
          });
        });
    });
  }
}
function llenarInputs(resultado){
  document.querySelector('#direccion').value = resultado.address.Address ||''
  document.querySelector('#ciudad').value = resultado.address.City ||''
  document.querySelector('#estado').value = resultado.address.Region ||''
  document.querySelector('#pais').value = resultado.address.CountryCode ||''
  document.querySelector('#lat').value = resultado.address.lat ||''
  document.querySelector('#lng').value = resultado.address.lng ||''
  
}
