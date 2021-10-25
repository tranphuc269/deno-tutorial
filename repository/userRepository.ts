import {User} from "../model/user.ts";
import database from "../database/database.ts";

const userCollection = database.collection("users");
export const createUser = async (user: User) => {
    return await userCollection.insertOne(user);
}

export const getByUserName = async (userName: string) => {
    return await userCollection.findOne({userName: userName});
}