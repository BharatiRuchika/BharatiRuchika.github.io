// Select the search input element
const inputEle = document.querySelector('#searchInput input');

// Get references to HTML elements
const mealElement = document.getElementById('mealContainer')
const favoritesList = document.getElementById('favoritesList');
let favorites = [];

// Function to add a meal to favorites
function addToFavorites() {
    const mealData = JSON.parse(this.getAttribute('data-meal'));

    // Check if the meal is already added in favorites section
    if (favorites.some(favorite => favorite.idMeal === mealData.idMeal)) {
        alert('Already added to favorites');
        return;
    }

    // Add meal to favorites array and update the Favourites section
    alert("added to favourites")
    favorites.push(mealData);
    displayFavorites()
}

// Function to remove a meal from favorites section
function removeFromFavorites() {
    const mealData = JSON.parse(this.getAttribute('data-meal'));
    favorites = favorites.filter(meal => meal.idMeal !== mealData.idMeal);
    displayFavorites()
}

// Function to open a new page showing meal details
function goToDetails() {
    const mealData = JSON.parse(this.getAttribute('data-meal'));

    // Open a new page
    const newPage = window.open('about:blank', '_blank');
    newPage.mealData = mealData;

    // Write HTML content to the new page
    if (newPage) {
        newPage.document.write(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Meal Details Page</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
           <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css"
           integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous" />
          <link href="style.css" rel="stylesheet" type="text/css" media="all" />
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <link rel="stylesheet" href="HomePage.css"/>
        </head>
        <body>
            <div id="mealDetails" class="container">
                <div class="row mt-5">
                    <div class="col-4" id="imageSection">
                        <div class="row">
                            <div class="col-12" id="mealHeader">
                                <h1 class="heading">${mealData.strMeal}</h1>
                            </div>
                            <div class="col-12">
                                <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"/>
                            </div>
                        </div>
                    </div>
                    <div class="col-8" id="instructionsSection">
                        <div class="row">
                            <div class="col-12">
                                <h1 class="heading">Instructions</h1>
                            </div>
                            <div class="col-12">
                                <div class="row" id="instructionsElement">
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
           <script>
                var instructions = document.getElementById('instructionsElement');
                var instructionsArray = (mealData.strInstructions).split(".");
                var instructionsList = instructionsArray.map((instruction) => {
                if(instruction!=''){
                    return \`<li>\${instruction.trim()}</li>\`;
                }
                }).join('');
                instructions.innerHTML = \`<ul>\${instructionsList}</ul>\`;
            </script>
        </body>
        </html>`);
    } else {
        alert("The new page could not be opened.");
    }
}

// Function to display favorite meals
function displayFavorites() {
    favoritesList.innerHTML = favorites.map(meal =>
        `<div class="offset-1 col-4 col-md-3 col-lg-1 images">
            <div class="row">
                <div class="imgContainer">
                    <div class="col-12">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                    </div>
                    <div class="meal-name">
                        <h6 class="heading">${meal.strMeal}</h6>
                    </div>
                </div>
                <div class="col-12">
                    <button class="remove-btn" data-meal='${JSON.stringify(meal)}'>Remove</button>
                </div>
            </div>
        </div>`
    ).join('')

    // Store favorites in local storage
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Add event listeners to remove buttons
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => button.addEventListener('click', removeFromFavorites));
}

// Event listener for keyup in the search input
inputEle.addEventListener('keyup', function (e) {
    const value = inputEle.value
    if (value != "") {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`)
            .then(res => res.json())
            .then(data => {
                if (data.meals === null) {
                    result.innerText = "No search results found"
                    mealElement.innerHTML = ""
                } else {
                    result.innerText = ""
                    // Clean and display meal results
                    const cleanMeals = data.meals.map((meal) => {
                        const updatedMeal = {};
                        for (const key in meal) {
                            if (meal.hasOwnProperty(key)) {
                                let value = meal[key];
                                if (value !== null && typeof value === 'string') {
                                    value = value.replace(/[\r\n]+/g, '');
                                    value = value.replace(/'/g, '');
                                }
                                if (key == 'strInstructions') {
                                    console.log('value', value)
                                }
                                updatedMeal[key] = value;
                            }
                        }
                        return updatedMeal;
                    });

                    // Display clean meal results
                    mealElement.innerHTML = cleanMeals.map(meal =>
                        `
                <div class="offset-1 col-4 col-md-3 col-lg-1 images">
                    <div class="row">
                        <div class="imgContainer" data-meal='${JSON.stringify(meal)}'>
                            <div class="col-12">
                                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                            </div>
                            <div class="meal-name">
                                <h6 class="heading">${meal.strMeal}</h6>
                            </div>
                        </div>
                        <div class="col-12">
                            <button class="favorite-btn" data-meal='${JSON.stringify(meal)}'>Add to favourites</button>
                        </div>
                    </div>
                </div>
            `
                    ).join('')

                    // Add event listeners to favorite buttons and meal containers
                    const favoriteButtons = document.querySelectorAll('.favorite-btn')
                    const mealContainers = document.querySelectorAll('.imgContainer')
                    favoriteButtons.forEach(button => button.addEventListener('click', addToFavorites))
                    mealContainers.forEach(container => container.addEventListener('click', goToDetails))
                }
            })
    } else {
        mealElement.innerHTML = ""
    }
})

// Event listener for page load
window.addEventListener('load', () => {
    
    // Retrieve stored favorites from local storage
    const storedFavorites = JSON.parse(localStorage.getItem('favorites'));
    if (Array.isArray(storedFavorites)) {
        favorites.push(...storedFavorites);
        displayFavorites();
    }
});

