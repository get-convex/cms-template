import { SignInForm } from "./SignInForm";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";


export function SignInDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Sign In</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>
                    <h2 className="font-semibold text-2xl tracking-tight">
                        Sign in or create an account
                    </h2>
                </DialogTitle>
                <DialogClose />
                <SignInForm />
            </DialogContent>
        </Dialog>
    )
}