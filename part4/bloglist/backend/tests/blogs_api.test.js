const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)


describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('when viewing all blogs', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
      const response = await api.get('/api/blogs')

      const titles = response.body.map(e => e.title)
      assert(titles.includes(helper.initialBlogs[0].title))
    })

    test('blogs have property id', async () => {
      const response = await api.get('/api/blogs')

      const blogs = response.body
      assert("id" in blogs[0])
    })
  })



  describe('adding a new blog', () => {
    test('succeeds when blog is valid', async () => {
      const newBlog = {
        title: "The grief when AI writes most of the code",
        author: "Gergely Orosz",
        url: "https://blog.pragmaticengineer.com/the-grief-when-ai-writes-most-of-the-code/",
        likes: 10,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(titles.includes('The grief when AI writes most of the code'))
    })

    test('succeeds when blog does not have likes property, it defaults to 0', async () => {
      const newBlog = {
        title: "The grief when AI writes most of the code",
        author: "Gergely Orosz",
        url: "https://blog.pragmaticengineer.com/the-grief-when-ai-writes-most-of-the-code/",
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const addedBlog = blogsAtEnd.filter(b => b.title === newBlog.title)[0]
      assert.strictEqual(addedBlog.likes, 0)
    })

    test('fails with code 400 if title is missing', async () => {
      const newBlog = {
        author: "Gergely Orosz",
        url: "https://blog.pragmaticengineer.com/the-grief-when-ai-writes-most-of-the-code/",
        likes: 10,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })

    test('fails with code 400 if url is missing', async () => {
      const newBlog = {
        title: "The grief when AI writes most of the code",
        author: "Gergely Orosz",
        likes: 10,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})