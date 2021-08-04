import { useRef, useState, useEffect, useCallback } from "react";
import { AlertList, Alert, AlertContainer } from "react-bs-notifier";

export default function NotifierGeneratorComponent(props) {
	//Posiciones del mensaje	
	//top-right
	//top-left
	//bottom-right
	//bottom-left
	const [position, setPosition] = useState("top-right");
	const [alertsType, setAlertsType] = useState([]);
	const [alertTimeout, setAlertTimeout] = useState(0);
	const [message, setNewMessage] = useState("No message asigned!!");
	
	function alertProperties (props){
		if (props.hasOwnProperty("position")){
			setPosition(props.position)
		}
		if (props.hasOwnProperty("alertsType")){
			setAlertsType(props.alertsType)
		}
		if (props.hasOwnProperty("alertTimeout")){
			setAlertTimeout(props.alertTimeout)
		}
		if (props.hasOwnProperty("message")){
			setNewMessage(props.message)
		}
	}

	
	return (
		<>
			<AlertList
				position={position}
				alertsType={alertsType}
				timeout={alertTimeout}
				dismissTitle="Begone!"
				//onDismiss={onDismissed}
			/>
		</>
  	);

}