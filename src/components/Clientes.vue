<template>
  <div class="page-container">
    <h2 class="text-primary mb-4">CLIENTES</h2>

    <div class="row mb-3">
      <div class="col-md-9">
        <input 
          type="text" 
          class="form-control" 
          v-model="busqueda" 
          placeholder="Buscar cliente por nombre" 
        />
      </div>
      <div class="col-md-3">
        <button class="btn btn-primary mb-3" @click="abrirModal()"><i class="bi bi-person-fill-add"></i><span>  Agregar Cliente</span></button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cliente in clientesFiltrados" :key="cliente.id">
          <td>{{ cliente.id }}</td>
          <td>{{ cliente.nombre }}</td>
          <td>{{ cliente.email }}</td>
          <td>
            <button @click="abrirModal(cliente)" class="btn btn-warning btn-sm"><i class="bi bi-pencil-square"></i><span> Editar</span></button>
            <button @click="eliminarCliente(cliente.id)" class="btn btn-danger btn-sm"><i class="bi bi-eraser-fill"></i><span> Eliminar</span></button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="modal fade" id="modalCliente" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ cliente.id ? 'Editar Cliente' : 'Añadir Cliente' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarCliente">
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" id="nombre" v-model="cliente.nombre" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" v-model="cliente.email" class="form-control" required />
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
      clientes: [],
      cliente: { id: null, nombre: '', email: '' },
      busqueda: '',
    };
  },
  computed: {
    clientesFiltrados() {
      return this.clientes.filter((cliente) =>
        cliente.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    },
  },
  methods: {
    async cargarClientes() {
      const response = await api.get('/clientes');
      this.clientes = response.data;
    },
    abrirModal(cliente = { id: null, nombre: '', email: '' }) {
      this.cliente = { ...cliente };
      const modalElement = document.getElementById('modalCliente');
      const modal = new Modal(modalElement);
      modal.show();
    },
    cerrarModal() {
      const modalElement = document.getElementById('modalCliente');
      const modalInstance = Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    },
    async guardarCliente() {
      if (this.cliente.id) {
        await api.put(`/clientes/${this.cliente.id}`, this.cliente);
      } else {
        await api.post('/clientes', this.cliente);
      }
      this.cargarClientes();
      this.cerrarModal();
    },
    async eliminarCliente(id) {
      await api.delete(`/clientes/${id}`);
      this.cargarClientes();
    },
  },
  created() {
    this.cargarClientes();
  },
};
</script>
