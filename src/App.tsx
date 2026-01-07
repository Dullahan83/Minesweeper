import "./App.css";
import { ModalProvider } from "./Components/ModalProvider";
import Window from "./Components/Window";

function App() {
  return (
    <div className="justify-center items-center flex h-full min-h-screen">
      <ModalProvider>
        <Window />
      </ModalProvider>
    </div>
  );
}

export default App;
