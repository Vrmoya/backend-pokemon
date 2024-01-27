const { Pokemon, Type } = require("../db");

const postPokemon = async (req, res) => {
  try {
    const { name, image, hp, attack, defense, speed, weight, height, type } = req.body;
    console.log('Datos recibidos del frontend:', { name, image, hp, attack, defense, speed, weight, height, type });

    if (!name || !hp || !attack || !defense || !weight || !height || !type) {
      return res.status(400).json({ success: false, message: 'Faltan datos' });
    }

    const [poke, created] = await Pokemon.findOrCreate({
      where: { name },
      defaults: {
        image,
        hp,
        attack,
        defense,
        speed,
        weight,
        height,
      },
    });

    if (!created) {
      return res.status(400).json({ success: false, message: 'El Pokémon ya existe' });
    }

    const typeInstances = await Type.findAll({
      where: { name: type },
    });

    if (typeInstances.length !== type.length) {
      return res.status(400).json({ success: false, message: 'Al menos uno de los tipos especificados no existe' });
    }

    await poke.addTypes(typeInstances);

    return res.status(201).json({ success: true, data: poke });
  } catch (error) {
    console.error('Error during creating Pokemon:', error);
    console.error('Error details:', error.stack || error);

    return res.status(500).json({ success: false, error: 'Error during creating Pokemon' });
  }
};

module.exports = postPokemon;

