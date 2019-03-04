// importing named exports we use brackets
import { createPostTile, uploadImage, sortDescending,clearBox, followUser, unfollowUser} from './helpers.js';
import { createSignUpForm } from './login.js';
import { checkPassword } from './checkLogin.js';
import { logout } from './logout.js';
import { signUp } from './signUp.js';
import { seeProfile } from './seeProfile.js'

// when importing 'default' exports, use below syntax
import API from './api.js';

const api  = new API();
//api.makeAPIRequest("/users.json").then((r)=>console.log(r));

//get the local storage
var currentUser = window.localStorage.getItem('AUTH_KEY');

//if not sign in or sign up, cannot show main page
console.log(currentUser);

// //get the main page box
var box = document.getElementById('mainPage');
var profilePage = document.getElementById('profile-page');
var feedPage = document.getElementById('large-feed');
var loginForm = document.getElementById('loginForm');
var registerForm = document.getElementById('signUpForm');

//used to refresh
if (currentUser === null) {
    //add login form here
    box.style.display = "none";
    createSignUpForm();
    var loginButton = document.getElementById('loginButton');
    // var registerButton = document.getElementById('')
    loginButton.addEventListener('click', checkPassword);
    var registerButton = document.getElementById('registerButton');
    registerButton.addEventListener('click', signUp);
    clearBox('followingList');

} else {
    box.style.display = "block";
    profilePage.style.display = "none";
    loginForm.style.display = "none";
    registerForm.style.display = "none";
    window.localStorage.setItem('inProfile', 'false');
    window.localStorage.setItem('reload', 10);
    const feed = api.getFeed(0);
    clearBox('followingList');

    feed
    .then(response => {
        console.log(response.status);
        response.json().then((data) => {
            var feedArray = data.posts;
            console.log(feedArray);
            if (data.posts.length != 0) {
                feedArray.sort(sortDescending);
                feedArray.reduce((parent, post) => {
                    parent.appendChild(createPostTile(post));
                    return parent;
                }, document.getElementById('large-feed'))
            }
        });
    });


    // Potential example to upload an image
    // const input = document.querySelector('input[type="file"]');
    // input.addEventListener('change', uploadImage);
}

// Potential example to upload an image
const input = document.querySelector('input[type="file"]');
input.addEventListener('change', uploadImage);

var logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', logout);

/*
see the profile of user itself
*/
var profileButton = document.getElementById('profile');
profileButton.addEventListener('click', function() {
    seeProfile();

});

document.getElementById('followUser').addEventListener('click', followUser);
document.getElementById('unfollowUser').addEventListener('click', unfollowUser);

document.getElementById('loadMore').addEventListener('click', function() {
    var start = window.localStorage.getItem('reload');
    api.getFeed(start)
    .then(response => {
        console.log(response.status);
        response.json().then((data) => {
            var feedArray = data.posts;
            console.log(feedArray);
            if (data.posts.length != 0) {
                feedArray.sort(sortDescending);
                window.localStorage.setItem('reload', Number(start) + data.posts.length);
                feedArray.reduce((parent, post) => {
                    parent.appendChild(createPostTile(post));
                    return parent;
                }, document.getElementById('large-feed'))
            }
        });
    });
})

/*
press instagram can assume as refresh, go to main page
also need to clean the storage in the profile
*/

document.getElementById('ins').addEventListener('click', function() {
    clearBox('self-posts');
    window.localStorage.setItem('inProfile', 'false');
    box.style.display = "block";
    feedPage.style.display = "block";
    profilePage.style.display = "none";
    loginForm.style.display = "none";
    registerForm.style.display = "none";
    clearBox('followingList');
})
