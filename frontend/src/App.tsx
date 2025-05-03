import { ChatProvider } from "./ChatContext"
import { DialogCloseButton } from "./Popup"

function App() {
  return (
    <ChatProvider>
      <div className="flex flex-col items-center justify-center min-h-svh">
        <DialogCloseButton />
      </div>
    </ChatProvider>
  )
}

export default App
