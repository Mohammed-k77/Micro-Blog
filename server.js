// start view counter code 
class Post {
  constructor() {
      this.events = {};
  }

  on(eventName, callback) {
      if (!this.events[eventName]) {
          this.events[eventName] = [];
      }

      this.events[eventName].push(callback);
  }

  view(postId) {
      this.emit('view', postId);
  }

  create(postData) {
      this.emit('create', postData);
  }

  update(postId, updatedData) {
      this.emit('update', postId, updatedData);
  }

  delete(postId) {
      this.emit('delete', postId);
  }

  emit(eventName, ...params) {
      const eventCallbacks = this.events[eventName];
      if (eventCallbacks) {
          eventCallbacks.forEach(callback => {
              callback(...params);
              // console.log(callback(...params))
          });
      }
  }
}

class Counter {
  constructor() {
      this.viewCounts = {};
      // this.viewCounts['totalView']=0;
  }

  incrementViewCount(typeName, typeId) {
    if(!this.viewCounts[typeName]){
      this.viewCounts[typeName]=0;
    }
      if (!this.viewCounts[typeId]) {
          this.viewCounts[typeId] = 0;      
          this.viewCounts[typeName]++;
      }
     

      this.viewCounts[typeId]++;
      // this.viewCounts[totalView]++;
      // console.log(Post ${postId} has been viewed ${this.viewCounts[postId]} times.);
  }

  report(){
      console.log(this.viewCounts);
      // for (let index = 0; index < this.viewCounts.length; index++) {
      //     const postId = this.viewCounts[index];
      //     console.log(Post ${postId} has been viewed ${this.viewCounts[postId]} times.);
      // }
      return this.viewCounts;
  }
}
// Usage example
const viewPost = new Post();
const viewCounter = new Counter();
// Subscribe to the "view" event
viewPost.on('view', (postId) => {
viewCounter.incrementViewCount("post",postId);
});

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { Console } = require('console');

const app = express();


// Middleware
app.use(express.json());
app.use(cors())

let posts = [
{
id: 1,
title: "Post 1 Title",
content: "Post 1 content"
},
{
id: 2,
title: "Post 2 Title",
content: "Post 2 content"
},
{
id: 3,
title: "Post 3 Title",
content: "Post 3 content"
},
{
id: 4,
title: "Post 4 Title",
content: "Post 4 content"
},
{
id: 5,
title: "Post 5 Title",
content: "Post 5 content"
},
{
id: 6,
title: "Post 6 Title",
content: "Post 6 content"
},
{
id: 7,
title: "Post 7 Title",
content: "Post 7 content"
}
];
const users = [];

// Routes for Posts resource
app.get('/posts', (req, res) => {
res.json({posts:posts});
});

app.get('/posts/:id', (req, res) => {
const postId =  req.params.id;
const post = posts.find((post) => post.id == postId);

if (!post) {
  return res.status(404).json({ message: 'Post not found' , code: 404});
}
// console.log(post1);
res.json(post);  
    // Emit "view" events
    viewPost.view("ViewedBy-"+postId);
    
res.json(viewCounter.report());
      // End  view counter code 
});

// Routes for Posts resource
app.get('/view', (req, res) => {
  res.json(viewCounter.report());
  });

app.post('/posts', (req, res) => {
const { title, content } = req.body;
id = posts.length +1;
const newPost = {id, title, content };
posts.push(newPost);
res.status(201).json(newPost);
});



app.put('/posts/:id', (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  const post = posts.find((p) => p.id == postId);

  if (!post) {
    return res.status(404).json({ message: 'Post not found', code: 404 });
  }

  post.title = title;
  post.content = content;

  res.json(post);
});


app.delete('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id == postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found', code: 404 });
  }

  posts = posts.filter(post => post.id !== postId);

  res.sendStatus(204);
});

// Routes for Users resource
app.get('/users', (req, res) => {
res.json({users: users});
});

app.post('/users', (req, res) => {
const { name, email } = req.body;
const newUser = { name, email };
users.push(newUser);
res.status(201).json({user:newUser});
});

// Start the server
const port = 3000;
app.listen(port, () => {
console.log(`Server running on port ${port}`);
});