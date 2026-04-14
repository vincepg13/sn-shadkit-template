import { getAxiosInstance } from "sn-shadcn-kit";

async function getCurrentUser() {
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
  return getCurrentUser();
}