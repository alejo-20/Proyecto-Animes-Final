const { Router } = require('express');

const router = Router();

const DATA = {
  naruto: [
    { name: 'Naruto', age: '17', power: 'Rasengan / Modo Sabio' },
    { name: 'Sasuke', age: '17', power: 'Chidori / Sharingan' },
    { name: 'Sakura', age: '17', power: 'Fuerza sobrehumana / Sanación' },
    { name: 'Kakashi', age: '30', power: 'Sharingan copiado / Raikiri' },
    { name: 'Itachi', age: '21', power: 'Amaterasu / Tsukuyomi' },
    { name: 'Gaara', age: '17', power: 'Control de arena' },
    { name: 'Jiraiya', age: '54', power: 'Modo Sabio / Rasengan' },
    { name: 'Tsunade', age: '55', power: 'Fuerza sobrehumana / Sanación' },
    { name: 'Orochimaru', age: '54', power: 'Inmortalidad / Serpientes' },
    { name: 'Rock Lee', age: '17', power: 'Taijutsu / Ocho puertas' },
  ],
  saintseiya: [
    { name: 'Seiya', age: '16', power: 'Pegasus Ryu Sei Ken' },
    { name: 'Shiryu', age: '16', power: 'Rozan Sho Ryu Ha' },
    { name: 'Hyoga', age: '16', power: 'Diamond Dust' },
    { name: 'Shun', age: '15', power: 'Nebula Chain' },
    { name: 'Ikki', age: '17', power: 'Ho Yoku Ten Sho' },
    { name: 'Aioria', age: '20', power: 'Lightning Plasma' },
    { name: 'Milo', age: '20', power: 'Scarlet Needle' },
    { name: 'Aldebaran', age: '21', power: 'Great Horn' },
    { name: 'Saga', age: '28', power: 'Galaxian Explosion' },
    { name: 'Shaka', age: '20', power: 'Tenbu Horin' },
  ],
  onepiece: [
    { name: 'Luffy', age: '19', power: 'Gomu Gomu no Mi / Haki' },
    { name: 'Zoro', age: '21', power: 'Santoryu / Haki de armadura' },
    { name: 'Nami', age: '20', power: 'Clima Tact' },
    { name: 'Usopp', age: '19', power: 'Francotirador / Dial de impacto' },
    { name: 'Sanji', age: '21', power: 'Diable Jambe / Ifrit Jambe' },
    { name: 'Chopper', age: '17', power: 'Hito Hito no Mi' },
    { name: 'Robin', age: '30', power: 'Hana Hana no Mi' },
    { name: 'Franky', age: '36', power: 'Cyborg / Franky Shogun' },
    { name: 'Brook', age: '90', power: 'Yomi Yomi no Mi / Alma fría' },
    { name: 'Jinbe', age: '46', power: 'Artes marciales del mar' },
  ],
  hunterxhunter: [
    { name: 'Gon', age: '12', power: 'Jajanken / Nen amplificado' },
    { name: 'Killua', age: '12', power: 'Godspeed / Electricidad' },
    { name: 'Kurapika', age: '17', power: 'Cadenas imperativas' },
    { name: 'Leorio', age: '19', power: 'Nen / Medicina' },
    { name: 'Hisoka', age: '28', power: 'Bungee Gum / Texture Surprise' },
    { name: 'Chrollo', age: '26', power: 'Libro de habilidades' },
    { name: 'Illumi', age: '24', power: 'Manipulacion de agujas' },
    { name: 'Meruem', age: '40 dias', power: 'Aura del rey / Absorcion' },
    { name: 'Netero', age: '120', power: '100 tipo Guanyin Bodhisattva' },
    { name: 'Bisky', age: '57', power: 'Transmutacion / Fuerza bruta' },
  ],
};

const CHARACTER_IMAGES = {
  naruto: [
    'https://cdn.myanimelist.net/images/characters/2/284121.jpg',
    'https://cdn.myanimelist.net/images/characters/2/284121.jpg',
    'https://cdn.myanimelist.net/images/characters/2/284121.jpg',
    'https://cdn.myanimelist.net/images/characters/2/284121.jpg',
  ],
  sasuke: [
    'https://cdn.myanimelist.net/images/characters/9/131317.jpg',
    'https://cdn.myanimelist.net/images/characters/9/131317.jpg',
    'https://cdn.myanimelist.net/images/characters/9/131317.jpg',
    'https://cdn.myanimelist.net/images/characters/9/131317.jpg',
  ],
  sakura: [
    'https://cdn.myanimelist.net/images/characters/10/114399.jpg',
    'https://cdn.myanimelist.net/images/characters/10/114399.jpg',
    'https://cdn.myanimelist.net/images/characters/10/114399.jpg',
    'https://cdn.myanimelist.net/images/characters/10/114399.jpg',
  ],
  kakashi: [
    'https://cdn.myanimelist.net/images/characters/7/284129.jpg',
    'https://cdn.myanimelist.net/images/characters/7/284129.jpg',
    'https://cdn.myanimelist.net/images/characters/7/284129.jpg',
    'https://cdn.myanimelist.net/images/characters/7/284129.jpg',
  ],
  itachi: [
    'https://cdn.myanimelist.net/images/characters/9/15297.jpg',
    'https://cdn.myanimelist.net/images/characters/9/15297.jpg',
    'https://cdn.myanimelist.net/images/characters/9/15297.jpg',
    'https://cdn.myanimelist.net/images/characters/9/15297.jpg',
  ],
  gaara: [
    'https://cdn.myanimelist.net/images/characters/3/92380.jpg',
    'https://cdn.myanimelist.net/images/characters/3/92380.jpg',
    'https://cdn.myanimelist.net/images/characters/3/92380.jpg',
    'https://cdn.myanimelist.net/images/characters/3/92380.jpg',
  ],
  luffy: [
    'https://cdn.myanimelist.net/images/characters/9/310307.jpg',
    'https://cdn.myanimelist.net/images/characters/9/310307.jpg',
    'https://cdn.myanimelist.net/images/characters/9/310307.jpg',
    'https://cdn.myanimelist.net/images/characters/9/310307.jpg',
  ],
  zoro: [
    'https://cdn.myanimelist.net/images/characters/3/100534.jpg',
    'https://cdn.myanimelist.net/images/characters/3/100534.jpg',
    'https://cdn.myanimelist.net/images/characters/3/100534.jpg',
    'https://cdn.myanimelist.net/images/characters/3/100534.jpg',
  ],
  sanji: [
    'https://cdn.myanimelist.net/images/characters/7/112331.jpg',
    'https://cdn.myanimelist.net/images/characters/7/112331.jpg',
    'https://cdn.myanimelist.net/images/characters/7/112331.jpg',
    'https://cdn.myanimelist.net/images/characters/7/112331.jpg',
  ],
  gon: [
    'https://cdn.myanimelist.net/images/characters/3/83620.jpg',
    'https://cdn.myanimelist.net/images/characters/3/83620.jpg',
    'https://cdn.myanimelist.net/images/characters/3/83620.jpg',
    'https://cdn.myanimelist.net/images/characters/3/83620.jpg',
  ],
  killua: [
    'https://cdn.myanimelist.net/images/characters/7/3531.jpg',
    'https://cdn.myanimelist.net/images/characters/7/3531.jpg',
    'https://cdn.myanimelist.net/images/characters/7/3531.jpg',
    'https://cdn.myanimelist.net/images/characters/7/3531.jpg',
  ],
  seiya: [
    'https://cdn.myanimelist.net/images/characters/9/72225.jpg',
    'https://cdn.myanimelist.net/images/characters/9/72225.jpg',
    'https://cdn.myanimelist.net/images/characters/9/72225.jpg',
    'https://cdn.myanimelist.net/images/characters/9/72225.jpg',
  ],
};

function getCharacterImages(name) {
  const key = name.toLowerCase();
  return CHARACTER_IMAGES[key] || [
    `https://picsum.photos/seed/${encodeURIComponent(name)}1/300/300`,
    `https://picsum.photos/seed/${encodeURIComponent(name)}2/300/300`,
    `https://picsum.photos/seed/${encodeURIComponent(name)}3/300/300`,
    `https://picsum.photos/seed/${encodeURIComponent(name)}4/300/300`,
  ];
}

/**
 * @swagger
 * /api/anime/{category}:
 *   get:
 *     summary: Lista de personajes de una categoría de anime
 *     tags: [Anime]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [naruto, saintseiya, onepiece, hunterxhunter]
 *         description: Slug de la categoría
 *     responses:
 *       200:
 *         description: Lista de nombres de personajes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *             example: ["Naruto","Sasuke","Sakura"]
 *       404:
 *         description: Categoría no encontrada
 */
router.get('/:category', (req, res) => {
  const category = req.params.category.toLowerCase();
  const chars = DATA[category];
  if (!chars) return res.status(404).json({ error: 'Categoría no encontrada' });
  res.json(chars.map(c => c.name));
});

/**
 * @swagger
 * /api/anime/{category}/{name}:
 *   get:
 *     summary: Detalle de un personaje por categoría y nombre
 *     tags: [Anime]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [naruto, saintseiya, onepiece, hunterxhunter]
 *         description: Slug de la categoría
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del personaje
 *     responses:
 *       200:
 *         description: Detalle del personaje
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 age:
 *                   type: string
 *                 power:
 *                   type: string
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *             example:
 *               name: "Naruto"
 *               age: "17"
 *               power: "Rasengan / Modo Sabio"
 *               images:
 *                 - "https://via.placeholder.com/300x300/1a1a2e/00ffff?text=Naruto"
 *       404:
 *         description: Categoría o personaje no encontrado
 */
router.get('/:category/:name', (req, res) => {
  const { category, name } = req.params;
  const chars = DATA[category.toLowerCase()];
  if (!chars) return res.status(404).json({ error: 'Categoría no encontrada' });

  const found = chars.find(c => c.name.toLowerCase() === name.toLowerCase());
  if (!found) return res.status(404).json({ error: 'Personaje no encontrado' });

  const images = getCharacterImages(found.name);
  res.json({ ...found, images });
});

module.exports = router;
