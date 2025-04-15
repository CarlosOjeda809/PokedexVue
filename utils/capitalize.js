export function MayusculaLetra(str) {
    if (typeof str !== 'string') {
      console.error('MayusculaLetra: El valor proporcionado no es una cadena:', str);
      return str; 
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }