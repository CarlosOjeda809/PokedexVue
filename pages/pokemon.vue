<template>
  <div class=" mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <button>
        <NuxtLink :to="{ name: 'index' }"><Icon name="material-symbols:arrow-back-rounded" class="text-3xl  "></Icon></NuxtLink>
      </button>
        <div class="flex items-center">
      
    </div>
    </div>
    <div class="flex justify-between items-center mb-4">
      <div>
      <h1 class="text-2xl font-bold capitalize">{{ pokemon.name }}</h1>
      <ul class="flex space-x-2 mt-2 justify-center"> 
        <li 
        v-for="type in pokemon.types" 
        :key="type" 
        class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
        >
        {{ type }}
        </li>
      </ul>
      </div>
      <h1 class="text-xl font-bold capitalize text-gray-500">#{{ pokemon.id }}</h1>
    </div>
      <img :src="pokemon.sprite" :alt="pokemon.name" class="w-32 h-32 mx-auto mb-4" />

      <div class="flex justify-center border-b mb-4">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'px-4 py-2 text-sm font-semibold',
            activeTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          ]"
        >
          {{ tab }}
        </button>
      </div>

      <div v-if="activeTab === 'About'">
        <p class="text-gray-700 text-base ">Altura: {{ pokemon.height }} m</p>
        <p class="text-gray-700 text-base ">Peso: {{ pokemon.weight }} kg</p>
        <p class="text-gray-700 text-base ">Experiencia base: {{ pokemon.exp }}</p>
        <div class="flex items-center text-gray-700 text-base ">
          <p>Habilidades:</p>
          <ul class="flex flex-wrap ml-2">
            <li
              v-for="ability in pokemon.abilities"
              :key="ability"
              class="text-gray-700 mr-2 mb-2"
            >
              {{ ability }}
            </li>
          </ul>
          
        </div>
        <br>
        <h1 class="text-xl font-bold ">Breeding</h1>
        <p class="text-gray-700 text-base ">Género  : {{ pokemon.gender }} </p>
        <p class="text-gray-700 text-base ">Peso: {{ pokemon.eggGroups }} kg</p>
        <p class="text-gray-700 text-base ">Experiencia base: {{ }}</p>
        
        
      </div>

      <div v-if="activeTab === 'Base Stats'">
        <h2 class="text-xl font-semibold text-center mb-4">Base Stats</h2>
        <ul class="flex flex-col items-start">
          <li
        v-for="stat in pokemon.stats"
        :key="stat.name"
        class="flex items-center justify-between w-full text-gray-700 text-base mb-2"
          >
        <span class="capitalize w-1/4">{{ stat.name }}</span>
        <span class="w-1/4 text-center">{{ stat.value }}</span>
        <div class="relative w-1/2 h-[5px] bg-gray-200 rounded-full">
          <div
            class="absolute h-[5px] bg-green-500 rounded-full"
            :style="{width: `${(stat.value /255)*100}%`}"
          ></div>
        </div>
          </li>
        </ul>
      </div>

      <div v-if="activeTab === 'Evolution'">
        <h2 class="text-xl font-semibold text-center mb-4">Evolution</h2>
        <p class="text-gray-700 text-center">Información de evolución no disponible en este endpoint.</p>
      </div>

      <div v-if="activeTab === 'Moves'">
        <h2 class="text-xl font-semibold text-center mb-4">Moves</h2>
        <ul class="flex flex-wrap justify-center">
          <li
            v-for="move in pokemon.moves"
            :key="move"
            class="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >
            {{ move }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useFetch } from '#app';
import { ref } from 'vue';
import Button from '@nuxt/ui/runtime/components/Button.vue';


const tabs = ['About', 'Base Stats', 'Evolution', 'Moves'];
const activeTab = ref('About'); 

const route = useRoute();
const pokemonName = route.query.name;

if (!pokemonName) {
  console.error('No se proporcionó el nombre del Pokémon en la URL.');
}

const { data: pokemonData, error } = await useFetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

if (error.value) {
  console.error('Error al obtener los datos del Pokémon:', error.value);
}

const pokemon = {
  name: pokemonData.value?.name || 'Desconocido',
  id: pokemonData.value?.id || 'N/A',
  exp: pokemonData.value?.base_experience || 'N/A',
  abilities: pokemonData.value?.abilities.map((ability) => ability.ability.name) || [],
  sprite: pokemonData.value?.sprites.front_default || '',
  height: pokemonData.value?.height / 10 || 'N/A',
  weight: pokemonData.value?.weight / 10 || 'N/A',
  gender: pokemonData.value?.gender || 'N/A',
  eggGroups: pokemonData.value?.egg_groups || [],
  types: pokemonData.value?.types.map((type) => type.type.name) || [],
  stats: pokemonData.value?.stats.map((stat) => ({
    name: stat.stat.name,
    value: stat.base_stat,
  })) || [],
  moves: pokemonData.value?.moves.map((move) => move.move.name) || [],
};
</script>