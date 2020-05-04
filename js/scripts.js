//IIFE wrap
var pokemonRepository = (function () {
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  var $modalContainer = document.querySelector('#modal-container');
  var $modalContainer2 = $('#modal-container');

  // defining public functions separately
  function add(pokemon) {
    repository.push(pokemon);
  }

  function getAll() {
    return repository;
  }

  function addListItem(pokemon) {
    var $pokemonList = $('.pokemon-list');
    var $listItem = $('<li class="list-item"></li>');
    var $button = $('<button class="my-button"></button').html(pokemon.name);
    $pokemonList.append($listItem);
    $listItem.append($button);
    $button.on("click", function() {
      showDetails(pokemon);
    })
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(function() {
      showModal(pokemon);
    });
  }

  function loadList() {
    return $.ajax(apiUrl)
      .then(function(json) {
        json.results.forEach(function(pokemon) {
          var pokemon = {
            name: pokemon.name,
            detailsUrl: pokemon.url
          };
          add(pokemon);
        });
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  function loadDetails(pokemon) {
    var url = pokemon.detailsUrl;
    return $.ajax(url)
      .then(function(details) {
      // Now we add the details to the item
      pokemon.imageUrl = details.sprites.front_default;
      pokemon.height = details.height;
      pokemon.weight = details.weight;
      pokemon.types = [];
        for (var i = 0; i < details.types.length; i++) {
          pokemon.types.push(details.types[i].type.name);
        };
      pokemon.abilities = [];
        for (var i = 0; i < details.abilities.length; i++) {
          pokemon.abilities.push(details.abilities[i].ability.name);
        };
    }).catch(function (e) {
      console.error(e);
    });
  }

  function showModal(pokemon) {
    // Clear all existing modal content
    $modalContainer2.html('');
    $modalContainer2.addClass('is-visible');

    var $modal = $('<div class="modal"></div>');
    $modalContainer2.append($modal);

    // Adding the new modal content
    var $closeButtonElement = $('<button class = "modal-close"></button>').html('Close');
    $modal.append($closeButtonElement);

    var $nameElement = $('<h1></h1>').html(pokemon.name);
    $modal.append($nameElement);

    var $imageElement = $('<img>').html(pokemon.imageUrl);
    $modal.append($imageElement);

    var $heightElement = $('<p></p>').html('Height: ' + pokemon.height);
    $modal.append($heightElement);

    var $weightElement = $('<p></p>').html('Weight: ' + pokemon.weight);
    $modal.append($weightElement);

    var $typesElement = $('<p></p>').html('Type: ' + pokemon.types.join(', '));
    $modal.append($typesElement);

    var $abilitiesElement = $('<p></p>').html('Abilities: ' + pokemon.abilities.join(', '));
    $modal.append($abilitiesElement);

    $closeButtonElement.on('click', hideModal);
  }

  function hideModal() {
    $modalContainer.removeClass('is-visible');
  }

/* Event listeners removed */

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    showModal: showModal,
    hideModal: hideModal,
    /* showDetails and loadDetails are private functions and as we are not using them from outside the IIFE
    they don't NEED to be returned */
    showDetails: showDetails,
    loadDetails: loadDetails
  };
})(); // end of IIFE

pokemonRepository.loadList().then(function() {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});
