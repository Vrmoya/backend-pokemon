const axios = require("axios");
const URL_API = "https://pokeapi.co/api/v2/pokemon"

const dataApi = async () =>{
  const {data} = await axios(`${URL_API}`)
  const { name, sprites, stats, height, weight } = data;
  const pokemonAPI = { 
    name, 
    image: sprites?.front_default || null,
    hp: stats.find(stat => stat.stat.name === 'hp')?.base_stat || null,
    attack: stats.find(stat => stat.stat.name === 'attack')?.base_stat || null,
    defense: stats.find(stat => stat.stat.name === 'defense')?.base_stat || null,
    speed: stats.find(stat => stat.stat.name === 'speed')?.base_stat || null,
    height,
    weight };


}

module.exports = dataApi;