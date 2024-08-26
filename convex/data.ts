import { internalMutation } from "./_generated/server";
import type { TableNames } from "./_generated/dataModel";


const USERS = [{}];
const POSTS = [
  {
    "title": "Introducing Convex Auth",
    "slug": "introducing-convex-auth",
    "summary": "Convex Auth is a library for implementing authentication natively in your Convex backend.",
    "published": true,
    "content": ` "Convex Auth is a library for implementing authentication using your Convex backend.

Check it out [in the Convex docs
]\(https: //docs.convex.dev/auth/convex-auth) to get started or play with the [example demo](https://labs.convex.dev/auth-example) ([source](https://github.com/get-convex/convex-auth-example)).

*This article is based on the [launch video
](https: //convex.dev/auth).*

# Motivation

Convex is designed for building multi-user applications. And if your app has users, it needs authentication. But authentication is a really complex component of a full-stack app. For this reason we have been recommending the built-in integrations with mature authentication platforms like [Clerk
](https: //clerk.dev/) and [Auth0](https://auth0.com/).

Yet many developers have been asking for a self-hosted solution. The auth platforms I mentioned have a ton of features but they also store the authentication data. This complicates your app, as that data has to be somehow synced or shared with your backend and database.

![diagram of client convex and auth server
](https: //cdn.sanity.io/images/ts10onj4/production/d0c8eae535ad0c9dc4bc2bfe336a7d3d5c3553cc-2798x1476.png)

This is a surmountable challenge, but maybe you’re just getting started and your app doesn’t need every authentication feature. You’d rather have more control over the data and a simpler architecture to build on top of.

![diagram of client and convex server
](https: //cdn.sanity.io/images/ts10onj4/production/c8226a4d784f83be8bb5b7d569fe422bfdac838c-1957x805.png)

# Functionality

Convex Auth enables you to build such a solution. It is inspired by the excellent [Auth.js
](https: //authjs.dev/) and [Lucia](https://lucia-auth.com/) libraries, and reuses some of their implementation. It is also similar in its capabilities to auth solutions such as Firebase Auth and Supabase Auth (although it doesn’t have all of their features yet).

In the [demo
](https: //labs.convex.dev/auth-example) you can see the various sign-in methods you can implement with Convex Auth. It supports sign-in via OAuth, magic links, one-time-passwords and normal email and password combination. You can use any of the 80 OAuth providers supported by Auth.js.

# Code deep dive

## Server configuration

The main configuration file is \`auth.ts\` in your convex directory, which configures the available authentication methods:

\`\`\`jsx
import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
import Resend from '@auth/core/providers/resend';
import { Password
} from '@convex-dev/auth/providers/Password';

export const { auth, signIn, signOut, store
} = convexAuth({
  providers: [GitHub, Google, Resend, Password
    ],
});
\`\`\`

Your \`schema.ts\` must also include the tables used by the library, including the \`users\` table. This is because the library uses indexes on these tables for efficient lookups:

\`\`\`jsx
import { authTables
} from '@convex-dev/auth/server';
import { defineSchema, defineTable
} from 'convex/server';
import { v
} from 'convex/values';

export default defineSchema({
  ...authTables,
    // Your other tables...
});
\`\`\`

There is additional configuration in \`auth.config.ts\` and \`https.ts\`, but you won’t need to touch these. See [Manual Setup
](https: //labs.convex.dev/auth/setup/manual) for more details if you’re interested.

## Frontend configuration

On the frontend, instead of using \`ConvexProvider\`, the app is wrapped in \`ConvexAuthProvider\`. Then in the \`App\` root component, the \`Authenticated\` and \`Unauthenticated\` components (from \`convex/react\`) are used to render different UI based on the authentication state. When not authenticated, your app can render the sign-in form:

\`\`\`jsx
import { Content
} from '@/Content';
import { SignInForm
} from '@/auth/SignInForm';
import { Authenticated, Unauthenticated
} from 'convex/react';

export default function App() {
  return (
    <>
      <Authenticated>
        <Content />
      </Authenticated>
      <Unauthenticated>
        <SignInForm />
      </Unauthenticated>
    </>
  );
}

\`\`\`

The key part of the sign-in UI is calling the \`signIn\` function with the name of one of the authentication methods configured in \`auth.ts\`. For example here’s a form that sends the user a magic link:

\`\`\`jsx

import { useAuthActions
} from '@convex-dev/auth/react';

export function SignInWithMagicLink() {
  const { signIn
    } = useAuthActions();
  return (
    <form
      className='flex flex-col'
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        void signIn('resend', formData);
        }
    }
    >
      <label htmlFor='email'>Email</label>
      <input name='email' id='email' className='mb-4' autoComplete='email' />
      <button type='submit'>Send sign-in link</button>
    </form>
  );
}
\`\`\`

## Handling authentication

Finally, let’s look at how the authentication state is used to power the signed-in experience. The \`auth.ts\` file exports an \`auth\` helper, which has methods for retrieving the current user and session ID. Using these methods, we can return the information about the current user back to the client:

\`\`\`jsx
import { query
} from './_generated/server';
import { auth
} from './auth';

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    return userId !== null ? ctx.db.get(userId) : null;
    },
});
\`\`\`

As well as enforce that certain functions can only be called by signed-in users:

\`\`\`jsx
import { query, mutation
} from './_generated/server';
import { v
} from 'convex/values';
import { auth
} from './auth';

export const send = mutation({
  args: { body: v.string()
    },
  handler: async (ctx,
    { body
    }) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error('Not signed in');
        }
        // Send a new message.
    await ctx.db.insert('messages',
        { body, userId
        });
    },
});
\`\`\`

## Conclusion

And that’s all it takes to get self-hosted auth to work. From here I recommend you read through the [docs
](https: //labs.convex.dev/auth). They go into detail on how to implement the various authentication methods and on the trade-offs between them. I hope you’ll find the library useful. Please let us know what you think on our [discord](https://arc.net/l/quote/dxljwnkc)."
`}
];


export const clearAll = internalMutation({
  args: {},
  handler: async (ctx) => {
    ["posts", "users", "versions"].map(async (table) => {
      const oldData = await ctx.db.query(table as TableNames).collect();
      oldData.map(async ({ _id }) => {
        await ctx.db.delete(_id);
      });
    })
  }
});


export const reset = internalMutation({
  args: {},
  handler: async (ctx) => {
    await clearAll(ctx, {});
    USERS.map(async u => await (ctx.db.insert('users', u)));
    const userIds = (await ctx.db.query('users').collect()).map((u) => u._id);
    POSTS.map(async (p, i) => {
      const authorId = userIds[i % userIds.length]
      const postId = await ctx.db.insert('posts',
        { ...p, authorId, publishTime: Date.now() }
      );
      await ctx.db.insert('versions',
        { ...p, postId, authorId, editorId: authorId }
      );
    });

  }
});