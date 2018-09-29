let restaurant;
let reviews;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initApp = () => {
    fetchRestaurantFromURL((error, restaurant) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            // self.map = new google.maps.Map(document.getElementById('map'), {
            //     zoom: 16,
            //     center: restaurant.latlng,
            //     scrollwheel: false
            // });
            fillBreadcrumb();
            //DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
        }
    });

    fillReviewFormHTML();

    fetchReviewsFromURL((error) => {
        if (error) { // Got an error!
            console.error(error);
        }
    });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
    if (self.restaurant) { // restaurant already fetched!
        callback(null, self.restaurant)
        return;
    }
    const id = getParameterByName('id');
    if (!id) { // no id found in URL
        error = 'No restaurant id in URL'
        callback(error, null);
    } else {
        DBHelper.fetchRestaurantById(id, (error, restaurant) => {
            self.restaurant = restaurant;
            if (!restaurant) {
                console.error(error);
                return;
            }
            fillRestaurantHTML();
            callback(null, restaurant)
        });
    }
}

/**
 * Get current reviews from page URL.
 */
fetchReviewsFromURL = (callback) => {
    if (self.reviews) { // restaurant already fetched!
        callback(null, self.reviews)
        return;
    }
    const id = getParameterByName('id');
    if (!id) { // no id found in URL
        error = 'No restaurant id in URL'
        callback(error, null);
    } else {
        DBHelper.fetchReviewsByRestaurantId(id, (error, reviews) => {
            self.reviews = reviews;
            if (!reviews) {
                console.error(error);
                return;
            }
            fillReviewsHTML();
            callback(null, reviews)
        });
    }
}

saveReviewForResturant = (form, callback) => {
    console.log(form);
    // DBHelper.saveReview(review);
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
    const name = document.getElementById('restaurant-name');
    name.innerHTML = restaurant.name;

    const address = document.getElementById('restaurant-address');

    const maplink = document.createElement('a');
    maplink.href = 'https://www.google.com/maps/search/?api=1&query=' + restaurant.address;
    maplink.innerHTML = restaurant.address;

    address.appendChild(maplink);

    const image = document.getElementById('restaurant-img');
    image.className = 'restaurant-img'
    image.alt = 'Image of ' + restaurant.name;
    image.src = DBHelper.imageUrlForRestaurant(restaurant);

    const cuisine = document.getElementById('restaurant-cuisine');
    cuisine.innerHTML = restaurant.cuisine_type;

    // fill operating hours
    if (restaurant.operating_hours) {
        fillRestaurantHoursHTML();
    }

    if (restaurant.is_favorite === "false") {
        var el = document.getElementById('favSpan');
        el.classList.toggle("fa-thumbs-down");
    }

    // fill reviews
    //fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
    const hours = document.getElementById('restaurant-hours');
    for (let key in operatingHours) {
        const row = document.createElement('tr');

        const day = document.createElement('td');
        day.innerHTML = key;
        row.appendChild(day);

        const time = document.createElement('td');
        time.innerHTML = operatingHours[key];
        row.appendChild(time);

        hours.appendChild(row);
    }
}

//Built with help from following guide
//http://www.developerdrive.com/2013/08/turning-the-querystring-into-a-json-object-using-javascript/
function QueryStringToJSON(stringToParse) {
  var pairs = stringToParse.split('&');

  var result = {};
  pairs.forEach(function(pair) {
      pair = pair.split('=');
      result[pair[0]] = decodeURIComponent(pair[1] || '');
  });

  return JSON.parse(JSON.stringify(result));
}


fillReviewFormHTML = () => {
    const id = getParameterByName('id');

    let formDiv = document.getElementById('review-form');
    const reviewTitle = document.createElement('h3');
    reviewTitle.innerHTML = "Leave your review";

    const form = document.createElement('form');
    form.style = "display: inline-grid";
    form.onsubmit = function(event) {
        event.preventDefault();
        var formElement = document.querySelector('form');
        var formElementQueryString = new URLSearchParams(new FormData(formElement)).toString()
        var data = QueryStringToJSON(formElementQueryString);
        data.restaurant_id = parseInt(data.restaurant_id);
        data.rating = parseInt(data.rating);
        console.log(data);
        DBHelper.saveReview(data, (res) => {
            console.log(res);
        });
        formElement.reset();
        //fillReviewsHTML();
    };

    const idHidden = document.createElement('input');
    idHidden.type = "hidden";
    idHidden.name = "restaurant_id";
    idHidden.value = id;

    //Name Textbox and label
    const reviewNameLabel = document.createElement('label')
    reviewNameLabel.htmlFor = "name";
    reviewNameLabel.innerHTML = "Name";

    const reviewNameInput = document.createElement('input')
    reviewNameInput.id = "name";
    reviewNameInput.type = "text";
    reviewNameInput.name = "name";

    //Review Textbox and label
    const reviewRatingLabel = document.createElement('label')
    reviewRatingLabel.htmlFor = "rating";
    reviewRatingLabel.innerHTML = "Rating (1 - 5)";

    const reviewRatingInput = document.createElement('input')
    reviewRatingInput.id = "rating";
    reviewRatingInput.type = "text";
    reviewRatingInput.name = "rating";
    reviewRatingInput.maxLength = 1;
    reviewRatingInput.style = "width:20px;"

    //Comments Textarea and label
    const reviewCommentLabel = document.createElement('label')
    reviewCommentLabel.htmlFor = "comments";
    reviewCommentLabel.innerHTML = "What would you like to share?";

    const reviewCommentInput = document.createElement('textarea')
    reviewCommentInput.id = "comments";
    reviewCommentInput.type = "text";
    reviewCommentInput.name = "comments";
    reviewCommentInput.style = "height:100px";

    const reviewSubmitButton = document.createElement('input')
    reviewSubmitButton.type = "submit";
    reviewSubmitButton.name = "submit";
    reviewSubmitButton.id = "reviewSubmitButton";
    reviewSubmitButton.value = "Submit Review";
    reviewSubmitButton.style = "height:20px;margin-top:5px;"

    form.appendChild(idHidden);
    form.appendChild(reviewNameLabel);
    form.appendChild(reviewNameInput);
    form.appendChild(reviewRatingLabel);
    form.appendChild(reviewRatingInput);
    form.appendChild(reviewCommentLabel);
    form.appendChild(reviewCommentInput);
    form.appendChild(reviewSubmitButton);


    formDiv.appendChild(reviewTitle);
    formDiv.appendChild(form);
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.reviews) => {
    const container = document.getElementById('reviews-container');
    const title = document.createElement('h3');
    title.innerHTML = 'Reviews';
    container.appendChild(title);

    if (!reviews) {
        const noReviews = document.createElement('p');
        noReviews.innerHTML = 'No reviews yet!';
        container.appendChild(noReviews);
        return;
    } else {
        const ul = document.getElementById('reviews-list');
        if (reviews.length) {
            reviews.forEach(review => {
                ul.appendChild(createReviewHTML(review));
            });
        } else {
            ul.appendChild(createReviewHTML(review));
        }
        container.appendChild(ul);
    }

}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
    const li = document.createElement('li');
    const name = document.createElement('p');
    name.innerHTML = review.name;
    li.appendChild(name);

    const rating = document.createElement('p');
    rating.innerHTML = `Rating: ${review.rating}`;
    li.appendChild(rating);

    const comments = document.createElement('p');
    comments.innerHTML = review.comments;
    li.appendChild(comments);

    return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
    const breadcrumb = document.getElementById('breadcrumb');
    const li = document.createElement('li');
    li.innerHTML = restaurant.name;
    breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function toggleFavorite(x) {
    DBHelper.clearResturantCache();

    var _this = x;
    var toggleState = true;
    const id = getParameterByName('id');
    _this.classList.toggle("fa-thumbs-down");

    if (_this.classList.contains("fa-thumbs-down")) {
        toggleState = false;
    }

    DBHelper.toggleFavoriteResturant(id, toggleState, (error, restaurant) => {
        if (!restaurant) {
            console.error(error);
            return;
        }
    });
}


