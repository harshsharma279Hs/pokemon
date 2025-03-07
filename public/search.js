// Select the input element with the id "search-input" using querySelector
const inputElement = document.querySelector("#search-input");

// Select the search close icon element with the id "search-close-icon" using querySelector
const search_icon = document.querySelector("#search-close-icon");

// Select the element with class "sort-wrapper" using querySelector
const sort_wrapper = document.querySelector(".sort-wrapper");

// Add an event listener to the input element for input events
inputElement.addEventListener("input", () => {
  // When input event occurs, call the handleInputChange function and pass the input element
  handleInputChange(inputElement);
});

// Add an event listener to the search close icon for click events
search_icon.addEventListener("click", handleSearchCloseOnClick);

// Add an event listener to the sort wrapper for click events
sort_wrapper.addEventListener("click", handleSortIconOnClick);

// Function to handle input changes
function handleInputChange(inputElement) {
  // Get the value of the input element
  const inputValue = inputElement.value;

  // Check if the input value is not empty
  if (inputValue !== "") {
    // Add a class to make the search close icon visible
    document
      .querySelector("#search-close-icon")
      .classList.add("search-close-icon-visible");
  } else {
    // Remove the class to hide the search close icon
    document
      .querySelector("#search-close-icon")
      .classList.remove("search-close-icon-visible");
  }
}

// Function to handle the click on the search close icon
function handleSearchCloseOnClick() {
  // Clear the value of the search input
  document.querySelector("#search-input").value = "";

  // Remove the class to hide the search close icon
  document
    .querySelector("#search-close-icon")
    .classList.remove("search-close-icon-visible");
}

// Function to handle the click on the sort icon
function handleSortIconOnClick() {
  // Toggle the class to open/close the filter wrapper
  document
    .querySelector(".filter-wrapper")
    .classList.toggle("filter-wrapper-open");

  // Toggle the class to show/hide an overlay on the body
  document.querySelector("body").classList.toggle("filter-wrapper-overlay");
}
