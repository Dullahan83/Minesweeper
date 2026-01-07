import "./App.css";
import { ModalProvider } from "./Components/ModalProvider";
import SweeperIcon from "./Components/SweeperIcon";
import Taskbar from "./Components/Taskbar";
import Window from "./Components/Window";

function App() {
  return (
    <div className="justify-center items-center flex h-full min-h-screen relative">
      <SweeperIcon />
      <ModalProvider>
        <Window />
      </ModalProvider>
      <Taskbar />
    </div>
  );
}

export default App;
