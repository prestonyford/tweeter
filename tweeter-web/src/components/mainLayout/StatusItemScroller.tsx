import { AuthToken, Status } from "tweeter-shared";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useToastListener from "../toaster/ToastListenerHook";
import StatusItem from "../statusItem/StatusItem";
import useUserInfo from "../userInfo/userInfoHook";
import { StatusItemPresenter, StatusItemView } from "../../presenters/StatusItemPresenter";

export const PAGE_SIZE = 10;

interface Props {
	presenterGenerator: (view: StatusItemView) => StatusItemPresenter
}

const StatusItemScroller = (props: Props) => {
	const { displayErrorMessage } = useToastListener();
	const [items, setItems] = useState<Status[]>([]);
	const [newItems, setNewItems] = useState<Status[]>([]);
	const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);

	const { displayedUser, authToken } = useUserInfo();

	// Initialize the component whenever the displayed user changes
	useEffect(() => {
		reset();
	}, [displayedUser]);

	// Load initial items whenever the displayed user changes. Done in a separate useEffect hook so the changes from reset will be visible.
	useEffect(() => {
		if (changedDisplayedUser) {
			loadMoreItems();
		}
	}, [changedDisplayedUser]);

	// Add new items whenever there are new items to add
	useEffect(() => {
		if (newItems) {
			setItems([...items, ...newItems]);
		}
	}, [newItems])


	const listener: StatusItemView = {
		addItems: setNewItems,
		displayErrorMessage
	}

	const [presenter] = useState(props.presenterGenerator(listener))

	const loadMoreItems = async () => {
		presenter.loadMoreItems(authToken!, displayedUser!?.alias);
		setChangedDisplayedUser(false);
	}

	const reset = async () => {
		setItems([]);
		setNewItems([]);
		setChangedDisplayedUser(true);

		presenter.reset();
	}

	return (
		<div className="container px-0 overflow-visible vh-100">
			<InfiniteScroll
				className="pr-0 mr-0"
				dataLength={items.length}
				next={loadMoreItems}
				hasMore={presenter.hasMoreItems}
				loader={<h4>Loading...</h4>}
			>
				{items.map((item, index) => (
					<StatusItem
						key={index}
						item={item}
					/>
				))}
			</InfiniteScroll>
		</div>
	);
};

export default StatusItemScroller;
