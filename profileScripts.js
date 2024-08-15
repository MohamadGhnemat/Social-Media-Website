setupUI();
getUser();
getPosts();
function getCurrentuserId() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("userid");
  return id;
}

function getUser() {
  const id = getCurrentuserId();
  axios.get(`${baseUrl}/users/${id}`).then((response) => {
    const user = response.data.data;
    document.getElementById("main-info-email").innerHTML = user.email;
    document.getElementById("main-info-name").innerHTML = user.name;
    document.getElementById("main-info-username").innerHTML = user.username;
    document.getElementById("posts-count").innerHTML = user.posts_count;
    document.getElementById("comments-count").innerHTML = user.comments_count;
    if (typeof user.profile_image == "string")
      document.getElementById("main-info-image").src = user.profile_image;

    document.getElementById("name-posts").innerHTML = `${user.username}'s`;
  });
}

function getPosts() {
  const id = getCurrentuserId();
  axios.get(`${baseUrl}/users/${id}/posts`).then((response) => {
    const posts = response.data.data;
    document.getElementById("user-posts").innerHTML = "";

    for (post of posts) {
      const author = post.author;

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
                <div class="d-flex align-items-center gap-2">
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
                        : "./placeholders/2.jpg"
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
      document.getElementById("user-posts").innerHTML += content;
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
