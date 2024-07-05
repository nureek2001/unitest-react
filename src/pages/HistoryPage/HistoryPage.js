import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export const HistoryPage = () =>{
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
	const jwt_access = localStorage.getItem('access')

    const [tests, setTests] = useState([])
    const full_name = user['first_name'] + " " + user['last_name']
    const [removeRoomCode, setRemoveRoomCode] = useState("")
    useEffect(() => {
		if((jwt_access === null) && !user){
			navigate('/authorization-teacher')
		}
		// eslint-disable-next-line
	}, [])
    useEffect(() => {
		const fetchData = async () => {
		  try {
			const response = await axios.get('http://localhost:8000/api/v1/tests-history/',{
				params: {
					teacher_login: user['login']
				}
			});
            setTests(response.data)
		  } catch (error) {
			console.log(error)
		  }
		};
		fetchData();
    }, []);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
       
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    var [date,setDate] = useState(new Date());
    useEffect(() => {
        var timer = setInterval(()=>setDate(new Date()), 1000 )
        return function cleanup() {
            clearInterval(timer)
        }
    });
    const nodeRef = useRef(null);
    useEffect(() => {
		const fetchData = async () => {
            if (removeRoomCode !== ""){
			try {

				const res = await axios.post('http://localhost:8000/api/v1/delete-room/', {
				'room': removeRoomCode,
				})
                const response = await axios.get('http://localhost:8000/api/v1/tests-history/',{
				params: {
					teacher_login: user['login']
				}
                });
                setTests(response.data)
			}
			catch(error){
                setTests([])
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
		};

		fetchData();
	  }, [removeRoomCode]);
    return(
        <div className="section" id = "exportContent">
            <div style={{width: windowSize.width}} ref={nodeRef}>
                <h2 className="m2">Проведенные тестирования</h2>
                <h3 className="m3"><span>Преподаватель: </span>{full_name}</h3>
                <div className="table-wrapper">
                    <table style={{margin: "0 auto", width: "60vw"}} className="fl-table">
                        <thead>
                            <tr>
                                <th>Факультет</th>
                                <th>Специальность</th>
                                <th>Курс</th>
                                <th>Дисциплина</th>
                                <th>Время</th>
                                <th>Действие</th>
                            </tr>
                        </thead>
                        <tbody>
                        {tests.map((test, i) => (
                            <tr style={{backgroundColor: i%2===0?"#c9e9ff":"white"}} key={i}>
                                <td onClick={() => navigate(`/test-results/${test.room_code}`)}>{test.faculty}</td>
                                <td onClick={() => navigate(`/test-results/${test.room_code}`)}>{test.specialty}</td>
                                <td onClick={() => navigate(`/test-results/${test.room_code}`)}>{test.year}</td>
                                <td onClick={() => navigate(`/test-results/${test.room_code}`)}>{test.discipline}</td>
                                <td onClick={() => navigate(`/test-results/${test.room_code}`)}>
                                    {((test) => {
                                        let datasy = "";
                                        for (let i = 0; i < 16; i++) {
                                            if(test.created_at[i] == 'T'){
                                                datasy+=' '
                                            }
                                            else{
                                            datasy += test.created_at[i]
                                            }
                                        }
                                        return datasy;
                                    })(test)}
                                </td>
                                <td>
							<button className = "remove__participant" aria-label='delete item' onClick={()=>setRemoveRoomCode(test.room_code)} type='button'>X</button>

                                </td>
                            </tr>
                        ))}   
                        </tbody>
                    </table>
                    <div  style = {{display: "flex", justifyContent: "center", margin: "20px 0 20px 0"}}>
                    <button  className="resbut"  onClick={() => navigate('/teacher-page')}>Выйти</button>

                    </div>

                </div>
            </div>
        </div>
	)
}
