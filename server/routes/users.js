import { v1 as uuid } from "uuid";
import utils from "../utils/utils.js";
import { newUserSchema } from "../schema/users.js";
import GoogleAuth from "../middleware/google-auth.js";

export default async function (fastify, options, next) {
    //Create a new Users document(Admin API - One time)
    fastify.post("/api/users/new-user-doc", async (request, reply) => {
        const {
            user_name,
            password,
            email,
            full_name,
            dob,
            gender,
            secure_login_recovery,
            street_address_1,
            street_address_2,
            city,
            state,
            zip,
            country,
            role,
            sold_product_ID,
        } = request.body;

        //Create New Document
        const data = await utils.createUsersDocument(
            "Users",
            user_name,
            password,
            email,
            full_name,
            dob,
            gender,
            secure_login_recovery,
            street_address_1,
            street_address_2,
            city,
            state,
            zip,
            country,
            role,
            sold_product_ID
        );
        reply.code(201).send(data);
    });

    // Get User-Info
    fastify.post("/api/users/login", async (request, reply) => {
        try {
            const { userName, password } = request.body;

            //Find all available docs
            let docList = await utils.findAllDocs();

            let id = "";
            let rev = "";
            let user_details = {};

            if (
                docList != null &&
                docList.data != null &&
                docList.data.total_rows > 0
            ) {
                const docFound = docList.data.rows.find(
                    (element) => element.doc.type === "Users"
                );
                if (docFound) {
                    id = docFound.id;
                    rev = docFound.doc._rev;

                    if ((userName && password) || (userName && !password)) {
                        const userFound = docFound.doc.user_details.find(
                            (user) =>
                                !password
                                    ? user.email === userName
                                    : user.user_name === userName &&
                                      user.password === password
                        );
                        if (userFound) {
                            user_details = userFound;
                            user_details.token = fastify.jwt.sign(
                                { userName, password: userFound.password },
                                { expiresIn: "1 day" }
                            );
                        } else {
                            throw new Error();
                        }
                        if (!password) {
                            const { googletoken: token } = request.headers;
                            const verified = await GoogleAuth(token);
                            if (!verified) {
                                throw new Error();
                            }
                        }
                    } else {
                        throw new Error();
                    }
                }
            }

            if (user_details != null && user_details.user_name) {
                reply.code(200).send(user_details);
            } else {
                throw new Error();
            }
        } catch (error) {
            reply.code(400).send(error);
        }
    });

    //Create New User
    fastify.post(
        "/api/users/sign-up",
        newUserSchema,
        async (request, reply) => {
            const { user_name, password, isAdmin } = request.body;

            //Find all available docs
            let docList = await utils.findAllDocs();

            let id = "";
            let rev = "";
            let user_details = [];

            if (
                docList != null &&
                docList.data != null &&
                docList.data.total_rows > 0
            ) {
                docList.data.rows.forEach((element) => {
                    //Extract information from Users document
                    if (element.doc.type == "Users") {
                        id = element.id;
                        rev = element.doc._rev;
                        user_details = element.doc.user_details;
                    }
                });
            }

            const token = fastify.jwt.sign(
                { user_name, password },
                { expiresIn: "1 day" }
            );

            //Create new user object
            let UserObj = {
                user_ID: uuid(),
                ...request.body,
                role: ["CONSUMER", "SELLER", "EXTERNAL", "ADMIN"].map(
                    (v, i) => {
                        return {
                            RoleID: i + 1,
                            Name: v,
                            GroupName: "GreenProductionInternalTest",
                            Precedence: "2",
                            CreatedTime: new Date().toISOString(),
                            UpdatedTime: new Date().toISOString(),
                            AppCustomer: "GREENYTALE",
                            ActiveStatus: !!isAdmin,
                        };
                    }
                ),
                created_dt: new Date().toISOString(),
                updated_dt: new Date().toISOString(),
            };

            //Modifiy existing User_Details array from document
            user_details.push(UserObj);

            //Insert updated user details array in Users document
            let docInfo = await utils.insertUserInfo(id, rev, user_details);

            reply.code(201).send({ ...UserObj, token });
        }
    );

    //Update Existing User - their user profile
    fastify.post(
        "/api/users/update-profile",
        {
            preValidation: [fastify.authentication],
        },
        async (request, reply) => {
            //Find all available docs
            let docList = await utils.findAllDocs();

            let id = "";
            let rev = "";
            let user_details = [];

            let userID = request.body.user_ID;

            if (
                docList != null &&
                docList.data != null &&
                docList.data.total_rows > 0
            ) {
                docList.data.rows.forEach((element) => {
                    //Extract information from Users document
                    if (element.doc.type == "Users") {
                        id = element.id;
                        rev = element.doc._rev;
                        user_details = element.doc.user_details;
                    }
                });
            }

            user_details.forEach((user) => {
                if (user.user_ID == userID) {
                    user = utils.mapUserUpdateToModel(user, request.body);
                }
            });

            //Insert updated user details array in Users document
            let docInfo = await utils.insertUserInfo(id, rev, user_details);

            reply.send(docInfo);
        }
    );

    next();
}
