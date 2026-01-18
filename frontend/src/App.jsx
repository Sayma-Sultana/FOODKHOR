import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./Pages/Home";
import Success from "./Pages/Success";
import NotFound from "./Pages/NotFound";
import DishDetail from "./Pages/DishDetail";
import MenuPage from "./Pages/MenuPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/success" element={<Success />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/dish/:id" element={<DishDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
