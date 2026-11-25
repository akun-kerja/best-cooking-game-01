// Warung Rasa — recipes and ingredients. Pure data plus small helpers;
// no drawing and no game state lives here.

export const INGREDIENTS = {
  nasi:  { id: 'nasi',  name: 'Nasi',  short: 'Nasi',  key: '1', prep: 'cook',     color: '#f5f0dc', dark: '#cbbf9a', desc: 'Masak di wajan' },
  telur: { id: 'telur', name: 'Telur', short: 'Telur', key: '2', prep: 'chopcook', color: '#ffd94d', dark: '#d9a521', desc: 'Cincang lalu masak' },
  ayam:  { id: 'ayam',  name: 'Ayam',  short: 'Ayam',  key: '3', prep: 'chopcook', color: '#e8a06a', dark: '#b06a35', desc: 'Cincang lalu masak' },
  mie:   { id: 'mie',   name: 'Mie',   short: 'Mie',   key: '4', prep: 'cook',     color: '#f2c14e', dark: '#c08a1e', desc: 'Masak di wajan' },
  tahu:  { id: 'tahu',  name: 'Tahu',  short: 'Tahu',  key: '5', prep: 'chop',     color: '#f7ead0', dark: '#c9a06a', desc: 'Cincang saja' },
  cabai: { id: 'cabai', name: 'Cabai', short: 'Cabai', key: '6', prep: 'chop',     color: '#e23b2e', dark: '#9e1f16', desc: 'Cincang saja' },
};

export const INGREDIENT_ORDER = ['nasi', 'telur', 'ayam', 'mie', 'tahu', 'cabai'];

// A component is ready for the plate once its prep steps are done.
export function prepSteps(ing) {
  if (ing.prep === 'cook') return ['cook'];
  if (ing.prep === 'chop') return ['chop'];
  return ['chop', 'cook'];
}

export const RECIPES = [
  {
    id: 'nasi-goreng',
    name: 'Nasi Goreng',
    price: 120,
    needs: ['nasi', 'telur', 'cabai'],
    blurb: 'Nasi wajan, telur, cabai pedas',
  },
  {
    id: 'mie-ayam',
    name: 'Mie Ayam',
    price: 130,
    needs: ['mie', 'ayam', 'cabai'],
    blurb: 'Mie wajan, ayam cincang, cabai',
  },
  {
    id: 'gado-gado',
    name: 'Gado-Gado',
    price: 110,
    needs: ['tahu', 'telur', 'cabai'],
    blurb: 'Tahu, telur, cabai segar',
  },
];

export function recipeById(id) {
  return RECIPES.find((r) => r.id === id) || null;
}

// Same set of components, order ignored.
export function plateMatches(plate, recipe) {
  if (plate.length !== recipe.needs.length) return false;
  const have = [...plate].sort().join(',');
  const want = [...recipe.needs].sort().join(',');
  return have === want;
}

export function randomRecipe(rng) {
  return RECIPES[Math.floor(rng() * RECIPES.length)];
}
