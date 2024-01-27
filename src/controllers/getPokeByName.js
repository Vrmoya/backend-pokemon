const axios = require("axios");
const { Op } = require("sequelize");
const { Pokemon, Type } = require("../db");
const URL = "https://pokeapi.co/api/v2/pokemon/{name}";

const getPokeByName = async (req, res) => {
  try {
    const { name } = req.query;

    const pokeNameDB = await Pokemon.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
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

    if (pokeNameDB.length > 0) {
      return res.status(200).json(pokeNameDB);
    }

    const { data } = await axios(
      `${URL.replace("{name}", encodeURIComponent(name))}`
    );
    const { id, sprites, stats, height, weight, types } = data;
    const pokeNameAPI = {
      id,
      name,
      image: sprites?.other.dream_world.front_default || null,
      hp: stats.find((stat) => stat.stat.name === "hp")?.base_stat || null,
      attack:
        stats.find((stat) => stat.stat.name === "attack")?.base_stat || null,
      defense:
        stats.find((stat) => stat.stat.name === "defense")?.base_stat || null,
      speed:
        stats.find((stat) => stat.stat.name === "speed")?.base_stat || null,
      height,
      weight,
      type: types.map((type) => type.type.name),
    };

    console.log("Respuesta de la API:", pokeNameAPI);

    if (!pokeNameAPI || typeof pokeNameAPI !== "object" || !pokeNameAPI.name) {
      console.error("La respuesta de la API no es válida:", pokeNameAPI);
      return res.status(404).json({
        message: "No se encontraron Pokémon con el nombre proporcionado.",
      });
    }

    return res.status(200).json([pokeNameAPI]);
  } catch (error) {
    console.error("Error en la función getPokeByName:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = getPokeByName;
