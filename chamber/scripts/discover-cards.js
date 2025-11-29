//import the data for the places of interest
import places from "../data/places.mjs";

//Print to console :
//console.log(places) //UNCOMMENT FOR DEBUGGING

// get the container for the discover cards
const discoverCards = document.querySelector('main');

const displayDiscoverCards= (interestPlaces) => {
    interestPlaces.forEach(place => {
        /************ FOR POPULATING GRID IN DISCOVER PAGE ****************/
        //Create elements to build for each card:
        let card = document.createElement('div');
        let title = document.createElement('h2');
        let imgContainer = document.createElement('figure');
        let imgDescription = document.createElement('figcaption');
        let photo = document.createElement('img');
        let address = document.createElement('span');
        let description = document.createElement("p");
        let learnMoreBtn = document.createElement("button");

        //Build figure (fig) content -----------------------
        //Build img content:
        photo.setAttribute('src', place.image);
        photo.setAttribute('alt', `Photo of ${place.name}`);
        photo.setAttribute('loading', 'lazy');
        photo.setAttribute('width', '300');
        photo.setAttribute('height', '200');

        //Build figCaption content:
        imgDescription.textContent = `Photo of ${place.name}`;

        imgContainer.appendChild(photo);
        imgContainer.appendChild(imgDescription);
        //--------------------------------------------------
        //Build Place Name (h2) content
        title.textContent = place.name;
        //--------------------------------------------------
        //Build the address (span tag) with content:
        address.textContent = `Address: ${place.address.street} ${place.address.city}, ${place.address.country} ${place.address.zip}`;
        //--------------------------------------------------
        //Build the description (p) tag with content: 
        description.textContent = place.description;
        //--------------------------------------------------
        //Build the Learn More Button:
        learnMoreBtn.textContent = "Learn More";
        learnMoreBtn.classList.add('learn-more-btn'); 

        //Append all content to card(div):
        card.appendChild(title);
        card.appendChild(imgContainer);
        card.appendChild(address);
        card.appendChild(description);
        card.appendChild(learnMoreBtn);
        card.classList.add('discover-cards');

        //Append the card(div) to discoverCards(main):
        discoverCards.appendChild(card);
    });
}

//Display the content for the cards
displayDiscoverCards(places);

//Use Local Storage to store the date of last visit
//VARIABLES:
let visitCount = localStorage.getItem('pageVisitCount'); //Get current visit count from Local storage
let firstVisitDate = localStorage.getItem("firstVisitDate"); //Get first visit date from local storage
let currentVisitDate = localStorage.getItem("currentVisitDate"); //Get current visit date from local storage
let visitorMsg = document.querySelector('#visitor-msg'); //get container to display message

//If it is their first visit, make a visitCount zero:
if (!visitCount && !firstVisitDate && !currentVisitDate) {
    visitCount = 0
    firstVisitDate = new Date(); //store first visit date
    currentVisitDate = new Date(); //store most current visit date
} else { //convert the string to a number
    visitCount = parseInt(visitCount);    
}

//Add to number of visits
visitCount++;

//Update local storage variable
localStorage.setItem('pageVisitCount', visitCount);
localStorage.setItem('firstVisitDate', firstVisitDate);
localStorage.setItem('currentVisitDate', currentVisitDate);

//If it is the first visit:
if (visitCount == 1){
    visitorMsg.textContent = "Welcome! Let us know if you have any questions.";
}
else {
    //Get current visit date:
    currentVisitDate = new Date();
    // currentVisitDate = new Date('2025-12-26'); // for testing day difference value 
    // console.log(currentVisitDate); //uncomment when debugging
    //Update local storage:
    localStorage.setItem('currentVisitDate', currentVisitDate);

    //Get time Difference from first visit to current visit dates:
    //Make it so that the values are Dates:
    let timeDifference = new Date(localStorage.getItem('currentVisitDate')) - new Date(localStorage.getItem('firstVisitDate'));
    
    //Convert milliseconds into days by dividing the number of milisecons in a day:
    //Use math ceil to make sure it rounds up to full days:
    let daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    //console.log(`Day Difference: ${daysDifference}`); //uncomment when debugging
    
    //Compare the number of days between visits:
    //If amount of time is less than a day:
    if (daysDifference < 1) {
        //Show the message "Back so soon! Awesome!"
        visitorMsg.textContent = "Back so soon! Awesome!";
    }
    //If amount of time is a day or more than a day
    else if (daysDifference >= 1) {
        //if amount of time passed is a day
        if (daysDifference == 1) {
            //display message as: "You last visited (numDays) days ago."
            visitorMsg.textContent = `You last visited ${daysDifference} day ago.`;
        }
        else {
            //else display number of days as: "You last visited (numDays) days ago."
            visitorMsg.textContent = `You last visited ${daysDifference} days ago.`;
        }
        
    }
}

//console.log(`This page has been visited ${visitCount} times.`); //uncomment when debugging
//console.log(`First Visit Date ${firstVisitDate}`); //uncomment when debugging
//console.log(`Current Visit Date ${currentVisitDate}`); //uncomment when debugging