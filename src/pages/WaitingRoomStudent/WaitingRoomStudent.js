import React, { useEffect,useState, useRef } from "react";
import PR from "../../images/pr1.png";
import ReactLoading from 'react-loading';
import { useParams, useNavigate, createBrowserRouter} from "react-router-dom";
import axios from "axios";


export const WaitingRoomStudent = () =>{
	const wsRef = useRef();
	const wsRef2 = useRef();
	const wsRef3 = useRef();

	const navigate = useNavigate()
  
	const participant = JSON.parse(localStorage.getItem('participant'))
    const full_name = participant? participant['full_name'] : ""
    const {room_code} = useParams();
    const [participantId, setParticipantId] = useState("")
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


    window.addEventListener('popstate',async () => {
      try {

        const res = await axios.post('http://localhost:8000/api/v1/delete-participant/', {
          'room': room_code,
          'full_name': full_name
        })

            localStorage.clear()
            //navigate('/authorization-student')
        
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
    });
    useEffect(() => {
      if (!wsRef.current) {
        wsRef.current = new WebSocket('ws://localhost:8000/test-status/'+room_code+'/');
    
      }
      wsRef.current.onopen = () => {
        console.log('connected')
        }
        wsRef.current.onmessage = (msg) => {
        const message = JSON.parse(msg.data)
        if (message.data === 'Test started'){
          wsRef.current.onclose = function () {}; // disable onclose handler first
          wsRef.current.close();
          wsRef2.current.onclose = function () {}; // disable onclose handler first
          wsRef2.current.close();
          wsRef3.current.onclose = function () {}; // disable onclose handler first
          wsRef3.current.close();
          navigate(`/test-page/${room_code}}`)
        }

    }
  }, [])

  useEffect(() => {
    if (!wsRef3.current) {
      wsRef3.current = new WebSocket('ws://localhost:8000/room-removed/'+room_code+'/');
  
    }
    wsRef3.current.onopen = () => {
      console.log('connected')
      }
      wsRef3.current.onmessage = (msg) => {
      const message = JSON.parse(msg.data)
      if (message.data === 'Room deleted'){
        wsRef.current.onclose = function () {}; // disable onclose handler first
        wsRef.current.close();
        wsRef2.current.onclose = function () {}; // disable onclose handler first
        wsRef2.current.close();
        wsRef3.current.onclose = function () {}; // disable onclose handler first
        wsRef3.current.close();
        localStorage.clear()
        navigate('/authorization-student')
      }

  }
}, [])

  useEffect( () => {
    if (participantId !== ""){
      if (!wsRef2.current) {
        wsRef2.current = new WebSocket('ws://localhost:8000/remove-participant/'+participantId.toString()+'/');
    
      }
      wsRef2.current.onopen = () => {
        console.log('connected')
        }
        wsRef2.current.onmessage = (msg) => {
        const message = JSON.parse(msg.data)
        if (message.data === 'Participant removed'){
          wsRef2.current.onclose = function () {}; // disable onclose handler first
          wsRef2.current.close();
          localStorage.clear()
          wsRef.current.onclose = function () {}; // disable onclose handler first
          wsRef.current.close();
          wsRef3.current.onclose = function () {}; // disable onclose handler first
          wsRef3.current.close();
          navigate('/authorization-student')
        }
    }


  }
}, [participantId])



     const handleQuit = async () => {
      try {
        const res = await axios.post('http://localhost:8000/api/v1/delete-participant/', {
        'room': room_code,
        'full_name': full_name
      })
      localStorage.clear()
      navigate('/authorization-student')
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

  
    }
	return(
    <div className=" wrtsection section">
			<img className="wrtimg" src={PR} alt="Простой фото" />
			<div className="wr wrtd" style={{marginTop: "18vh"}}>
                <div style={{marginLeft: "150px", marginTop: "30px", marginBottom: "20px"}}>
                    <ReactLoading type={'spin'} color={'#4461F2'} height={'30%'} width={'30%'} />
                </div>
                <p className="wrp">Ожидание</p>
                <p className="wrq">{full_name},<br /> подождите, пока преподаватель <br/> не начнет тестирование</p>
                <button className="wrt" onClick={handleQuit}>Выйти</button>
            </div>
        </div>
	)
}