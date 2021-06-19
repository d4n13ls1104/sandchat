import { response, Router } from "express";
import { checkChannelExists, fetchMessagesFromChannelBeforeDate } from "../../util/sand-channel";
//import { pool } from "../../util/sand-db";
import { extractPayloadFromToken } from "../../util/sand-jwt";
import { isUserChannelMember, sendMessageForUser } from "../../util/sand-user";
import * as validator from "../../util/sand-validator";

const router = Router();

//---------------------------------------------------------------
// Purpose: Get messages from channel
//---------------------------------------------------------------
router.get("/:id/messages", (req, res) => {
    const beforeDate = validator.sanitizeParam(req.query.beforeDate);

    // Check if channel exists, if not return error
    checkChannelExists(parseInt(req.params.id))
    .catch(reason => { return res.json({ errors: [reason] }); });

    // Get payload from user's auth token
    const payload = extractPayloadFromToken(req.cookies.auth);

    // Check if user is a member of the channel, if not return an error
    isUserChannelMember(payload.sub, parseInt(req.params.id))
    .catch(reason => { return res.json({ errors: [reason] }); });

    // Fetch messagees
    fetchMessagesFromChannelBeforeDate(parseInt(req.params.id), beforeDate).then(response => {
        return res.json(response);
    }).catch(reason => { return res.json({ errors: [reason] }); });
});

//---------------------------------------------------------------
// Purpose: Send message to channel
//---------------------------------------------------------------
router.post("/:id/messages", (req, res) => {
    if(!req.body.content) return res.sendStatus(400).json({ errors: ["Message cannot be empty."] });

    const content = validator.sanitizeParam(req.body.content);

    if(content.length > 4000) return res.json({ errors: ["Something went wrong. Please try again later."] });

    // Check if channel exists
    checkChannelExists(parseInt(req.params.id))
    .catch(reason => { return res.json({ errors: [reason] }); });

    // Get payload from user's auth token
    const payload = extractPayloadFromToken(req.cookies.auth);

    isUserChannelMember(payload.sub, parseInt(req.params.id))
    .catch(reason => { return response.json({ errors: [reason] }); });

    // All good, send the message
    sendMessageForUser(payload.sub, parseInt(req.params.id), content)
    .then(() => {
        return res.json({ ok: true });
    }).catch(reason => { return res.json({ errors: [reason] }); });
});

export default router;
