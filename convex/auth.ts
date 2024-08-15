import GitHub from "@auth/core/providers/github";
import Resend from "@auth/core/providers/resend";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GitHub, Resend],
  callbacks: {
    async redirect(params) {
      console.log(params);
      if (!params.redirectTo) {
        if (!process.env.SITE_URL) {
          throw new Error("SITE_URL is not set");
        }
        return process.env.SITE_URL;
      }
      const url = new URL(params.redirectTo);
      if (
        [
          new URL(process.env.SITE_URL || process.env.CONVEX_SITE_URL!)
            .hostname,
          "localhost",
          "www.convex-cms.com",
          "vite.convex-cms.com",
          "tanstack.convex-cms.com",
          "convex-cms.com",
          "labs.convex.dev",
        ].includes(url.hostname)
      ) {
        return params.redirectTo;
      }
      throw new Error("Invalid redirect URL");
      // return process.env.SITE_URL;
    },
  },
});
