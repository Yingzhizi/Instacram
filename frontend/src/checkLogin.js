import API from './api.js';
import { createPostTile, uploadImage, sortDescending} from './helpers.js';
import { seeProfile } from './seeProfile.js'
export function checkPassword() {
      console.log("I click login");
      var box = document.getElementById('mainPage');
      var username = document.getElementById("inputUsername").value;
      var password = document.getElementById("inputPassword").value;

      const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      };

      //depend on the input create the header
      var data;
      if (username == "" && password == "") {
          //data doesn't contains anything
          var data = {};
      }

      else if (username == "" && password != "") {
          var data = {
              'password': String(password)
          };
      } else if (username != "" && password == "") {
          var data = {
              'username': String(username)
          };
      } else {
          var data = {
              'username': String(username),
              'password': String(password)
          };
      }

      fetch("http://localhost:5000/auth/login", {
          headers,
          method: 'POST',
          body: JSON.stringify(data)
      }).then(response => {
          response.json().then((data) => {
              console.log(data.token);
              if (data.token != null) {
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
                          window.localStorage.setItem('reload', 10);
                          feedArray.sort(sortDescending);
                          console.log(feedArray);
                          feedArray.reduce((parent, post) => {
                              parent.appendChild(createPostTile(post));
                              return parent;
                          }, document.getElementById('large-feed'))
                      });
                  });

                  //display the main page, hide the login page
                  box.style.display = "block";
                  document.getElementById('profile-page').style.display = "none";
                  loginForm.style.display = "none";

              } else {
                  if (response.status == 400){
                      window.alert("Missing Username or Password!!!");
                  } else if (response.status == 403) {
                      window.alert("Invalid Username/Password");
                  }
              }
          });
      });
}
