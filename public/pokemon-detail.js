// Variable to store the current Pokemon ID
let currentPokemonId = null;

// Event listener for when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Maximum number of Pokemons
  const MAX_POKEMONS = 151;

  // Extract the 'id' query parameter from the URL
  const pokemonID = new URLSearchParams(window.location.search).get("id");

  // Parse the 'id' to an integer
  const id = parseInt(pokemonID, 10);

  // Check if the 'id' is within valid range; if not, redirect to the index page
  if (id < 1 || id > MAX_POKEMONS) {
    return (window.location.href = "./index.html");
  }

  // Set the currentPokemonId to the valid 'id' and load Pokemon data
  currentPokemonId = id;
  loadPokemon(id);
});

// Asynchronous function to load Pokemon data
async function loadPokemon(id) {
  try {
    // Fetch both Pokemon and Pokemon species data simultaneously
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);

    // Get the abilitiesWrapper element
    const abilitiesWrapper = document.querySelector(
      ".pokemon-detail-wrap .pokemon-detail.move"
    );

    // Clear the inner HTML of abilitiesWrapper
    abilitiesWrapper.innerHTML = "";

    // Check if the loaded Pokemon data corresponds to the current Pokemon
    if (currentPokemonId === id) {
      // Display Pokemon details, flavor text, and set navigation arrows
      displayPokemonDetails(pokemon);
      const flavorText = getEnglishFlavorText(pokemonSpecies);
      document.querySelector(".body3-fonts.pokemon-description").textContent =
        flavorText;

      const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map((sel) =>
        document.querySelector(sel)
      );
      leftArrow.removeEventListener("click", navigatePokemon);
      rightArrow.removeEventListener("click", navigatePokemon);

      if (id !== 1) {
        leftArrow.addEventListener("click", () => {
          navigatePokemon(id - 1);
        });
      }
      if (id !== 151) {
        rightArrow.addEventListener("click", () => {
          navigatePokemon(id + 1);
        });
      }

      // Update the browser history to maintain the state
      window.history.pushState({}, "", `./detail.html?id=${id}`);
    }

    return true;
  } catch (error) {
    console.error("An error occurred while fetching Pokemon data:", error);
    return false;
  }
}

// Asynchronous function to navigate to a different Pokemon
async function navigatePokemon(id) {
  currentPokemonId = id;
  await loadPokemon(id);
}

// Object to map Pokemon types to colors
const typeColors = {
  normal: "#A8A878",
  fire: "#F08030",
  // ... (other type-color mappings)
};

// Function to set styles of DOM elements
function setElementStyles(elements, cssProperty, value) {
  elements.forEach((element) => {
    element.style[cssProperty] = value;
  });
}

// Function to convert a hexadecimal color to RGBA format
function rgbaFromHex(hexColor) {
  return [
    parseInt(hexColor.slice(1, 3), 16),
    parseInt(hexColor.slice(3, 5), 16),
    parseInt(hexColor.slice(5, 7), 16),
  ].join(", ");
}

// Function to set background color and styles based on Pokemon type
function setTypeBackgroundColor(pokemon) {
  const mainType = pokemon.types[0].type.name;
  const color = typeColors[mainType];

  if (!color) {
    console.warn(`Color not defined for type: ${mainType}`);
    return;
  }

  // Set background color and border color for the detail-main element
  const detailMainElement = document.querySelector(".detail-main");
  setElementStyles([detailMainElement], "backgroundColor", color);
  setElementStyles([detailMainElement], "borderColor", color);

  // Set background color for type labels and text colors for stats
  setElementStyles(
    document.querySelectorAll(".power-wrapper > p"),
    "backgroundColor",
    color
  );
  setElementStyles(
    document.querySelectorAll(".stats-wrap p.stats"),
    "color",
    color
  );
  setElementStyles(
    document.querySelectorAll(".stats-wrap .progress-bar"),
    "color",
    color
  );

  // Create and append style tag for progress bar customization
  const rgbaColor = rgbaFromHex(color);
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
    .stats-wrap .progress-bar::-webkit-progress-bar {
        background-color: rgba(${rgbaColor}, 0.5);
    }
    .stats-wrap .progress-bar::-webkit-progress-value {
        background-color: ${color};
    }
  `;
  document.head.appendChild(styleTag);
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Function to create and append an HTML element to a parent element
function createAndAppendElement(parent, tag, options = {}) {
  const element = document.createElement(tag);
  Object.keys(options).forEach((key) => {
    element[key] = options[key];
  });
  parent.appendChild(element);
  return element;
}

// Function to display Pokemon details
function displayPokemonDetails(pokemon) {
  // Extract relevant data from the Pokemon object
  const { name, id, types, weight, height, abilities, stats } = pokemon;

  // Capitalize the Pokemon name
  const capitalizePokemonName = capitalizeFirstLetter(name);

  // Update the title of the document
  document.querySelector("title").textContent = capitalizePokemonName;

  // Add a class to the detail-main element for styling
  const detailMainElement = document.querySelector(".detail-main");
  detailMainElement.classList.add(name.toLowerCase());

  // Update the Pokemon name and ID
  document.querySelector(".name-wrap .name").textContent =
    capitalizePokemonName;
  document.querySelector(
    ".pokemon-id-wrap .body2-fonts"
  ).textContent = `#${String(id).padStart(3, "0")}`;

  // Update the Pokemon image source
  const imageElement = document.querySelector(".detail-img-wrapper img");
  imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
  imageElement.alt = name;

  // Update the Pokemon type labels
  const typeWrapper = document.querySelector(".power-wrapper");
  typeWrapper.innerHTML = "";
  types.forEach(({ type }) => {
    createAndAppendElement(typeWrapper, "p", {
      className: `body3-fonts type ${type.name}`,
      textContent: type.name,
    });
  });

  // Update the Pokemon details such as weight, height, and abilities
  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight"
  ).textContent = `${weight / 10}kg`;
  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height"
  ).textContent = `${height / 10}m`;

  const abilitiesWrapper = document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail.move"
  );
  abilities.forEach(({ ability }) => {
    createAndAppendElement(abilitiesWrapper, "p", {
      className: "body3-fonts",
      textContent: ability.name,
    });
  });

  // Update the Pokemon stats
  const statsWrapper = document.querySelector(".stats-wrapper");
  statsWrapper.innerHTML = "";

  const statNameMapping = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SATK",
    "special-defense": "SDEF",
    speed: "SPD",
  };

  stats.forEach(({ stat, base_stat }) => {
    const statDiv = document.createElement("div");
    statDiv.className = "stats-wrap";
    statsWrapper.appendChild(statDiv);

    createAndAppendElement(statDiv, "p", {
      className: "body3-fonts stats",
      textContent: statNameMapping[stat.name],
    });

    createAndAppendElement(statDiv, "p", {
      className: "body3-fonts",
      textContent: String(base_stat).padStart(3, "0"),
    });

    createAndAppendElement(statDiv, "progress", {
      className: "progress-bar",
      value: base_stat,
      max: 100,
    });
  });

  // Set background color and other styles based on Pokemon type
  setTypeBackgroundColor(pokemon);
}

// Function to get the English flavor text from Pokemon species data
function getEnglishFlavorText(pokemonSpecies) {
  for (let entry of pokemonSpecies.flavor_text_entries) {
    if (entry.language.name === "en") {
      let flavor = entry.flavor_text.replace(/\f/g, " ");
      return flavor;
    }
  }
  return "";
}
