import {Context, Status} from "https://deno.land/x/oak@v9.0.1/mod.ts";

export const ResponseCustom = (context : Context, status : Status, data : any) => {
    context.response.status = status;
    context.response.body = data;
}