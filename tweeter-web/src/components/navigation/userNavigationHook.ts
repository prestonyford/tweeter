import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/userInfoHook";
import { UserNavigationPresenter, UserNavigationView } from "../../presenters/UserNavigationPresenter";
import { useNavigate } from "react-router-dom";

const useNavigation = () => {
	const { setDisplayedUser, currentUser, authToken } = useUserInfo();
	const { displayErrorMessage } = useToastListener();

	const listener: UserNavigationView = {
		setDisplayedUser,
		displayErrorMessage,
		navigate: useNavigate(),
	}

	const presenter = new UserNavigationPresenter(listener); // Does this need to be state?

	const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
		event.preventDefault();
		presenter.navigateToUser(event.target, authToken!, currentUser!)
	};

	return navigateToUser;
};

export default useNavigation;
