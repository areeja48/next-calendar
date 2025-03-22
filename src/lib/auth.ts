import GoogleProvider from 'next-auth/providers/google'
import type { AuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { signIn } from 'next-auth/react'

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar.events",
        },
      },
    }),
  ],
  pages: {
    signIn: '/dashboard',
    signOut: '/',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account, user, trigger, session }) {
      if (user) {
        token.name = user.name || '';
        token.email = user.email || '';
        token.role = 'user';
        token.image = user.image || '';
      }

      if (trigger === 'update' && session?.user?.name) {
        token.name = session.user.name;
      }

      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at! * 1000;
      }

      // If token still valid
      if (Date.now() < (token.accessTokenExpires || 0)) {
        return token;
      }

      // Otherwise refresh
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        name: token.name as string,
        email: token.email as string,
        role: token.role as string,
        image: token.image as string,
      };
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
};

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const signInWithGoogle = async () => {
  await signIn('google');
};
