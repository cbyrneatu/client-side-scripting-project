const root = document.getElementById("root");
const form = document.getElementById("search-form");

form.onsubmit = performSearch;

/**
 * Takes the input provided by the user and uses the IMDB API to get search results for it.
 */
async function performSearch(event) {
	// This prevents the form from:
	// 1. clearing the input values
	// 2. causing the page to reload
	// https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
	event.preventDefault();

	const inputElement = document.getElementById("search-text");
	if (!inputElement) {
		console.error("Element with the ID `search-text` does not exist...");
		return;
	}

	const text = inputElement.value;
	if (text === "") {
		console.log("User did not enter anything, not searching for anything.");
		return;
	}

	console.log(`Searching for ${text}!`);
}
