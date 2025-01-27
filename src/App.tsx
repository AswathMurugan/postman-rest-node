import React from 'react';
import logo from './logo.svg';
import './App.css';
import RestCall from "./components/RestCall";
import jwt from 'jwt-simple';

function App() {


    const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAjNpMfrYoO7wpv2JbhDQuaYHRJTkxn4oJFUqRYF3LplNRsoMW
OVXKZGKQXtPIw7iBriqK8UDldJX+atzcuWMEK2tBRi9p6jNDWuYz5+Zkg9xvQUKW
vl3evTWNqPY+lUnmIXnwNbWg2NcE4VljpfaOS5EZW26fTWrmDaRTb5a6E/L2Y/0h
C5tKU5z9Yi2OwMNOyvmjhA5aOh8qKOStV3nlTHHpQlFMpOp4WKSyQ0P4QDsbom3G
hxWGLCWUCrkzA00i5batTB1/zt9v3F4D2lCtUYKHkIubKm7Di+R0dfaViKT6L0Rb
rERYTgQ3qxRTD9uzAm3RwarNlKQg8Uej83we7QIDAQABAoIBAANxUyemXc22onyW
M69uXmi0xBRj//sAHYsNg10hcxinIQWQdQAaFol6lpXCw72eP7PZQAPNNsPb5gKI
UHAgOUSzE+mFFNJ6cJ3YUjzLoaROxHy0sHOJtCfYFxTMo/3zzEdVhXytP6JdKwuJ
AEmuVjmxm7bjjsrjydNb3gWJtRWctDDV22OPFUne/yqiqSbZ6YbPb0G1z1dIbJ2D
WOcA6wPUcdoOEWhGFlBedleml5INMR4DDZ135OtbNIHfvcddkq8h9ZDQxTTp7q13
6+JCzn0Odmj43gQ/FEIYR/yzK85EMXBJd/zAFdrVA63a7MFasQTZAZjV9YzwzPF2
uBlJtm8CgYEAwvDZVtjay7/nOpxfr84M8VYT3YlOvJAlalYCuwjRsHENiFcvaoGW
TI9TQITBuSp0B+d9HufCR6C4JSB4Qy1do0Qr7m+EM4EB+70qt5wY6L9yR0Dc3BXP
/IGrwQxUZGYkX9V9wfvxM+9Y6NGJkV+b+xhVRv9JlWQ0afbUT+lvdFsCgYEAuPhy
MoukJr0A8ts/S4Pef6YFU5SrC2qsHwgHFz+wimY55DwXqT3pnMiwIPBNXW1lMFuw
SBM3saBDgM1JfUGtAb4L313/LYKORr/vBr8vrxIIBqeJng9pL1G7tf/WDTZtJwT0
WBNYqmOymsHK58lttnF07M45T2DwHpqdRSzW/FcCgYEAi3mbZyHc2a7CGBNN+xEn
/Xwi1nypUwynWH+VkJBsxxr8HbKTgFabXMenPyA9IuiXABjGUthrDqiVWCr1IMtS
lb/u1rf/FIKXErBz4c7Tm6NudkCYRPduSjHU21ihAPx7xf2P7rz+BLSZHmrdTJ/l
kDAGw7dfxH1favlpSouwbMUCgYBFkxYJUyMkexU/RB6zvd9ULlN0k8genDov1eos
4YT7GeaOpdfUjfgwRACT8y92g+562RIemjPpuTmK2izZU3nK3PxEQWv5Z1Ey5YD4
DbPW6zZfomcOMAfFh73OgHO4No+qDKAH/Qbt2GBW+6vhsY91/4kWhZ9i7ziCmm+r
lGktMwKBgG/ck9eJCb334mNxOY0yQrrO9ioadwIq6y5ML+YVaTqlFv2cZLLJ0hgz
MWoukIJnORNxe4AnMzLbi6dlPvdbaT5YTicWOG/DqX6AOQ686UP4kP+6jc7kOrba
KKAXjwRlB3PJfToDPyQ4X7OLPnUWpb9iOfT2oMAz9cUTisshpC/I
-----END RSA PRIVATE KEY-----`;

   /* const token = jwt.encode(
        {
            "iss": "5c2b8d7e-xxxx-xxxx-xxxx-cda8a50dd73f",
            "sub": "464f7988-xxxx-xxxx-xxxx-781ee556ab7a",
            "aud": "account-d.docusign.com",
            "iat": 1598383123,
            "exp": 1598390123,
            "scope": "signature impersonation"
        },
        privateKey,
        );*/


    console.log("token");



  return (
      <div className="App">
        <h1>Postman Node</h1>
        <RestCall/>
      </div>
  );
}

export default App;
