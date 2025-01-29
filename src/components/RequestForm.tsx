import React, {useEffect, useState} from 'react';
import axios from "axios";
import {FiSettings} from "react-icons/fi";

type RequestFormProps = {
    onSend: (method: string, url: string, headers: Record<string, string>, body: string) => void;
};

type Provider = {
    compId: string;
    name: string;
    version: string;
};

type Service = {
    compId: string;
    name: string;
    version: string
};

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];


const RequestForm: React.FC<RequestFormProps> = ({ onSend }) => {
    let host = `https://integrationtest.jiffy.ai`;
    let appName = `orgtestapp`;
    let tenantName = `apex-int-test-tenant`;
    let appId = "f1797175-ee1e-4c5a-a293-12d9000a86f4";
    let tenantId = "76851fa5-219c-4c7f-b39a-2a078b71b688";
    let userId = "30c27dfd-202c-4eea-9a82-6458867f9ce2";

    const [method, setMethod] = useState('GET');
    const [url, setUrl] = useState('');
    const [activeTab, setActiveTab] = useState('Headers');
    const [headers, setHeaders] = useState([{ key: 'x-jiffy-app-id', value: appId }, {key: 'x-jiffy-tenant-id', value: tenantId }, {key: 'x-jiffy-user-id', value: userId}]);
    const [queryParams, setqueryParams] = useState([{ key: '', value: '' }]);
    const [body, setBody] = useState('');

    const [providers, setProviders] = useState<Provider[]>([]);
    const [selectedProvider, setSelectedProvider] = useState("");
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState("");
    const [componentId, setComponentId] = useState("");

    const [iamToken, setIamToken] = useState<string | null>(null);


    const [isModalOpen, setModalOpen] = useState(false);
    const [curlInput, setCurlInput] = useState("");

    const [settingPopup, setSettingPopup] = useState(false);
    const [settingPopupOptions, setSettingPopupOptions] = useState({
        externalAuth: false,
        offloadData: false,
    });

    const handleImport = () => {
        console.log("cURL Command:", curlInput);

        fetch("http://localhost:9087/curl/v1/parse", {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
                "Cookie": "CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1",
            },
            body: curlInput,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Response from server:", data);
                const queryParams = data.args.query;
                let queryString: string = "?";
                queryParams.forEach((queryObject :  { [key: string]: string }, index: number) => {
                    const [key, value] = Object.entries(queryObject)[0];
                    queryString += `${key}=${value}`;
                    if (index < queryParams.length - 1) {
                        queryString += "&"; // Add & only if it's not the last item
                    }
                    setqueryParams((prevQueryParams) => [...prevQueryParams, { key: key, value: value }]);
                });
                setUrl(data.args.url + (queryString === "?" ? "" : queryString));
                setMethod(data.call);
                setBody(JSON.stringify(data.args.body));
                const headers = data.args.header
                headers.forEach((headerObj :  { [key: string]: string }) => {
                    const [key, value] = Object.entries(headerObj)[0];
                    setHeaders((prevHeaders) => [...prevHeaders, { key: key, value: value }]);
                });

                setModalOpen(false); // Close the modal after import
                setCurlInput("");
            })
            .catch((error) => {
                console.error("Error importing cURL:", error);
            });
    };




    useEffect(() => {
        console.log("iamToken", iamToken);
        (async function () {
            if(!iamToken){
                const token = await fetchIAMToken();
                setIamToken(token);
                console.log("iamToken***", token);
                axios
                    .get(
                        `${host}/platform/pam/tenant/${tenantName}/app/${appName}/inst/${appId}/providers`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "x-jiffy-app-id": appId,
                                "x-jiffy-tenant-id": tenantId,
                                "x-jiffy-user-id": userId,
                                "Authorization": `Bearer ${token}`,
                            }
                        })
                    .then((response) => {
                        setProviders(response.data);
                    })
                    .catch((error) => {
                        console.error("Error fetching providers:", error);
                    });
            }

        })()
        console.log("iamTokenFF", iamToken);
    }, [iamToken]);


    const  authToken = iamToken;

    const fetchIAMToken = async () => {
        const response = await axios({
            url: "https://integrationtest.jiffy.ai/auth/realms/apex-int-test-tenant/protocol/openid-connect/token",
            method:"POST",
            data: "grant_type=password&scope=openid email profile&username=apex-int-test-user1@yopmail.com&password=test&client_id=bc76f158-a234-4caf-8d4c-de8d05a62ef1",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
            }
        });
        const data = response.data;
        setIamToken(data.access_token);
        return data.access_token;
    }

    const handleProviderChange = (providerName: string) => {
        setSelectedProvider(providerName);
        setSelectedService('');
        addOrUpdateHeaders([{ key: 'x-jiffy-connector-providerName', value: providerName }]);

        // Fetch services for the selected provider
        const url = `${host}/platform/pam/tenant/${tenantName}/app/${appName}/inst/${appId}/connector?type=external-service&type=connector-implementation&providerName=${providerName}&update=true`;
        axios
            .get(url, {
                headers: {
                    "Content-Type": "application/json",
                    "x-jiffy-app-id": appId,
                    "x-jiffy-tenant-id": tenantId,
                    "x-jiffy-user-id": userId,
                    Authorization: `Bearer ${authToken}`
                },
            })
            .then((response) => {
                setServices(response.data.map((item: any) => ({ compId: item.compId, name: item.name, version: item.version })));
            })
            .catch((error) => {
                console.error('Error fetching services:', error);
            });
    };


    const handleServiceChange = (serviceName: string, version: string) => {
        setSelectedService(serviceName);
        addOrUpdateHeaders( [
            { key: 'x-jiffy-connector-serviceName', value: serviceName },
            { key: 'x-jiffy-connector-version', value: version },
            { key: 'x-jiffy-connector-type', value: "external-service" },
            { key: 'x-jiffy-connector-ns', value: `${tenantId}.default` }
        ]);

        // Fetch componentId for the selected service


        let url = `${host}/platform/cls/api/v1/components/_byCoordinates?name=${serviceName}&type=external-service&version=1.0.0&includeReserved=false&includeNotReady=true&ns=${tenantId}.default`;
        axios
            .get(url,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-jiffy-app-id": appId,
                        "x-jiffy-tenant-id": tenantId,
                        "x-jiffy-user-id": userId,
                        Authorization: `Bearer ${authToken}`
                    },
                }
            )
            .then((response) => {
                const componentId = response.data.id;
                //setHeaders((prevHeaders) => [...prevHeaders, { key: 'componentId', value: componentId }]);


                serviceName = response.data.dependencies[0].name
                let version = response.data.dependencies[0].version;
                const versionString = version.major + "." + version.minor + "." + version.build;
                const nonce = response.data.dependencies[0].nonce;
                url = `${host}/platform/cls/api/v1/components/_byCoordinates?name=${serviceName}&type=authenticator&version=${versionString}&includeReserved=false&includeNotReady=true&ns=${tenantId}.default&nonce=${nonce}`;
                axios
                    .get(url,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "x-jiffy-app-id": appId,
                                "x-jiffy-tenant-id": tenantId,
                                "x-jiffy-user-id": userId,
                                Authorization: `Bearer ${authToken}`
                            },
                        }
                    ).then((res) => {

                })
            })
            .catch((error) => {
                console.error('Error fetching component ID:', error);
            });
    };



    const handleSend = () => {
        const headersObj = headers.reduce((acc, header) => {
            if (header.key && header.value) acc[header.key] = header.value;
            return acc;
        }, {} as Record<string, string>);

        // Call the onSend prop with the current data
        onSend(method, url, headersObj, body);
    };

    const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);

    const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
        const updatedHeaders = headers.map((header, i) =>
            i === index ? { ...header, [field]: value } : header
        );
        setHeaders(updatedHeaders);
    };

    const removeHeader = (index: number) => {
        setHeaders(headers.filter((_, i) => i !== index));
    };


    const addQueryParams = () => setqueryParams([...queryParams, { key: '', value: '' }]);

    const updateQueryParams = (index: number, field: 'key' | 'value', value: string) => {
        const updatedQueryParams = queryParams.map((querParams, i) =>
            i === index ? { ...querParams, [field]: value } : querParams
        );
        setqueryParams(updatedQueryParams);
    };

    const removeQueryParam = (index: number) => {
        setqueryParams(queryParams.filter((_, i) => i !== index));
    };

    const addOrUpdateHeaders = (newHeaders: { key: string; value: string }[]) => {
        setHeaders((prevHeaders) => {
            const updatedHeaders = [...prevHeaders];

            newHeaders.forEach((newHeader) => {
                const existingHeaderIndex = updatedHeaders.findIndex(
                    (header) => header.key === newHeader.key
                );

                if (existingHeaderIndex !== -1) {
                    // Replace the existing header
                    updatedHeaders[existingHeaderIndex] = newHeader;
                } else {
                    // Add a new header if the key doesn't exist
                    updatedHeaders.push(newHeader);
                }
            });

            return updatedHeaders;
        });
    };


    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        console.log(name, checked);
        if(name === "externalAuth" && checked) {
            addOrUpdateHeaders([
                { key: 'x-jiffy-connector-auth-type', value: "internal" }
            ]);
        } else {
            addOrUpdateHeaders([
                { key: 'x-jiffy-connector-auth-type', value: "external" }
            ]);
        }
        if(name === "offloadData" && checked) {
            addOrUpdateHeaders([
                { key: 'x-jiffy-connector-offload-data', value: "true" }
            ]);
        } else {
            addOrUpdateHeaders([
                { key: 'x-jiffy-connector-offload-data', value: "false" }
            ]);
        }
        setSettingPopupOptions((prevOptions) => ({ ...prevOptions, [name]: checked }));
    };

    const togglePopup = () => setSettingPopup(!settingPopup);


    // Function to get version by name
    const getVersionByName = (service: Service[], serviceName: string) => {
        const component = service.find(comp => comp.name === serviceName);
        return component ? component.version : "";  // Return version if found, else null
    };



    return (
        <div className="reqbin-form">
            <div className="reqbin-form-header">
                <div className="reqbin-form-header-config">
                    <select className="service-dropdown"
                            value={selectedProvider}
                            onChange={(e) => handleProviderChange(e.target.value)}
                    >
                        <option value="">Select Provider / Service </option>
                        {providers.map((provider) => (
                            <option key={provider.compId} value={provider.name}>
                                {provider.name}
                            </option>
                        ))}
                    </select>

                    {selectedProvider && (
                        <select className="service-dropdown"
                                value={selectedService}
                                onChange={(e) => handleServiceChange(e.target.value, getVersionByName(services, e.target.value))}
                                disabled={!selectedProvider}
                        >
                            <option value="">Select a service</option>
                            {services.map((service) => (
                                <option key={service.compId} value={service.name}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                    )}
                    <div style={{
                        padding: "5px",
                        position: "relative",
                        display: "inline-block" }}>
                        {/* Settings Icon */}
                        <FiSettings
                            size={24}
                            style={{ cursor: "pointer", color: "#007bff" }}
                            onClick={togglePopup}
                        />
                        {/* Popup Window */}
                        {settingPopup && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "30px",
                                    right: "0px",
                                    width: "250px",
                                    padding: "15px",
                                    backgroundColor: "white",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                    borderRadius: "8px",
                                    zIndex: 1000,
                                }}
                            >
                                <h4 style={{ margin: "0 0 10px" }}>Settings</h4>
                                <div>
                                    <label style={{ display: "block", marginBottom: "8px" }}>
                                        <input
                                            type="checkbox"
                                            name="externalAuth"
                                            checked={settingPopupOptions.externalAuth}
                                            onChange={handleCheckboxChange}
                                        />
                                        External Auth
                                    </label>
                                    <label style={{ display: "block", marginBottom: "8px" }}>
                                        <input
                                            type="checkbox"
                                            name="offloadData"
                                            checked={settingPopupOptions.offloadData}
                                            onChange={handleCheckboxChange}
                                        />
                                        Offload Data to Jiffy Drive
                                    </label>
                                </div>
                                <button
                                    onClick={togglePopup}
                                    style={{
                                        marginTop: "10px",
                                        padding: "5px 10px",
                                        backgroundColor: "#007bff",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="request-row">
                <div>
                    {/* Button to open the modal */}
                    <button
                        onClick={() => setModalOpen(true)}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Import cURL
                    </button>

                    {/* Modal */}
                    {isModalOpen && (
                        <div
                            style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: "white",
                                    padding: "20px",
                                    borderRadius: "8px",
                                    width: "900px",
                                    height: "500px",
                                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                                }}
                            >
                                <h2 style={{
                                    marginBottom: "20px",
                                    fontFamily: "Nunito Sans",
                                    fontSize: "20px",
                                    padding: "5px",
                                }}>Import cURL</h2>
                                <textarea
                                    value={curlInput}
                                    onChange={(e) => setCurlInput(e.target.value)}
                                    placeholder="Paste your cURL command here..."
                                    style={{
                                        width: "880px",
                                        height: "300px",
                                        padding: "10px",
                                        marginBottom: "20px",
                                        border: "2px solid #ddd",
                                        borderRadius: "4px",
                                    }}
                                />
                                <div style={{
                                    textAlign: "right"
                                }}>
                                    <button
                                        className="import-model-button"
                                        onClick={handleImport}
                                    >
                                        Import
                                    </button>
                                    <button
                                        onClick={() => setModalOpen(false)}
                                        style={{
                                            padding: "10px 20px",
                                            backgroundColor: "#dc3545",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="method-select"
                >
                    {methods.map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter request URL"
                    className="url-input"
                />
                <button onClick={handleSend} className="send-button">
                    Send
                </button>
            </div>

            <div className="tabs">
                {['Params','Headers', 'Body'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'Headers' && (
                <div className="headers-tab">
                    {headers.map((header, index) => (
                        <div key={index} className="header-row">
                            <input
                                type="text"
                                value={header.key}
                                onChange={(e) => updateHeader(index, 'key', e.target.value)}
                                placeholder="Key"
                                className="header-input"
                            />
                            <input
                                type="text"
                                value={header.value}
                                onChange={(e) => updateHeader(index, 'value', e.target.value)}
                                placeholder="Value"
                                className="header-input"
                            />
                            <button onClick={() => removeHeader(index)} className="remove-header-button">
                                ✕
                            </button>
                        </div>
                    ))}
                    <button onClick={addHeader} className="add-header-button">
                        + Add Header
                    </button>
                </div>
            )}

            {activeTab === 'Params' && (
                <div className="headers-tab">
                    {queryParams.map((header, index) => (
                        <div key={index} className="header-row">
                            <input
                                type="text"
                                value={header.key}
                                onChange={(e) => updateQueryParams(index, 'key', e.target.value)}
                                placeholder="Key"
                                className="header-input"
                            />
                            <input
                                type="text"
                                value={header.value}
                                onChange={(e) => updateQueryParams(index, 'value', e.target.value)}
                                placeholder="Value"
                                className="header-input"
                            />
                            <button onClick={() => removeQueryParam(index)} className="remove-header-button">
                                ✕
                            </button>
                        </div>
                    ))}
                    <button onClick={addQueryParams} className="add-header-button">
                        + Add Parameters
                    </button>
                </div>
            )}

            {activeTab === 'Body' && (
                <div className="body-tab">
          <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter request body"
              className="body-textarea"
          ></textarea>
                </div>
            )}

            {activeTab === 'Authorization' && (
                <div className="authorization-tab">
                     <textarea
                         value={body}
                         onChange={(e) => setBody(e.target.value)}
                         placeholder="dsl"
                         className="body-textarea"
                     ></textarea>
                </div>
            )}
        </div>
    );
};

export default RequestForm;
