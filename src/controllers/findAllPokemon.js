const axios = require("axios");
const { Pokemon, Type } = require("../db");

const URL = "https://pokeapi.co/api/v2/pokemon";

const maxPoke = 50;

const findAllPokemon = async (req, res) => {
  try {
    const pokemonsFromDB = await Pokemon.findAll({
      include: [
        {
          model: Type,
          attributes: ["name"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    const formattedPokemonsFromDB = pokemonsFromDB.map((pokemon) => ({
      ...pokemon.toJSON(),
      type: pokemon.types.map((type) => type.name),
      api: false,
    }));

    const remainingPokemonCount = maxPoke + formattedPokemonsFromDB.length;

    if (remainingPokemonCount > 0) {
      const { data } = await axios(`${URL}?limit=${remainingPokemonCount}`);
      const apiPokemons = data.results;
        console.log(apiPokemons);
      const apiPokemonDetails = await Promise.all(
        apiPokemons.map(async (apiPokemon) => {
          const { data } = await axios(apiPokemon.url);
          const { id, name, sprites, stats, height, weight, types } = data;
          const hp = stats.find((stat) => stat.stat.name === "hp").base_stat;
          const attack = stats.find((stat) => stat.stat.name === "attack").base_stat;
          const defense = stats.find((stat) => stat.stat.name === "defense").base_stat;
          const speed = stats.find((stat) => stat.stat.name === "speed").base_stat;
          const pokemonTypes = types.map((type) => type.type.name);
          const image = sprites.other.dream_world.front_default;

          
          const existingPokemon = formattedPokemonsFromDB.find(
            (p) => p.id === id
          );

          if (!existingPokemon) {
            return {
              id,
              name,
              image,
              hp,
              attack,
              defense,
              speed,
              height,
              weight,
              type: pokemonTypes,
              api: true,
            };
          } else {
            return null;
          }
        })
      );

      const filteredApiPokemonDetails = apiPokemonDetails.filter((p) => p !== null);

      const totalPokemons = formattedPokemonsFromDB.length + filteredApiPokemonDetails.length;

      if (totalPokemons > maxPoke) {
        
        const trimmedPokemons = [...formattedPokemonsFromDB.slice(0, maxPoke - 1), ...filteredApiPokemonDetails.slice(0, maxPoke - formattedPokemonsFromDB.length)];
        return res.status(200).json(trimmedPokemons);
      } else {
        const allPokemons = [...formattedPokemonsFromDB, ...filteredApiPokemonDetails];
        return res.status(200).json(allPokemons);
      }
    } else {
      return res.status(200).json(formattedPokemonsFromDB);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = findAllPokemon;

