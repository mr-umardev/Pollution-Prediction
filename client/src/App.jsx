import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/HomePage';

import PredictionForm from './components/PredictionForm';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/form" element={<PredictionForm />} />
            </Routes>
        </Router>
    );
}

export default App;
