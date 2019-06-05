import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import getClient from './utils/getClient'
import { createUser, getProfile, getUsers, login } from './utils/operations'
import seed, { userOne } from './utils/seedDatabase'

beforeEach(seed)
const client = getClient()

test('shoud add a user', async () => {
    const variables = {
        data: {
            name: 'Omar',
            email: 'omar@g.com',
            password: 'AE00000000',
        },
    }

    const u = await client.mutate({ mutation: createUser, variables })

    const exists = await prisma.exists.User({
        id: u.data.createUser.user.id,
    })

    expect(exists).toBe(true)
})

test('Should expose public author', async () => {
    const u = await client.query({ query: getUsers })
    expect(u.data.users.length).toBe(2)
    expect(u.data.users[0].email).toBe(null)
    expect(u.data.users[0].name).toBe('Ali')
})

test('shold not login with bad cridentials!', async () => {
    const variables = {
        data: { email: 'omar@g.com', password: 'AE000000000' },
    }

    // const l = await client.mutate({ mutation: login })

    await expect(client.mutate({ mutation: login })).rejects.toThrow()
})
test('shold not create user with short password!', async () => {
    const variables = {
        data: {
            name: 'Adil',
            email: 'Adil@g.com',
            password: '1234567',
        },
    }

    // const l = await client.mutate({ mutation: login })

    await expect(
        client.mutate({ mutation: createUser, variables })
    ).rejects.toThrow()
})

test('should fetch user profile', async () => {
    const client = getClient(userOne.jwt)

    const { data } = await client.query({ query: getProfile })

    expect(data.me.id).toBe(userOne.user.id)
    expect(data.me.email).toBe(userOne.user.email)
    expect(data.me.name).toBe(userOne.user.name)
    expect(data.me.password).toBe(userOne.user.password)
})

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// await prisma.mutation.deleteManyUsers()
//   await prisma.mutation.deleteManyPosts()

//   const user = prisma.mutation.createUser({
//     data: {
//       name: 'Omar',
//       email: 'omar@g.com',
//       password: bcrypt.hashSync('jhsqjdknsdq'),
//     },
//   })

//   await prisma.mutation.createPost({
//     data: {
//       title: 'test title',
//       body: 'post body ...',
//       published: true,
//       author: {
//         connect: {
//           email: user.id,
//         },
//       },
//     },
//   })
// })

// test('Should create a new user', async () => {
//   const createUser = gql`
//     mutation {
//       createUser(
//         data: { name: "Ali", email: "Ali@g.com", password: "00000000" }
//       ) {
//         token
//         user {
//           id
//         }
//       }
//     }
//   `

// const res = await client.mutate({ mutation: createUser })

// const exists = await prisma.exists.User({
//   id: res.data.createUser.user.id,
// })

// expect(exists).toBe(true)
