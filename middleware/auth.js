import { Jwt } from "jsonwebtoken";
const JWT_SECRET = "secret";
import mongoose from "mongoose";
import User from "../models/user";

const auth = async (req, res, next) => {
    const {authorization} = req.headers;

    if(!authorization) {
        return res.status(401).send({error: "You must be logged in"});
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, JWT_SECRET, async (err, payload) => {
        if(err) {
            return res.status(401).send({error: "You must be logged in"});
        }

        const {_id} = payload;

        const user = await User.findById(_id);

        req.user = user;

        return next();
    });
}