const Subscription = {
    user: {
        subscribe: (parent, args, { prisma, pubsub }, info) => {
            return pubsub.asyncIterator(`USER`)
        },
    },
}

export default Subscription
