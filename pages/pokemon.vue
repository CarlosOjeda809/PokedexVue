<template>
  <div :class="['mx-auto relativeshadow-lg rounded-lg overflow-hidden', pokemon.types[0]]">
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <NuxtLink :to="{ name: 'index' }"><Icon name="material-symbols:arrow-back-rounded" class="text-3xl"></Icon></NuxtLink>
        <button @click="isFavorite = !isFavorite;">
        <Icon 
          :name="isFavorite ? 'material-symbols:favorite' : 'material-symbols:favorite-outline'" 
          class="text-3xl mt-2"
        />
          
        </button>
      </div>
        <div class="flex items-center">
      

    </div>
    <div class="flex justify-between items-center mb-4">
      <div>
      <h1 class="text-4xl font-semibold capitalize text-white">{{ pokemon.name }}</h1>
      <ul class="flex space-x-2 mt-2 justify-center"> 
      <li 
      v-for="type in pokemon.types"   
      :key="type" 
      class="inline-block bg-gray-100/30 rounded-full px-3 text-md text-white mr-2 mb-2"
      >
      {{ MayusculaLetra(type) }}
      </li>
      </ul>
      </div>
      <h1 class="text-2xl font-bold capitalize text-gray-500 text-white">#{{ pokemon.id }}</h1>
    </div>
      <img :src="pokemon.sprite" :alt="pokemon.name" class="w-[200px] mx-auto mb-4" />
<div class="bg-white rounded-t-[25px] w-[100%] absolute left-0 h-[640px]">
      <div class="flex justify-center border-b border-gray-300 mb-4">
        <div class="flex justify-between w-full ml-10 mr-10 mt-5">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-4 py-2 text-md font-semibold',
              activeTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-300'
            ]"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <div v-if="activeTab === 'About'" class="ml-8 ">
        <p class="text-gray-700 text-xl mb-5 mt-5 font-[Times-New-Roman]">Altura: {{ pokemon.height }} m</p>
        <p class="text-gray-700 text-xl mb-5 font-[Times-New-Roman]">Peso: {{ pokemon.weight }} kg</p>
        <p class="text-gray-700 text-xl mb-5 font-[Times-New-Roman]">Experiencia base: {{ pokemon.exp }}</p>
        <div class="text-gray-700 text-xl mb-5 font-[Times-New-Roman]">
            <p class="mb-2">Habilidades: 
            <span
              v-for="(ability, index) in pokemon.abilities"
              :key="ability"
              class="text-gray-700 mr-2"
            >
              {{ ability }}<span v-if="index < pokemon.abilities.length - 1">,</span>
            </span>
            </p>
          
          
        </div>
        <br>
        <h1 class="text-xl font-bold ">Breeding</h1>
        <br>
        <p class="text-gray-700 text-xl mb-5 font-[Times-New-Roman]">Género: {{ MayusculaLetra(pokemon.gender) }} </p>
        <p class="text-gray-700 text-xl mb-5 font-[Times-New-Roman] flex items-center">
          GenderRate: 
          <Icon name="material-symbols:male" class=" text-blue-500" />{{ pokemon.genderRate.masculino }} 
          <Icon name="material-symbols:female" class="text-pink-500"/> {{ pokemon.genderRate.femenino }}
        </p>
        <p class="text-gray-700 text-xl mb-5 font-[Times-New-Roman]">Egg Groups: {{ MayusculaLetra(pokemon.eggGroups) }}</p>
        
        
        
      </div>

      <div v-if="activeTab === 'Base Stats'" class="ml-8">
        <ul class="flex flex-col items-start mt-6">
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

      <div v-if="activeTab === 'Evolution'" class="ml-8">
      <ul class="flex flex-col items-start space-y-4">
        <li
          v-for="evolucion in pokemon.evolution"
          :key="evolucion.id"
          class="flex items-center space-x-4"
        >
          <img
            :src="evolucion.sprite"
            :alt="evolucion.name"
            class="w-30 h-30 rounded-full"
          />
          <div>
            <p class="font-semibold">{{ MayusculaLetra(evolucion.name) }}</p>
            <p v-if="evolucion.level" class="text-sm text-gray-500">
              Nivel: {{ evolucion.level }}
            </p>
            <p v-else class="text-sm text-gray-500">Nivel: 1</p>
          </div>
        </li>
      </ul>
    </div>

      <div v-if="activeTab === 'Moves'">
        <ul class="flex flex-col space-y-2 mt-6">
          <li
            v-for="move in pokemon.moves"
            :key="move"
            class="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
          >
            {{ MayusculaLetra(move) }}
          </li>
        </ul>
      </div>
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
const isFavorite = ref(false); 

const route = useRoute();
const pokemonName = route.query.name;


if (!pokemonName) {
  console.error('No se proporcionó el nombre del Pokémon en la URL.');
}

const { data: pokemonData, error } = await useFetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

if (error.value) {
  console.error('Error al obtener los datos del Pokémon:', error.value);
}

const porcentajesGenero = await genderRate(pokemonData.value?.name);

const pokemon = {
  name: pokemonData.value?.name || 'Desconocido',
  id: pokemonData.value?.id || 'N/A',
  exp: pokemonData.value?.base_experience || 'N/A',
  abilities: pokemonData.value?.abilities.map((ability) => ability.ability.name) || [],
  sprite: pokemonData.value?.sprites.front_default || '',
  height: pokemonData.value?.height / 10 || 'N/A',
  weight: pokemonData.value?.weight / 10 || 'N/A',
  gender: await generoPokemon(pokemonData.value?.name) || 'N/A',
  genderRate: porcentajesGenero,
  eggGroups: await huevoPokemon(pokemonData.value?.name)|| [],
  types: pokemonData.value?.types.map((type) => type.type.name) || [],
  stats: pokemonData.value?.stats.map((stat) => ({
    name: stat.stat.name,
    value: stat.base_stat,
  })) || [],
  moves: pokemonData.value?.moves.map((move) => move.move.name) || [],
  evolution: await cadenaEvolutiva(pokemonData.value?.name) || 'N/A',
};
</script>