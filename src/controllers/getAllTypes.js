const axios = require("axios");
const { Type } = require("../db");
const URL_TYPE = "https://pokeapi.co/api/v2/type";

let cachedTypes = null; 

const getAllTypes = async (req, res) => {
    try {
        console.log("Entrando en getAllTypes");
       
        if (cachedTypes) {
            console.log("Enviando tipos desde caché");
            return res.status(200).json(cachedTypes);
        }

       const typesFromDB = await Type.findAll();

        if (typesFromDB.length > 0) {
            cachedTypes = typesFromDB;
            console.log("Enviando tipos desde la base de datos");
            return res.status(200).json(typesFromDB);
        }

        const {data} = await axios(`${URL_TYPE}`);
        const typesFromAPI = data.results.map((type) => ({ name: type.name }));

        await Type.bulkCreate(typesFromAPI);

        cachedTypes = typesFromAPI;
        
        console.log("Enviando tipos desde la API");
        return res.status(200).json(typesFromAPI);
    } catch (error) {
        console.error("Error en getAllTypes:", error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = getAllTypes;


