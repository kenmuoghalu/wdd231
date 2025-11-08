// Declare a variable that contains the URL of the JSON resource:
const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';

// Select the HTML div with the id "cards"
const cards = document.querySelector("#cards");

async function getProphetData() {
    const response = await fetch(url);
    const data = await response.json();
    //console.table(data.prophets);
    displayProphets(data.prophets); // you reference the prophets array of the JSON data object, not just the object
}

/*
NOTE: Remember that functions are hoisted and therefore, 
where ever you define the function in your main line of code 
does not matter as it is available to the rest of the scoped code.
 */
const displayProphets = (prophets) => {
    prophets.forEach((prophet) => {
        //Create elements to build the card in the selected div element
        let card = document.createElement('section');
        let fullName = document.createElement('h2');
        let info_container = document.createElement('span');
        let dateOfBirth = document.createElement('p');
        let placeOfBirth = document.createElement('p');
        let protrait = document.createElement('img');

        //Build the h2 content to show the prophet's full name
        fullName.textContent = `${prophet.name} ${prophet.lastname}`;

        //Build the span content to show info about date of birth and place of birth:
        dateOfBirth.textContent = `Date of Birth: ${prophet.birthdate}`;
        placeOfBirth.textContent = `Palce of Birth: ${prophet.birthplace}`;

        //Build the image by setting the relevant attributes
        protrait.setAttribute('src', prophet.imageurl);
        protrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`);
        protrait.setAttribute('loading', 'lazy');
        protrait.setAttribute('width', '340');
        protrait.setAttribute('height', '440');

        //Append the span (info_container) with the created p tag elements
        info_container.appendChild(dateOfBirth);
        info_container.appendChild(placeOfBirth);

        //Append the section(card) with the created elements
        card.appendChild(fullName);
        card.appendChild(info_container);
        card.appendChild(protrait);

        cards.appendChild(card); // append to the div #cards
    });
}

getProphetData();
