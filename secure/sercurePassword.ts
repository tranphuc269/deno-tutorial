import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

export const encodePass = (password : string) => {
    return bcrypt.hashSync(password);
}

export const verifyPass = (password : string, hash : string) => {
    return bcrypt.compareSync(password, hash);
}