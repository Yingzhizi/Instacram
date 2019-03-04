import API from './api.js';
import { createPostTile, uploadImage, sortDescending } from './helpers.js';

export function signUp() {
       console.log("I should start register now");
       var signUpBox = document.getElementById('signUpForm');
       //var signInBox = document.getElementById('loginForm');
       loginForm.style.display = "none";

       var form = document.createElement('form');
       form.className = "form-register";

       //create image
       var image = document.createElement('img');
       image.className = "mb-4";
       image.src = "https://upload.wikimedia.org/wikipedia/commons/6/65/Black_Instagram_icon.svg";
       image.width = "72";
       image.height = "72";

       //create header
       var registerHeader = document.createElement('h1');
       registerHeader.className = "h3 mb-3 font-weight-normal";
       registerHeader.innerText = "Enter your information";

       //create label
       var userLabel = document.createElement('label');
       var passLabel = document.createElement('label');
       var emailLabel = document.createElement('label');
       var nameLabel = document.createElement('label');

       userLabel.class = "sr-only";
       userLabel.for = "registerUsername";
       userLabel.innerText = "Username";

       var usrInput = document.createElement('input');
       usrInput.type = "text";
       usrInput.id = "registerUsername";
       usrInput.className = "form-control";
       usrInput.placeholder = "Username";

       passLabel.class = "sr-only";
       passLabel.for = "registerPassword";
       passLabel.innerText = "Password";

       var pswInput = document.createElement('input');
       pswInput.type = "password";
       pswInput.id = "registerPassword";
       pswInput.className = "form-control";
       pswInput.placeholder = "Password";

       emailLabel.class = "sr-only";
       emailLabel.for = "registerEmail";
       emailLabel.innerText = "Email";

       var emailInput = document.createElement('input');
       emailInput.type = "email";
       emailInput.id = "registerEmail";
       emailInput.className = "form-control";
       emailInput.placeholder = "Email";

       nameLabel.class = "sr-only";
       nameLabel.for = "registerName";
       nameLabel.innerText = "Name";

       var nameInput = document.createElement('input');
       nameInput.type = "text";
       nameInput.id = "registerName";
       nameInput.className = "form-control";
       nameInput.placeholder = "Name";

       var submitButton = document.createElement('input');
       submitButton.type = "button";
       submitButton.id = "submitRegister";
       submitButton.className = "btn btn-lg btn-primary btn-block";
       submitButton.value = "Submit";
       submitButton.addEventListener('click', checkRegister)

       form.appendChild(image);
       form.appendChild(registerHeader);
       form.appendChild(userLabel);
       form.appendChild(usrInput);
       form.appendChild(passLabel);
       form.appendChild(pswInput);
       form.appendChild(emailLabel);
       form.appendChild(emailInput);
       form.appendChild(nameLabel);
       form.appendChild(nameInput);
       form.appendChild(submitButton);
       signUpBox.appendChild(form);
       function checkRegister() {
           console.log("I click register button");
           var username = document.getElementById('registerUsername').value;
           var password = document.getElementById('registerPassword').value;
           var email = document.getElementById('registerEmail').value;
           var name = document.getElementById('registerName').value;
           var box = document.getElementById('mainPage');
           const headers = {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
           };

           var data = {
               'username': String(username),
               'password': String(password),
               'email': String(email),
               'name': String(name)
           };

           fetch("http://localhost:5000/auth/signup", {
               headers,
               method: 'POST',
               body: JSON.stringify(data)
           }).then(response => {
               response.json().then((data) => {
                       console.log(data.token);
                       if (data.token != null) {
                           console.log('here1');
                           window.localStorage.setItem('AUTH_KEY', data.token);
                           window.localStorage.setItem('username', username);
                           //get feed and add it to the mainPage
                           const api  = new API();
                           window.localStorage.setItem('reload', 10);
                           const feed = api.getFeed(0);
                           const me = api.getMe();

                           if (me != null) {
                               me.then(response => {
                                   response.json().then(data => {
                                       //the posts here is a array contains the id of each post
                                       //need to fetch it somehow
                                       window.localStorage.setItem('userId', data.id);
                                       console.log(data.id);
                                   });
                               });
                           }

                           feed
                           .then(response => {
                               console.log(response.status);
                               response.json().then((data) => {
                                   var feedArray = data.posts;
                                   feedArray.sort(sortDescending);
                                   console.log(feedArray);
                                   feedArray.reduce((parent, post) => {
                                       parent.appendChild(createPostTile(post));
                                       return parent;
                                   }, document.getElementById('large-feed'))
                               });
                           });
                           box.style.display = "block";
                           document.getElementById('profile-page').style.display = "none";
                           document.getElementById('signUpForm').style.display = "none";
                           //var toHide = document.getElementsByClassName('form-register')[0];
                       } else {
                           if (response.status == 409) {
                               alert("user name taken");
                           } else if (response.status == 400){
                               alert("Malformed Request");
                           }
                       }
                   });
           });
       }
 }
