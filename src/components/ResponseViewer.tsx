import React, {useState} from 'react';
import ReactJson from 'react-json-view';

interface ResponseViewerProps {
    response: any;
    error: string | null;
    statusCode: number | null;
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({ response, error, statusCode }) => {
    const [activeTab, setActiveTab] = useState('Body');
    return(

    <div>
        <div style={{
            display: "flex",
            justifyContent: "space-between",
        }}>
            <div style={{
                justifyContent: "left"
            }}><h3>Response</h3></div>
            <div style={{
            justifyContent: "right",
            }}>
                <h4 style={{
                    backgroundColor: statusCode === 200 ? "#48a35e": '#f82525',
                    color: "white"
                }}>{statusCode}</h4>
            </div>
        </div>
        <div className="tabs">
            {['Body', 'Headers'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                >
                    {tab}
                </button>
            ))}
        </div>

        {activeTab === 'Body' && (
            <div>
                <ReactJson
                    src={response}/>
            </div>
        )}
    </div>
);}

export default ResponseViewer;
