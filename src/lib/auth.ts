import { NextAuthOptions,Session } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";
const getGoogleCredentials = () => {
    const clientId= process.env.GOOGLE_CLIENT_ID
    const clientSecret= process.env.GOOGLE_CLIENT_SECRET
    if (!clientId || clientId.length === 0) {
        throw new Error("GOOGLE_CLIENT_ID is not set")

    }
    if (!clientSecret || clientSecret.length === 0) {
        throw new Error("GOOGLE_CLIENT_ID is not set")

    }
    return{clientId,clientSecret}
}
export const authOptions: NextAuthOptions = {
    
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        GoogleProvider({
            clientId:getGoogleCredentials().clientId,
            clientSecret:getGoogleCredentials().clientSecret,
            httpOptions: {
         timeout: 10000, // Increase timeout to 10 seconds
      },
        })
    ],
    callbacks:{
        async jwt({token,user}) {
            if (user) {
                token.id = user.id
                token.name = user.name
                token.email = user.email
                token.picture = user.image
            }

            return token
        },
        async session({session,token}):Promise<Session>{
            if (token) {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
              }
        
              return session
    
    },
    redirect(){
        return '/dashboard'
    }
},
}
