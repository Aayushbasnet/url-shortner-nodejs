import * as session from 'express-session';

declare module 'express-session' {
    interface SessionData {
        shortUrl : string;
        originalUrl : string;
        errorMessage : {
            status : boolean,
            message : string | Array<any>
        };
        user : {
            id : number,
            firstName : string
        };
        loggedIn : boolean;
        // user: { [key: string]: any }
    }
}
