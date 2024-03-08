import { Starship } from '../entities';

function getRandomName(): string {
  const names = [
    'Alpha',
    'Beta',
    'Gamma',
    'Delta',
    'Epsilon',
    'Zeta',
    'Eta',
    'Theta',
    'Iota',
    'Kappa',
    'Lambda',
    'Mu',
    'Nu',
    'Xi',
    'Omicron',
    'Pi',
    'Rho',
    'Sigma ',
    'Tau',
    'Upsilon',
    'Phi',
    'Chi',
    'Psi',
    'Omega ',
  ];

  return names[Math.floor(Math.random() * names.length)];
}

function getRandomNumber(max: number): number {
  return Math.floor(Math.random() * max);
}

export function createRandomStarship(enemy: Starship): Starship {
  return new Starship({
    name: `${getRandomName()} ${getRandomName()}`,
    capacity: getRandomNumber(1000),
    model: getRandomName(),
    coordinates: `(${getRandomNumber(200)}, ${getRandomNumber(200)})`,
    enemies: [enemy],
  });
}
