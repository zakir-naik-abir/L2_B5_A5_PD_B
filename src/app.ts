import passport from 'passport';
import expressSession from 'express-session';
import express, { Request, Response } from "express"
import cors from "cors";
import { envVars } from './app/config/env';
import { notFound } from './app/middleware/notFound';
import { router } from './app/routes';
import "./app/config/passport";

const app = express();

app.use(expressSession({
  secret: envVars.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(express.json());

const corsOptions = {
  origin: '*', 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: "*",
  exposedHeaders: ['Authorization']
};
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use("/api/v1", router);

app.get('/', (req: Request, res: Response) =>{
  res.status(200).json({
    message: "🚚 Welcome to Parcel Delivery System Backend"
  })
});

app.use(notFound);

export default app;