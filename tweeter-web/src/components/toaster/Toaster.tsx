import "./Toaster.css";
import { useEffect, useState } from "react";
import { Toast } from "react-bootstrap";
import useToaster from "./ToastHook";
import { ToasterPresenter, ToasterView } from "../../presenters/ToasterPresenter";

interface Props {
	position: string;
}

const Toaster = ({ position }: Props) => {
	const { toastList, deleteToast } = useToaster();

	const listener: ToasterView = {
		deleteToast
	}

	const [presenter] = useState(new ToasterPresenter(listener));

	useEffect(() => {
		presenter.setupExpiredToastInterval(toastList);
		return () => {
			presenter.clearExpiredToastInterval();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [toastList]);

	return (
		<>
			<div className={`toaster-container ${position}`}>
				{toastList.map((toast, i) => (
					<Toast
						id={toast.id}
						key={i}
						className={toast.bootstrapClasses}
						autohide={false}
						show={true}
						onClose={() => deleteToast(toast.id)}
					>
						<Toast.Header>
							<img
								src="holder.js/20x20?text=%20"
								className="rounded me-2"
								alt=""
							/>
							<strong className="me-auto">{toast.title}</strong>
						</Toast.Header>
						<Toast.Body>{toast.text}</Toast.Body>
					</Toast>
				))}
			</div>
		</>
	);
};

export default Toaster;
