const openButton = document.querySelector("#openButton");
const dialogBox = document.querySelector("#dialogBox");
const closeButton = document.querySelector("#closeButton");
const dialogBoxText = document.querySelector("#dialogBox div");

//"Show the dialog" button opnes the dialog modally
openButton1.addEventListener("click", () => {
    dialogBox.showModal(); //make modal show (pop-up show)
    dialogBoxText.innerHTML = `One Apple contains 95 calories`;
});

openButton2.addEventListener("click", () => {
    dialogBox.showModal(); //make modal show (pop-up show)
    dialogBoxText.innerHTML = `One Orange contains 45 calories`;
});

openButton3.addEventListener("click", () => {
    dialogBox.showModal(); //make modal show (pop-up show)
    dialogBoxText.innerHTML = `One Banana contains 105 calories`;
});

//"Close" button closes the dialog
closeButton.addEventListener("click", () => {
    dialogBox.close(); //close pop-up
});