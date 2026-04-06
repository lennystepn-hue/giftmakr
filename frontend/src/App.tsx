import { Routes, Route } from "react-router-dom";
import ToastProvider from "@/components/Toast";
import Landing from "@/pages/Landing";
import Find from "@/pages/Find";
import About from "@/pages/About";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";

export default function App() {
  return (
    <>
      <ToastProvider />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/find" element={<Find />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </>
  );
}
