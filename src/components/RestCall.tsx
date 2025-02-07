import React, { useState } from 'react';
import axios from 'axios';
import CurlImporter from './CurlImporter';
import RequestForm from './RequestForm';
import ResponseViewer from './ResponseViewer';
import {Call, CallArgs, CallType} from "./Call";

const RestCall: React.FC = () => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const [statusCode, setStatusCode] = useState<number | null>(null);
    const [respHeader, setRespHeader] = useState<any>([{key: '', value: ''}]);

    const handleSend = async (method: string, url: string, headers: Record<string, string>, body: string) => {
        try {
            setError(null);
            headers['x-jiffy-proxy-redirect-url'] = url;
            const type : string = headers['x-jiffy-connector-auth-type'];

            let query: string | null = null;

            if( type === "external"){
                if(url.startsWith('{{baseUrl}}')){
                     const path: string = url.replace("{{baseUrl}}", "");
                     url = "http://localhost:8097/proxy/api/external/postman" + path;
                } else {
                    let parsedUrl = new URL(url);
                    let path = parsedUrl.pathname;   // Gets the path
                    let query = parsedUrl.search;    // Gets the query string
                    url = "http://localhost:8097/proxy/api/external/postman" + path + query;
                }
            } else {
                let parsedUrl = new URL(url);
                let path = parsedUrl.pathname;   // Gets the path
                query = parsedUrl.search;    // Gets the query string



                url = "http://localhost:8097/proxy/api/platform" + path + query;
            }
            //url = "http://localhost:8097/proxy/api/external/postman/balances/cash/activity?accountNumber=70899768";


            const queryArray = query
                ? query.replace(/^\?/, '') // Remove leading '?'
                    .split('&') // Split by '&' to get key-value pairs
                    .map(param => {
                        const [key, value] = param.split('='); // Split each pair into key and value
                        return { [key]: value };
                    })
                : []; // Return an empty array if query is null

            const callArgs : CallArgs = {
                url: url,
                header: Object.entries(headers).map(([key, value]) => ({ [key]: value })),
                query: queryArray,
                body: body ? JSON.parse(body) : {}
            }


            const toCallType = (value: string): CallType | null => {
                return Object.values(CallType).includes(value as CallType) ? (value as CallType) : null;
            };

            const  call: Call =  {
                call: toCallType(method),
                args: callArgs,
                result: "response"
            }

            const dsl: any = [
                {
                    "main": {
                        "steps": [
                            {
                                "call_step": call
                            },
                            {
                                "exit_flow": {
                                    "return": "${response}"
                                }
                            }
                        ]
                    }
                }
            ];

            console.log(dsl);

            try {
                const create = await axios.post(
                    "http://localhost:8084/workflow/v1/defs/def/postman",
                    dsl,
                    { headers }
                );
            } catch (err){
                const update = await axios.put(
                    "http://localhost:8084/workflow/v1/defs/def/postman",
                    dsl,
                    { headers }
                );
            }
            url = "http://localhost:8084/workflow/v1/instances/execute/sync/postman"
            const res = await axios.post(url,
                { }, {headers});
            setResponse(res.data);
            setStatusCode(res.status)
            const respHeader: { key: string; value: string }[] = Object.entries(res.headers).map(([key, value]) => ({
                key,
                value: value as string, // Cast value to string
            }));
            setRespHeader(respHeader);
        } catch (err: any) {
            console.log(err);
            setError(err.message);
            setResponse(err.response.data);
            setStatusCode(err.status)

            const respHeader: { key: string; value: string }[] = Object.entries(err.response.headers).map(([key, value]) => ({
                key,
                value: value as string, // Cast value to string
            }));
            setRespHeader(respHeader);
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
                statusCode={statusCode}
                respHeader={respHeader}/>
        </div>
    );
};

export default RestCall;
