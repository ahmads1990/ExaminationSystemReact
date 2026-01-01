import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div className="d-flex flex-grow-1">
            {/* SIDEBAR */}
            <aside className="bg-white border-end" style={{ width: "250px" }}>
                <div className="p-3">
                    <h5>Sidebar</h5>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                Link 1
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                Link 2
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                Link 3
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-grow-1 p-4">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
