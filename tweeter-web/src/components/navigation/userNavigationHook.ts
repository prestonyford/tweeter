import useToastListener from "../toaster/ToastListenerHook";
import { AuthToken, FakeData, User } from "tweeter-shared";
import useUserInfo from "../userInfo/userInfoHook";
import { UserNavigationPresenter, UserNavigationView } from "../../presenters/UserNavigationPresenter";

const useNavigation = () => {
	const { setDisplayedUser, currentUser, authToken } = useUserInfo();
	const { displayErrorMessage } = useToastListener();

	const listener: UserNavigationView = {
		setDisplayedUser,
		displayErrorMessage
	}

	const presenter = new UserNavigationPresenter(listener); // Does this need to be state?

	const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
		event.preventDefault();
		presenter.navigateToUser(event.target, authToken!, currentUser!)
	};

	return navigateToUser;
};

export default useNavigation;
