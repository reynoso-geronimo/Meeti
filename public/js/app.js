import { OpenStreetMapProvider } from "leaflet-geosearch";
import asistencia from "./asistencia"
import eliminarComentario from "./eliminarComentario"

//obtener valores de la base de datos

const lat =document.querySelector('#lat').value || -33.689844;
const lng =document.querySelector('#lng').value || -59.676162;
const direccion= document.querySelector('#direccion').value||''
const map = L.map("mapa").setView([lat, lng], 15);
let markers = new L.FeatureGroup().addTo(map);
let marker;

    //utilizar el provider y geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

//colocar el ping en edicion

if(lat && lng ){
    //agregar el pin
    marker = new L.marker([lat, lng], {
      draggable: true,
      autoPan: true,
    })
      .addTo(map)
      .bindPopup(direccion)
      .openPopup();
    //asignar al contenedor makers
    markers.clearLayers();
    markers.addLayer(marker);

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
}

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
  document.querySelector('#lat').value = resultado.latlng.lat ||''
  document.querySelector('#lng').value = resultado.latlng.lng ||''
  
  
}
