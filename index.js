document.addEventListener('DOMContentLoaded', function() {
    const mealNameInput = document.getElementById('mealName');
    const mealDescriptionInput = document.getElementById('mealDescription');
    const addMealButton = document.getElementById('addMealButton');
    const searchInput = document.getElementById('searchInput');
    const mealList = document.getElementById('mealList');

    let meals = JSON.parse(localStorage.getItem('meals')) || [];

    function renderMeals(mealsToRender) {
        mealList.innerHTML = '';
        mealsToRender.forEach((meal, index) => {
            const mealItem = document.createElement('li');
            mealItem.className = 'list-group-item';
            mealItem.textContent = `${meal.name}: ${meal.description}`;
            mealList.appendChild(mealItem);
        });
    }

    function addMeal(name, description) {
        meals.push({ name, description });
        localStorage.setItem('meals', JSON.stringify(meals));
        renderMeals(meals);
    }

    addMealButton.addEventListener('click', () => {
        const name = mealNameInput.value.trim();
        const description = mealDescriptionInput.value.trim();

        if (name && description) {
            addMeal(name, description);
            mealNameInput.value = '';
            mealDescriptionInput.value = '';
        } else {
            alert('Please enter both a name and description for the meal.');
        }
    });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredMeals = meals.filter(meal =>
            meal.name.toLowerCase().includes(searchTerm) ||
            meal.description.toLowerCase().includes(searchTerm)
        );
        renderMeals(filteredMeals);
    });

    // Initial render
    renderMeals(meals);
});
