import { useContext } from "react";
import { UserInfoContext } from "./UserInfoProvider";

const useUserInfo = () => {
    return useContext(UserInfoContext)
}

export default useUserInfo;
