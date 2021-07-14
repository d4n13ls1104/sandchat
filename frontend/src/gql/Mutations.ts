import { gql } from "@apollo/client"

export const CREATE_MESSAGE_MUTATION = gql`
    mutation CreateMessage($channelId: Float!, $content: String!) {
        createMessage(data: {channelId: $channelId, content: $content}) {
            id
        }
    } 
`