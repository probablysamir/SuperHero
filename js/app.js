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
const leftContainer = document.querySelector('.left-container');
const rightContainer = document.querySelector('.right-container');
const mainContainer = document.querySelector('.main-container');
let searchVal = '';
let supData = [];
let featHeadings = ['appearance', 'biography', 'connections', 'work']

//Adding Event Listeners
searchBtn.forEach(e => {
    e.addEventListener('click', showResults);
});
searchName.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) showResults();
});

//The return home button
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
            let count = 0;
            data.results.forEach(variab => {
                //Displays the character's image, name and attributes
                supData.push(variab);
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
                    cName.innerText = cName.innerText.charAt(0).toUpperCase() + cName.innerText.slice(1);
                    if (cPower.innerText == 'null') cPower.innerText = "N/A";
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
                pLevel.setAttribute('id', `${count}-pLevel`)
                img.src = variab.image.url;
                img.classList.add('image');
                grItem.append(img);
                grItem.append(h2);
                grItem.append(pLevel);
                grItem.classList.add('gr-item');
                grItem.setAttribute('id', `${count}`);
                resultGrid.append(grItem);
                loading.style.display = 'none';
                returnBtn.style.display = 'flex';
                count++;
            });
            const clickCard = document.querySelectorAll('.gr-item');
            //Adding eventlisteners to each card to diplay the detailed result
            clickCard.forEach(e => {
                let cardId = e.id;
                cardPLevel = e.querySelector('.power-level');
                cardImage = e.querySelector('.image');
                cardName = e.querySelector('.hero-name');
                cardImage.addEventListener('click', () => detail(cardId));
                cardName.addEventListener('click', () => detail(cardId));
            });
        }).catch(err => {
            loading.style.color = 'tomato';
            loading.innerText = 'Hero not found';
            returnBtn.style.display = 'flex';
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

//Asynchronous function to fetch the data

const getData = async (resource) => {
    const response = await fetch(resource);
    const data = await response.json();
    return data;
}

//Function to show the detailed description of the character
function detail(cardId) {
    resultPage.style.display = 'none';
    mainContainer.style.display = 'grid';
    const elem = document.getElementById(`${cardId}-pLevel`);
    let img = document.createElement('img');
    let h2 = document.createElement('h2');
    h2.innerText = supData[cardId].name;
    img.src = supData[cardId].image.url;
    const i = document.createElement('i');
    i.classList.add('fa-solid','fa-circle-left', 'back-btn');
    leftContainer.append(i);
    leftContainer.append(img);
    leftContainer.append(h2);
    leftContainer.append(elem.cloneNode(true));
    for (let i = 0; i < featHeadings.length; i++) {
        let featHeading = document.createElement('h2');
        featHeading.classList.add('feature-heading', 'm-50-top');
        featHeading.innerText = featHeadings[i];
        featHeading.innerText = featHeading.innerText.charAt(0).toUpperCase() + featHeading.innerText.slice(1);
        rightContainer.append(featHeading);
        let dAttrib = document.createElement('div');
        dAttrib.classList.add('detailed-attrib');
        for (let j = 0; j < Object.keys(supData[cardId][featHeadings[i]]).length; j++) {
            let aName = document.createElement('div');
            aName.innerText = `${Object.keys(supData[cardId][featHeadings[i]])[j]}: `;
            aName.innerText = aName.innerText.charAt(0).toUpperCase() + aName.innerText.slice(1);
            let feat = document.createElement('span');
            feat.classList.add('feature');
            feat.innerText = Object.values(supData[cardId][featHeadings[i]])[j];
            aName.append(feat);
            dAttrib.append(aName);
        }
        rightContainer.append(dAttrib);
    }
    const backBtn = document.querySelector('.back-btn');
    backBtn.addEventListener('click',()=>{
        resultPage.style.display = 'flex';
        mainContainer.style.display = 'none';
        leftContainer.replaceChildren();
        rightContainer.replaceChildren();
    })
}