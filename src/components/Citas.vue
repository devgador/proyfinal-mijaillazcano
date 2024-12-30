<template>
  <div class="page-container">
    <h2 class="text-primary mb-4">CITAS</h2>

    <div class="card">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="input-cliente">Cliente: </label>
            <input 
              type="text" 
              class="form-control" 
              id="input-cliente"
              v-model="busqueda" 
              placeholder="Buscar cita por cliente" 
            />
          </div>
          <div class="col-md-3">
            <label for="input-filtro">Desde fecha: </label>
            <input 
              type="date" 
              class="form-control" 
              id="input-filtro"
              v-model="fechaFiltro" 
              placeholder="Filtrar desde" 
            />
          </div>
          <div class="col-md-3">
            <button class="btn btn-primary mb-3" @click="abrirModal()">
              <i class="bi bi-calendar2-date"></i><span>  Agregar Cita</span>
            </button>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Barbero</th>
              <th>Servicio</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cita in citasFiltradas" :key="cita.id">
              <td>{{ cita.id }}</td>
              <td>{{ getClienteNombre(cita.clienteId) }}</td>
              <td>{{ getBarberoNombre(cita.barberoId) }}</td>
              <td>{{ cita.servicio }}</td>
              <td>{{ cita.fecha }}</td>
              <td>
                <button @click="abrirModal(cita)" class="btn btn-warning btn-sm"><i class="bi bi-pencil-square"></i><span> Editar</span></button>
                <button @click="eliminarCita(cita.id)" class="btn btn-danger btn-sm"><i class="bi bi-eraser-fill"></i><span> Eliminar</span></button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Modal -->
        <div class="modal fade" id="modalCita" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ cita.id ? 'Editar Cita' : 'Añadir Cita' }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="guardarCita">
                  <div class="mb-3">
                    <label for="cliente" class="form-label">Cliente</label>
                    <select id="cliente" v-model="cita.clienteId" class="form-control" required>
                      <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
                        {{ cliente.nombre }}
                      </option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label for="barbero" class="form-label">Barbero</label>
                    <select id="barbero" v-model="cita.barberoId" class="form-control" required>
                      <option v-for="barbero in barberos" :key="barbero.id" :value="barbero.id">
                        {{ barbero.nombre }}
                      </option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label for="servicio" class="form-label">Servicio</label>
                    <input type="text" id="servicio" v-model="cita.servicio" class="form-control" required />
                  </div>
                  <div class="mb-3">
                    <label for="fecha" class="form-label">Fecha</label>
                    <input type="datetime-local" id="fecha" v-model="cita.fecha" class="form-control" required />
                  </div>
                  <button type="submit" class="btn btn-primary">Guardar</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';
import { Modal } from 'bootstrap';

export default {
  data() {
    return {
      citas: [],
      cita: {
        id: null,
        clienteId: null,
        barberoId: null,
        servicio: '',
        fecha: ''
      },
      clientes: [],
      barberos: [],
      busqueda: '',
      fechaFiltro: '',  // Nueva variable para almacenar la fecha de filtro
    };
  },
  computed: {
    citasFiltradas() {
      // Filtramos por cliente y fecha
      return this.citas.filter((cita) => {
        const clienteCoincide = this.getClienteNombre(cita.clienteId).toLowerCase().includes(this.busqueda.toLowerCase());
        const fechaCoincide = this.fechaFiltro ? new Date(cita.fecha) >= new Date(this.fechaFiltro) : true;
        return clienteCoincide && fechaCoincide;
      });
    },
  },
  methods: {
    async cargarCitas() {
      const response = await api.get('/citas');
      this.citas = response.data;
    },
    async cargarClientes() {
      const response = await api.get('/clientes');
      this.clientes = response.data;
    },
    async cargarBarberos() {
      const response = await api.get('/barberos');
      this.barberos = response.data;
    },
    getClienteNombre(clienteId) {
      const cliente = this.clientes.find(c => c.id === clienteId);
      return cliente ? cliente.nombre : '';
    },
    getBarberoNombre(barberoId) {
      const barbero = this.barberos.find(b => b.id === barberoId);
      return barbero ? barbero.nombre : '';
    },
    abrirModal(cita = { id: null, clienteId: null, barberoId: null, servicio: '', fecha: '' }) {
      this.cita = { ...cita };
      const modalElement = document.getElementById('modalCita');
      const modal = new Modal(modalElement);
      modal.show();
    },
    cerrarModal() {
      const modalElement = document.getElementById('modalCita');
      const modalInstance = Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    },
    async guardarCita() {
      if (this.cita.id) {
        await api.put(`/citas/${this.cita.id}`, this.cita);
      } else {
        await api.post('/citas', this.cita);
      }
      this.cargarCitas();
      this.cerrarModal();
    },
    async eliminarCita(id) {
      await api.delete(`/citas/${id}`);
      this.cargarCitas();
    }
  },
  created() {
    this.cargarCitas();
    this.cargarClientes();
    this.cargarBarberos();
  }
};
</script>
