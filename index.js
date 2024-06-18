// Constants for DOM elements
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResultsDiv = document.getElementById('searchResults');
const favouriteMealsList = document.getElementById('favouriteMeals');

// Event listener for search form submission
searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        const meals = await searchMealByName(searchTerm);
        displaySearchResults(meals);
    }
});

// Function to search meals by name from API
async function searchMealByName(name) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    const data = await response.json();
    return data.meals;
}

// Function to display search results
function displaySearchResults(meals) {
    searchResultsDiv.innerHTML = '';
    meals.forEach(meal => {
        const mealCard = createMealCard(meal);
        searchResultsDiv.appendChild(mealCard);
    });
}

// Function to create a meal card with favourite button
function createMealCard(meal) {
    const mealCard = document.createElement('div');
    mealCard.classList.add('card', 'mb-3');
    mealCard.innerHTML = `
        <div class="row no-gutters">
            <div class="col-md-4">
                <img src="${meal.strMealThumb}" class="card-img" alt="${meal.strMeal}">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${meal.strMeal}</h5>
                    <p class="card-text">${meal.strInstructions.slice(0, 150)}...</p>
                    <button class="btn btn-primary btn-sm" onclick="addToFavourites('${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}')">Add to Favourites</button>
                    <a href="meal.html?id=${meal.idMeal}" class="btn btn-secondary btn-sm">View Details</a>
                </div>
            </div>
        </div>
    `;
    return mealCard;
}

// Function to add a meal to favourites
function addToFavourites(id, name, imageUrl) {
    const favouriteMeal = { id, name, imageUrl };
    // Check if meal already exists in favourites
    if (!isMealInFavourites(id)) {
        // Add to favourites list (localStorage for persistence)
        let favourites = JSON.parse(localStorage.getItem('favouriteMeals')) || [];
        favourites.push(favouriteMeal);
        localStorage.setItem('favouriteMeals', JSON.stringify(favourites));
        // Update UI
        updateFavouriteMealsUI();
    }
}

// Function to check if a meal is already in favourites
function isMealInFavourites(id) {
    let favourites = JSON.parse(localStorage.getItem('favouriteMeals')) || [];
    return favourites.some(meal => meal.id === id);
}

// Function to update the UI with favourite meals
function updateFavouriteMealsUI() {
    favouriteMealsList.innerHTML = '';
    let favourites = JSON.parse(localStorage.getItem('favouriteMeals')) || [];
    favourites.forEach(meal => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.innerHTML = `
            <div class="d-flex justify-content-between">
                <span>${meal.name}</span>
                <button class="btn btn-danger btn-sm" onclick="removeFromFavourites('${meal.id}')">Remove</button>
            </div>
        `;
        favouriteMealsList.appendChild(listItem);
    });
}

// Initial load: update UI with existing favourite meals
updateFavouriteMealsUI();
