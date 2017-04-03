var postForm = {
  //метод инициализирующий отлов события клика по
  //контейнеру, в котором содержатся посты
  init: function() {
    var postsContainer = document.getElementById('posts');
  
    postsContainer.onclick = function(e) {
      var action = e.target.dataset.action;

      if (action) postForm[action](e);
    };
  },

  create: function(e) {
    e.preventDefault();

    var formElem = document.getElementById('post-add-form');
    var formWrapper = formElem.closest('.modal-form-wrapper');

    this.show(formWrapper);

    formElem.addEventListener('submit', postSubmitHandler);
  },

  edit: function(e) {
    e.preventDefault();

    var formElem = document.getElementById('post-edit-form');
    var formWrapper = formElem.closest('.modal-form-wrapper');
    var postTitleInput = formElem.elements.title;
    var postIntroInput = formElem.elements.intro;
    var postItem = e.target.parentNode.parentNode;
    var postLink = postItem.querySelector('.post__link');
    var postIntro = postItem.querySelector('.post__intro');
    var id = postLink.dataset.id;
    
    this.show(formWrapper);
    
    postTitleInput.value = postLink.textContent;
    postIntroInput.value = postIntro.textContent;
    
    formElem.onsubmit = function(e) {
      e.preventDefault();
      updatePost(this, id);
    };
  },

  delete: function(e) {
    var postItem = e.target.parentNode.parentNode;
    var postLink = postItem.querySelector('.post__link');
    var id = postLink.dataset.id;

    deletePost(id);
  },

  show: function(form) {
    var closeBtn = form.querySelector('.modal-form-close');

    form.classList.add('modal-form-wrapper--show');
    closeBtn.addEventListener('click', this.close);
  },

  close: function(e) {
    e.preventDefault();

    var formWrapper = this.closest('.modal-form-wrapper');

    formWrapper.classList.remove('modal-form-wrapper--show');
  }
};


function postSubmitHandler(e) {
  e.preventDefault();
  var hash = location.hash.substring(1);
  var blogName = document.querySelector('.main-nav__link--active').textContent.toLowerCase();

  createPost(this, hash, blogName);
  this.removeEventListener('submit', postSubmitHandler);
}


function getPosts(callback) {
  var xhr = new XMLHttpRequest();
  var hash = location.hash.substring(1);

  xhr.open("GET", "/posts/" + hash, true);
  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;
    
    var posts = JSON.parse(xhr.responseText);

    callback(posts);
  };
}


function renderPosts(posts, callback) {

  var mainContent = document.getElementById('main-content');
  var postsContainer = document.createElement('section');
  var postsHeader = document.createElement('header');
  var id, hash, title, intro;
  var postsTitle = posts[0].blog.toLowerCase();
  
  postsHeader.className = 'posts__header';
  postsHeader.innerHTML = '<h2 class="posts__title">' + postsTitle + '</h2>' +
                          '<div class="posts__action">' +
                            '<button data-action="create" class="btn  btn--add  btn--dark">Добавить пост</button>'
                          '</div>';
  
  postsContainer.className = 'posts';
  postsContainer.setAttribute('id', 'posts');
  postsContainer.appendChild(postsHeader);

  mainContent.innerHTML = '';
  mainContent.appendChild(postsContainer);

  if ( !(postsTitle === 'в этом блоге нет записей') ) {      
    posts.forEach(function(item) {
      id = item.id;
      hash = item.hash;
      title = item.title;
      intro = item.intro;

      postsContainer.innerHTML += 
        '<article class="post">' +
          '<span class="post__link" data-id="' + id + '">' + 
            '<h3 class="post__title">' + title + '</h3>' +
          '</span>' +
          '<p class="post__intro">' + intro + '</p>' +
          '<div class="post__actions">' +
            '<button data-action="edit" class="btn  btn--action  btn--edit"></button>' +
            '<button data-action="delete" class="btn  btn--action  btn--delete"></button>' +
          '</div>' +
        '</article>';
    });
  }

  callback();

}


function createPost(form, hash, blogName) {
  var formData = new FormData(form);
  var xhr = new XMLHttpRequest();
  
  formData.append("hash", hash);
  formData.append("blog", blogName);
  xhr.open("POST", "/posts", true);
  xhr.send(formData);

  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;

    var response = xhr.responseText;

    alert(response);

    getPosts(function(posts) {
      renderPosts(posts, function() {
        postForm.init();//вешается обработчик на #posts после того,
                        //как #posts отрисуется 
      });
    });

    form.elements.title.value = '';
    form.elements.intro.value = '';
  };
}


function updatePost(form, id) {
  var formData = new FormData(form);
  
  var xhr = new XMLHttpRequest();

  formData.append("id", id);
  xhr.open("PUT", "/posts/" + id, true);
  xhr.send(formData);

  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;

    var response = xhr.responseText;

    alert(response);

    getPosts(function(posts) {
      renderPosts(posts, function() {
        postForm.init();//вешается обработчик на #posts после того,
                        //как #posts отрисуется 
      });
    });
  };
}


function deletePost(id) {
  
  var xhr = new XMLHttpRequest();

  var body = 'id=' + encodeURIComponent(id);

  xhr.open("DELETE", "/posts/" + id, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(body);

  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;

    var response = xhr.responseText;

    alert(response);

    getPosts(function(posts) {
      renderPosts(posts, function() {
        postForm.init();//вешается обработчик на #posts после того,
                        //как #posts отрисуется 
      });
    });
  };

}