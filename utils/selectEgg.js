export async function huevoPokemon(pokemonName) {
        for (let i = 1; i <= 15; i++) {
            const response = await fetch(`https://pokeapi.co/api/v2/egg-group/${i}`);
            const data = await response.json();

            const eggPokemon = data.pokemon_species.map(p => p.name);

            if (eggPokemon.includes(pokemonName.toLowerCase())) {
                return data.name; 
            }
        }

        return 'Desconocido';
    } 