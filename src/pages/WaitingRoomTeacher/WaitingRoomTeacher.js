import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../utils/axiosInstance";
import PN from "../../images/pn3.png";
import Line from "../../images/Line3.png";
import axios from "axios";
import Modal from "../../components/Modal";

export const WaitingRoomTeacher = () =>{
	const navigate = useNavigate()
	const user = JSON.parse(localStorage.getItem('user'))
	const jwt_access = localStorage.getItem('access')
	const login = user? user['login'] : ""
	const [roomCode, setRoomCode] = useState("")
	const [numOfParticipants, setNumOfParticipants] = useState(0);
	const wsRef = useRef();
	const [participants, setParticipants] = useState([])
	const [isOpen, setIsOpen] = useState(false);
	const [removeFullName, setRemoveFullName] = useState("")
	
	useEffect(() => {
		const fetchData = async () => {
		  try {
			const response = await axios.get('http://localhost:8000/api/v1/get-room-code/',{
				params: {
					teacher_login: login
				}
			});
			setRoomCode(response.data['room_code']);

			if (!wsRef.current) {
			  wsRef.current = new WebSocket('ws://localhost:8000/get-participants/'+response.data['room_code']+'/');

			}
			wsRef.current.onopen = () => {
				console.log('connected')
			  }
			  wsRef.current.onmessage = (msg) => {
				const message = JSON.parse(msg.data)
				setNumOfParticipants(message.data)
				setParticipants(message.participants)

			  }
		  } catch (error) {
			alert(error.response.data)

				navigate('/teacher-page')
				
			// navigate('/authorization-teacher')
		  }
		};

		fetchData();
	  }, []);

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
		if(jwt_access === null && !user){
			navigate('/authorization-teacher')
		}
		// eslint-disable-next-line
	}, [jwt_access, user])

	const handleStart = async () => {
		wsRef.current.onclose = function () {}; // disable onclose handler first
		wsRef.current.close();
		try {

			const res = await axios.post('http://localhost:8000/api/v1/test-start/', {
			  'room': roomCode
		  })
			if (res.status === 200){
				navigate(`/waiting-test-teacher/${roomCode}`)
			}

		  }
		  catch(error){
			if(error.response){
			  console.log(error.response.data)
			  console.log(error.response.status);
			  console.log(error.response.headers);
			} else if (error.request) {
			  console.log(error.request);
			} else {
			  console.log('Error', error.message);
			}
			console.log(error);
		  }
		};

	const handleBack = async () => {
		wsRef.current.onclose = function () {}; // disable onclose handler first
		wsRef.current.close();
		try {
			const res = await axios.post('http://localhost:8000/api/v1/delete-room/',{
				'room': roomCode
			})
			if (res.status === 204){
				navigate("/teacher-page")
				localStorage.removeItem("specialty")
				localStorage.removeItem("year")
				localStorage.removeItem("minutes")
				localStorage.removeItem("question_num")
				localStorage.removeItem('discipline')
			}

		}
		catch(error){
			if(error.response){
				console.log(error.response.data)
				console.log(error.response.status);
				console.log(error.response.headers);
			} else if (error.request) {
				console.log(error.request);
			} else {
				console.log('Error', error.message);
			}
			console.log(error);
		}
		navigate('/teacher-page')

	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				if(removeFullName !== ""){
				const res = await axios.post('http://localhost:8000/api/v1/delete-participant/', {
				'room': roomCode,
				'full_name': removeFullName,
				})
			}
			}
			catch(error){
				if(error.response){
				console.log(error.response.data)
				console.log(error.response.status);
				console.log(error.response.headers);
				} else if (error.request) {
				console.log(error.request);
				} else {
				console.log('Error', error.message);
				}
				console.log(error);
			}
		};

		fetchData();
	  }, [removeFullName]);
	return(
        <div className="wrtsection section">
			<img className="wrtimg" src={PN} alt="Простой фото" />
			<div className="wr wrtd" >
				<div className="wrb">
					<p>Комната теста</p>
					<img style={{marginLeft: "85px", paddingTop: "20px"}} src={Line} alt="Простой фото" />
				</div>
				<div className="sbr">
					<p>Идентификатор :</p>
					<p style={{marginLeft: "93px"}}>{roomCode}</p>
				</div>
				<div className="sbr">
					<p>Статус :</p>
					<p style={{marginLeft: "80px"}}>В ожидании <span>({numOfParticipants})</span></p>
				
				</div>

				<button className="wrt" onClick={handleStart}>Начать тест</button>
				<button className="wrt2" onClick={handleBack}>Отменить</button>

			</div>
			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <h2 style={{marginBottom: "10px", marginTop: "20px"}}>Подключившиеся участники </h2>
			  {participants.map((participant, index) => (
                		<div key = {index} className = "waiting__participant" data-closable>
							<p key={index}>
							{participant.full_name} 
							<br />
							</p>
							<button className = "remove__participant" aria-label='delete item' onClick={()=>setRemoveFullName(participant.full_name)} type='button'>X</button>

						</div>
						
						
            ))}

            </Modal>
        </div>
	)
}