import { compare, hash } from 'bcryptjs'
import { generateToken, getUserId } from '../utils'

export const Mutation = {
    createUser: async (parent, args, { prisma, pubsub }, info) => {
        if (args.data.password.length < 8) {
            throw new Error('Password must be 8 caracteres at least!')
        }

        const emailTaken = await prisma.exists
            .User({ email: args.data.email })
            .catch(e => e)
        if (emailTaken) throw new Error('email taken!!!!')

        const myHachedPassword = await hash(args.data.password, 10).catch(
            e => e
        )

        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password: myHachedPassword,
            },
        })

        if (user) {
            pubsub.publish(`USER`, {
                user: { mutation: 'CREATED', data: user },
            })
        }

        const token = await generateToken(user.id)

        return { user, token }
    },

    login: async (parent, args, { prisma, pubsub, req }, info) => {
        // const myHachedPassword = await hash(args.data.password, 10).catch(e => e)

        const user = await prisma.query.user({
            where: {
                email: args.data.email,
            },
        })
        if (!user) throw new Error('user does not existe!!!!')

        const match = await compare(args.data.password, user.password)
        // console.log(match)

        if (!match) throw new Error('Wrong password!')

        const token = await generateToken(user.id)

        req.request.headers = {
            ...req.request.headers,
            authorization: `Bearer ${token}`,
        }

        // console.log(req.request.headers)

        return {
            user,
            token,
        }
    },

    deleteUser: async (parent, args, { prisma, pubsub, req }, info) => {
        const userId = getUserId(req)
        // console.log('decoded: =====> ', userId)

        const userExist = await prisma.exists
            .User({ where: { id: userId } })
            .catch(e => e)
        if (!userExist) throw new Error(' user does not exist!')

        const u = await prisma.mutation
            .deleteUser({ where: { id: userId } })
            .catch(e => e)

        if (u) {
            pubsub.publish(`USER`, {
                user: { mutation: 'DELETED', data: u },
            })
        }

        return u
    },

    updateUser: async (parent, args, { prisma }, info) => {
        const userExist = await prisma.exists
            .User({ where: { id: args.id } })
            .catch(e => e)
        if (!userExist) throw new Error(' user does not exist!')

        const opArgs = { where: { id: args.id }, data: args.data }

        const u = await prisma.mutation.updateUser(opArgs, info).catch(e => e)

        if (u) {
            pubsub.publish(`USER`, {
                user: { mutation: 'CREATED', data: u },
            })
        }

        return u
    },
}
