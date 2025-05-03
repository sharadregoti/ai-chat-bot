import { ChatProvider } from "./ChatContext"
import { DialogCloseButton } from "./Popup"

function App() {
  return (
    <ChatProvider>
      <div className="relative min-h-svh">
        <div className="fixed bottom-6 right-6">
          <DialogCloseButton />
        </div>
      </div>
    </ChatProvider>
  )
}

export default App
