import axios from "axios";

const url = "https://ulift.azurewebsites.net/api/";

//const url = "http://localhost:3000/api/";
const instance = axios.create({
  baseURL: url,
  timeout: 100000000,
  headers: { "X-Custom-Header": "foobar" },
});

instance.interceptors.request.use(config => {
  config.headers['Access-Control-Allow-Origin'] = 'https://ulift20-production.up.railway.app'; 
  return config;
});

export default instance;
