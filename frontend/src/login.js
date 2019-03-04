export function createSignUpForm() {
  //var loginForm = document.getElementById('loginForm');
  //create a login form
  var form = document.createElement('form');
  form.className = "form-signin";

  //create image
  var image = document.createElement('img');
  image.className = "mb-4";
  image.src = "https://upload.wikimedia.org/wikipedia/commons/6/65/Black_Instagram_icon.svg";
  image.width = "72";
  image.height = "72";

  //create header
  var loginHeader = document.createElement('h1');
  loginHeader.className = "h3 mb-3 font-weight-normal";
  loginHeader.innerText = "Please Login";

  //create label
  var userLabel = document.createElement('label');
  var passLabel = document.createElement('label');
  userLabel.class = "sr-only";
  userLabel.for = "inputUsername";
  userLabel.innerText = "Username";

  var usrInput = document.createElement('input');
  usrInput.type = "text";
  usrInput.id = "inputUsername";
  usrInput.className = "form-control";
  usrInput.placeholder = "Username";

  passLabel.class = "sr-only";
  passLabel.for = "inputPassword";
  passLabel.innerText = "Password";

  var pswInput = document.createElement('input');
  pswInput.type = "password";
  pswInput.id = "inputPassword";
  pswInput.className = "form-control";
  pswInput.placeholder = "Password";

  var submitButton = document.createElement('input');
  submitButton.type = "button";
  submitButton.id = "loginButton";
  submitButton.className = "btn btn-lg btn-primary btn-block";
  submitButton.value = "Login";

  var registerButton = document.createElement('input');
  registerButton.type = "button";
  registerButton.id = "registerButton";
  registerButton.className = "btn btn-lg btn-primary btn-block";
  registerButton.value = "Register";

  form.appendChild(image);
  form.appendChild(loginHeader);
  form.appendChild(userLabel);
  form.appendChild(usrInput);
  form.appendChild(passLabel);
  form.appendChild(pswInput);
  form.appendChild(submitButton);
  form.appendChild(registerButton);
  loginForm.appendChild(form);
}
