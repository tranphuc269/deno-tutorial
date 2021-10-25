import {Header, create, Payload} from "https://deno.land/x/djwt@v2.4/mod.ts";
import {verify} from "https://deno.land/x/djwt@v2.4/mod.ts";

export const keyHS256 = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode("secret"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
);

export const header: Header = {
    alg: "HS256",
    typ: "JWT",
};


export const genToken = async (payload: Payload) =>{
    const jwt = await create(header, payload, keyHS256);
    return jwt;
}

export const validateToken = async (token: string) => {
    return await verify(token, keyHS256);
}