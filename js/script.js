const fetchOptions = {
	method: "GET",
	headers: {
		"x-rapidapi-key": "32796c810dmsh49cb2662fd889b2p166ff5jsnc5b8804816fd",
		"x-rapidapi-host": "imdb-com.p.rapidapi.com",
	},
};

const root = document.getElementById("root");
const form = document.getElementById("search-form");
const limitElement = document.getElementById("search-limit");
const submitButton = document.getElementById("search-submit");

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

	let limit = limitElement.value;
	if (limit === "" || isNaN(limit)) {
		limit = 20;
	}

	// Disabling the button stops the user from submitting while data is already
	// being fetched from the API.
	submitButton.disabled = true;
	root.innerHTML = "";

	try {
		const result = await imdbSearch(text, limit);
		displaySearchResults(result);
	} catch (e) {
		console.error("IMDB search failed", e);
		displayErrorMessage("Failed to fetch data from IMDB API");
	} finally {
		// Once either the code in the try block is done or an exception is caught
		// re-enable the button.
		submitButton.disabled = false;
	}
}

/**
 * Takes search results from IMDB and displays them to the user.
 */
function displaySearchResults(result) {
	const items = result.data.mainSearch.edges;
	items.forEach((item) => {
		displaySearchResult(item.node.entity);
	});
}

/**
 * Displays a single search result from IMDB.
 */
function displaySearchResult(item) {
	const container = document.createElement("div");
	container.className = "result-card";

	if (item.primaryImage) {
		const image = document.createElement("img");
		image.src = item.primaryImage.url;
		image.style.height = "300px";

		container.appendChild(image);
	}

	const detailsContainer = document.createElement("div");

	const title = document.createElement("h3");
	title.textContent = item.titleText.text;
	detailsContainer.appendChild(title);

	if (item.releaseDate) {
		const releaseDate = document.createElement("h4");
		releaseDate.textContent = `Released on ${item.releaseDate.day}/${item.releaseDate.month}/${item.releaseDate.year}`;
		detailsContainer.appendChild(releaseDate);
	}

	if (item.principalCredits[0]) {
		const creditsContainer = document.createElement("div");
		creditsContainer.className = "credits-container";

		item.principalCredits[0].credits.forEach((actor) => {
			if (!actor.name.primaryImage) {
				return;
			}

			const element = document.createElement("img");
			element.src = actor.name.primaryImage.url;
			element.className = "actor-image";
			element.alt = `Picture of ${actor.name.nameText.text}`;

			creditsContainer.appendChild(element);
		});

		detailsContainer.appendChild(creditsContainer);
	}

	container.appendChild(detailsContainer);
	root.appendChild(container);
}

/**
 * Adds an error message to the root element of the page.
 */
function displayErrorMessage(text) {
	const message = document.createElement("p");
	message.className = "error-message";
	message.textContent = text;

	root.appendChild(message);
}

/**
 * Returns search results for a certain value from the IMDB API.
 */
async function imdbSearch(searchTerm, limit) {
	const response = await fetch(
		`https://imdb-com.p.rapidapi.com/search?searchTerm=${searchTerm}&limit=${limit}&type=MOVIE,TV`,
		fetchOptions,
	);

	if (!response.ok) {
		throw new Error("Failed to fetch data from the IMDB API!");
	}

	return await response.json();
}
