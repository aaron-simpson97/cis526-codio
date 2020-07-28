const express = require('express');
const app = express();
const signIn = require('./sign-in');
const createUser = require('./create-user');
const createSession = require('./create-session');
const topicPage = require('./topic-page');
const newTopic = require('./new-topic');
const newPost = require('./new-post');
const topics = require('./topics');
const signUp = require('./sign-up');
const posts = require('./posts');
const forum = require('./forum');
const processBody = require('./process-body');
const loadSession = require('./load-session');
const destroySession = require('./destroy-session');
const authenticate = require('./authenticate');

app.use(loadSession);
app.use('/', express.static('public'));
app.get('/forum', forum);
app.get('/signin', signIn);
app.get('/signout', destroySession);
app.get('/signup', signUp);
app.post('/signin', processBody, createSession);
app.post('/signup', processBody, createUser);

app.get('/forum/topics/new', authenticate, newTopic);
app.get('/forum/topics/:id', topicPage);
app.post('/forum/topics', processBody, topics.create);

app.get('/forum/topics/:id/new', authenticate, newPost);
app.post('/forum/topics/:id/posts', processBody, posts.create);

module.exports = app;