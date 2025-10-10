import { betterAuth } from "better-auth";
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { connectToDatabase } from "@/database/mongoose";
import { nextCookies } from 'better-auth/next-js'

let authInstance: ReturnType<typeof betterAuth> | null = null; //singleton instance this prevents multiple connections

//the below is an instance of authentication
//below is the way to setup our database
export const getAuth = async() => {
    if (authInstance) return authInstance;
    const mongoose = await connectToDatabase(); //this is the way to connect to the database.
    const db = mongoose.connection.db; //this is the way to get the database from mongoose connection

    if (!db) throw new Error('mongodb connection is not found');
    
    authInstance = betterAuth({
        database: mongodbAdapter(db as any),
        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: process.env.BETTER_AUTH_URL,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
        },
        plugins:[nextCookies()],
    })

    return authInstance
}

export const auth = await getAuth(); //this is the instance of authentication