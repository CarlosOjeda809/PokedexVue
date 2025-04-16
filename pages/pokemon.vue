<script setup>
import { useRoute } from 'vue-router';
import { useFetch } from '#app';
import Spinner from '@/components/spinner.vue';

const route = useRoute();
const pokemonName = route.query.name;

const tabs = ['About', 'Base Stats', 'Evolution', 'Moves'];

const activeTab = ref('About');
const isFavorite = ref(false);
const pokemonData = ref(null);
const pokemon = ref({});
const favoritos = ref([]);
const loading = ref(true);
const { data, error } = await useFetch(`${API_URL}/pokemon/${pokemonName}`);

onMounted(async () => {
  if (!pokemonName) {
    console.error('No se proporcionó el nombre del Pokémon en la URL.');
    return;
  }

  if (error.value) {
    console.error('Error al obtener los datos del Pokémon:', error.value);
    return;
  }
  pokemonData.value = data.value;

  const genero = await generoPokemon(pokemonName);
  const generoProb = await genderRate(pokemonName);
  const evolutionChain = await cadenaEvolutiva(pokemonName);

  pokemon.value = {
    name: pokemonData.value?.name || 'Desconocido',
    id: pokemonData.value?.id || 'N/A',
    exp: pokemonData.value?.base_experience || 'N/A',
    abilities: pokemonData.value?.abilities.map((ability) => ability.ability.name) || [],
    sprite: pokemonData.value?.sprites.front_default || '',
    height: pokemonData.value?.height / 10 || 'N/A',
    weight: pokemonData.value?.weight / 10 || 'N/A',
    gender: genero,
    genderRate: generoProb,
    evolution: evolutionChain,
    types: pokemonData.value?.types.map((type) => type.type.name) || [],
    stats: pokemonData.value?.stats.map((stat) => ({
      name: stat.stat.name,
      value: stat.base_stat,
    })) || [],
    moves: pokemonData.value?.moves.map((move) => move.move.name) || [],
  };

  obtenerFavoritos();
  isFavorite.value = favoritos.value.includes(pokemon.value.name);
  loading.value = false;
});

const obtenerFavoritos = () => {
  const favData = localStorage.getItem('favoritos');
  favoritos.value = favData ? JSON.parse(favData) : [];
};

const guardarFavoritos = (favs) => {
  localStorage.setItem('favoritos', JSON.stringify(favs));
};

const toggleFavorito = () => {
  obtenerFavoritos();
  if (isFavorite.value) {
    const nuevosFavoritos = favoritos.value.filter((nombre) => nombre !== pokemon.value.name);
    guardarFavoritos(nuevosFavoritos);
    favoritos.value = nuevosFavoritos;
    isFavorite.value = false;
  } else {
    favoritos.value.push(pokemon.value.name);
    guardarFavoritos(favoritos.value);
    isFavorite.value = true;
  }
};
</script>

<template>
  <!-- CARGANDO... -->
  <div v-if="loading" >
    <Spinner />
  </div>

  <!-- PARTE DE ARRIBA -->
  <div v-if="!loading" class="mx-auto relative " :class="pokemon.types[0]">
    <div class="p-6">
      <div class="flex justify-between items-center mb-4 ">
        <NuxtLink :to="{ name: 'index' }">
          <Icon name="material-symbols:arrow-back-rounded" class="text-3xl"></Icon>
        </NuxtLink>
        <button @click="toggleFavorito" class="cursor-pointer">
          <Icon :name="isFavorite ? 'material-symbols:favorite' : 'material-symbols:favorite-outline'"
            class="text-3xl mt-2 hover:text-red-500" :class="{ 'text-red-500': isFavorite }" />
        </button>
      </div>

      <div class="flex justify-between items-center mb-[15%]">
        <div>
          <h1 class="text-4xl font-semibold capitalize text-white">{{ pokemon.name }}</h1>
          <ul class="flex space-x-2 mt-2 justify-center">
            <li v-for="type in pokemon.types" :key="type"
              class="inline-block bg-gray-100/30 rounded-full px-3 text-md text-white">
              {{ MayusculaLetra(type) }}
            </li>
          </ul>
        </div>
        <h1 class="text-2xl font-bold capitalize text-white">#{{ pokemon.id }}</h1>
      </div>
      

      <!-- PARTE DE ABAJO -->
      <div class="bg-white rounded-t-[25px] w-[100%] absolute left-0">
        <div class="flex justify-center border-b border-gray-300">
          <div class="flex justify-between w-full ml-10 mr-10 mt-5">
            <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" :class="[ 
              'px-4 py-2 text-md font-semibold transition-colors duration-200 cursor-pointer hover:text-gray-400',
              activeTab === tab ? 'border-b-2 text-[17px]' : 'text-gray-300',
            ]">
              {{ tab }}
            </button>
          </div>
        </div>

        <!-- ABOUT -->
        <div v-if="activeTab === 'About'" class="p-8">
          <Spinner v-if="loading" />
          <div class="flex">
            <ul class="flex flex-col gap-5 text-xl text-gray-500">
              <li>Altura:</li>
              <li>Peso:</li>
              <li>EXP Base:</li>
              <li>Habilidades:</li>
            </ul>
            <ul class="flex flex-col gap-5 text-xl ml-20">
              <li>{{ pokemon.height }} m</li>
              <li>{{ pokemon.weight }} kg</li>
              <li>{{ pokemon.exp }}</li>
              <li>
                <div class="flex flex-wrap gap-2">
                  <span v-for="(ability, index) in pokemon.abilities" :key="ability" class="text-gray-700 capitalize">
                    {{ ability }}<span v-if="index < pokemon.abilities.length - 1">,</span>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div style="font-family: 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif">
            <h1 class="text-2xl font-bold mt-8 mb-8">Breeding</h1>
            <div class="flex">
              <ul class="flex flex-col gap-5 text-xl text-gray-500">
                <li>Género:</li>
                <li>GenderRate:</li>
              </ul>
              <ul class="flex flex-col gap-4 text-gray-700 text-xl ml-32">
                <li>{{ MayusculaLetra(pokemon.gender) }}</li>
                <li class="flex flex-wrap gap-2 xs:flex-col items-center">
                  <Icon name="material-symbols:male" class=" text-blue-500" />{{ pokemon.genderRate.masculino }}
                  <Icon name="material-symbols:female" class="text-pink-500" /> {{ pokemon.genderRate.femenino }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- BASE STATS -->
        <div v-if="activeTab === 'Base Stats'" class="p-8">
          <Spinner v-if="loading" />
          <ul class="flex flex-col gap-4">
            <li v-for="stat in pokemon.stats" :key="stat.name"
              class="flex items-center justify-between w-full text-gray-700 text-xl ">
              <span class="capitalize w-1/4">{{ stat.name }}</span>
              <span class="w-1/4 text-center">{{ stat.value }}</span>
              <div class="relative w-1/2 h-[5px] bg-gray-200 rounded-full">
                <div class="absolute h-[5px] bg-green-500 rounded-full"
                  :style="{ width: `${(stat.value / 255) * 100}%` }">
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- EVOLUTION -->
        <div v-if="activeTab === 'Evolution'" class="p-8">
          <Spinner v-if="loading" />
          <ul class="flex flex-col items-start space-y-4 shadow-xl rounded-2xl p-5">
            <li v-for="evolucion in pokemon.evolution" :key="evolucion.id" class="flex items-center space-x-4 ">
              <img :src="evolucion.sprite" :alt="evolucion.name" class="w-30 h-30 rounded-full" />
              <div>
                <p class="font-semibold">{{ MayusculaLetra(evolucion.name) }}</p>
                <p v-if="evolucion.level" class="text-sm text-gray-500">
                  Nivel: {{ evolucion.level }}
                </p>

              </div>
            </li>
          </ul>
        </div>

        <!-- MOVES -->
        <div v-if="activeTab === 'Moves'">
          <Spinner v-if="loading" />
          <ul class="flex flex-col gap-4 p-8">
            <li v-for="move in pokemon.moves" :key="move"
              class="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              {{ MayusculaLetra(move) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <img :src="pokemon.sprite" class="absolute top-[42%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] z-10">
</template>
