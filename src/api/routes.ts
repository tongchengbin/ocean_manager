import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
};


export const getUserInfo = () => {
  return http.get<any,any>("/api/admin/userinfo");
};
