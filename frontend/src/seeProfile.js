import API from './api.js';
import { createPostTile, uploadImage, sortDescending, clearBox, getUserName } from './helpers.js';

export function seeProfile() {
    // document.getElementById('mainPage').style.display = "block";
    document.getElementById('profile-page').style.display = "block";
    document.getElementById('large-feed').style.display = "none";
    document.getElementById('PostFormContainer').style.display = "none";
    document.getElementById('createPost').style.display = "inline-block";
    document.getElementById('createPost').addEventListener('click', showPostBox);
    document.getElementById('postNew').addEventListener('click', addNewPost);
    console.log('here see profile');
    const api = new API();
    const me = api.getMe();
    if (me != null) {
        console.log("me is not none");
        me.then(response => {
            response.json().then(data => {
                var username = data.username;
                //the posts here is a array contains the id of each post
                //need to fetch it somehow

                var posts = data.posts;
                var followers = data.followed_num;
                var followings = data.following.length;
                var postNum = data.posts.length;
                if (window.localStorage.getItem('inProfile') === null || window.localStorage.getItem('inProfile') === 'false') {
                    getPostList(posts, postNum);
                    window.localStorage.setItem('inProfile', 'true');
                }
                // postsList.sort(sortDescending);
                document.getElementsByClassName('USER_NAME')[0].innerText = username;
                document.getElementById('posts').innerText = postNum + " posts";
                document.getElementById('followers').innerText = followers + " followers";
                document.getElementById('following').innerText = followings + " followings";

                var modal = document.getElementById('followings');
                var span = document.getElementsByClassName("close")[1];
                document.getElementById('following').addEventListener('click', function() {
                    modal.style.display = "block";
                    clearBox('followingList');
                    for (var i = 0; i < data.following.length; i++) {
                        getUserName(data.following[i]).then(response => response.json().then(data => {
                            var name = document.createElement('h5')
                            name.innerText = data.username;
                            document.getElementById('followingList').appendChild(name);
                        }));
                    }
                    //show following list
                });
                span.onclick = function() {
                    modal.style.display = "none";
                    //clean everything in the div-whoLikes
                    clearBox('followingList');
                }
                window.onclick = function(event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                        clearBox('followingList');
                    }
                }

            })
        })
    }
}


export function getPost(id) {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + window.localStorage.getItem('AUTH_KEY')
    }

    return fetch("http://localhost:5000/post/?id=" + id, {
        headers,
        method: 'GET'
    })
}

function getPostList(posts, num) {
    for (var i = 0; i < num; i++) {
        getPost(posts[i]).then(response => response.json().then(data => {
            console.log("posts is")
            console.log(data);
            document.getElementById('self-posts').appendChild(createPostTile(data));
        }));
    }
}

function getUser(username) {
    return fetch("http://localhost:5000/dummy/user?username=" + username, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

function addNewPost() {
    var description = document.getElementById('descriptionOfPost').value;
    var imgSrc = window.localStorage.getItem('onload');
    var matches = imgSrc.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    console.log(imgSrc);
    console.log(matches);

    console.log(window.localStorage.getItem('AUTH_KEY'));


    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + String(window.localStorage.getItem('AUTH_KEY'))
    }

    const data = {
        "description_text": description,
        "src": String(matches[2])
    }

    fetch("http://localhost:5000/post/", {
        headers,
        method: 'POST',
        body: JSON.stringify(data)
    }).then (response => {
        console.log(response.status);
        if (response.status === 200) {
            alert('You have a new post');
            //clean the localStorage of the onload
            window.localStorage.setItem('onload', null);
            // hide the post form
            document.getElementById('PostFormContainer').style.display = "none";
        } else if (response.status === 400) {
            alert("Malformed Request / Image could not be processed");
        } else if (response.status === 403) {
            alert("Invalid Auth Token");
        }
    })
}

function showPostBox() {
    if (document.getElementById('PostFormContainer').style.display === "none") {
        document.getElementById('PostFormContainer').style.display = "block";
    } else {
        document.getElementById('PostFormContainer').style.display = "none";
    }
}
