import {Router} from "https://deno.land/x/oak@v9.0.1/mod.ts";
import {helloHandler} from "../controllers/helloController.ts";
import {signInHandler, signUpHandler, userProfileHandler} from "../controllers/userController.ts";
import {jwtMiddleware} from "../middleware/middlewareJWT.ts";

let router = new Router();
router
    .get("/", jwtMiddleware, helloHandler)
    .post("/api/v1/sign-up", signUpHandler)
    .post("/api/v1/sign-in", signInHandler)
    .get("/api/v1/user-profile", jwtMiddleware, userProfileHandler);

export default router;
