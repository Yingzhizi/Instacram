/*
returns an empty array of size max */
export const range = (max) => Array(max).fill(null);
/* returns a randomInteger */
export const randomInteger = (max = 1) => Math.floor(Math.random()*max);

/* returns a randomHexString */
const randomHex = () => randomInteger(256).toString(16);

/* returns a randomColor */
export const randomColor = () => '#'+range(3).map(randomHex).join('');

/**
 * You don't have to use this but it may or may not simplify element creation
 *
 * @param {string}  tag     The HTML element desired
 * @param {any}     data    Any textContent, data associated with the element
 * @param {object}  options Any further HTML attributes specified
 */
export function createElement(tag, data, options = {}) {
    const el = document.createElement(tag);
    el.textContent = data;

    // Sets the attributes in the options object to the element
    return Object.entries(options).reduce(
        (element, [field, value]) => {
            element.setAttribute(field, value);
            return element;
        }, el);
}

/**
 * Given a post, return a tile with the relevant data
 * @param   {object}        post
 * @returns {HTMLElement}
 */
export function createPostTile(post) {
    // like the pictures
    var id = post.id;
    var token = window.localStorage.getItem('AUTH_KEY');

    //need to add user to here
    var whoLikes = document.getElementById('who-likes');

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
    };

    const section = createElement('section', null, { class: 'post' });
    var postTitle = document.createElement('h3');
    postTitle.innerText = post.meta.author;
    postTitle.className = 'post-title';
    postTitle.id = post.meta.author;
    section.appendChild(postTitle);
    // section.appendChild(createElement('h3', post.meta.author, { class: 'post-title', id: post.meta.author }));

    var imgSrc = "data:image/png;base64," + post.src;
    section.appendChild(createElement('img', null,
        { src: imgSrc, alt: post.meta.description_text, class: 'post-image' }));

    var postInfo = createElement('session', null, { class: 'post-container' });
    //get how many likes

    // if (post.meta.likes.length != 0) {
    var likes = createElement('h5', String(post.meta.likes.length + " likes"), { id: "numOfLikes" + String(post.id) });
    var modal = document.getElementById('myModal');

    if (post.meta.likes.length === 0) {
        likes.style.display == "none";
    }

    likes.onclick = function() {
        modal.style.display = "block";
        //TODO: get user likes here
        showLikes(post.id);
    }
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
        //clean everything in the div-whoLikes
        clearBox('who-likes');
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            clearBox('who-likes');
        }
    }
    postInfo.appendChild(likes);

    var session = createElement('session', null, { class: 'nothing' });
    var span1 = createElement('span', null, { class: 'span-box' });
    var span2 = createElement('span', null, { class: 'span-box' });
    console.log(post.meta.likes);
    if (checkLikeOrNot(post.meta.likes)) {
        span1.appendChild(createElement('img', null,
            { src: '/images/unlike.png', class: 'button-sign', width:'24px', height: '24px', id:"likeSign" + String(post.id)}));
        span1.addEventListener('click', clickUnLike);
    } else {
        span1.appendChild(createElement('img', null,
            { src: '/images/like.png', class: 'button-sign', width:'24px', height: '24px', id:"likeSign" + String(post.id)}));
        span1.addEventListener('click', clickLike);
    }
    //user able to click like now
    span2.appendChild(createElement('img', null,
        { src: '/images/comment.png', class: 'button-sign', width:'24px', height: '24px'}));

    //add description
    session.appendChild(span1);
    session.appendChild(span2);
    section.appendChild(session);
    postInfo.appendChild(createElement('h5', post.meta.description_text, {}));

    //how many comments
    var c = createElement('p', String('View all ' + post.comments.length + ' comments'), { id: "numOfComments" + String(post.id)});
    c.style.color = "gray";
    c.style["font-style"] = "bold";

    //click view comments, show all comments
    var allCommentBox = document.createElement('div')
    allCommentBox.id = "showCommentBox" + String(post.id);
    allCommentBox.style.display = "none";

    postInfo.appendChild(createElement('div', null, { class:'num-of-comments' }).appendChild(c));
    postInfo.appendChild(allCommentBox);
    section.appendChild(postInfo);
    var time = dateToUTC(new Date(Number(post.meta.published)));
    postInfo.appendChild(createElement('p', time, {}));

    // add a section to post in the button, getByClassName
    var commentContainer = document.createElement('form');
    commentContainer.className = "Comment-container";
    commentContainer.id = post.id;
    commentContainer.style.display = "none";

    var commentBox = document.createElement('div');
    commentBox.style.width = "88%";
    commentBox.class = "commentBox";
    var commentArea = document.createElement('input');
    commentArea.type = "text";
    commentArea.id = "comment-info" + String(post.id);
    commentArea.className = "form-control";

    var bottonBox = document.createElement('div');
    bottonBox.style.width = "12%";
    bottonBox.className = "buttonBox";

    var commentButton = document.createElement('input');
    commentButton.type = "button";
    commentButton.id = "sommentButton" + String(post.id);
    commentButton.className = "btn btn-lg btn-primary btn-block";
    commentButton.value = "Send";
    commentButton.style.height = "34px";
    bottonBox.appendChild(commentButton);

    commentBox.appendChild(commentArea);
    bottonBox.appendChild(commentButton);
    commentContainer.appendChild(commentBox);
    commentContainer.appendChild(bottonBox);
    span2.addEventListener('click', showCommentBox);

    c.addEventListener('click', function() {
        if (document.getElementById("showCommentBox" + String(post.id)).style.display != "none") {
            document.getElementById("showCommentBox" +String(post.id)).style.display = "none";
            clearBox("showCommentBox" + String(post.id));
        } else {
            document.getElementById("showCommentBox" + post.id).style.display = "block";
            showComment(post.id);
        }
    });

    postTitle.addEventListener('click', function() {
        seeUserProfile(post.meta.author);
    });

    commentButton.addEventListener('click', function() {
        var commentsContent = document.getElementById('comment-info' + String(post.id)).value;
        var postId = post.id;
        addComment(commentsContent, postId);
        document.getElementById('numOfComments' + String(post.id)).innerText = String('View all ' + (Number(post.comments.length) + 1) + ' comments');
    });
    section.appendChild(commentContainer);
    //the day post it
    function showCommentBox() {
        if (document.getElementById(post.id).style.display != "none") {
            document.getElementById(post.id).style.display = "none";
        } else {
            document.getElementById(post.id).style.display = "flex";
        }
    }

    function clickLike() {
        fetch("http://localhost:5000/post/like?id=" + id, {
            headers,
            method: 'PUT'
        }).then(response => {
            response.json().then(data => {
                console.log(data);
            });
        });
        document.getElementById('likeSign' + String(id)).src = '/images/unlike.png'
        document.getElementById("numOfLikes" + String(post.id)).innerText = String((Number(post.meta.likes.length) + 1) + " likes");
        document.getElementById("numOfLikes" + String(post.id)).style.display = "block";
    }

    function clickUnLike() {
        fetch("http://127.0.0.1:5000/post/unlike?id=" + id, {
            headers,
            method: 'PUT'
        }).then(response => {
            response.json().then(data => {
                console.log(data);
            });
        });
        document.getElementById('likeSign' + String(id)).src = '/images/like.png';
        document.getElementById("numOfLikes" + String(post.id)).innerText = String((Number(post.meta.likes.length) - 1) + " likes");
        if (Number(post.meta.likes.length) - 1 === 0) {
            document.getElementById("numOfLikes" + String(post.id)).style.display = "none";
        }
        function decodeBase64Image(dataString) {
          var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};

          if (matches.length !== 3) {
            return new Error('Invalid input string');
          }

          response.type = matches[1];
          response.data = new Buffer(matches[2], 'base64');

          return response;
        }

    }


    return section;
}

// Given an input element of type=file, grab the data uploaded for use
export function uploadImage(event) {
    window.localStorage.setItem('onload', null);
    const [ file ] = event.target.files;

    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);

    // bad data, let's walk away
    if (!valid)
        return false;

    // if we get here we have a valid image
    const reader = new FileReader();

    reader.onload = (e) => {
        // do something with the data result
        const dataURL = e.target.result;
        const image = createElement('img', null, { src: dataURL });
        //save it to localStorage on load img
        window.localStorage.setItem('onload', dataURL);
        //document.body.appendChild(image);
    };

    // this returns a base64 image
    reader.readAsDataURL(file);
}

/*
    Reminder about localStorage
    window.localStorage.setItem('AUTH_KEY', someKey);
    window.localStorage.getItem('AUTH_KEY');
    localStorage.clear()
*/
export function checkStore(key) {
    if (window.localStorage)
        return window.localStorage.getItem(key)
    else
        return null
}

/*
sort json array in time, most recent post first
*/
export var sortAscending = function(a, b) {
  var aDate = new Date(a.meta["published"]);
  var bDate = new Date(b.meta["published"]);
  return aDate.getTime() - bDate.getTime();
}

export var sortDescending = function(a, b) { return -1 * sortAscending(a, b); }

/*
when logout, every posts in the large-feed need to been clean up
*/
export function clearBox(name) {
    console.log('clear');
    var posts = document.getElementById(name);
    while(posts.firstChild){
        posts.removeChild(posts.firstChild);
    }
}

function checkLikeOrNot(lists) {
    const result = lists.includes(parseInt(window.localStorage.getItem('userId')));
    console.log(result);
    return result;
}

function showLikes(postId) {
    //get post info
    fetch("http://localhost:5000/dummy/post?id=" + postId, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => response.json().then(data => {
        for (var i = 0; i < data.meta.likes.length; i++) {
            getUserName(data.meta.likes[i]).then(response => response.json().then(data => {
                var name = document.createElement('h5')
                name.innerText = data.username;
                document.getElementById('who-likes').appendChild(name);
            }));
        }
    }));
}

//TODO: click then show the comment
function showComment(postId) {
    fetch("http://localhost:5000/dummy/post?id=" + postId, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => response.json().then(data => {
        console.log(data.comments);
        for (var i = 0; i < data.comments.length; i++) {
            var commentUser = data.comments[i].author;
            var context = data.comments[i].comment;
            // var published = dateToUTC(new Date(Number(data.comments[i].published)));
            // console.log(published);
            console.log(commentUser);
            console.log(context);
            var single = document.createElement('div');
            single.class = "signle-comment";
            single.appendChild(createElement('h5', commentUser, { class: "comment-user-name" }));
            single.appendChild(createElement('p', context, {}));
            document.getElementById("showCommentBox" + postId).appendChild(single);
        }
    }));

}


function addComment(commentsContent, postId) {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + window.localStorage.getItem('AUTH_KEY')
    };

    var data = {};
    //if comments is empty string
    if (commentsContent === "") {
        data = {
            "author": window.localStorage.getItem('username'),
            "published": String(new Date()),
        }

    } else {
        data = {
            "author": window.localStorage.getItem('username'),
            "published": String(new Date()),
            "comment": String(commentsContent)
        }
    }

    fetch("http://localhost:5000/post/comment?id=" + postId, {
        headers,
        method: 'PUT',
        body: JSON.stringify(data)
    }).then(response => {
        console.log(response.status)
        if (response.status == 200) {
            console.log("comment successful");
            //hide comment box
            document.getElementById(postId).style.display = "none";
        } else if (response.status == 400) {
            alert("Malformed Request");
        } else if (response.status == 403) {
            alert("Invalid Auth Token");
        } else if (response.status == 404) {
            alert("Post Not Found");
        }
    });

}

export function getUserName(userId) {
    return fetch("http://localhost:5000/dummy/user?id=" + userId, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

function dateToUTC(date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}

export function followUser() {
    var username = document.getElementById('personWantToFollow').value;
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + window.localStorage.getItem('AUTH_KEY')
    }
    fetch("http://localhost:5000/user/follow?username=" + username, {
        headers,
        method: 'PUT'
    }).then(response => {
        console.log(response.status);
        if (response.status == 200) {
            //get the feed??????
            alert('success');

        } else if (response.status == 400) {
            alert('Malformed Request');
        } else if (response.status == 403) {
            alert('Invalid Auth Token');
        } else if (response.status == 404) {
            alert('User Not Found');
        }
    })
}

export function unfollowUser() {
    var username = document.getElementById('unfollow').value;;
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + window.localStorage.getItem('AUTH_KEY')
    }
    fetch("http://localhost:5000/user/unfollow?username=" + username, {
        headers,
        method: 'PUT'
    }).then(response => {
        console.log(response.status);
        if (response.status == 200) {
            //get the feed??????
            alert('unfollow successfully');
        } else if (response.status == 400) {
            alert('Malformed Request');
        } else if (response.status == 403) {
            alert('Invalid Auth Token');
        } else if (response.status == 404) {
            alert('User Not Found');
        }
    })
}

function seeUserProfile(userName) {
    document.getElementById('profile-page').style.display = "block";
    document.getElementById('large-feed').style.display = "none";
    document.getElementById('createPost').style.display = "none";
    document.getElementById('PostFormContainer').style.display = "none";
    console.log('here see profile');
    const user = getUser(userName);
    user.then(response => {
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
        })
    })
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

function getPostList(posts, num) {
    for (var i = 0; i < num; i++) {
        getPost(posts[i]).then(response => response.json().then(data => {
            console.log(data);
            document.getElementById('self-posts').appendChild(createPostTile(data));
        }));
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
