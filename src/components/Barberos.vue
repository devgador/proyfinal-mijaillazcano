<template>
  <div class="page-container">
    <h2 class="text-primary mb-4">BARBEROS</h2>

    <div class="row mb-3">
      <div class="col-md-9">
        <input 
          type="text" 
          class="form-control" 
          v-model="busqueda" 
          placeholder="Buscar barbero por nombre" 
        />
      </div>
      <div class="col-md-3">
        <button class="btn btn-primary " @click="abrirModal()"><i class="bi bi-person-fill-add"></i><span>  Agregar Barbero</span></button>
      </div>
    </div>

    

    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Especialidad</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="barbero in barberosFiltrados" :key="barbero.id">
          <td>{{ barbero.id }}</td>
          <td>{{ barbero.nombre }}</td>
          <td>{{ barbero.especialidad }}</td>
          <td>
            <button @click="abrirModal(barbero)" class="btn btn-warning btn-sm"><i class="bi bi-pencil-square"></i><span> Editar</span></button>
            <button @click="eliminarBarbero(barbero.id)" class="btn btn-danger btn-sm"><i class="bi bi-eraser-fill"></i><span> Eliminar</span></button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div class="modal fade" id="modalBarbero" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ barbero.id ? 'Editar Barbero' : 'Añadir Barbero' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarBarbero">
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" id="nombre" v-model="barbero.nombre" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="especialidad" class="form-label">Especialidad</label>
                <input type="text" id="especialidad" v-model="barbero.especialidad" class="form-control" required />
              </div>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </form>
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
      barberos: [],
      barbero: { id: null, nombre: '', especialidad: '' },
      busqueda: '',
    };
  },
  computed: {
    barberosFiltrados() {
      return this.barberos.filter((barbero) =>
        barbero.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    },
  },
  methods: {
    async cargarBarberos() {
      const response = await api.get('/barberos'); // Aquí se hace la consulta a la API que te trae los barberos
      this.barberos = response.data;
    },
    abrirModal(barbero = { id: null, nombre: '', especialidad: '' }) {
      this.barbero = { ...barbero };        
      const modalElement = document.getElementById('modalBarbero');
      const modal = new Modal(modalElement);
      modal.show();
    },
    cerrarModal() {
      const modalElement = document.getElementById('modalBarbero');
      const modalInstance = Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    },
    async guardarBarbero() {
      if (this.barbero.id) {
        await api.put(`/barberos/${this.barbero.id}`, this.barbero);
      } else {
        await api.post('/barberos', this.barbero);
      }
      this.cargarBarberos();
      this.cerrarModal();
    },
    async eliminarBarbero(id) {
      await api.delete(`/barberos/${id}`);
      this.cargarBarberos();
    },
  },
  created() {
    this.cargarBarberos();
  },
};
</script>
