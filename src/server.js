import { GraphQLServer, PubSub } from 'graphql-yoga'
import prisma from './prisma'
import { fragmentReplacements, resolvers } from './resolvers'

const IN_PROD = true

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs: './src/typeDefs/schema.graphql',
    resolvers,
    context: req => {
        return { prisma, pubsub, req }
    },
    playground: !IN_PROD,
    fragmentReplacements,
})

export { server as default }
