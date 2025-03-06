console.log("hello");
const $container = document.querySelector(".containerWithDisplay");
const $btn = document.getElementById("btn");
const $turnos = document.getElementById("sectionTurnos");
const $turnosGuardados = document.getElementById("turnosGuardados");
const $icon = document.querySelector(".iconForForm");

$btn.addEventListener("click", function () {
  console.log("agregar nuevo turno");
  createTurno();
});

function createTurno() {
  let div = document.createElement("div");
  div.setAttribute("id", "formularioTurno");
  div.innerHTML = `
  <div id="turnos">
        <div id="secondTurn"> 
          <h2 id="textFormulario">Agregando nuevo turno:</h2>
          <!-- Nombre de cliente -->
          <p id="nameText"">Nombre de cliente:</p>
          <input type="text" id="name" placeholder="Nombre:">

          <!-- Opciones uñas o peluqueria -->
          <select name="uñas" id="select">
            <option value="uñas">Uñas</option>
            <option value="peluqueria">Peluqueria</option>
          </select>

          <!-- Fecha y hora -->
          <p id="dateTime">Fecha y hora de turno:</p>
          <div class="timedate"><input type="date" id="date"> <input type="time" id="time"></div>

          <!-- Motivo de turno -->
          <input type="text" id="motive" placeholder="Motivo del turno:">
        </div>

        <!-- Boton agregar -->
        <button id="add">Agregar</button>
      </div>`;
  $turnos.appendChild(div);
  if ($turnos) {
    $container.style.display = "none";
    $icon.style.display = "block";
  } else {
    $container.style.display = "block";
  }

  //agregar fecha y hora inicial
  const fecha = new Date().toISOString().split("T")[0];
  document.getElementById("date").value = fecha;

  const hora = new Date().toTimeString().slice(0, 5);
  document.getElementById("time").value = hora;

  //Boton para agregar turno seleccionandolo el elemento DOM desde el div

  const $btnAdd = div.querySelector("#add");
  $btnAdd.addEventListener("click", function () {
    saveTurno();
  });
}

//Convirtiendo los datos en array para luego ordenar por fecha

let turnos = JSON.parse(localStorage.getItem("dataTurnos")) || [];
console.log(localStorage.getItem("dataTurnos"));
// Carga los turnos del localStorage

//guardar los turnos como objetos en un array para facilitar la manipulacion de datos
function saveTurno() {
  // Crear un nuevo turno como objeto
  const nuevoTurno = {
    fecha: document.getElementById("date").value,
    hora: document.getElementById("time").value,
    clienta: document.getElementById("name").value,
    seccion: document.getElementById("select").value,
    motivo: document.getElementById("motive").value,
  };

  // Agregar el turno al array
  turnos.push(nuevoTurno);

  saveData();
  renderTurnos();

  // Seleccionando y eliminando el formulario para nuevo turno
  const $formularioTurno = document.getElementById("formularioTurno");
  $formularioTurno.remove();
}

function saveData() {
  localStorage.setItem("dataTurnos", JSON.stringify(turnos));
}

function getData() {
  renderTurnos(); // Renderizar los turnos almacenados
}

function renderTurnos() {
  if (turnos.length > 0) {
    $container.style.display = "none";
    $icon.style.display = "block";
  } else {
    $container.style.display = "block";
    $icon.style.display = "none";
  }
  // Ordenar los turnos por fecha
  turnos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  //Ordenar los turnos por hora

  turnos.sort((a, b) => new Date(a.hora) - new Date(b.hora));

  ///(a,b) son dos elementos del array que se están comparando en cada paso de la ordenacion (en este caso, turnos)

  // El new date () transforma las fechas en valores numericos que representan la cantidad de milisegundos desde el 1 de enero de 1970 (epoca unix);

  // al restar las dos fechas:
  // si el resultado es negativo (-), significa que A debe ir antes que B
  // si el resultado es positivo (+), significa que A debe ir despues de B
  // si el resultado es 0, no cambia el orden

  // Limpiar el contenedor antes de renderizar
  $turnosGuardados.innerHTML = "";

  // Renderizar cada turno en el DOM
  turnos.forEach((turno, index) => {
    let turnoDiv = document.createElement("div");
    turnoDiv.setAttribute("id", "turnoDiv");
    turnoDiv.innerHTML = `
        <div id="dataturnos">
          <div id="sectionData">
            <h2 id="h1DataTurnos">Turno pendiente:</h2>
            <div id="saveData">
            <p>Fecha: ${turno.fecha} <br>
               Hora: ${turno.hora} <br>
               Clienta: ${turno.clienta} <br>
               Seccion: ${turno.seccion} <br>
               Motivo: ${turno.motivo} <br>
              <button id="delete-${index}" class="delete">
              Delete turno
              </button>
            </div>
          </div>
        </div>`;
    $turnosGuardados.appendChild(turnoDiv);

    //Seleccionar el boton de DOM de turnoDiv dependiendo de su indice

    const $delete = turnoDiv.querySelector(`#delete-${index}`);
    $delete.addEventListener("click", function () {
      deleteTurno(index);
    });
  });
}

function deleteTurno(index) {
  turnos.splice(index, 1); // Eliminar el turno del array
  saveData();
  renderTurnos(); // Actualizar el DOM
}

getData();
