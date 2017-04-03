var express = require('express');
var formidable = require('express-formidable');
var app = express();

app.use(express.static('build'));
app.use(formidable());


var blogs = [
  {
    id: 1,
    name: "Спорт",
    hash: "sport",
  },
  {
    id: 2,
    name: "Бизнес",
    hash: "business"
  },
  {
    id: 3,
    name: "Здоровье",
    hash: "health"
  }
];

var lastBlogId = 3;


app.get('/categories', function(req, res) {
  res.send(JSON.stringify(blogs));
});


app.post('/categories', function (req, res) {
  if(!req.fields) return res.sendStatus(400);

  lastBlogId++;

  blogs.push(
    {
      id: lastBlogId,
      name: req.fields.blogname,
      hash: req.fields.hash
    }
  );
  
  res.send('blog created');
});


app.put('/categories/:id', function (req, res) {
  var id = +req.fields.id;
  var blogname = req.fields.blogname;
  var hash = (req.fields.hash[0] === "#") 
               ? req.fields.hash.substring(1)
               : req.fields.hash;
  
  blogs.forEach(function(item) {
    if (item.id === id) {
      item.name = blogname;
      item.hash = hash;
    }
  });
  
  res.send('blog changed');
});


app.delete('/categories/:id', function (req, res) {
  var id = +req.fields.id;
  var msg = 'Blog not found. Check id';
  
  blogs.forEach(function(item, i) {
    if (item.id === id) {
      blogs.splice(i, 1);
      msg = item.name + ' deleted!';
    }
  });
  
  res.send(msg);
});



var posts = [
  {
    id: 1,
    hash: "sport",
    blog: "спорт",
    title: "Статья из блога спорт",
    intro: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi aspernatur atque culpa cum dignissimos dolorem, eaque earum ex facilis fuga, impedit minus neque nulla porro quasi repudiandae sapiente soluta tenetur."
  },
  {
    id: 2,
    hash: "business",
    blog: "бизнес",
    title: "Пост из блога бизнес",
    intro: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi aspernatur atque culpa cum dignissimos dolorem, Animi aspernatur atque culpa cum dignissimos dolorem, eaque earum ex facilis fuga, impedit minus neque nulla porro quasi repudiandae sapiente soluta tenetur."
  },
  {
    id: 3,
    hash: "health",
    blog: "здоровье",
    title: "Текст из блога здоровье",
    intro: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi aspernatur atque culpa cum dignissimos dolorem, eaque earum ex facilis fuga, impedit minus neque nulla porro quasi repudiandae sapiente soluta tenetur. consectetur adipisicing elit. Animi aspernatur atque culpa cum dignissimos dolorem, eaque earum ex facilis fuga, impedit minus neque nulla porro quasi repudiandae sapiente soluta tenetur."
  },
  {
    id: 4,
    hash: "health",
    blog: "здоровье",
    title: "Другая статья из блога здоровье",
    intro: "Lorem ipsum dolor sit amet, consectetur aspernatur atque culpa cum dignissimos dolorem, eaque earum ex facilis fuga, impedit minus neque nulla porro quasi repudiandae sapiente soluta tenetur."
  },
  {
    id: 5,
    hash: "business",
    blog: "бизнес",
    title: "Вторая статья из блога бизнес",
    intro: "Lorem. Animi aspernatur atque culpa cum dignissimos dolorem, eaque earum ex facilis fuga, impedit minus neque nulla porro quasi repudiandae sapiente soluta tenetur."
  },
  {
    id: 6,
    hash: "sport",
    blog: "спорт",
    title: "Еще одна статья из блога спорт",
    intro: "Lorem ipsum dolor adipisicing elit. Animi aspernatur atque culpa cum dignissimos dolorem, eaque earum ex facilis fuga, impedit minus neque nulla porro quasi repudiandae sapiente soluta tenetur."
  }
];

var lastPostId = 6;


app.get('/posts/:hash', function(req, res) {

  var filteredPosts = posts.filter(function(post) {
    return post.hash === req.params.hash;
  });

  if (filteredPosts.length < 1) {
    filteredPosts = [ { blog: 'в этом блоге нет записей' } ];
  }

  res.send(JSON.stringify(filteredPosts));
});


app.post('/posts/', function (req, res) {
  if(!req.fields) return res.sendStatus(400);

  lastPostId++;

  posts.push(
    {
      id: lastPostId,
      hash: req.fields.hash,
      blog: req.fields.blog,
      title: req.fields.title,
      intro: req.fields.intro
    }
  );
  
  res.send('post created!');
});


app.put('/posts/:id', function (req, res) {
  var id = +req.fields.id;
  
  posts.forEach(function(item) {
    if (item.id === id) {
      item.title = req.fields.title;
      item.intro = req.fields.intro;
    }
  });
  
  res.send('post changed');
});


app.delete('/posts/:id', function (req, res) {
  var id = +req.fields.id;
  var msg = 'Post not found. Check id';
  
  posts.forEach(function(item, i) {
    if (item.id === id) {
      posts.splice(i, 1);
      msg = item.title.substr(0, 27) + '... - post deleted!'
    }
  });
  
  res.send(msg);
});


app.listen(4000, function() {
  console.log('server listen port 4000');
});