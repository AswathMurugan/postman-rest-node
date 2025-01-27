import React, { useState } from 'react';
import axios from 'axios';
import CurlImporter from './CurlImporter';
import RequestForm from './RequestForm';
import ResponseViewer from './ResponseViewer';

const RestCall: React.FC = () => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const [statusCode, setStatusCode] = useState<number | null>(null);

    const handleSend = async (method: string, url: string, headers: Record<string, string>, body: string) => {
        try {
            setError(null);
            headers['x-jiffy-proxy-redirect-url'] = url;
            url = "http://localhost:8097/proxy/v1/route/get";
            const res = await axios({ method, url, headers, data: body });
            setResponse(res.data);
            setStatusCode(res.status)
        } catch (err: any) {
            console.log(err);
            setError(err.message);
            setResponse(null);
            setStatusCode(err.status)
        }
    };

    const handleCurlImport = (curl: string) => {
        console.log('Import cURL:', curl);
        // Parse cURL command and pre-fill RequestForm fields
    };

    //   // <CurlImporter onImport={handleCurlImport} />

    return (
        <div>
            <RequestForm onSend={handleSend} />
            <ResponseViewer
                response={response}
                error={error}
                statusCode={statusCode}/>
        </div>
    );
};

export default RestCall;
