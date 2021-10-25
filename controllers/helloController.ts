import {Context} from "https://deno.land/x/oak@v9.0.1/mod.ts";

export const helloHandler = async (context: Context) => {
    context.response.body = "Hello world";
}