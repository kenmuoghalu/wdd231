// store the URL of the JSON resource:
const url = './data/members.json';

// get the container for the business cards
const businessCards = document.querySelector("#business-cards");

//Get the buttons in the menu:
const gridViewBtn = document.querySelector("#grid");
const listViewBtn = document.querySelector("#list");

//Function to get the data from the JSON file:
async function getBusinessData() {
    const response = await fetch(url);
    const data = await response.json();
    //console.table(data.businesses); //test on console if it is fetching data
    displayBusinessGrid(data.businesses);
}

//When GRID VIEW button is clicked:
gridViewBtn.addEventListener('click', () => {
    //Toggle class list to view ONLY the grid view
    businessCards.classList.add("grid-view");
    businessCards.classList.remove("list-view");
});

//When LIST VIEW button is clicked:
listViewBtn.addEventListener('click', () => {
    //Toggle class list to view ONLY the grid view
    businessCards.classList.add("list-view");
    businessCards.classList.remove("grid-view");
});


//Create content for Grid view
const displayBusinessGrid = (businesses) => {
    businesses.forEach(business => {
        //Create elements to build for each card:
        let card = document.createElement('section');
        let icon = document.createElement('img');
        let businessName = document.createElement('h2');

        //info container contents:
        let address = document.createElement('p');
        let phoneNumber = document.createElement('p');
        let email = document.createElement('p');
        let website = document.createElement("a");

        //Build icon (img) content:
        icon.setAttribute('src', business.image);
        icon.setAttribute('alt', `Icon for ${business.name}`);
        icon.setAttribute('loading', 'lazy');
        icon.setAttribute('width', '300');
        icon.setAttribute('height', 'auto');

        //Build businessName (h2) content
        businessName.textContent = `${business.name}`;

        //Build the (p) tags with content: 
        address.textContent = `${business.address.street}, ${business.address.city}, ${business.address.country} ${business.address.zip}`;
        phoneNumber.textContent = `${business.phone_number}`;
        email.textContent = `${business.email}`;

        //Build website(a) content:
        website.href = `${business.url}`;
        website.target = '_blank';
        website.textContent = business.url;

        //Append all content to card(section):
        card.appendChild(icon);
        card.appendChild(businessName);
        card.appendChild(address);
        card.appendChild(phoneNumber);
        card.appendChild(email);
        card.appendChild(website);


        //Append the card(section) to businessCard(#div):
        businessCards.appendChild(card);
    });
}

getBusinessData();