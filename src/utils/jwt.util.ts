import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import path from "path";

import HttpException from "./exceptions/http.exception";
import { speeches } from "../configs/speeches.config";

class JwtUtil {
    /**
     * Create a JWT token
     * @param data Data is object, information need to store in token.
     * @param key Private key application level secret
     * @returns encrypted token
     */
    async createToken(data = {}, key: any = process.env.PRIVATE_KEY) {
        if (Object.keys(data).length) {
            try {
                var privateKEY = readFileSync(path.join(process.cwd(), process.env.PUBLIC_KEY || "keys/jwtRS256.pem"), 'utf8');
                return jwt.sign(data, privateKEY, {
                    expiresIn: process.env.TOKEN_DEFAULT_TIMEOUT,
                    algorithm: "HS256"
                });
            } catch (err) {
                return new Promise((resolve, reject) => {
                    reject(err);
                });
            }
        } else {
            throw new HttpException(500, speeches.INVALID_DATA_SEND_TO_CREATE_TOKEN);
        }
    }

    /**
     * Validate the token, verify the payload data attached to the token
     * @param token String
     * @returns data
     */
    async validateToken(token: string) {
        try {
            const publicKEY = readFileSync(path.join(process.cwd(), process.env.PRIVATE_KEY || "keys/jwtRS256.pem"), 'utf8');
            return new Promise((resolve, reject) => {
                jwt.verify(
                    token,
                    publicKEY, (err: any, result: any) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
            })
        } catch (err) {
            return new Promise((resolve, reject) => {
                console.log("-------------------------------------");
                reject(err);
            });
        }
    }

}

export default new JwtUtil();