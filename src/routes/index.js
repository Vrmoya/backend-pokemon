const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();




const findAllPokemnon = require("../controllers/findAllPokemon")
const getPokeById = require("../controllers/getPokeById");
const getPokeByName = require('../controllers/getPokeByName');
const postPokemon = require('../controllers/postPokemon');
const getAllTypes = require('../controllers/getAllTypes');



// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get('/pokemons', findAllPokemnon);

router.get('/pokemons/name', getPokeByName);

router.get('/pokemons/:id', getPokeById);

router.post('/pokemons', postPokemon);

router.get('/types', getAllTypes);



module.exports = router;
