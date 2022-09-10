<template>
  <div class="container" style="background-color: #eee; text-align: center;">
    <h1 v-if="error.statusCode === 404"><b>404</b></h1>
    <h1 v-if="error.statusCode === 404">Страница не найдена</h1>
    <h1 v-else>Ошибка</h1>
    <nuxt-link to="/">Вернуться на главную</nuxt-link>
  </div>
</template>

<script>
export default {
  props: ['error']
}
</script>