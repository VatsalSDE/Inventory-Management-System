import "./App.css";
import Adminroutes from "./routes/Adminroutes";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import AIChatbot from "./components/AIChatbot";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Adminroutes />
        <AIChatbot />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
