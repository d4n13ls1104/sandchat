import moment from "moment";

export const formatMessageTimestamp = (timestamp: string) => moment(timestamp).calendar();