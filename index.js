// To Refresh Page after Updating
const refreshPageContent = () => {
  location.reload();
};

// To add Movie as Favourites
const addToFavourites = (title) => {
  console.log(title);
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

// Display Content on favourites Page
const favouritesPage = () => {
  clearInterval(stopInterval);

  let movieList = JSON.parse(localStorage.getItem("movieList"));

  if (movieList !== null) {
    document.querySelector("#page-content").innerHTML = "";
    movieList.forEach(async (element) => {
      console.log(element);
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
                  <a href="/imdb-clone/movie.html?title=${movie.Title}">
                    <img
                    src=${movie.Poster}
                    class="card-img-top movie-card-image"
                    alt=${movie.Title}
                    />
                  </a>
                  <div class="card-body p-3">
                    <div>
                      <i class="fa-solid fa-star text-warning"></i>${movie.Ratings[0].Value}
                    </div>
                    <a href="/imdb-clone/movie.html?title=${movie.Title}"> <h6 class="card-title my-2">${movie.Title}</h6></a>
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
  let movieList = JSON.parse(localStorage.getItem("movieList"));
  let check = "";
  if (movieList === null) {
    check = false;
  } else {
    check = checkInFavourite(movie.Title);
  }
  const card = `
      <div class="d-flex w-75 movieRow mt-4" >
        <div class="col-md-4">
          <img
            src=${movie.Poster}
            class="img-fluid rounded h-75 "
            alt="..."
          />
        </div>
        <div class="col-md-8">
          <div class=" d-flex flex-column justify-content-evenly " >
            <div class="d-flex justify-content-between">
              <h3 class="card-title">${movie.Title}</h3>

              <div class="mt-2 mx-4 py-1 px-2 rating rounded">
                <i class="fa-solid fa-star text-warning"></i> ${movie.Ratings[0].Value
    }
              </div>
              <div class="mt-2 mx-4 py-1 px-2 rating rounded">
              <i class="fa-solid fa-star text-warning"></i>IMDB Rating ${movie.imdbRating
    }
              </div>
             
            </div>
            <p class="w-100 my-3 text-start">
            ${movie.Plot}
            </p>

            <div class="d-flex justify-content-between">
            <p>Genre : ${movie.Genre}</p>
            <p>Released : ${movie.Released}</p>
          </div>

            <div class="d-flex justify-content-between">
              <p>Director : ${movie.Director}</p>
              <p>Language : ${movie.Language}</p>
              <p>Country : ${movie.Country}</p>
            </div>

            <div>
              <p>Writers : ${movie.Writer}</p>
              <p>Stars : ${movie.Actors}</>
            </div>

            ${check
      ? ` <button
                  onclick="removeFavourites('${movie.Title}')"
                  class="add-favourites w-50 text-center bg-danger border-0 text-white py-1 rounded"
                >
                <i class="fa-solid fa-trash"></i> Remove Favourites
                </button>`
      : `<div
                  onclick="addToFavourites('${movie.Title}')"
                  class="mt-1 add-favourites w-25 text-center border-0 text-white p-1 rounded"
                >
                  <i class="fa-solid fa-plus"></i> Favourites
                </div>`
    }
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
    console.log(movie);
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
    console.log(movie);
    const card = `
    <a class="movie-card bg-light border-1" href="/imdb-clone/movie.html?title=${movie.Title}">
  
      <img
        src="${movie.Poster}"
        class="card-img-top movie-card-image h-100"
        alt="..."
      />
    <div class="overlay">
      <h4>${movie.Title}</h4>
    </div>
  </a>
  `;

    document.querySelector(".page-content").innerHTML = card;
  }
};

//Function to fetch Movie (search)
const fetchMovie = async () => {
  console.log("Fetchmovie");
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
