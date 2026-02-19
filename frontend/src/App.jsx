import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthTest from "./components/AuthTest";
import AddQuestion from "./components/AddQuestion";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<AuthTest />} />

          <Route path="/addQuestion" element={<AddQuestion />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;