//IIFE wrap
var pokemonRepository = (function () {
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  var modalContainer = $('#modal-container');

  // defining public functions separately
  function add(pokemon) {
    repository.push(pokemon);
  }

  function getAll() {
    return repository;
  }

  function addListItem(pokemon) {
    var pokemonList = $('.pokemon-list');
    var listItem = $('<li class="list-item"></li>');
    var button = $('<button class="my-button"></button').text(pokemon.name);
    pokemonList.append(listItem);
    listItem.append(button);
    button.on("click", function() {
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
    modalContainer.html('');
    modalContainer.addClass('is-visible');

    var modal = $('<div class="modal"></div>');
    modalContainer.append(modal);

    // Adding the new modal content
    var closeButtonElement = $('<button class = "modal-close"></button>').text('Close');
    modal.append(closeButtonElement);

    var nameElement = $('<h1></h1>').text(pokemon.name);
    modal.append(nameElement);

    // Img takes .attr, not .html!!! 'src' is needed
    var imageElement = $('<img>').attr('src', pokemon.imageUrl);
    modal.append(imageElement);

    var heightElement = $('<p></p>').text('Height: ' + pokemon.height);
    modal.append(heightElement);

    var weightElement = $('<p></p>').text('Weight: ' + pokemon.weight);
    modal.append(weightElement);

    var typesElement = $('<p></p>').text('Type: ' + pokemon.types.join(', '));
    modal.append(typesElement);

    var abilitiesElement = $('<p></p>').text('Abilities: ' + pokemon.abilities.join(', '));
    modal.append(abilitiesElement);

   // Modal closes upon clicking the close button
    closeButtonElement.on('click', hideModal);
  }

  function hideModal() {
    modalContainer.removeClass('is-visible');
  }

   // Modal closes upon hitting Esc
  $(window).on('keydown', (e) => {
     if (e.key === 'Escape' && modalContainer.hasClass('is-visible')) {
       hideModal();
     }
   });

   // Modal closes upon clicking outside of it
   modalContainer.on('click', (e) => {
     var target = e.target;
     if ($(target).is(modalContainer)) {
       hideModal();
     }
   });

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
