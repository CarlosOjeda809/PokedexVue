export async function generoPokemon(pokemonName) {
    const genders = ["male", "female", "genderless"]
    for (const gender of genders) {
        const response = await fetch(`${API_URL}/gender/${gender}`)
        const data = await response.json();
        const genderPokemon = data.pokemon_species_details.map(p => p.pokemon_species.name)
        if (genderPokemon.includes(pokemonName)){
            return gender;
        }
    }

}