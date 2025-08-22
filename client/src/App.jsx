import "./App.css";
import Adminroutes from "./routes/Adminroutes";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Adminroutes />
    </BrowserRouter>
  );
}

export default App;
