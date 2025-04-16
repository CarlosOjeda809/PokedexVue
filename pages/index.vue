<script setup>
const config = useRuntimeConfig();
const { data: pokemonsData, error } = await useFetch(`${API_URL}/pokemon`, {
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


<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold">POKEDEX</h1>
    <br>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
      <NuxtLink v-for="pokemon in pokemons" :key="pokemon.name" :to="`/pokemon?name=${pokemon.name}`"
        class="relative flex flex-col min-h-[130px] text-white px-5 pt-6 shadow-md rounded-2xl overflow-hidden"
        :class="pokemon.types[0]">
        <img src="/public/img/pokeball.png" class="absolute -bottom-6 -right-4 opacity-30 h-[100px]"></img>
        <div class="absolute inset-0 bg-gray-200/20 rounded-2xl p-4 flex flex-col justify-between">
          <div class="flex justify-end items-start">
            <p class="text-gray-700 font-bold top-3 opacity-20 ">#{{ pokemon.id }}</p>
          </div>
          <div class="absolute py-2 text-xl font-bold text-white">
            {{ MayusculaLetra(pokemon.name) }}
          </div>
          <div class="flex flex-col w-fit mt-2">
            <div v-for="type in pokemon.types" :key="type"
              class="bg-gray-200/30 rounded-full inline-block px-2 py-0.5 text-sm font-verdana text-white mb-1">
              <span class="block text-center" :style="{ minWidth: '2em', padding: '0 0.5em' }">
                {{ MayusculaLetra(type) }}
              </span>
            </div>

          </div>

        </div>
        <div class="absolute bottom-2 right-2">
          <img class="w-30 h-30 relative -bottom-4 -right-4" :src="pokemon.sprite" :alt="pokemon.name" />
        </div>

      </NuxtLink>
    </div>
  </div>
</template>

