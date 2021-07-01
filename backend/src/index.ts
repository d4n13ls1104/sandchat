import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { redis } from "src/redis";
import * as Express from "express";
import * as connectRedis from "connect-redis";
import * as session from "express-session";
import * as cors from "cors";
import * as https from "https";
import * as fs from "fs";


const port = process.env.ENVIORMENT === "production" ? 443 : 3000;

const SESSION_SECRET = process.env.SESSION_SECRET || "session_secret_for_dev_testing";

const boostrap = async () => {
    await createConnection();

    const schema = await buildSchema({
        resolvers:[__dirname + "/modules/**.ts"]
    });

    const apolloServer = new ApolloServer({schema});

    const app = Express();

    const RedisStore = connectRedis(session);

    const sessionOptions: session.SessionOptions = {
        store: new RedisStore({
            client: redis
        }),
        name: "qid",
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            secure: process.env.ENVIORMENT === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 Years in ms
        }
    };

    app.use(
        cors({
            credentials: true,
            origin: "http://localhost:3000"
        })
    );

    app.use(session(sessionOptions));

    apolloServer.applyMiddleware({ app });

    app.get("/",  (_req, res) => res.send("This route is for testing purposes. Hopefully the SSL works.."));
    
    if(process.env.ENVIORMENT === "production") {
        https.createServer({
            key: fs.readFileSync(__dirname + "/ssl/private.key"),
            cert: fs.readFileSync(__dirname + "/ssl/certificate.crt")
        }, app).listen(port, () => console.log(`Server listening on port ${port}`));
    } else {
        app.listen(port, () => console.log(`Server listening on port ${port}`));
    }
}

boostrap();