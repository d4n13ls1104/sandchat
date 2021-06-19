import { Router } from "express";
import { checkChannelExists, fetchMessagesFromChannelBeforeDate } from "../../util/sand-channel";
//import { pool } from "../../util/sand-db";
import { extractPayloadFromToken } from "../../util/sand-jwt";
import { isUserChannelMember } from "../../util/sand-user";
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

export default router;
