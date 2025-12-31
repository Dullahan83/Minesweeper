import "./App.css";
import { ModalProvider } from "./Components/ModalProvider";
import Window from "./Components/Window";

function App() {
  return (
    <div className="justify-center items-center flex h-full min-h-screen bg-gray-200">
      <ModalProvider>
        <Window />
      </ModalProvider>
    </div>
  );
}

export default App;
