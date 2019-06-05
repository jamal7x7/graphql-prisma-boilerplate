import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../src/prisma'

const userOne = {
    input: {
        name: 'Ali',
        email: 'ali@g.com',
        password: bcrypt.hashSync('hello@12!3hfhgfBHnj'),
    },
    user: undefined,
    jwt: undefined,
}
const userTwo = {
    input: {
        name: 'Alaa',
        email: 'alaa@g.com',
        password: bcrypt.hashSync('hello@12!3hfhgfBHnj'),
    },
    user: undefined,
    jwt: undefined,
}

const seed = async () => {
    // Delete test deta
    await prisma.mutation.deleteManyUsers()

    // create userOne
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input,
    })

    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input,
    })

    userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET)
}

export { seed as default, userOne, userTwo }
