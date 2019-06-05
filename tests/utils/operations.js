import { gql } from 'apollo-boost'

// * USERS
const createUser = gql`
    mutation($data: CreateUserInput!) {
        createUser(data: $data) {
            user {
                id
                email
                name
            }
            token
        }
    }
`

const getUsers = gql`
    query {
        users {
            id
            name
            email
        }
    }
`

const login = gql`
    mutation($data: LoginUserInput!) {
        login(data: $data) {
            user {
                id
                email
                name
            }
            token
        }
    }
`
const getProfile = gql`
    query {
        me {
            id
            name
            email
            password
        }
    }
`

export { createUser, login, getUsers, getProfile }
