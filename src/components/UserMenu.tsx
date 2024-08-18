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
import { SignInDialog } from "./SignIn/SignInDialog";
import { Link } from "react-router-dom";
import type { Doc } from "../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UserImage } from "./Author/Profile";

export function AuthedUserMenu({ user }: { user: Doc<'users'> }) {
  const userName = user.name || user.email
  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      {userName}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full" >
            <UserImage src={user.image} size='full' />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="font-normal">
            <Link to={`/authors/${user._id}/edit`}>View/edit profile</Link>
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
