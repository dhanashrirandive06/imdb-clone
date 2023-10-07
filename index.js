// To Refresh Page after Updating
const refreshPageContent = () => {
  location.reload();
};

// To add Movie as Favourites
const addToFavourites = (title) => {
  if (localStorage.getItem("movieList")) {
    let movieList = JSON.parse(localStorage.getItem("movieList"));
    if (!checkInFavourite(title)) {
      movieList.push(title);
      localStorage.setItem("movieList", JSON.stringify(movieList));
      refreshPageContent();
    }
  } else {
    let movieList = JSON.stringify([title]);
    localStorage.setItem("movieList", movieList);
  }
};
// To Remove Movie as Favourites
const removeFavourites = (title) => {
  let movieList = JSON.parse(localStorage.getItem("movieList"));

  let index = movieList.indexOf(title);
  movieList.splice(index, 1);
  localStorage.setItem("movieList", JSON.stringify(movieList));
  if (Object.keys(movieList).length === 0) {
    localStorage.removeItem("movieList");
  }
  refreshPageContent();
};

// To render page content based on URL
const stopInterval = setInterval(() => {
  if (window.location.pathname.includes(["movie.html"])) {
    moviePage();
  } else if (window.location.pathname.includes(["favourites.html"])) {
    favouritesPage();
  }
}, 1000);

// To add Movie as Favourites on Movie Page
const addFavourites = (title) => {
  if (localStorage.getItem("movieList")) {
    let movieList = JSON.parse(localStorage.getItem("movieList"));
    if (!checkInFavourite(title)) {
      movieList.push(title);
      localStorage.setItem("movieList", JSON.stringify(movieList));
      document.querySelector(".overlay").innerHTML = `
      <h4>${title}</h4>
      <button
      onclick="removefromFavourites('${title}')"
      class="add-favourites text-center bg-danger border-0 text-white py-1 rounded"
    >
    <i class="fa-solid fa-trash"></i> Remove Favourites
    </button>`;
    }
  } else {
    let movieList = JSON.stringify([title]);
    localStorage.setItem("movieList", movieList);
    document.querySelector(".overlay").innerHTML = `
    <h4>${title}</h4>
    <button
    onclick="removefromFavourites('${title}')"
    class="add-favourites text-center bg-danger border-0 text-white py-1 rounded"
  >
  <i class="fa-solid fa-trash"></i> Remove Favourites
  </button>`;
  }
};
// To Remove Movie as Favourites on movie page
const removefromFavourites = (title) => {
  let movieList = JSON.parse(localStorage.getItem("movieList"));
  let index = movieList.indexOf(title);
  movieList.splice(index, 1);

  localStorage.setItem("movieList", JSON.stringify(movieList));
  if (Object.keys(movieList).length === 0) {
    localStorage.removeItem("movieList");
  }
  document.querySelector(".overlay").innerHTML = `
      <h4>${title}</h4>
      <div
        onclick="addFavourites('${title}')"
        class="mt-1 add-favourites  text-center border-0 text-white p-1 rounded"
      >
        <i class="fa-solid fa-plus"></i> Favourites
      </div>`;
};

// Display Content on favourites Page
const favouritesPage = () => {
  clearInterval(stopInterval);

  let movieList = JSON.parse(localStorage.getItem("movieList"));

  if (movieList !== null) {
    document.querySelector("#page-content").innerHTML = "";
    movieList.forEach(async (element) => {
      const response = await fetch(
        `https://www.omdbapi.com/?t=${element}&apikey=58db2aa0`
      );
      const movie = await response.json();
      favouritesPageCard(movie);
    });
  } else {
    document.querySelector("#page-content").innerHTML = "";
    let div = document.createElement("div");
    div.classList =
      "d-flex flex-column mt-5 justify-content-center align-items-center";

    let h2 = document.createElement("h2");
    h2.className = "text-white";
    h2.innerText = "No Favourites Yet!";
    div.appendChild(h2);
    document.querySelector("#page-content").appendChild(div);
  }
};

// Create favourites Page Movie Card
const favouritesPageCard = (movie) => {
  const card = `<div class="favCard mx-3 bg-light border-1 mt-3 ">
                  <a class="fav-card-image"
                   href="/imdb-clone/movie.html?title=${movie.Title}">
                    <img
                    
                    src=${movie.Poster}
                    class="card-img-top fav-img"
                    alt=${movie.Title}
                    />
                  </a>
                  <div class=" card-body fav-card-body p-1">
                    <div>
                      <i class="fa-solid fa-star text-warning"></i>${movie.Ratings[0].Value}
                    </div>
                    <a href="/imdb-clone/movie.html?title=${movie.Title}"> <h6 class="card-title my-1">${movie.Title}</h6></a>
                    <button onclick="removeFavourites('${movie.Title}')" class="add-favourites text-center bg-danger border-0 text-white p-1 rounded">
                    <i class="fa-solid fa-trash"></i> Remove Favourites
                    </button>
                  </div>   
                </div>`;

  let div = document.createElement("div");
  div.innerHTML = card;
  document.querySelector("#page-content").appendChild(div);
};

//Create Movie Page Card
const moviePageCard = (movie) => {
  const card = `
      <div class="d-flex movieRow my-4" >
        <div class="movieRow_img">
          <img
            src=${movie.Poster}
            class="img-fluid rounded h-75 "
            alt="..."
          />
        </div>
        <div class="movieRow_data ">
          <div class=" d-flex flex-column justify-content-evenly " >
            <div class="d-flex justify-content-between">
              <h3 class="card-title">${movie.Title}</h3>

              <div class="mt-2 mx-4 py-1 px-2 rating rounded">
                <i class="fa-solid fa-star text-warning"></i> ${movie.Ratings[0].Value}
              </div>
              <div class="mt-2 mx-4 py-1 px-2 rating rounded">
              <i class="fa-solid fa-star text-warning"></i>IMDB Rating ${movie.imdbRating}
              </div>
             
            </div>
            <p class="w-100 my-3 text-start">
            <span>Plot :</span> ${movie.Plot}
            </p>

            <div class="d-flex justify-content-between">
            <p><span>Genre :</span> ${movie.Genre}</p>
            <p><span>Released :</span> ${movie.Released}</p>
          </div>

            <div class="d-flex justify-content-between">
              <p><span>Director :</span> ${movie.Director}</p>
              <p><span>Language :</span> ${movie.Language}</p>
              <p><span>Country :</span> ${movie.Country}</p>
            </div>

            <div>
              <p><span>Writers :</span> ${movie.Writer}</p>
              <p><span>Stars :</span> ${movie.Actors}</>
            </div>
          </div>
        </div>
      </div>
`;

  document.querySelector("#movieContainer").innerHTML = card;
};

//display Content On Movie Page
const moviePage = async () => {
  clearInterval(stopInterval);
  let title = "";
  let urlParams = new URLSearchParams(location.search);
  for (const value of urlParams.values()) {
    title = value;
  }

  const response = await fetch(
    `https://www.omdbapi.com/?t=${title}&apikey=58db2aa0`
  );
  const movie = await response.json();
  moviePageCard(movie);
};

const checkInFavourite = (title) => {
  let favouritesList = JSON.parse(localStorage.getItem("movieList"));
  if (favouritesList.includes(title)) {
    return true;
  } else {
    return false;
  }
};

//Function to create Movie Card on Home Page
const movieCard = (movie) => {
  document.querySelector(".page-content").innerHTML = "";
  if (movie.Response === "False") {
    let div = document.createElement("div");
    div.classList =
      "d-flex flex-column mt-5 justify-content-center align-items-center";

    let button = document.createElement("button");
    button.classList = "py-1 px-3 my-5 border-0 text-white bg-danger rounded";
    button.innerText = "Back";
    button.onclick = refreshPageContent;
    let h2 = document.createElement("h2");
    h2.className = "text-white";
    h2.innerText = movie.Error;
    div.appendChild(button);
    div.appendChild(h2);
    document.querySelector(".page-content").appendChild(div);
  } else {
    let movieList = JSON.parse(localStorage.getItem("movieList"));
    let check = "";
    if (movieList === null) {
      check = false;
    } else {
      check = checkInFavourite(movie.Title);
    }
    const card = `
    <div class="movie-card bg-light border-1">
    <a  href="/imdb-clone/movie.html?title=${movie.Title}">
  
      <img
        src="${movie.Poster}"
        class="card-img-top movie-card-image h-100"
        alt="..."
      />
    </a>
    <div class="overlay d-flex flex-column">
      <h4>${movie.Title}</h4>
      ${check
        ? ` <button
                    onclick="removefromFavourites('${movie.Title}')"
                    class="add-favourites text-center bg-danger border-0 text-white py-1 rounded"
                  >
                  <i class="fa-solid fa-trash"></i> Remove Favourites
                  </button>`
        : `<div
                    onclick="addFavourites('${movie.Title}')"
                    class="mt-1 add-favourites  text-center border-0 text-white p-1 rounded"
                  >
                    <i class="fa-solid fa-plus"></i> Favourites
                  </div>`
      }
    </div>
 
  </div>
  `;

    document.querySelector(".page-content").innerHTML = card;
  }
};

//Function to fetch Movie (search)
const fetchMovie = async () => {
  let search = document.querySelector("#search").value;
  if (search !== "") {
    const response = await fetch(
      `https://www.omdbapi.com/?t=${search}&apikey=58db2aa0`
    );
    const movie = await response.json();
    movieCard(movie);
  } else {
    const card = `<div class="d-flex flex-column mt-5">
                    <h2 class="text-white">Search Movie</h2>
                    <img src="./assets/images/search.gif" />
                  </div>`;

    document.querySelector(".page-content").innerHTML = card;
  }
};
