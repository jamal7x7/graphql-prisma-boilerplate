import { getUserId } from '../utils/getUserId'
export const User = {
    email: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { prisma, req }, info) {
            const userId = getUserId(req, false)

            // a users can see only his email and not emails of others

            if (userId && parent.id === userId) {
                return parent.email
            } else {
                return null
            }
        },
    },
}
