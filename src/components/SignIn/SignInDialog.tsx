import { SignInForm } from "./SignInForm";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export function SignInDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Sign In</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="font-semibold text-2xl tracking-tight">
          Sign in or create an account
        </DialogTitle>
        <DialogClose />
        <SignInForm />
      </DialogContent>
    </Dialog>
  );
}
