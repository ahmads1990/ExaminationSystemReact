import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./components/common/MainLayout";
import QuestionList from "./components/questions/QuestionList";
import TestComponents from "./components/TestComponents";

function App() {
    return (
        <BrowserRouter>
            {/* TOP NAVBAR */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-info">
                <div className="container-fluid">
                    <a className="navbar-brand text-black" href="#">
                        MyApp
                    </a>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/">
                                Questions
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/test">
                                Test
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
            {/* MAIN SECTION */}
            <MainLayout>
                <Routes>
                    <Route path="test" element={<TestComponents />}></Route>
                    <Route path="/" element={<QuestionList />}></Route>
                </Routes>
            </MainLayout>
            {/* FOOTER */}
            <footer className="bg-dark text-white text-center py-3 mt-auto">
                <div className="container">
                    <small>&copy; 2024 MyApp</small>
                </div>
            </footer>
        </BrowserRouter>
    );
}

export default App;
