import GitHub from "@auth/core/providers/github";
import Resend from "@auth/core/providers/resend";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GitHub, Resend],
  callbacks: {
    async redirect(params) {
      const url = new URL(params.redirectTo);
      if (
        [
          new URL(process.env.SITE_URL || process.env.CONVEX_SITE_URL!)
            .hostname,
          "localhost",
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
