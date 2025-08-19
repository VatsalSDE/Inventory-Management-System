import { useState } from "react";
import "./App.css";
import Adminroutes from "./routes/AdminRoutes";
import { BrowserRouter } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Adminroutes />
    </BrowserRouter>
  );
}

export default App;
