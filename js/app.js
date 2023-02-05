//Initializing variables
const searchName = document.querySelector('#search-name-main');
const searchNameT = document.querySelector('#searchNameT');
const searchBtn = document.querySelectorAll('.search-btn');
const queryText = document.querySelector('.query-text');
const homePage = document.querySelector('#home-page');
const resultPage = document.querySelector('#result-page');
const resultGrid = document.querySelector('.result-grid');
const returnBtn = document.querySelector('.return-btn');
const searchText = document.querySelectorAll('.search-name');
const loading = document.querySelector('.loading');
let searchVal = '';

//Adding Event Listeners
searchBtn.forEach(e => {
    e.addEventListener('click', showResults);
});
searchName.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) showResults();
});

returnBtn.addEventListener('click', () => {
    resultPage.style.display = 'none';
    homePage.style.display = 'flex';
    resultGrid.replaceChildren();
})

//Shows the full searches
function showResults() {
    loading.style.color = 'white';
    loading.innerText = 'Loading...';
    resultGrid.replaceChildren();
    searchText.forEach(e => {
        searchVal += e.value;
    });
    if (searchVal != '') {
        const resource = `https://superheroapi.com/api.php/727054372039115/search/${searchVal}`;
        getData(resource).then(data => {
            console.log(data);
            data.results.forEach(variab => {
                let img = document.createElement('img');
                let grItem = document.createElement('div');
                let pLevel = document.createElement('div');
                let h2 = document.createElement('h2');
                for (let i = 0; i < 6; i++) {
                    let pAttrib = document.createElement('div');
                    pAttrib.classList.add('power-attrib');
                    pAttrib.classList.add('grid-item');
                    let cName = document.createElement('span');
                    let cAttrib = document.createElement('div');
                    let cProg = document.createElement('div');
                    let cPower = document.createElement('span');
                    cProg.classList.add('progress');
                    cAttrib.classList.add('attrib-value');
                    cName.innerText = Object.keys(variab.powerstats)[i];
                    cProg.style.width = `${Object.values(variab.powerstats)[i]}%`;
                    cPower.innerText = Object.values(variab.powerstats)[i];
                    if (cPower.innerText == 'null') cPower.innerText = "N/A";
                    console.log(pAttrib);
                    pLevel.classList.add('power-level');
                    h2.innerText = variab.name;
                    grItem.classList.add('grid-item');
                    h2.classList.add('hero-name');
                    pAttrib.append(cName);
                    cAttrib.append(cProg);
                    cAttrib.append(cPower);
                    pAttrib.append(cAttrib);
                    pLevel.append(pAttrib);
                }
                img.src = variab.image.url;
                img.classList.add('image');
                grItem.append(img);
                grItem.append(h2);
                grItem.append(pLevel);
                resultGrid.append(grItem);
                loading.style.display = 'none';
                returnBtn.style.display = 'flex';
            });
        }).catch(err => {
            loading.style.color = 'tomato';
            loading.innerText = 'Hero not found';
        });
        queryText.innerText = searchVal;
        homePage.style.display = 'none';
        resultPage.style.display = 'flex';
        searchVal = '';
        searchText.forEach(e => {
            e.value = '';
        });
    }
}

const getData = async (resource) => {
    const response = await fetch(resource);
    const data = await response.json();
    return data;
}