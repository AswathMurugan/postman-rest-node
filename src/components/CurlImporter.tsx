import React, { useState } from 'react';

interface CurlImporterProps {
    onImport: (curl: string) => void;
}

const CurlImporter: React.FC<CurlImporterProps> = ({ onImport }) => {
    const [curlCommand, setCurlCommand] = useState('');

    const handleImport = () => {
        onImport(curlCommand);
        setCurlCommand('');
    };

    return (
        <div>
            <h3>Import cURL</h3>
            <textarea
                rows={4}
                value={curlCommand}
                onChange={(e) => setCurlCommand(e.target.value)}
                placeholder="Paste your cURL command here"
            ></textarea>
            <button onClick={handleImport}>Import</button>
        </div>
    );
};

export default CurlImporter;
