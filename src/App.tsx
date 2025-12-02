import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { PostsPage } from "./pages/PostsPage";
import { PostCreatePage } from "./pages/PostCreatePage";
import { PostEditPage } from "./pages/PostEditPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/new" element={<PostCreatePage />} />
        <Route path="/posts/:id/edit" element={<PostEditPage />} />

        <Route path="/" element={<Navigate to="/posts" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
