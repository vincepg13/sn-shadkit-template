/* eslint-disable no-restricted-globals */
import axios from "axios";
import { getAxiosInstance, setAxiosInstance } from "sn-shadcn-kit";

declare global {
  interface Window {
    g_ck?: string;
  }
}

function isDevelopment() {
  const username = import.meta.env.VITE_REACT_APP_USER;
  const tokenSpoof = import.meta.env.VITE_SPOOF_TOKEN;
  const axiosInstance = axios.create({ withCredentials: true });

  if (tokenSpoof) {
    axiosInstance.defaults.headers["X-UserToken"] = tokenSpoof;
  } else {
    axiosInstance.defaults.auth = {
      username,
      password: import.meta.env.VITE_REACT_APP_PASSWORD,
    };
  }

  setAxiosInstance(axiosInstance);

  return {
    axiosInstance,
    user: { username, guid: "dev-guid" },
  };
}

async function isProduction() {
  const axiosInstance = getAxiosInstance();

  const userRes = await axiosInstance.get("/api/now/table/sys_user", {
    params: {
      sysparm_query: `user_name=javascript:gs.getUserName()`,
      sysparm_fields: "user_name, sys_id",
      sysparm_limit: 1,
    },
  });

  const [first] = userRes.data.result;
  if (!first) throw new Error("User not found");

  const userguid = first.sys_id;
  const username = first.user_name;

  return {
    axiosInstance,
    user: { username, guid: userguid },
  };
}

export async function bootstrapApp() {
  const mode = import.meta.env.MODE;
  const config = mode === "development" ? isDevelopment() : await isProduction();
  return config;
}