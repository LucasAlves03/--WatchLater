import { tmdbApiKey } from './config.js';

export function searchMovies() {
    const searchTerm = document.getElementById('movie-search').value;
    const apiKey = tmdbApiKey;

    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
            const movies = data.results;
            const movieList = document.getElementById('movie-container');
            movieList.innerHTML = '';

            movies.forEach(movie => {
                const movieCard = createMovieCard(movie);

                const saveButton = createSaveButton(movie);
                movieCard.appendChild(saveButton);

                movieList.appendChild(movieCard);
            });
        })
        .catch(error => {
            console.error('Ocorreu um erro:', error);
        });
}


function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');

    const posterURL = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    const posterImg = document.createElement('img');
    posterImg.src = posterURL;

    const title = document.createElement('h2');
    title.textContent = movie.title;

    const rating = document.createElement('p');
    const roundedRating = Math.round(movie.vote_average * 10) / 10;
    rating.textContent = `Avaliação: ⭐${roundedRating}`;

    const removeButton = createRemoveButton(movie);
    movieCard.appendChild(posterImg);
    movieCard.appendChild(title);
    movieCard.appendChild(rating);
    movieCard.appendChild(removeButton);

    return movieCard;
}
function createSaveButton(movie) {
    const saveButton = document.createElement('button');
    saveButton.textContent = '+';
    saveButton.addEventListener('click', () => {
        saveMovieForLater(movie);
        saveButton.disabled = true; 
    });
    return saveButton;
}

function saveMovieForLater(movie) {
    const watchLaterContainer = document.getElementById('watch-later-container');
    const movieCard = createMovieCard(movie);
    
    watchLaterContainer.appendChild(movieCard);

    saveMovieToLocalStorage(movie);
}

function saveMovieToLocalStorage(movie) {
    if (typeof Storage !== 'undefined') {
        const savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

        const isAlreadySaved = savedMovies.some(savedMovie => savedMovie.id === movie.id);

        if (!isAlreadySaved) {
            savedMovies.push(movie);

            localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
        }
    } else {
        alert('Seu navegador não suporta armazenamento local. Não é possível salvar filmes para assistir mais tarde.');
    }
}

function loadSavedMovies() {
    const watchLaterContainer = document.getElementById('watch-later-container');

    if (typeof Storage !== 'undefined') {
        const savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

        savedMovies.forEach(movie => {
            const movieCard = createMovieCard(movie);
            watchLaterContainer.appendChild(movieCard);
        });
    }
}

function createRemoveButton(movie) {
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remover';
    removeButton.addEventListener('click', () => {
        removeMovieFromWatchLaterList(movie);
        removeButton.parentNode.remove(); 
    });

    return removeButton;
}

function removeMovieFromWatchLaterList(movie) {
    if (typeof Storage !== 'undefined') {
        const savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

        const updatedWatchLaterList = savedMovies.filter(savedMovie => savedMovie.id !== movie.id);

        localStorage.setItem('savedMovies', JSON.stringify(updatedWatchLaterList));
    } else {
        alert('Seu navegador não suporta armazenamento local. Não é possível remover filmes da lista.');
    }
}

function saveAddedMovieToLocalStorage(movie) {
    if (typeof Storage !== 'undefined') {
        const addedMovies = JSON.parse(localStorage.getItem('addedMovies')) || [];

        const isAlreadyAdded = addedMovies.some(addedMovie => addedMovie.id === movie.id);

        if (!isAlreadyAdded) {
            addedMovies.push(movie);

            localStorage.setItem('addedMovies', JSON.stringify(addedMovies));
        }
    } else {
        alert('Seu navegador não suporta armazenamento local. Não é possível salvar filmes adicionados.');
    }
}

function loadAddedMovies() {
    const movieList = document.getElementById('movie-container');

    if (typeof Storage !== 'undefined') {
        const addedMovies = JSON.parse(localStorage.getItem('addedMovies')) || [];

        addedMovies.forEach(movie => {
            const movieCard = createMovieCard(movie);

            const removeButton = createRemoveButton(movie);
            movieCard.appendChild(removeButton);

            movieList.appendChild(movieCard);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search');
    searchButton.addEventListener('click', searchMovies);
    loadSavedMovies();
    loadAddedMovies();
});
