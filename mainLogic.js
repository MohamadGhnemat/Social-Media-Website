const baseUrl = "https://tarmeezacademy.com/api/v1";
//================== Post requests ===================

function CreateNewPostClicked() {
  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == "";

  let title = document.getElementById("post-title-input").value;
  let body = document.getElementById("post-body-input").value;
  let image = document.getElementById("post-image-input").files[0];
  const token = localStorage.getItem("token");
  let formData = new FormData();
  formData.append("body", body);
  formData.append("title", title);
  formData.append("image", image);

  // const params = {
  //   title: title,
  //   body: body,
  // };
  let url = ``;

  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };
  if (isCreate) {
    url = `${baseUrl}/posts`;
  } else {
    formData.append("_method", "put");
    url = `${baseUrl}/posts/${postId}`;
  }
  toggleLoader(true);
  axios
    .post(url, formData, {
      headers: headers,
    })
    .then((response) => {
      var modal = document.getElementById("create-post-modal");
      var modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      if (isCreate) {
        showAlert("New Post Has Been Created", "success");
      } else {
        showAlert("New Post Has Been Editeed", "success");
      }

      getPosts();
      // console.log(response.data);
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}

function editPostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  //console.log(post);
  document.getElementById("post-modal-submit-btn").innerHTML = "Update";
  document.getElementById("post-id-input").value = post.id;
  document.getElementById("post-modal-title").innerHTML = "Edit Post";
  document.getElementById("post-title-input").value = post.title;
  document.getElementById("post-body-input").value = post.body;
  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
  //getPosts();
}
function deletePostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  //console.log(post);
  document.getElementById("delete-post-id-input").value = post.id;
  let postModal = new bootstrap.Modal(
    document.getElementById("delete-post-modal"),
    {}
  );
  postModal.toggle();
  //getPosts();
}
function confirmPostDelete() {
  const token = localStorage.getItem("token");
  const postId = document.getElementById("delete-post-id-input").value;
  const url = `${baseUrl}/posts/${postId}`;
  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };
  axios
    .delete(url, {
      headers: headers,
    })
    .then((response) => {
      //console.log(response);
      var modal = document.getElementById("delete-post-modal");
      var modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("The Post Has Been Deleted Successfully", "success");
      getPosts();
      setupUI();
      //console.log(response.data.token);
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    });
}

//================== Post requests ===================
function profileClicked() {
  const user = getCurrentUser();
  window.location = `profile.html?userid=${user.id}`;
}
function setupUI() {
  const token = localStorage.getItem("token");
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const AddPostBtn = document.getElementById("add-btn");
  const userData = document.getElementById("user-data");
  if (token == null) {
    if (AddPostBtn != null) {
      AddPostBtn.style.display = "none";
    }
    // document.getElementById("add-comment-div").style.display = "none";
    loginBtn.style.display = "block";
    registerBtn.style.display = "block";
    logoutBtn.style.display = "none";

    userData.style.display = "none";
  } else {
    if (AddPostBtn != null) {
      AddPostBtn.style.display = "block";
    }
    // document.getElementById("add-comment-div").style.display = "block";
    // logged in user
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    logoutBtn.style.display = "block";

    userData.style.display = "flex";

    const user = getCurrentUser();
    document.getElementById("nav-username").innerHTML = user.username;
    document.getElementById("nav-user-image").src = user.profile_image;
  }
}

//===============Auth Functions=================//

function loginBtnClicked() {
  let username = document.getElementById("username-input").value;
  let password = document.getElementById("password-input").value;
  const params = {
    username: username,
    password: password,
  };
  const url = `${baseUrl}/login`;
  toggleLoader(true);
  axios
    .post(url, params)
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      //alert("user logged in successfully");

      var modal = document.getElementById("login-modal");
      var modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("Logged in successfully", "success");

      // getPosts();

      setupUI();
      //console.log(response.data.token);
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}
function toggleLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}

function registerBtnClicked() {
  const name = document.getElementById("register-name-input").value;
  const username = document.getElementById("register-username-input").value;
  const password = document.getElementById("register-password-input").value;
  const image = document.getElementById("register-image-input").files[0];

  let formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("password", password);
  formData.append("image", image);

  const headers = {
    "Content-Type": "multipart/form-data",
  };
  const url = `${baseUrl}/register`;
  toggleLoader(true);
  axios
    .post(url, formData, {
      headers: headers,
    })

    .then((response) => {
      // console.log(response);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      var modal = document.getElementById("register-modal");
      var modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("New User Registered successfully", "success");

      //getPosts();

      setupUI();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlert("Logged out successfully");
  setupUI();

  // getPosts();
}

function showAlert(customMessage, type = "success") {
  const alertPlaceholder = document.getElementById("success-alert");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };

  appendAlert(customMessage, type);
  //to-do: hide the alert

  setTimeout(() => {
    //var alert = document.getElementById("success-alert");
    //var modalAlert = bootstrap.Alert.getInstance(alert);
    //modalAlert.hide();
    //const alert = bootstrap.Alert.getOrCreateInstance("#success-alert ");
    //alert.close();
  }, 2000);
}

function getCurrentUser() {
  let user = null;
  if (localStorage.getItem("token") != null) {
    user = JSON.parse(localStorage.getItem("user"));
  }

  return user;
}
