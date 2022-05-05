import "express-session";
declare module "express-session" {
  interface SessionData {
    shortUrl: string;
    originalUrl: string;
    errorMessage: string | boolean | object;
  }
}