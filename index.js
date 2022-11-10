//SEARCH BUTTON

const searchBtn = () => {
    // const searchBox = document.querySelector(".icon_list input");
    const searchBox = document.getElementById("search-name");
    if (searchBox.value === ""){
        searchBox.classList.toggle("show")
    } else {
        renderGames({q:searchBox.value});
        const resultContainer = document.getElementById("game_list");
        resultContainer.scrollIntoView({behavior: 'smooth', block:"start",inline: "nearest"},true);
    }
}

// CAROUSEL 
let slideIndex = 1; // currentIndex

// Next/previous controls
function plusSlides(m) {
    showSlides(slideIndex += m); // slideIndex += m <==> slideIndex = slideIndex + m
}

// myslides -> | 0 | 1 | 2 |
function showSlides(n) {
    let myslides = document.getElementsByClassName("slides");
    if (n > myslides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = myslides.length}
    for (let i = 0; i < myslides.length; i++) {
        myslides[i].style.display = "none";
    }
    myslides[slideIndex-1].style.display = "block";
}

//GET FEATURED GAMES 
const getFeaturedGames = async () => {
    try {
        let url = "https://cs-steam-game-api.herokuapp.com/features"
        const res = await fetch(url);
        const data = await res.json();
        console.log (data);
        return data;
    } catch (error){
        console.log(error);
    }
}

const renderFeaturedGames = async () => {
    try {
        // get data 
        const featuredGames = await getFeaturedGames();
        console.log(featuredGames);
        // select existing html ele
        const gameCarousel = document.querySelector(".carousel-container")
        // input data 
        // loop thru arr
        featuredGames.data.slice(0, 4).forEach((game) => {
                //create div container 
                const carouselDiv = document.createElement("div");
                carouselDiv.className = "slides fade";
                carouselDiv.innerHTML = `
                    <img src=${game.background} alt="background-slide" class="slide-bg">
                    <img src=${game.header_image} alt="foreground-slide" class="slide-fg">`
                //append to existing ele
                gameCarousel.appendChild(carouselDiv);
            })

        showSlides(slideIndex);
    } catch (error) {
        console.log(error);
    }
}
renderFeaturedGames();


// GET ALL GAMES 
// const getGames = async ({q}) => {
    const getGames = async ({q, genres, tag}) => {
    try {
        let url = "https://cs-steam-game-api.herokuapp.com/games?";
        const queryObj = {
            genres,
            steamspy_tags:tag,
            q
        }
        for (let [key, value] of Object.entries(queryObj)){
            if(value){
                url += `&${key}=${value}`;
            }
        }
        console.log("url", url)
        const res = await fetch(url); //fetch data
        const data = await res.json() 
        console.log("data", data)
        return data;
    } catch (err){
        console.log(err);
    }
}
//render games with queries, genres and tags
const renderGames = async ({q, genres, tag}) => { //q= "dota", value:10
    try {
        const allGames = await getGames({q, genres, tag}); ///== {q= "", value:""}
        console.log(allGames);
        //select exist element html (body, div#main)
        const gameElement = document.getElementById("game_list");
        // gameElement.scrollIntoView({behavior: 'smooth', block:"start",inline: "nearest"},true);
        
        //create new element
            //loop through array data
        gameElement.innerHTML="";
        if(allGames.data.length){ //to check array true false by length
            allGames.data.forEach((game) => {
                //for each el => create div 
                const divGame = document.createElement("div")
                divGame.innerHTML = `<div class="game" style="color:white;">
                                 <img src=${game.header_image} alt="">
                                 <h3 style="padding: 0.5rem 0;">${game.name}</h3>
                                 <p>$ ${game.price}</p>
                         </div>`
                //=> append to exist ele
                gameElement.appendChild(divGame)
            })
        } else {
            const messH1 = document.createElement("h1")
            messH1.innerText = "0 results"
            gameElement.appendChild(messH1)
        }
    } catch (err) {
        console.log(err)
    }
}
renderGames({q:"", genres:"", tag:""});

//FILTERING GENRES 

const getGenres = async () => {
    try {
        let url = "https://cs-steam-game-api.herokuapp.com/genres";
        const res = await fetch(url);
        const data = await res.json();
        return data;
        console.log(data);
    } catch (error){
        console.log(error);
    }
}

const renderGenres = async () => {
    try {
        //get data 
        const gameGenres = await getGenres();
        console.log(gameGenres);
        //select existing element 
        const genreList = document.querySelector("#genres");
        //input data 
        //loop thru the array
        gameGenres.data.forEach((genre) => {
            //create fiv container 
            const genreDiv = document.createElement("option"); 
            genreDiv.textContent = `${genre.name}`;
            //append to the element
            console.log(genreDiv)
            genreList.appendChild(genreDiv);
        })   
    } catch (error) {
        console.log(error);
    }
}
renderGenres();

//FILTERING TAGS 
const getTags = async () => {
    try {
        const url = "https://cs-steam-game-api.herokuapp.com/steamspy-tags";
        const res = await fetch(url);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}
const renderTags = async () => {
    try {
        const gameTags = await getTags();
        const tagList = document.querySelector("#steamspy_tags")
        gameTags.data.forEach((tag) => {
            const tagContainer = document.createElement("option");
            tagContainer.textContent = `${tag.name}`;
            tagList.appendChild(tagContainer);
        })

    } catch (error) {
        console.log(error);
    }
}
renderTags();


// FILTER BUTTON 
const filterBtn = async () => {
    try {
        const genres = document.getElementById("genres").value;
        const tag= document.getElementById("steamspy_tags").value;
        renderGames({q:"",genres, tag});
    } catch (err){
        console.log(err);
    }
}
