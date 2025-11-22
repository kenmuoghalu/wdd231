//Get url for info
const memberInfo = new URLSearchParams(window.location.search);
//console.log(memberInfo); //for debugging

// Variables to get input values:
// firstName = required
// lastName = required
// orgTitle
// email = required
// phone = required
// businessName = required
// businessDesc
// membershipLevel = required
// timestamp

/****For Debugging*****/
// console.log(memberInfo.get('firstName'));
// console.log(memberInfo.get('lastName'));
// console.log(memberInfo.get('email'));
// console.log(memberInfo.get('phone'));
// console.log(memberInfo.get('businessName'));
// console.log(memberInfo.get('membershipLevel'));
// console.log(memberInfo.get('timestamp'));
/*********************/

const resultsContainer = document.querySelector("#results");

resultsContainer.innerHTML = `
    <p>Welcome to the Lasg Chamber of Commerce, ${memberInfo.get('firstName')} ${memberInfo.get('lastName')}</p>
    <p>We'll be adding your business, ${memberInfo.get('businessName')}, to our members list. We're glad to have you on board</p><br>
    
    <p>Primary Contact Information:</p>
    <p>Full Name: ${memberInfo.get('firstName')} ${memberInfo.get('lastName')}</p>
    <p>Email: ${memberInfo.get('email')}</p>
    <p>Phone: ${memberInfo.get('phone')}</p><br>
   
    <p>Member Information:</p>
    <p>Business Name: ${memberInfo.get('businessName')}</p>
    <p>Registered Membership: ${memberInfo.get('membershipLevel').toUpperCase()} MEMBERSHIP</p><br>
    <p>Membership Application Form Submission Date: ${memberInfo.get('timestamp')}</p>
    `;