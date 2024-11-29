document.addEventListener("DOMContentLoaded", function () {
    start();
});

const urlBreeds = 'https://dog.ceo/api/breeds/list/all'; // EndPoint de todas las razas
const urlImg = 'https://dog.ceo/api/breed/xxxxx/images/random'; // EndPoint con imagenes aleatorias de perros
let breeds = []; // Array que contendrá todas las razas de perros
let dogs = []; // Array que contendrá todas las imagenes de perros

// Se obtienen las razas 
const getAllBreeds = async() => {
    try {
        const response = await axios.get(urlBreeds);
        const breeds = response.data.message;
        return breeds;
    } catch (error) {
        console.error('Error en la funcion getAllBreeds' + error);
    }
};

// Se obtienen las urls con las imagenes de perros
const allDogs = () => {
    const nameBreed = 'xxxxx';
    const breedsKeys = Object.keys(breeds);
    breedsKeys.map((breed) => {
        dogs.push(urlImg.replace(nameBreed, breed));
    });
    return dogs;
};

// Iteraración de razas
const iterateBreeds = (breeds) =>{
    const breedsKeys = Object.keys(breeds);
    breedsKeys.map((breed) => loadBreeds(breed))
};

// Cargar Select con las razas
const loadBreeds = (breed) => {
    const select = document.getElementById('dog-selector');
    
    const option = `
    <option value="${breed}">${breed}</option>
    `;
    
    select.insertAdjacentHTML("beforeend", option);
}

// Iterar imagenes de perros
const iterateDogs = (dogs) =>{

    dogs.map(async (dog) => {
        try {
            const response = await axios.get(dog)
            const  dogImg = response.data.message;
            loadDogs(dogImg);
        } catch (err){
            console.error(err);
        }
    })
}

// Crear las tarjetas de todas las imagenes de perros
const loadDogs = (dog) => {

    // Obtener raza
    let str1 = dog;
    let str2 = str1.slice(30);
    let str3 = str2.split('/');
    let name = str3[0];
    name = name.toLowerCase().replace(/\b[a-z]/g, function(letter) {
           return letter.toUpperCase();
    });

    const nodo = document.getElementById('dog-grid');
    const image = `
        <div class="card">
            <img src="${dog}" alt="Foto de perro ${name}"/>
            <div class="card-body">
                <h5 class="card-title">${name}</h5>
            </div>
        </div>
    `;
    nodo.insertAdjacentHTML("beforeend", image);
}

// Cuando seleccionamos un elemento del Selector nos buscará todas las imágenes de esa raza
const searchDog = () => {
    const { value : name} = document.getElementById('dog-selector');

    document.getElementById('dog-grid').innerHTML = "";
    
    if(name === ""){
        document.getElementById("find").style.visibility = 'visible';
        dogs = allDogs();
        iterateDogs(dogs);

    } else {
        document.getElementById("find").style.visibility = 'hidden';
        const nameBreed = 'xxxxx';
        
        const url = "https://dog.ceo/api/breed/xxxxx/images".replace(nameBreed, name);
        
        const filter = async(url) => {
            try {
                const response = await axios.get(url);
                const dogFilter = response.data.message;
                for (const dog of dogFilter){
                    loadDogs(dog);
                }
            } catch (err){
                console.error(err);
            }
        };
        filter(url);
    }
}

// Cargamos elementos del DOM
const start = async () => {
    document.getElementById("find").addEventListener("click", searchDog);
    document.getElementById("dog-selector").addEventListener("change", searchDog);
    
    breeds = await getAllBreeds();
    iterateBreeds(breeds);

    dogs = allDogs();
    iterateDogs(dogs);
}
