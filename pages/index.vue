<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold">POKEDEX</h1>
    <br>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
      <NuxtLink
        v-for="pokemon in pokemons"
        :key="pokemon.name"
        :to="`/pokemon?name=${pokemon.name}`"
        class="relative flex flex-col min-h-[130px] grass text-white px-5 pt-6 shadow-md rounded-2xl overflow-hidden"
      >
        <div class="relative z-10">
          <div class="flex justify-end items-start">
            <p class="text-gray-700">{{ pokemon.id }}</p>
          </div>
          <div class="absolute top-2 left px-3 py-1 font-semibold text-gray-700">
            {{ MayusculaLetra(pokemon.name) }}
          </div>
          <div class="flex flex-col w-fit mt-2">
            <div
              v-for="type in pokemon.types"
              :key="type"
              class="bg-gray-200 rounded-full px-1.5 py-0.5 text-sm font-semibold text-gray-700"
            >
              {{ type }}
            </div>
          </div>
        </div>
        <div class="absolute bottom-2 right-2">
          <img
            class="w-30 h-30"
            :src="pokemon.sprite"
            :alt="pokemon.name"
          />
        </div>
      </NuxtLink>
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
