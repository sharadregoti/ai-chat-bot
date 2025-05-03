
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { ChatDemo } from "./Chat"

export function DialogCloseButton() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">✨Ask AI</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[50%]">
                <DialogHeader>
                    <DialogTitle>Docs AI</DialogTitle>
                    <DialogDescription>
                        Anyone who has this link will be able to view this.
                    </DialogDescription>
                </DialogHeader>
                <ChatDemo />
            </DialogContent>
        </Dialog>
    )
}
