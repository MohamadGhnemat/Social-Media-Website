const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("postId");

setupUI();
getPost();
function getPost() {
  axios.get(`${baseUrl}/posts/${id}`).then((response) => {
    const post = response.data.data;
    const comments = post.comments;
    const author = post.author;
    document.getElementById("username-span").innerHTML = author.username;
    let postTitle = "";
    if (post.title != null) {
      postTitle = post.title;
    }
    let commentsContent = "";
    for (comment of comments) {
      commentsContent += `
         <div
                    class="p-3 d-flex flex-column gap-2 "
                    style="background-color: rgb(236, 236, 236)"
                  >
                    <div class="d-flex gap-3 align-items-center">
                      <img
                        class="rounded-circle"
                        src=" ${
                          typeof comment.author.profile_image == "string"
                            ? comment.author.profile_image
                            : "./profile-pics/1.png"
                        }"
                        alt="profile-img"
                        style="width: 40px; height: 40px"
                      />
                      <b>@${comment.author.username}</b>
                    </div>
                    <div>
                    ${comment.body}
                    </div>
                  </div>
          `;
    }
    const postContent = `
     <div class="card ">
            <div class="card-header d-flex align-items-center gap-2">
              <img
                src="${
                  typeof author.profile_image == "string"
                    ? author.profile_image
                    : "./profile-pics/1.png"
                }"
                alt="profile-image"
                class="rounded-circle border border-2"
              />
              <b class="m-0">@${author.username}</b>
            </div>

            <div class="card-body">
              <img
                class="w-100 rounded"
                src="${
                  typeof post.image == "string"
                    ? post.image
                    : "./placeholders/3.jpg"
                }"
                alt="card-image"
              />
              <h6 class="mt-1">${post.created_at}</h6>
              <h5>${postTitle}</h5>
              <p>
                      ${post.body}
              </p>
              <hr />
              <span>
                <i class="bi bi-pen"></i>
                (${post.comments_count}) Comments
                <span id="post-tags" class="mx-1">
                 
                </span>
              </span>
            </div>
            <div id="comments" >
            ${commentsContent}
            </div>
            ${
              localStorage.getItem("token") == null
                ? ""
                : `<div class="input-group " id="add-comment-div">
                 
                    <input type="text" id="comment-input" placeholder="add your comment here.." class="form-control">
                    
                     <button class="btn btn-outline-primary " type="button" onclick="createCommentClicked()">send</button>

               
            </div>`
            }
            
          </div>
    
    
    `;
    document.getElementById("post-data").innerHTML = postContent;
  });
}

function createCommentClicked() {
  let commentBody = document.getElementById("comment-input").value;
  let params = {
    body: commentBody,
  };
  let token = localStorage.getItem("token");
  let url = `${baseUrl}/posts/${id}/comments`;

  axios
    .post(url, params, {
      headers: {
        Authorization: `Bearer ${token}
        `,
      },
    })
    .then((response) => {
      document.getElementById("comment-input").value = "";
      showAlert("The comment has been created successfully", "success");
      getPost();
    })
    .catch((error) => {
      const errorMessage = error.response.data.message;
      showAlert(errorMessage, "danger");
    });
}
document.getElementById("liveAlertBtn").addEventListener("click", function () {
  setTimeout(function () {
    getPost();
  }, 300);
});
document
  .getElementById("registerModalR")
  .addEventListener("click", function () {
    setTimeout(function () {
      getPost();
    }, 300);
  });
document.getElementById("logout-btn").addEventListener("click", function () {
  getPost();
});
