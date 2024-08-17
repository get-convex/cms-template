import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthActions } from "@convex-dev/auth/react";
import { PersonIcon } from "@radix-ui/react-icons";
import { SignInDialog } from "../SignIn/SignInDialog";
import { Link } from "react-router-dom";
import type { Doc } from "../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function AuthedUserMenu({ user }: { user: Doc<'users'> }) {
  const userName = user.name || user.email
  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      {userName}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            {user.image
              ? <img src={user.image} className="rounded-full" />
              : <PersonIcon className="h-5 w-5" />}
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>
            <Link to={`/users/${user._id}/edit`}>Edit user profile</Link>
          </DropdownMenuLabel>
          <DropdownMenuLabel className="flex items-center gap-2 py-0 font-normal">
            Theme
            <ThemeToggle />
          </DropdownMenuLabel>
          <SignOutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function SignOutButton() {
  const { signOut } = useAuthActions();
  return (
    <DropdownMenuItem onClick={() => void signOut()}>Sign out</DropdownMenuItem>
  );
}

export function UserMenu() {
  const viewer = useQuery(api.users.viewer)

  return (viewer
    ? <AuthedUserMenu user={viewer} />
    : <SignInDialog />
  );
}
