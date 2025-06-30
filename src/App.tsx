import {
  BrowserRouter as Router,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Login } from "./views/Login.tsx";
import { Signup } from "./views/Signup.tsx";
import { NotFound } from "./views/NotFound.tsx";
import { NavBar } from "./components/nav/NavBar.tsx";
import { UserSettingsView } from "./views/user/UserSettingsView.tsx";
import { Dashboard } from "./views/Dashboard.tsx";
import { PlaybookView } from "./views/playbook/PlaybookView.tsx";
import JournalView from "./views/journal/JournalView.tsx";
import Footer from "./components/footer/Footer.tsx";

const Layout: React.FC = () => {
  const location = useLocation();

  const noNavBarRoutes = ["/", "/signup"];
  const hideNavBar = noNavBarRoutes.includes(location.pathname);

  return (
    <div className="px-6 lg:px-[10vw] py-4">
      {!hideNavBar && <NavBar />}
      <Outlet />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/journal" element={<JournalView />} />
          <Route path="/playbook" element={<PlaybookView />} />
          <Route path="/settings" element={<UserSettingsView />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
