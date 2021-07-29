// Require the framework and instantiate it
import Fastify from "fastify";
const fastify = Fastify({ logger: true });
import swagger from "fastify-swagger";
import jwt from "fastify-jwt";
import auth from "./middleware/auth.js";

import util from "util";
import { pipeline } from "stream";
const pump = util.promisify(pipeline)
import fs from "fs";
import multer from "fastify-multer";

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

//fastify.register(import("fastify-multipart"));
fastify.register(multer.contentParser);


const upload = multer({
    limits: {
        fileSize: 1.049e+6
    },
    fileFilter(req, file, cb) {
        // if(!file.originalname.endsWith('.pdf')) { //here we are using endswith method to check if a single file those charactes at the end
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) { //here match uses regex to chec extentions of multiple files which we are allowing
            cb(new Error('Please upload a JPG/JPEG/PNG file'))
        }

        cb(undefined, true)
    }
})

fastify.post(
    '/file',
    { preHandler: upload.single('file') },
    async function(request, reply) {
        
    //const data = await request.file()
    const buffer = await request.file.buffer

    console.log('buffer', buffer)
    console.log('product_id', request.body.product_ID)

    reply.code(200).send(buffer)
    }
)

// Run the server!
fastify.listen(process.env.PORT, "0.0.0.0", function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`server listening on ${address}`);
});
