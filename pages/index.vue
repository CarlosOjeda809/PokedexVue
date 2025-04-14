<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-5xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="p-6">
        <h1 class="text-3xl font-bold">Lista de Pokémon</h1>
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="pokemon in pokemons"
            :key="pokemon.name"
            class="bg-white shadow-md rounded-lg overflow-hidden h-[300px] "
          >
            <NuxtLink :to="`/pokemon?name=${pokemon.name}`">
              <img
                class="w-full"
                :src="pokemon.sprite"
                :alt="pokemon.name"
              />
            </NuxtLink>
            <div class="p-4">
              <NuxtLink :to="`/pokemon?name=${pokemon.name}`" class="block text-center font-bold text-xl capitalize mb-2">
                {{ pokemon.name }}
              </NuxtLink>
              <p class="text-gray-700 text-center">ID: {{ pokemon.id }}</p>
              <div class="flex justify-center flex-wrap mt-2">
                <span
                  v-for="type in pokemon.types"
                  :key="type"
                  class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  {{ type }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>        
</template>

<script setup>
const config = useRuntimeConfig();
const { data: pokemonsData, error } = await useFetch(`${config.public.URLPokemon}pokemon`, {
  params: { limit: 18 },
});

if (error.value) {
  console.error('Error al obtener la lista de Pokémon:', error.value);
}

const pokemonsRaw = pokemonsData.value?.results || [];


const pokemons = await Promise.all(
  pokemonsRaw.map(async (pokemon) => {
    const pokemonDetails = await $fetch(pokemon.url); 
    return {
      name: pokemon.name,
      id: pokemonDetails.id,
      sprite: pokemonDetails.sprites.front_default, 
      types: pokemonDetails.types.map((type) => type.type.name), 
    };
  })
);
</script>