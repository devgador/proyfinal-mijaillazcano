<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img src="/logo.jpeg" alt="Supermercado" class="navbar-logo" />
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarColor01">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
              <router-link to="/barberos" class="nav-link">Barberos</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/clientes" class="nav-link">Clientes</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/citas" class="nav-link">Citas</router-link>
            </li>   
        </ul>
        
      </div>
    </div>
  </nav> 
    <router-view />
  </div>
</template>
<style>
.navbar-logo{
  height: 60px;
  width: auto;
}
</style>
<script>
export default {
  name: 'App',
};
</script>

