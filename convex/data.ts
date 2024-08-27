import { internalMutation } from "./_generated/server";
import type { TableNames } from "./_generated/dataModel";


const USERS = [
  {
    email: "ian@convex.dev",
    emailVerificationTime: 1723716062529,
    image:
      "https://avatars.githubusercontent.com/u/366683?v=4",
    name: "Ian Macartney",
  },
  {
    email: "wayne@convex.dev",
    emailVerificationTime: 1723607151950,
    image:
      "https://avatars.githubusercontent.com/u/720186?v=4",
    name: "Wayne Sutton",
  },
  {
    email: "contact@anjana.dev",
    emailVerificationTime: 1723639304753,
    image:
      "https://avatars.githubusercontent.com/u/5424927?v=4",
    name: "Anjana Vakil",
  },
  {
    email: "tom@tomredman.ca",
    emailVerificationTime: 1724094339527,
    image:
      "https://avatars.githubusercontent.com/u/4225378?v=4",
    name: "Tom Redman",
  }
];
const POSTS = [
  {
    authorIndex: 1,
    content: `A few months into their startup journey, Emily and Jason had successfully launched their platform, thanks to the robust backend support from Convex.dev. Their users loved the smooth, intuitive experience, and the team was ready to take the next big step: adding content management capabilities.
  
  When Convex announced their new CMS feature, Emily and Jason were thrilled. The CMS was exactly what they needed to empower their users to manage their content seamlessly within the platform. The developers spent the day exploring the new feature, diving into its functionalities, and brainstorming how they could integrate it to enhance their platform’s offerings.
  
  The creative startup office buzzed with excitement as they mapped out new possibilities. Jason pointed out key features on the laptop screen while Emily jotted down implementation ideas. The large screen in the office displayed the CMS dashboard, hinting at the powerful new tools they were eager to incorporate. This new addition to Convex’s offerings not only fueled their excitement but also opened up a world of possibilities for their startup’s growth.`,
    imageUrl:
      "https://pleasant-albatross-666.convex.cloud/api/storage/82027b58-1979-435c-a41a-e55205b0a0c5",
    published: true,
    slug: "convexcms",
    summary:
      "This new addition to Convex’s offerings not only fueled their excitement but also opened up a world of possibilities for their startup’s growth.",
    title: "Exploring Convex’s New CMS",
  },
  {
    authorIndex: 0,
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
`},
  {
    authorIndex: 3,
    content: `A team of full-stack developers, comprised of Alex, Priya, and Mateo, were always on the lookout for new tools and technologies that could push the boundaries of their projects. When they heard about the Convex “Zero to One” hackathon, they decided to join, eager to explore what this new backend platform could offer.

The hackathon challenge was simple yet ambitious: build something unique using Convex.dev in just 48 hours. The team brainstormed and decided to create a blog platform that could effortlessly handle dynamic content and user interactions. They were drawn to Convex’s promise of fast, scalable, and serverless backend solutions, which seemed perfect for their idea.

As they delved into the development, they were impressed by how quickly they could set up their backend using Convex. The platform’s real-time features and seamless integration with their frontend frameworks allowed them to focus on creating a rich, interactive user experience without worrying about managing servers or databases. The project came together faster than they expected, with Convex handling the heavy lifting behind the scenes.

By the end of the hackathon, their blog platform was not only functional but also robust and scalable. The experience had been so smooth and empowering that they decided to take their idea further. The team transformed their hackathon project into a full-fledged startup, using Convex as the backbone of their platform. They envisioned expanding the blog into a community-driven space where users could create, share, and interact with content effortlessly.

With Convex.dev, they were confident they could scale their startup quickly and efficiently. What started as a hackathon experiment had now evolved into a startup venture, fueled by the possibilities that Convex unlocked for them. The journey from zero to one was just the beginning, and they were excited to see where Convex would take them next.`,
    imageUrl:
      "https://pleasant-albatross-666.convex.cloud/api/storage/6a651783-cb93-4878-a7c9-784091e560c4",
    postId: "h",
    published: true,
    slug: "hackathon-startup",
    summary:
      "With Convex.dev, they were confident they could scale their startup quickly and efficiently. ",
    title: "From Hackathon to Startup with Convex",
  }
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