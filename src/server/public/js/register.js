// error message cross button
const errorCrossBtn = document.querySelector('#close-error');
const errorMsg = document.querySelector('.error-message');
if(errorCrossBtn){
    errorCrossBtn.addEventListener("click", () =>{
        console.log("I am here", errorMsg);
        errorMsg.style.display = "none";
    });
}else{
    console.log("No cross available");
}

// Register submit button
// const submitBtn = document.querySelector('.btnRegister');
// const registerForm = document.querySelector('#registerForm');
// if(submitBtn){
//     submitBtn.addEventListener("click", () => {
//         console.log("I am clicked");

//         registerForm.submit();
//     });
// }else{
//     console.log("No btn register");
// };



