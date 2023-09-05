  // Função para buscar e exibir filmes
// Função para buscar e exibir filmes
function searchMovies() {
    const searchTerm = document.getElementById('movie-search').value;
    const config = require('../config.json');
    const apiKey = config.tmdbApiKey;

    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
            const movies = data.results;
            const movieList = document.getElementById('movie-container');
            movieList.innerHTML = ''; // Limpa a lista de filmes antes de adicionar os novos

            movies.forEach(movie => {
                const movieCard = createMovieCard(movie);

                // Adiciona o botão de salvar para assistir mais tarde
                const saveButton = createSaveButton(movie);
                movieCard.appendChild(saveButton);

                movieList.appendChild(movieCard);
            });
        })
        .catch(error => {
            console.error('Ocorreu um erro:', error);
        });
}

// Função para criar um cartão de filme
function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');

    const posterURL = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    const posterImg = document.createElement('img');
    posterImg.src = posterURL;

    const title = document.createElement('h2');
    title.textContent = movie.title;
    const removeButton = createRemoveButton(movie); // Adicione o botão de remover
    

    movieCard.appendChild(posterImg);
    movieCard.appendChild(title);
    movieCard.appendChild(removeButton);

    return movieCard;
}

// Função para criar um botão de salvar para assistir mais tarde
function createSaveButton(movie) {
    const saveButton = document.createElement('button');
    saveButton.textContent = '+';
    saveButton.addEventListener('click', () => {
        saveMovieForLater(movie);
        saveButton.disabled = true; // Impede o usuário de salvar o filme novamente
    });

    return saveButton;
}

// Função para salvar um filme para assistir mais tarde
function saveMovieForLater(movie) {
    const watchLaterContainer = document.getElementById('watch-later-container');

    // Crie um novo cartão de filme para o filme salvo
    const movieCard = createMovieCard(movie);
    
    watchLaterContainer.appendChild(movieCard);

    // Salve o filme no armazenamento local
    saveMovieToLocalStorage(movie);
}

// Função para salvar um filme no armazenamento local
function saveMovieToLocalStorage(movie) {
    // Verifica se o armazenamento local é suportado pelo navegador
    if (typeof Storage !== 'undefined') {
        // Obtém a lista de filmes salvos do armazenamento local (se existir)
        const savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

        // Verifica se o filme já está na lista
        const isAlreadySaved = savedMovies.some(savedMovie => savedMovie.id === movie.id);

        if (!isAlreadySaved) {
            // Adiciona o filme à lista de filmes salvos
            savedMovies.push(movie);

            // Atualiza o armazenamento local
            localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
        }
    } else {
        alert('Seu navegador não suporta armazenamento local. Não é possível salvar filmes para assistir mais tarde.');
    }
}

// Função para carregar os filmes salvos do armazenamento local ao carregar a página
function loadSavedMovies() {
    const watchLaterContainer = document.getElementById('watch-later-container');

    // Verifica se o armazenamento local é suportado pelo navegador
    if (typeof Storage !== 'undefined') {
        // Obtém a lista de filmes salvos do armazenamento local (se existir)
        const savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

        // Adicione os filmes salvos à lista "Filmes para Assistir Mais Tarde"
        savedMovies.forEach(movie => {
            const movieCard = createMovieCard(movie);
            watchLaterContainer.appendChild(movieCard);
        });
    }
}
// ... (código anterior) ...

// Função para criar um botão de remover filme da lista de "Filmes para Assistir Mais Tarde"
function createRemoveFromWatchLaterButton(movie) {
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remover';
    removeButton.addEventListener('click', () => {
        removeMovieFromWatchLaterList(movie);
        removeButton.parentNode.remove(); // Remove o cartão de filme da lista
    });

    return removeButton;
}

// Função para remover um filme da lista de "Filmes para Assistir Mais Tarde" e do armazenamento local
function removeMovieFromWatchLaterList(movie) {
    // Verifica se o armazenamento local é suportado pelo navegador
    if (typeof Storage !== 'undefined') {
        // Obtém a lista de filmes salvos do armazenamento local (se existir)
        const savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

        // Remove o filme da lista de "Filmes para Assistir Mais Tarde"
        const updatedWatchLaterList = savedMovies.filter(savedMovie => savedMovie.id !== movie.id);

        // Atualiza o armazenamento local
        localStorage.setItem('savedMovies', JSON.stringify(updatedWatchLaterList));
    } else {
        alert('Seu navegador não suporta armazenamento local. Não é possível remover filmes da lista.');
    }
}



// Função para salvar um filme adicionado no armazenamento local
function saveAddedMovieToLocalStorage(movie) {
    // Verifica se o armazenamento local é suportado pelo navegador
    if (typeof Storage !== 'undefined') {
        // Obtém a lista de filmes adicionados do armazenamento local (se existir)
        const addedMovies = JSON.parse(localStorage.getItem('addedMovies')) || [];

        // Verifica se o filme já está na lista
        const isAlreadyAdded = addedMovies.some(addedMovie => addedMovie.id === movie.id);

        if (!isAlreadyAdded) {
            // Adiciona o filme à lista de adicionados
            addedMovies.push(movie);

            // Atualiza o armazenamento local
            localStorage.setItem('addedMovies', JSON.stringify(addedMovies));
        }
    } else {
        alert('Seu navegador não suporta armazenamento local. Não é possível salvar filmes adicionados.');
    }
}
function createRemoveButton(movie) {
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remover';
    removeButton.addEventListener('click', () => {
        removeMovieFromWatchLaterList(movie);
        removeButton.parentNode.remove(); // Remove o cartão de filme da lista
    });

    return removeButton;
}

// Função para carregar os filmes adicionados ao carregar a página
function loadAddedMovies() {
    const movieList = document.getElementById('movie-container');

    // Verifica se o armazenamento local é suportado pelo navegador
    if (typeof Storage !== 'undefined') {
        // Obtém a lista de filmes adicionados do armazenamento local (se existir)
        const addedMovies = JSON.parse(localStorage.getItem('addedMovies')) || [];

        // Adicione os filmes adicionados à lista de filmes
        addedMovies.forEach(movie => {
            const movieCard = createMovieCard(movie);

            // Adiciona o botão de remover filme adicionado
            const removeButton = createRemoveButton(movie);
            movieCard.appendChild(removeButton);

            movieList.appendChild(movieCard);
        });
    }
}

// Chama a função para carregar os filmes adicionados ao carregar a página


// Chama a função para carregar os filmes salvos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    loadSavedMovies();
    loadAddedMovies();
});