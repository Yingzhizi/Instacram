import { clearBox } from './helpers.js';

export function logout() {
      //then switch back to the login page
      //logout first clear the local storage
      localStorage.clear();

      console.log("I click logout button");

      //delete feed data from large-feed
      clearBox('large-feed');
      clearBox('followingList');

      document.getElementById('mainPage').style.display = "none";
      document.getElementById('loginForm').style.display = "block";

}
