import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import './ModelManager.css';

function ModelViewer({ url }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} scale={1.5} />;
}

function ModelManager() {
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        axios.get('https://glb-viewer-mpv9.onrender.com/models')
            .then(res => {
            setModels(res.data);
        });
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('model', file);
        formData.append('name', name);

        const res = await axios.post('https://glb-viewer-mpv9.onrender.com/upload', formData);
        setModels([...models, res.data.model]);
        setName('');
        setFile(null);
    };

    return (
        <div className="model-manager">
            <form onSubmit={handleUpload} className="upload-form">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Model name" required />
                <input type="file" onChange={e => setFile(e.target.files[0])} accept=".glb" required />
                <button type="submit">Upload</button>
            </form>

            <div className="model-list">
                {models.map((model) => (
                    <button key={model._id} onClick={() => setSelectedModel(model.filePath)}>
                        {model.name}
                    </button>
                ))}
            </div>

            <div className="viewer">
                {selectedModel && (
                    <Canvas>
                        <ambientLight />
                        <pointLight position={[10, 10, 10]} />
                        <ModelViewer url={selectedModel} />
                        <OrbitControls />
                    </Canvas>
                )}
            </div>
        </div>
    );
}

export default ModelManager;
