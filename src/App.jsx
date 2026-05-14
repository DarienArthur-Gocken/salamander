import { Routes, Route} from 'react-router-dom';
import Home from './pages/Home.jsx';
import Videos from './pages/Videos.jsx';
import Preview from './pages/Preview.jsx';
import Export from './pages/Export.jsx';
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <div className="bg-background min-h-screen pt-16 pb-16">
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/preview/:filename" element={<Preview />} />
        <Route path="/export" element={<Export />} />
      </Routes>
      <Footer />
    </div>
  );
}