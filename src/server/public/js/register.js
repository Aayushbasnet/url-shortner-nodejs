const errorCrossBtn = document.querySelector('#close-error');
const errorMsg = document.querySelector('.error-message');

errorCrossBtn.addEventListener("click", () =>{
    errorMsg.style.display = "none";
    console.log("I am here", errorMsg);
});
