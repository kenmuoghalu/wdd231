import { membershipInfo } from '../data/membership-info.js';
//console.log(membershipInfo); //for debugging

//Get the container where to show the dialog
const membershipInfoCards = document.querySelector("#cardsShowHere");
const membershipDialog = document.querySelector("#memberDialog");
const membershipTitle = document.querySelector("#memberDialog h2");
const membershipClose = document.querySelector("#memberDialog button");
const memberInfoContainer = document.querySelector("#memberDialog p");
const timestamp = document.querySelector("#timestamp");
const submitDate = new Date();

timestamp.value = submitDate.toDateString();
console.log(timestamp.value);

membershipClose.addEventListener("click", () => {
    membershipDialog.close();
});

//Loop through the array of JSON items
function displayMembershipInfo(data) {
    //console.log(data); //for debugging
    data.forEach( info => {
        //console.log(info); for debugging

        const infoContainer = document.createElement('div');
        const title = document.createElement('h3');
        const learnMoreBtn = document.createElement('button');


        //Add event listener to the button
        learnMoreBtn.addEventListener('click', () => showInfo(info));
        //Add text to button
        learnMoreBtn.textContent = "Learn More";

        //Add the name of the title in the h2 tag created
        title.textContent = info.name;

        //Make the info container
        infoContainer.appendChild(title);
        infoContainer.appendChild(learnMoreBtn);

        //Add to the main div where it will be viewed
        membershipInfoCards.appendChild(infoContainer);
    });
}

function showInfo(info) {
    membershipTitle.innerHTML = info.name;
    memberInfoContainer.innerHTML = `Description: <br><br>${info.description}<br><br><span>Membership Price: $${info.price}</span>`;
    membershipDialog.showModal();
}

//Display items in the JSON file
displayMembershipInfo(membershipInfo);