const form = document.querySelector('#form');
const resultPanel = document.querySelector('#resultPanel');
const list = document.querySelector('#list');
const body = document.querySelector('body');
let currentGenIndex = 7;

let loadAllPokemon = async () => {

  const randomNum = Math.floor(Math.random() * 878);
  const allPokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${randomNum}`)
  const onLoadBody = document.querySelector('#load-body');

  list.innerHTML = '';

  for (let pokemon of allPokemon.data.results) {
    let id
    if (pokemon.url.length <= 36) {
      id = (pokemon.url.substr(pokemon.url.length - 2, 1));
    } else if (pokemon.url.length == 37) {
      id = (pokemon.url.substr(pokemon.url.length - 3, 2));
    } else {
      id = (pokemon.url.substr(pokemon.url.length - 4, 3));
    }

    let pokemonImgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

    onLoadBody.innerHTML += `
      <div id="pokemon-${id}" class="w-full" onclick="searchPokemon(${id})">
        <div class="w-full h-64 bg-slate-50 border-8 border-black rounded-lg hover:bg-pink-50">
          <img class="w-full h-full object-contain" src="${pokemonImgUrl}" />
        </div>

        <h1 class="w-56 h-2 mt-4 rounded-lg font-bold text-xl uppercase">${pokemon.name}</h1>
        <p class="w-24 h-2 mt-4 rounded-lg uppercase font-bold text-l"> ID: <span class="text-pink-400">${id}<span></p>
    </div>
    `
  }
}

loadAllPokemon();



const searchPokemon = async (searchTerm) => {
  const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`)
  const onLoadBody = document.querySelector('#load-body');
    currentGenIndex = 7;
    onLoadBody.innerHTML = ``
    list.innerHTML = '';
    makePanel(result.data);
    form.elements.query.value = ''
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  list.innerHTML = '';
  currentGenIndex = 7;
  const searchTerm = form.elements.query.value;
  const onLoadBody = document.querySelector('#load-body');
    onLoadBody.innerHTML = ``
    try {
      const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`)
      makePanel(result.data);
      form.elements.query.value = ''
    } catch {
      console.log('failed');

      list.innerHTML = `
      <div class="flex justify-center px-6">
      <div class="w-half flex">
        <div class="w-full h-auto flex flex-col items-center bg-slate-50 border-8 border-black lg:w-1/2 bg-contain rounded">
          <div class="mt-4 text-pink-400">
          </div>
        <img id="genImage"class ="mt-5 w-96 mix-blend-multiply h-96 object-contain" src="https://wiki.p-insurgence.com/images/0/09/722.png" alt="">
        </div>
        <div class="w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none">
          <div class="px-8 mb-4 text-center">
            <h3 class="pt-4 mb-2 text-3xl font-bold uppercase">MISSINGNO <span class="text-pink-300">#??</span></h3>
            <p class="mb-4 text-sm text-gray-700 uppercase">
            Type: ???
           </p>
            <p class = "uppercase font-bold" id="genLabel">Generation: ???</p>
          </div>
        </div>
      </div>
    </div>`;
    form.elements.query.value = ''
    return;
    }


});

const makePanel = (data) => {
  let typeString = '';
  data.types.forEach(type => {
    typeString += `${type.type.name} `;
  });

  let generations = Object.keys(data.sprites.versions);
  list.innerHTML = `
      <div class="flex justify-center px-6">
      <div class="w-half flex">
        <div class="w-full h-auto flex flex-col items-center bg-slate-50 border-black border-8 lg:w-1/2 bg-contain rounded">
          <div class="mt-4 text-pink-300">
            <button id="leftButton${data.id}" class = "hover:text-black" >
              <svg class="w-10 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
            <button id="rightButton${data.id}" class = "hover:text-black">
              <svg class="w-10 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        <img id="genImage"class ="w-96 mix-blend-multiply h-96 object-contain" src="${Object.values(data.sprites.versions[generations[currentGenIndex]])[0].front_default}" alt="">

        </div>
        <div class="w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none">
          <div class="px-8 mb-4 text-center">
            <h3 class="pt-4 mb-2 text-3xl font-bold uppercase">${data.name} <span class="text-pink-300">#${data.id}</span></h3>
            <p class="mb-4 text-sm text-gray-700 uppercase">
              Type: ${typeString}
            </p>
            <p class = "uppercase font-bold" id="genLabel">${generations[currentGenIndex].replace('-', ' ')}</p>
          </div>
        </div>
      </div>
    </div>`;

  const leftButton = document.querySelector(`#leftButton${data.id}`);
  const rightButton = document.querySelector(`#rightButton${data.id}`);


  leftButton.addEventListener('click', () => changeCurrentGen(data,generations, -1));

  rightButton.addEventListener('click',() => changeCurrentGen(data,generations, 1));
}

let changeCurrentGen = (data,generations, amount) => { //button which goes up and down on left/right click
  currentGenIndex = currentGenIndex + amount

  const genImg = document.querySelector('#genImage');
  const genLabel = document.querySelector('#genLabel');

  if (currentGenIndex > 7) {
    currentGenIndex = 0
  } else if (currentGenIndex < 0) {
    currentGenIndex = 7
  }
  let currentIMG = Object.values(data.sprites.versions[generations[currentGenIndex]])[0].front_default;

  if (!currentIMG) {
    changeCurrentGen(data, generations, amount);
  } else {
    genImg.src = Object.values(data.sprites.versions[generations[currentGenIndex]])[0].front_default;
    genLabel.innerText = generations[currentGenIndex].replace('-', ' ');
  }
}
