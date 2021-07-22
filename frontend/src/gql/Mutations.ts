import { gql } from "@apollo/client"

export const CREATE_MESSAGE_MUTATION = gql`
    mutation CreateMessage($channelId: String!, $content: String!) {
        createMessage(data: {channelId: $channelId, content: $content}) {
            id
        }
    } 
`

export const LOGIN_MUTATION = gql`
mutation LoginUser($email: String!, $password: String!) {
    login(data: { email: $email, password: $password }) {
        id
    }
}
`

export const REGISTER_MUTATION = gql`
mutation RegisterUser($email: String!, $username: String!, $password: String!) {
    register(data: {email: $email, username: $username, password: $password }) {
        id
    }
}
`