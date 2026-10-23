import cocodriloImg from '../assets/animales-ebrios/cocodrilo.png';
import focaImg from '../assets/animales-ebrios/foca.png';
import gatoImg from '../assets/animales-ebrios/gato.png';
import gaviotaImg from '../assets/animales-ebrios/gaviota.png';
import osoImg from '../assets/animales-ebrios/oso.png';
import perroImg from '../assets/animales-ebrios/perro.png';
import pezImg from '../assets/animales-ebrios/pez.png';
import tiburonImg from '../assets/animales-ebrios/tiburon.png';

export const ANIMAL_AVATARS = [
  { id: 'perro', name: 'Perro', image: perroImg, phrase: 'El fiel chupa-gratis' },
  { id: 'gato', name: 'Gato', image: gatoImg, phrase: 'El curado mañoso' },
  { id: 'oso', name: 'Oso', image: osoImg, phrase: 'El que da jugo pesado' },
  { id: 'tiburon', name: 'Tiburón', image: tiburonImg, phrase: 'Depredador del bar' },
  { id: 'cocodrilo', name: 'Cocodrilo', image: cocodriloImg, phrase: 'Boca suelta' },
  { id: 'foca', name: 'Foca', image: focaImg, phrase: 'Aplaude cualquier trago' },
  { id: 'gaviota', name: 'Gaviota', image: gaviotaImg, phrase: 'Pica todo lo ajeno' },
  { id: 'pez', name: 'Pez', image: pezImg, phrase: 'Toma como condenado' },
];

export function getAnimalAvatar(animalId) {
  return ANIMAL_AVATARS.find((a) => a.id === animalId) || ANIMAL_AVATARS[0];
}
