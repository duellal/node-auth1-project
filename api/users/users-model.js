const db = require(`../../data/db-config`)

/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
function find() {
  return db('users').select(`user_id`, `username`)
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
function findBy(filter) {
  return db(`users`).where(filter).first()
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
function findById(user_id) {
  return db(`users`).where(`user_id`, user_id).first()
}

/**
  resolves to the newly inserted user { user_id, username }
 */
async function add(user) {
  const newUser = await db(`users`).insert(user)

  return findById(newUser)
}

module.exports = {
  find, 
  findBy, 
  findById,
  add
}