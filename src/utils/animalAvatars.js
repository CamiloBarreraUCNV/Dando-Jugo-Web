import cocodriloImg from '../assets/animales-ebrios/cocodrilo.webp';
import focaImg from '../assets/animales-ebrios/foca.webp';
import gatoImg from '../assets/animales-ebrios/gato.webp';
import gaviotaImg from '../assets/animales-ebrios/gaviota.webp';
import osoImg from '../assets/animales-ebrios/oso.webp';
import perroImg from '../assets/animales-ebrios/perro.webp';
import pezImg from '../assets/animales-ebrios/pez.webp';
import tiburonImg from '../assets/animales-ebrios/tiburon.webp';

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
