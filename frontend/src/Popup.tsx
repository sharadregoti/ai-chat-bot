
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
                <Button
                    className="flex flex-col items-center justify-center w-16 h-16 p-2 rounded-lg bg-indigo-900 hover:cursor-pointer hover:bg-indigo-800 hover:text-white text-white shadow-lg"
                    variant="outline"
                >
                    ✨
                    <span className="">Ask AI</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[50%]">
                <DialogHeader>
                    <DialogTitle>Docs AI</DialogTitle>
                    <DialogDescription>
                        Your intelligent assistant for document navigation and insights.
                    </DialogDescription>
                </DialogHeader>
                <ChatDemo />
            </DialogContent>
        </Dialog>
    )
}
