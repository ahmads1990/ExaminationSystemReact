import "bootstrap/dist/css/bootstrap.min.css";
import TestComponents from "./components/TestComponents";
import "./App.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import QuestionList from "./components/questions/QuestionList";

function App() {
    return (
        <BrowserRouter>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Questions</Link>
                        </li>
                        <li>
                            <Link to="/test">Test</Link>
                        </li>
                    </ul>
                </nav>
            </div>

            <Routes>
                <Route path="test" element={<TestComponents />}></Route>
                <Route path="/" element={<QuestionList />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
