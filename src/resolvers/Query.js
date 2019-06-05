import { getUserId } from '../utils/getUserId'

export const Query = {
    me(p, args, { prisma, req }, info) {
        const userId = getUserId(req)
        return prisma.query.user({ where: { id: userId } })
    },

    user(p, args, { prisma }, info) {
        return prisma.query.user(args.id, info)
    },

    users: async (p, args, { prisma }, info) => {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
        }

        if (args.query) {
            opArgs.where = {
                OR: [
                    {
                        name_contains: args.query,
                    },
                ],
            }
        }

        const u = await prisma.query.users(opArgs, info)
        return u
        // return db.usersData
    },
}
