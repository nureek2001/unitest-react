import React, { useEffect,useState, useRef } from "react";
import PR from "../../images/pr1.png";
import ReactLoading from 'react-loading';
import { useParams, useNavigate, createBrowserRouter} from "react-router-dom";
import axios from "axios";


export const WaitingTestResults = () =>{
	const wsRef = useRef();

	const navigate = useNavigate()
  
	const participant = JSON.parse(localStorage.getItem('participant'))
    const full_name = participant? participant['full_name'] : ""
    const {room_code} = useParams();
    const [participantId, setParticipantId] = useState("")
    const [isFinished, setIsFinished] = useState(false)
    useEffect(() => {
      const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:8000/api/v1/get-info-student-room/', {
              params: {
                  full_name: full_name,
                  room_code: room_code
              }
            });
            setParticipantId(response.data['id'].toString())
          } catch (error) {
            navigate('/authorization-student')
          }
        };
    
        fetchData();
  }, [])


    useEffect(() => {
      if (!wsRef.current) {
        wsRef.current = new WebSocket('ws://localhost:8000/test-status/'+room_code+'/');
    
      }
      wsRef.current.onopen = () => {
        console.log('connected')
        }
        wsRef.current.onmessage = (msg) => {
        const message = JSON.parse(msg.data)
        if (message.data === 'Test ended'){
          wsRef.current.onclose = function () {}; // disable onclose handler first
          wsRef.current.close();
          setIsFinished(true)
        }

    }
  }, [])
  useEffect(()=> {
    if(isFinished === true){
    navigate(`/test-results-details/${room_code}/${participantId}`)
    }
  }, [isFinished])

	return(
    <div className=" wrtsection section">
			<img className="wrtimg" src={PR} alt="Простой фото" />
			<div className="wr wrtd" style={{marginTop: "18vh"}}>
                <div style={{marginLeft: "150px", marginTop: "30px", marginBottom: "20px"}}>
                    <ReactLoading type={'spin'} color={'#4461F2'} height={'30%'} width={'30%'} />
                </div>
                <p className="wrp">Ожидание</p>
                <p className="wrq">{full_name},<br /> подождите, пока преподаватель <br/> не закончит тестирование, чтобы <br />увидеть свои результаты</p>
            </div>
        </div>
	)
}