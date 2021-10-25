import {Context, Status, STATUS_TEXT} from "https://deno.land/x/oak@v9.0.1/mod.ts";
import {createUser, getByUserName} from "../repository/userRepository.ts";
import {ResponseCustom} from "../utilities/responseCustom.ts";
import {encodePass, verifyPass} from "../secure/sercurePassword.ts";
import {genToken} from "../secure/token.ts";
import {User} from "../model/user.ts";
import {parseToken} from "../middleware/middlewareJWT.ts";

export const signUpHandler = async (context: Context) => {
    const body = await context.request.body();
    const reqValue = await body.value;
    const user = await getByUserName(reqValue.userName);
    if (user) {
        // nếu tồn tại user name trong db, sẽ trả về conflict, không thể tạo
        return ResponseCustom(context, Status.Conflict, {
            message: STATUS_TEXT.get(Status.Conflict),
            status: Status.Conflict
        })
    } else {
        reqValue.password = encodePass(reqValue.password);
        const insertId = await createUser(reqValue);
        if (insertId) {
            return ResponseCustom(context, Status.OK, {
                message: STATUS_TEXT.get(Status.OK),
                status: Status.OK,
                data: {
                    token: await genToken({phone: reqValue.numberPhone, userName: reqValue.userName})
                }
            });
        } else {
            return ResponseCustom(context, Status.InternalServerError, {
                message: STATUS_TEXT.get(Status.InternalServerError),
                status: Status.InternalServerError
            });
        }
    }
}

export const signInHandler = async (context: Context) => {
    const body = await context.request.body();
    const reqValue = await body.value;
    const user = (await getByUserName(reqValue.userName)) as User;
    if (user) {
        /// chúng ta sẽ kiểm tra password bằng cách mã hóa password user nhập khi đăng nhập,
        // nếu encode == encode ở db thì là đúng
        const validatePass = verifyPass(reqValue.password, user.password);
        if (validatePass) {
            return ResponseCustom(
                context, Status.OK, {
                    status: Status.OK,
                    message: STATUS_TEXT.get(Status.OK),
                    data: {
                        token: await genToken({phone: reqValue.numberPhone, userName: reqValue.userName})
                    }
                }
            );
        } else {
            return ResponseCustom(context, Status.Unauthorized, {
                status: Status.Unauthorized,
                message: STATUS_TEXT.get(Status.Unauthorized)
            });
        }
    } else {
        return ResponseCustom(context, Status.NotFound, {
            status: Status.NotFound,
            message: STATUS_TEXT.get(Status.NotFound)
        });
    }
}
export const userProfileHandler = async(context : Context) => {
    const dataUser = await parseToken(context);
    if(!dataUser){
        return;
    }
    const userName = (dataUser as any).userName;
    const user = await getByUserName(userName);
    if (user){
        return ResponseCustom(context, Status.OK, {
            status: Status.OK,
            message: STATUS_TEXT.get(Status.OK),
            data : user
        });
    }else{
        return ResponseCustom(context, Status.NotFound, {
            status: Status.NotFound,
            message: STATUS_TEXT.get(Status.NotFound)
        });
    }
}




