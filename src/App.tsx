import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { getAuthToken } from "./api/client";
import { PostsPage } from "./pages/PostsPage";

function App() {
  const isLoggedIn = !!getAuthToken();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={isLoggedIn ? <PostsPage /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
