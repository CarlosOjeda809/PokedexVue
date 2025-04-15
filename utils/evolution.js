export async function cadenaEvolutiva(pokemonName) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
        const dataSpecies = await response.json();

        const evolutionChainUrl = dataSpecies.evolution_chain.url;
        const evolutionChainResponse = await fetch(evolutionChainUrl);
        const evolutionChainData = await evolutionChainResponse.json();

        
        const evolutionChain = evolutionChainData.chain;
        const evolutions = [];
        let currentEvolution = evolutionChain;

        while (currentEvolution) {
            const evolutionName = currentEvolution.species.name;

            const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolutionName}`);
            const pokemonData = await pokemonResponse.json();

            evolutions.push({
                name: evolutionName,
                id: pokemonData.id,
                sprite: pokemonData.sprites.front_default,
                level: currentEvolution.evolution_details[0]?.min_level || null
            });

            currentEvolution = currentEvolution.evolves_to[0];
        }

        return evolutions;
}