import { Router } from "express";
import { pool } from "../../util/sand-db";
import { extractPayloadFromToken } from "../../util/sand-jwt";

const router = Router();

//---------------------------------------------------------------
// Purpose: Get messages from channel
//---------------------------------------------------------------
router.get("/:id/messages", (req, res) => {
    
});



//---------------------------------------------------------------
// Purpose: Send message to channel
//---------------------------------------------------------------

router.post("/:id/messages", (req, res) => {
    const content = req.body.content;

    if(typeof content === "object") return res.json({ok: true, errors: ["Bad request."]});
    if(typeof content === "undefined" || content.trim() == "") return res.json({ok: false, errors: ["Message is empty"]});

    if(content.length > 4000) return res.json({ok: false, errors: ["Character limit exceeded."]});


    pool.getConnection((err, connection) => {
        if(err) {
            console.error(err);
            return res.json({ok: false, errors: ["Something went wrong. Please try again later."]});
        }

        // check if channel exists
        connection.query(`SELECT 1 FROM channels WHERE id=${escape(req.params.id)}`, (err, result) => {
            if(err) {
                return res.json({ok: false, errors: ["Something went wrong. Please try again later."]});
            }
            if(result.length === 0) return res.json({ok: false, errors: ["Channel doesn't exist"]});
        });


        const payload = extractPayloadFromToken(req.cookies.auth);

        // Check if user is a member of channel

        connection.query(`SELECT 1 FROM channel_memberships WHERE user=${escape(payload.sub.toString())} AND channel=${escape(req.params.id)}`, (err, result) => {
            if(err) return res.json({ok: false, errors: ["Something went wrong. Please try again later."]});

            if(result.length === 0) return res.json({ok: false, errors: ["You are not a member of this channel."]});
        });

        // Everything is okay, send the message

        connection.query(`INSERT INTO messages (author, channel, content) VALUES (${escape(payload.sub.toString())}, ${escape(req.params.id)}, "${escape(content)}")`, (err) => {
            if(err) {
                console.error(err.message);
                return res.json({ok: false, errors: ["Something went wrong. Please try again later"]});
            }

            return res.json({ok: true});
        });

        connection.release();
    });
});

export default router; 
