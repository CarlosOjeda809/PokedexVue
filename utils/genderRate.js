export async function genderRate(pokemonName) {
    try {
      
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
      const data = await response.json();
  
      const genderRate = data.gender_rate;
  
      if (genderRate === -1) {
        return {
          masculino: 0,
          femenino: 0,
          sinGenero: true, 
        };
      }
  
      const porcentajeFemenino = (genderRate / 8) * 100;
      const porcentajeMasculino = 100 - porcentajeFemenino;
  
      return {
        masculino: porcentajeMasculino,
        femenino: porcentajeFemenino,
        sinGenero: false,
      };
    } catch (error) {
      console.error('Error al obtener el gender_rate:', error);
      return {
        masculino: 'N/A',
        femenino: 'N/A',
        sinGenero: false,
      };
    }
  }