import {validate, verify, decode} from "https://deno.land/x/djwt@v2.4/mod.ts";
import {Context, Status} from "https://deno.land/x/oak@v9.0.1/mod.ts";
import {ResponseCustom} from "../utilities/responseCustom.ts";
import {keyHS256, header} from "../secure/token.ts";


export const parseToken = async (context: Context) => {
    const token = await getToken(context);
    const data = decode(token);
    return data ? data[1] : null;
}
const getToken = async (context: Context) => {
    const header: Headers = context.request.headers;
    const author = header.get("Authorization");
    if (author) {
        const token = author.split(" ")[1];
        if (token) {
            return token;
        }
    }
    return "";
}


export const jwtMiddleware = async (context: Context, next: any) => {
    const header: Headers = context.request.headers;
    const author = header.get("Authorization");
    if (!author) {
        return ResponseCustom(context, Status.Unauthorized, {
            message: "Invalid JWT Token",
        });
    }
    const token = author.split(" ")[1];
    if (token) {
        if (await verify(token, keyHS256)) {
            await next();
            return;
        }
    } else {
        return ResponseCustom(context, Status.Unauthorized, {
            message: "Invalid JWT Token",
        });
    }
}