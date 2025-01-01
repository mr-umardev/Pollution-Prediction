import React, { useState } from 'react';
import axios from 'axios';

function PredictionForm() {
    const [modelType, setModelType] = useState('xgb');
    const [city, setCity] = useState('');
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

    // Handle form submission to make the prediction
    const handlePrediction = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Prepare input data with all required fields
        const inputData = [
            parseFloat(pm25),
            parseFloat(pm10),
            parseFloat(no),
            parseFloat(no2),
            parseFloat(nox),
            parseFloat(nh3),
            parseFloat(co),
            parseFloat(so2),
            parseFloat(o3),
            parseFloat(benzene),
            parseFloat(toluene),
            parseFloat(xylene),
            parseFloat(aqi),
            parseFloat(aqiBucket),
            city.trim()
        ];

        // Check for NaN after form submission
        if (inputData.some(isNaN)) {
            setError('Please enter valid numeric data in all fields.');
            setLoading(false);
            return;
        }

        try {
            // Send the request to the Flask API
            const response = await axios.post('http://127.0.0.1:5000/predict', {
                model_type: modelType,
                input_data: inputData
            });
            
            // Set prediction result
            setPrediction(response.data.prediction);
        } catch (error) {
            setError('An error occurred while fetching the prediction.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Pollution Prediction Form</h2>
            <form onSubmit={handlePrediction}>
                <div>
                    <label htmlFor="pm25">PM2.5:</label>
                    <input
                        type="number"
                        id="pm25"
                        value={pm25}
                        onChange={(e) => setPm25(e.target.value)}
                        placeholder="PM2.5"
                    />
                </div>

                <div>
                    <label htmlFor="pm10">PM10:</label>
                    <input
                        type="number"
                        id="pm10"
                        value={pm10}
                        onChange={(e) => setPm10(e.target.value)}
                        placeholder="PM10"
                    />
                </div>

                <div>
                    <label htmlFor="no">NO:</label>
                    <input
                        type="number"
                        id="no"
                        value={no}
                        onChange={(e) => setNo(e.target.value)}
                        placeholder="NO"
                    />
                </div>

                <div>
                    <label htmlFor="no2">NO2:</label>
                    <input
                        type="number"
                        id="no2"
                        value={no2}
                        onChange={(e) => setNo2(e.target.value)}
                        placeholder="NO2"
                    />
                </div>

                <div>
                    <label htmlFor="nox">NOx:</label>
                    <input
                        type="number"
                        id="nox"
                        value={nox}
                        onChange={(e) => setNox(e.target.value)}
                        placeholder="NOx"
                    />
                </div>

                <div>
                    <label htmlFor="nh3">NH3:</label>
                    <input
                        type="number"
                        id="nh3"
                        value={nh3}
                        onChange={(e) => setNh3(e.target.value)}
                        placeholder="NH3"
                    />
                </div>

                <div>
                    <label htmlFor="co">CO:</label>
                    <input
                        type="number"
                        id="co"
                        value={co}
                        onChange={(e) => setCo(e.target.value)}
                        placeholder="CO"
                    />
                </div>

                <div>
                    <label htmlFor="so2">SO2:</label>
                    <input
                        type="number"
                        id="so2"
                        value={so2}
                        onChange={(e) => setSo2(e.target.value)}
                        placeholder="SO2"
                    />
                </div>

                <div>
                    <label htmlFor="o3">O3:</label>
                    <input
                        type="number"
                        id="o3"
                        value={o3}
                        onChange={(e) => setO3(e.target.value)}
                        placeholder="O3"
                    />
                </div>

                <div>
                    <label htmlFor="benzene">Benzene:</label>
                    <input
                        type="number"
                        id="benzene"
                        value={benzene}
                        onChange={(e) => setBenzene(e.target.value)}
                        placeholder="Benzene"
                    />
                </div>

                <div>
                    <label htmlFor="toluene">Toluene:</label>
                    <input
                        type="number"
                        id="toluene"
                        value={toluene}
                        onChange={(e) => setToluene(e.target.value)}
                        placeholder="Toluene"
                    />
                </div>

                <div>
                    <label htmlFor="xylene">Xylene:</label>
                    <input
                        type="number"
                        id="xylene"
                        value={xylene}
                        onChange={(e) => setXylene(e.target.value)}
                        placeholder="Xylene"
                    />
                </div>

                <div>
                    <label htmlFor="aqi">AQI:</label>
                    <input
                        type="number"
                        id="aqi"
                        value={aqi}
                        onChange={(e) => setAqi(e.target.value)}
                        placeholder="AQI"
                    />
                </div>

                <div>
                    <label htmlFor="aqiBucket">AQI Bucket:</label>
                    <input
                        type="number"
                        id="aqiBucket"
                        value={aqiBucket}
                        onChange={(e) => setAqiBucket(e.target.value)}
                        placeholder="AQI Bucket"
                    />
                </div>

                <div>
                    <label htmlFor="city">City:</label>
                    <input
                        type="text"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Get Prediction'}
                </button>
            </form>

            {error && <p>{error}</p>}

            {prediction !== null && (
                <div>
                    <h3>Prediction Result:</h3>
                    <p>{prediction}</p>  {/* This is where you display the prediction */}
                </div>
            )}
        </div>
    );
}

export default PredictionForm;
