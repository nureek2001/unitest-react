import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import axiosInstance from "../../utils/axiosInstance";
import PN from "../../images/pn3.png";
import Line from "../../images/Line3.png";
import axios from "axios";
import Modal from "../../components/Modal";
import { timers } from "jquery";

export const WaitingTestTeacher = () =>{
    const navigate = useNavigate()
    const specialty = localStorage.getItem('specialty')
    const year = localStorage.getItem('year')
    const {room_code} = useParams()
	const wsRef = useRef();
	const minutesss = localStorage.getItem('minutes')
	const [initialTime, setInitialTime] = useState()
    const [seconds, setSeconds] = useState();
	const user = JSON.parse(localStorage.getItem('user'))
	const jwt_access = localStorage.getItem('access')
    const [participants, setParticipants] = useState([])
	const [isOpen, setIsOpen] = useState(false);
	const [timerStart, setTimerStart] = useState(false)
    useEffect(() => {
		if((jwt_access === null) && !user){
			navigate('/authorization-teacher')
		}
		// eslint-disable-next-line
	}, [])
	useEffect(() => {
      const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:8000/api/v1/get-test-info/', {
              params: {
                  room_code: room_code
              }
            });
            setSeconds(response.data['minutes']*60)
			setTimerStart(true)
			if (!wsRef.current) {

				wsRef.current = new WebSocket('ws://localhost:8000/get-participants/'+room_code+'/');
  
			  }
			  wsRef.current.onopen = () => {
				  console.log('connected')
				}
				wsRef.current.onmessage = (msg) => {
				  const message = JSON.parse(msg.data)
				  setParticipants(message.participants)
  
				}
          } catch (error) {
            navigate('/authorization-teacher')
          }
        };
    
        fetchData();
  }, [])
  useEffect(() => {
	const fetchData = async () => {
		if (participants.length>0){
			setIsOpen(true)
		}
		else{
			setIsOpen(false)
		}
	};

	fetchData();
  }, [participants]);

	useEffect(() => {
		if (specialty === null){
			navigate('/authorization-teacher')
		}
		// eslint-disable-next-line
	}, [])

   
	const handleEnd = async () =>{
		
		try {
            const response = await axios.post('http://localhost:8000/api/v1/test-end/', {
              'room': room_code
            });
			setTimeout(navigate(`/test-results/${room_code}`), 3000)
          } catch (error) {
            console.log(error)
          }
	}
			 useEffect(() => {
			   const intervalId = setInterval(() => {
				 setSeconds((prevSeconds) => {
				   if (prevSeconds > 0) {
					 return prevSeconds - 1;
				   } else {
					navigate(`/test-results/${room_code}`)

				   }
				 });
			   }, 1000);
			   return () => clearInterval(intervalId);
			 }, [timerStart]);
			 const minutes = Math.floor(seconds / 60);
        const formattedSeconds = seconds % 60;
			 // соны

    return(

        <div className="wrtsection section">
			<img className="wrtimg" src={PN} alt="Простой фото" />
			<div className="wr wrtd" style={{marginTop: "18vh"}}>
				<div className="wrb" style={{height: "160px"}}>
					<p style={{paddingTop: "15px", textAlign: "center", paddingLeft: "0px"}}>До окончания теста</p>
					<img style={{marginLeft: "85px", paddingTop: "20px"}} src={Line} alt="Простой фото" />
					<p style={{ display: timerStart === true? "Block":"None", paddingLeft: "0px", paddingTop: "15px", textAlign: "center"}}>{String(minutes).padStart(2, '0')}:{String(formattedSeconds).padStart(2, '0')}</p>
				</div>
				<div className="sbr">
					<p>Специальность: </p>
					<p style={{marginLeft: "20px"}}>{specialty}</p>
				</div>
				<div className="sbr">
					<p style={{marginLeft: "80px"}}>Курс :</p>
					<p style={{marginLeft: "30px"}}>{year}</p>
				</div>

				<button className="wrt" onClick={handleEnd}>Завершить</button>

			</div>
			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <h2 style={{marginBottom: "10px", marginTop: "20px"}}>Студенты, закончившие тестирование</h2>
			  {participants.map((participant, index) => (
                		<div key = {index} className = "waiting__participant" data-closable>
							<p key={index}>
							{participant} 
							<br />
							</p>
						</div>
						
						
            ))}

            </Modal>
        </div>
	)
}