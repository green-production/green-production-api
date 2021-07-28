// Require the framework and instantiate it
import Fastify from "fastify";
const fastify = Fastify({ logger: true });
import swagger from "fastify-swagger";
import jwt from "fastify-jwt";
import auth from "./middleware/auth.js";

fastify.register(jwt, {
    secret: process.env.JWT_SECRET_KEY,
});

fastify.register(swagger, {
    exposeRoute: true,
    routePrefix: "/docs",
    swagger: {
        info: {
            title: "GreenyTale",
            description: "Testing GreenyTale API",
            version: "1.0.0",
        },
        host: "localhost",
    },
});

fastify.register(import("fastify-cors"));

fastify.register(auth);
fastify.register(import("./routes/users.js"));
fastify.register(import("./routes/products.js"));
fastify.register(import("./routes/cart.js"));
fastify.register(import("./routes/orders.js"));

// Run the server!
fastify.listen(process.env.PORT, "0.0.0.0", function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`server listening on ${address}`);
});
