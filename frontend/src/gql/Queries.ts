import { gql } from "@apollo/client";

export const ME_QUERY = gql`
    query MeQuery {
        me {
            username,
            avatar
        }
    }
`

export const GET_MESSAGES_QUERY = gql`
    query GetMessages($channelId: Float!, $beforeDate: String!) {
        getMessages(data: {channelId: $channelId, beforeDate: $beforeDate}) {
            id,
            content,
            timestamp,

            author {
                id,
                username,
                avatar
            }
        }
    }
`