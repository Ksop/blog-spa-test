
'use strict';

window.onload = function() {
  
  getNavItems(function(blogs) {
    renderNav(blogs);
  });

};

var mainNav = document.getElementById('main-nav');

//вешаем отлов клика контейнер элемента навигации, 
//далее работаем через делегирование
mainNav.addEventListener('click', function(e) {
  var target = e.target;
  var action = target.dataset.action;

  if (action) {
    blogForm[action](e);
  }

  if (target.className === 'main-nav__link') {
    setActiveLink(target);
  }
});

window.addEventListener('hashchange', function() {
  getPosts(function(posts) {
    renderPosts(posts, function() {
      postForm.init();//вешается обработчик на #posts после того,
                      //как #posts отрисуется 
    });
  });
});


var blogForm = {
  //метод показа формы создания блога
  create: function(e) {
    e.preventDefault();

    var formElem = document.getElementById('blog-add-form');
    var formWrapper = formElem.closest('.modal-form-wrapper');

    this.show(formWrapper);

    formElem.addEventListener('submit', blogSubmitHandler);
  },
  
  //метод показа формы редактирования блога
  edit: function(e) {
    e.preventDefault();

    var formElem = document.getElementById('blog-add-form');
    var formWrapper = formElem.closest('.modal-form-wrapper');
    var blogNameInput = formElem.elements.blogname;
    var hashInput = formElem.elements.hash;
    var navItem = e.target.parentNode.parentNode;
    var navLink = navItem.querySelector('.main-nav__item a');
    var id = navLink.dataset.id;
    
    this.show(formWrapper);
    
    blogNameInput.value = navLink.innerHTML;
    hashInput.value = navLink.getAttribute('href').substring(1);
    
    formElem.onsubmit = function(e) {
      e.preventDefault();
      updateNavItem(this, id);
    };
  },
  
  delete: function(e) {
    var navItem = e.target.parentNode.parentNode;
    var navLink = navItem.querySelector('.main-nav__item a');
    var id = navLink.dataset.id;

    deleteNavItem(id);
  },

  show: function(form) {
    var closeBtn = form.querySelector('#modal-form-close');

    form.classList.add('modal-form-wrapper--show');
    closeBtn.addEventListener('click', this.close);
  },

  close: function(e) {
    e.preventDefault();

    var formWrapper = this.closest('.modal-form-wrapper');

    formWrapper.classList.remove('modal-form-wrapper--show');
  }
};


function blogSubmitHandler(e) {
  e.preventDefault();
  createNavItem(this);

  //удаляем отлов событий,
  //чтобы в будущем старые события не накапливались
  this.removeEventListener('submit', blogSubmitHandler);
}


function setActiveLink(target) {
  var links = document.querySelectorAll('.main-nav__link');

  links.forEach(function(link) {
    if ( link.classList.contains('main-nav__link--active') ) {
      link.classList.remove('main-nav__link--active');          
    }
  });

  target.classList.add('main-nav__link--active');
}


function getNavItems(callback) {
  var xhr = new XMLHttpRequest();

  xhr.open("GET", "/categories", true);
  xhr.send();

  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;

    var navItems = JSON.parse(xhr.responseText);
    
    callback(navItems);
  };
}


function renderNav(navItems) {
  var navList = document.getElementById('main-nav-list');
  var id, hash, name;

  navList.innerHTML = '';
  
  navItems.forEach(function(item) {
    id = item.id;
    hash = item.hash;
    name = item.name;

    navList.innerHTML += 
      '<li class="main-nav__item">' +
        '<a data-id="' + id + '" href="#' + hash + '" class="main-nav__link">' + name + '</a>' +
        '<div class="main-nav__actions">' +
          '<button data-action="edit" class="btn  btn--action  btn--edit"></button>' +
          '<button data-action="delete" class="btn  btn--action  btn--delete"></button>' +
        '</div>' +
      '</li>';      
  });    
}


function createNavItem(form) {
  var formData = new FormData(form);
  var xhr = new XMLHttpRequest();

  xhr.open("POST", "/categories", true);
  xhr.send(formData);

  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;

    var response = xhr.responseText;

    alert(response);

    getNavItems(function(navItems) {
      renderNav(navItems);
    });

    form.elements.blogname.value = '';
    form.elements.hash.value = '';
  };
}


function updateNavItem(form, id) {
  var formData = new FormData(form);
  
  var xhr = new XMLHttpRequest();

  formData.append("id", id);
  xhr.open("PUT", "/categories/" + id, true);
  xhr.send(formData);

  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;

    var response = xhr.responseText;

    alert(response);

    getNavItems(function(navItems) {
      renderNav(navItems);
    });
  };
}


function deleteNavItem(id) {
  
  var xhr = new XMLHttpRequest();

  var body = 'id=' + encodeURIComponent(id);

  xhr.open("DELETE", "/categories/" + id, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(body);

  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;

    var response = xhr.responseText;

    alert(response);

    getNavItems(function(navItems) {
      renderNav(navItems);
    });
  };
}
