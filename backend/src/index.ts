import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { redis } from "./redis";
import { SandContext } from "./types/SandContext";
import * as express from "express";
import * as connectRedis from "connect-redis";
import * as session from "express-session";
import * as cors from "cors";
import * as https from "https";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

const port = process.env.ENVIORMENT === "production" ? 443 : 3000;

const SESSION_SECRET = process.env.SESSION_SECRET || "dev_session_secret";

const boostrap = async () => {
	await createConnection();
	
	const schema = await buildSchema({
		resolvers: [__dirname + "/modules/user/**.ts"]
	});

	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res }: SandContext) => ({ req, res })
	});

	const app = express();

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
			maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years in ms
		}
	};

	app.use(
		cors({
			credentials: true,
			origin: "http://localhost:3000"
		})
	);

	app.use(session(sessionOptions));

	app.get("/", (_req, res) => res.send("This is a placeholder route. Ignore this."));

	apolloServer.applyMiddleware({ app });

	if(process.env.ENVIORMENT === "production") {
		https.createServer({
			key: fs.readFileSync(__dirname + "/ssl/private.key"),
			cert: fs.readFileSync(__dirname + "/ssl/certificate.crt")
		}, app).listen(port, () => console.log(`Server listening in production mode on port ${port}`));
	} else {
		app.listen(port, () => console.log(`Server listening in development mode on port ${port}`));
	}
}

boostrap();