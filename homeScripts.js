let currentPage = 1;
let lastPage = 1;

// ========  START INFINITE SCROLL ======== //
window.addEventListener("scroll", function () {
  const endOfPage =
    //window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    // window.scrollY + window.innerHeight + 1 >=document.documentElement.scrollHeight;
    window.innerHeight + window.scrollY >= document.body.scrollHeight;
  if (endOfPage && currentPage < lastPage) {
    currentPage = currentPage + 1;
    getPosts(false, currentPage);
  }
});
// ========  END INFINITE SCROLL ======== //

setupUI();

getPosts();

function userClicked(userId) {
  window.location = `profile.html?userid=${userId}`;
}

function getPosts(reload = true, page = 1) {
  toggleLoader(true);
  axios.get(`${baseUrl}/posts?limit=6&page=${page}`).then((response) => {
    toggleLoader(false);
    const posts = response.data.data;
    if (reload) {
      document.getElementById("posts").innerHTML = "";
    }
    lastPage = response.data.meta.last_page;

    for (post of posts) {
      //console.log(post);
      const author = post.author;
      // show or hide edit
      let user = getCurrentUser();
      let isMyPost = user != null && post.author.id == user.id;
      let editBtncontent = "";
      if (isMyPost) {
        editBtncontent = `
                      <div class="updateDel">
       <button type="button" class="btn btn-secondary" onclick="editPostBtnClicked('${encodeURIComponent(
         JSON.stringify(post)
       )}')">edit</button>
       <button type="button" class="btn btn-danger" onclick="deletePostBtnClicked('${encodeURIComponent(
         JSON.stringify(post)
       )}')">delete</button>
       </div>
        
        `;
      }
      let postTitle = "";
      if (post.title != null) {
        postTitle = post.title;
      }
      let content = `
        <div class="card shadow">
            <div
              class="card-header d-flex align-items-center justify-content-between"
            >
              <div class="d-flex align-items-center gap-2" style="cursor:pointer;"  onclick="userClicked(${
                author.id
              })">
                <img
                  src="${
                    typeof author.profile_image == "string"
                      ? author.profile_image
                      : "./profile-pics/1.png"
                  }"
                  alt="profile-image"
                  class="rounded-circle border border-2"
                />
                <b class="m-0">${author.username}</b>
              </div>
              
                 
         ${editBtncontent}
                
              
             
            </div>

          
  
              <div class="card-body"  onclick="postClicked(${
                post.id
              })" style="cursor:pointer;">
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
                <span id="post-tags-${post.id}" class="mx-1"> </span>
                </span>
              </div>
            </div>
      
      
      `;
      document.getElementById("posts").innerHTML += content;
      const currentPostTagsId = `post-tags-${post.id}`;
      document.getElementById(currentPostTagsId).innerHTML = "";
      for (tag of post.tags) {
        let tagsContent = `
             <button
                      class="btn btn-sm rounded-5"
                      style="background-color: gray; color: white; border: none"
                    >
                      ${tag.name}
                    </button>
        `;
        document.getElementById(currentPostTagsId).innerHTML += tagsContent;
      }
    }
  });
}

function postClicked(postId) {
  window.location = `postDetails.html?postId=${postId}`;
}

function addBtnClicked() {
  document.getElementById("post-modal-submit-btn").innerHTML = "Create";
  document.getElementById("post-id-input").value = "";
  document.getElementById("post-modal-title").innerHTML = "Create A New Post";
  document.getElementById("post-title-input").value = "";
  document.getElementById("post-body-input").value = "";
  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
}
