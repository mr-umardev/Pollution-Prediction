import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import './HomePage.css';

function Homepage() {
    const [modelType, setModelType] = useState('xgb'); 
    const [city, setCity] = useState('');
    const [date, setDate] = useState('');
    const [pm25, setPm25] = useState('');
    const [pm10, setPm10] = useState('');
    const [no, setNo] = useState('');
    const [no2, setNo2] = useState('');
    const [nox, setNox] = useState('');
    const [nh3, setNh3] = useState('');
    const [co, setCo] = useState('');
    const [so2, setSo2] = useState('');
    const [o3, setO3] = useState('');
    const [benzene, setBenzene] = useState('');
    const [toluene, setToluene] = useState('');
    const [xylene, setXylene] = useState('');
    const [aqi, setAqi] = useState('');
    const [aqiBucket, setAqiBucket] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handlePrediction = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const inputData = {
            PM25: parseFloat(pm25),
            PM10: parseFloat(pm10),
            NO: parseFloat(no),
            NO2: parseFloat(no2),
            NOx: parseFloat(nox),
            NH3: parseFloat(nh3),
            CO: parseFloat(co),
            SO2: parseFloat(so2),
            O3: parseFloat(o3),
            Benzene: parseFloat(benzene),
            Toluene: parseFloat(toluene),
            Xylene: parseFloat(xylene),
            AQI: parseFloat(aqi),
            AQI_Bucket: parseFloat(aqiBucket),
            City: city,
            Date: date
        };

        if (Object.values(inputData).some(isNaN)) {
            setError('Please enter valid numeric data in all fields.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:5000/predict', {
                model_type: modelType,
                input_data: inputData
            });
            setPrediction(response.data.prediction);
        } catch (error) {
            console.error('Error fetching prediction', error);
            setError('An error occurred while fetching the prediction.');
        } finally {
            setLoading(false);
        }
    };

    const handleRedirect = () => {
        navigate('/form');
    };

    return (
        <div className="page-container">
            <div className="video-container">
               <video autoPlay loop muted className="video-background">
               <source src="/9867271-uhd_3840_2160_24fps.mp4" type="video/mp4" />
               </video>
            </div>
            <nav className="navbar">
                <div className="nav-logo">Pollution Prediction</div>
                <div className="nav-search">
                    <input
                        type="text"
                        placeholder="Search City"
                        className="search-input"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <FaSearch className="search-icon" />
                </div>
            </nav>

            <div className="content-container">
                <h2 className="heading">Pollution Prediction</h2>
                <p className="sub-heading">Get predictions based on various models.</p>

                <button onClick={handleRedirect} className="redirect-button">
                    Go to Prediction Form
                </button>

                {prediction !== null && (
                    <div className="prediction-result">
                        <h3>Prediction: {prediction}</h3>
                    </div>
                )}

                {loading && <div>Loading...</div>}
                {error && <div className="error">{error}</div>}
            </div>

            <footer className="footer">
                <p>&copy; 2024 Pollution Prediction. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Homepage;
