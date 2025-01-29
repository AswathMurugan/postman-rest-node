import React, {useState} from 'react';
import ReactJson from 'react-json-view';

interface ResponseViewerProps {
    response: any;
    error: string | null;
    statusCode: number | null;
    respHeader: [{key: string, value: string}];
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({ response, error, statusCode, respHeader }) => {
    const [activeTab, setActiveTab] = useState('Body');
    const [headers, setHeaders] = useState([{ key: 'x-jiffy-app-id', value: "appId" }, {key: 'x-jiffy-tenant-id', value: "tenantId" }, {key: 'x-jiffy-user-id', value: "userId"}]);


    const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
        const updatedHeaders = headers.map((header, i) =>
            i === index ? { ...header, [field]: value } : header
        );
        setHeaders(updatedHeaders);
    };

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
        {activeTab === 'Headers' && (
            <div>
                <div className="headers-tab">
                    {respHeader.map((header, index) => (
                        <div key={index} className="header-row">
                            <input
                                readOnly={true}
                                disabled={true}
                                type="text"
                                value={header.key}
                                onChange={(e) => updateHeader(index, 'key', e.target.value)}
                                placeholder="Key"
                                className="header-input"
                            />
                            <input
                                readOnly={true}
                                disabled={true}
                                type="text"
                                value={header.value}
                                onChange={(e) => updateHeader(index, 'value', e.target.value)}
                                placeholder="Value"
                                className="header-input"
                            />
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
    );
}

export default ResponseViewer;
