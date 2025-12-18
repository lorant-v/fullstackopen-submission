var _ = require('lodash');

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, current) => sum += current.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0)
    return null
  return blogs.reduce((max, current) => {
    return max.likes > current.likes ? max : current
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  return _.maxBy(_.map(_.groupBy(blogs, 'author'), (blogs, author) => ({ author: author, blogs: blogs.length })), 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  return _.flow(
    blogs => _.groupBy(blogs, 'author'),
    grouped => _.map(grouped, (blogs, author) => ({
      author: author,
      likes: blogs.reduce((sum, current) => (sum += current.likes), 0)
    })),
    summed => _.maxBy(summed, 'likes')
  )(blogs)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}