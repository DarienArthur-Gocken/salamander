import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Videos from './pages/Videos.jsx';
import Preview from './pages/Preview.jsx';
import Export from './pages/Export.jsx';

export default function App() {
  return (
    <div>

      <nav>
        <Link to="/">Home</Link>
        {' | '}
        <Link to="/videos">Videos</Link>
        {' | '}
        <Link to="/preview">Preview</Link>
        {' | '}
        <Link to="/export">Export</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/export" element={<Export />} />
      </Routes>
    </div>
  );
}