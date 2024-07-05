import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import ICon from "../../images/tt.png";
import { getByLabelText } from "@testing-library/react";
export const TestPage = () =>{
    const [isOpen, setIsOpen] = useState(false);
    const [questions, setQuestions] = useState([])
    const navigate = useNavigate()
	  const wsRef = useRef();
    const [quesMas, setQuesMas] = useState([])
    const [mas, setMas] = useState([])
    const room_code = localStorage.getItem('room_code')
    const [answers, setAnswers] = useState([])
    const participant = JSON.parse(localStorage.getItem('participant'))
    const full_name = participant? participant['full_name']: ""
    const [questionNum, setQuestionNum] = useState(5)
    const [seconds, setSeconds] = useState();
    const [countInd, setCountInd] = useState(0)
    const [isFinished, setIsFinished] = useState(false)
    const [correct, setCorrect] = useState(0)
    const [participantId, setParticipantId] = useState()
	const [timerStart, setTimerStart] = useState(false)

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
  document.onvisibilitychange = () => {
  if (document.visibilityState === "hidden") {
    setIsFinished(true)
  }
};
  
 useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/get-test-info/', {
                    params: {
                        room_code: room_code
                    }
                });
                setQuestionNum(response.data['question_num'])
                setSeconds(response.data['minutes']*60)
			    setTimerStart(true)

            } catch (error) {
                navigate('/authorization-student')
            }
        };
        fetchData();
    }, [])

    // Function to handle the change in radio button selection
    useEffect(() => {
        if(full_name===""){
            navigate('/authorization-student')
        }
      // eslint-disable-next-line
    }, [])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/get-questions/',{
                    params: {
                        room_code: room_code
                    }
                });
                setQuestions(response.data)
                setAnswers([])
                setCountInd(0)
                for(let i=0; i<questionNum; i++){
                    mas.push(-1)
                    quesMas.push(-1)
                }
            } catch (error) {
                navigate('/authorization-student')
            }
        };
    
        fetchData();
    }, []);
    useEffect(()=>{
        const fetchData = async () => {
            questions.map((question, index)=>{
                if (countInd!=questionNum){
                    setCountInd(countInd+1)
                    const oneanswer = answers.find(answer=>answer.question_id === question.question_id)
                    if(!oneanswer){
                        setAnswers([...answers,{question_id: question.question_id, option: "", full_name: full_name, room_code: room_code}])
                    }
                }
            })
        };
        fetchData();
    }, [countInd, questionNum, answers])
    const onValueChange = (event) => {
        const oneanswer = answers.find(answer=>answer.question_id === parseInt(event.target.name))
        if (oneanswer){
            oneanswer.option = event.target.value
        }
        else{
            setAnswers([...answers,{question_id: parseInt(event.target.name), option: event.target.value, full_name: full_name, room_code: room_code}])
        }
    }
    useEffect(() => {
        const handleBeforeUnload = async (event) => {
            event.preventDefault();
            const res = await axios.post('http://localhost:8000/api/v1/delete-participant/', {
                'room': room_code,
                'full_name': full_name
            })
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    useEffect(() => {
		    const fetchData = async () => {
            if (!wsRef.current) {
                wsRef.current = new WebSocket('ws://localhost:8000/test-status/'+room_code+'/');
            }
            wsRef.current.onopen = () => {
                console.log('connected')
            }
            wsRef.current.onmessage = async (msg) => {
                const message = JSON.parse(msg.data)
                if (message.data === 'Test ended'){
                    setIsFinished(true)
                    wsRef.current.onclose = function () {}; // disable onclose handler first
                    wsRef.current.close();
                }
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            let arr = []
            for(let i =0; i<questionNum; i++){
                const findAns = answers.find(answer=>answer.question_id === questions[i].question_id)
                arr.push(findAns)
            }
            try {
                let part_id = Number(participantId)

                const res = await axios.post(`http://localhost:8000/api/v1/end-test-student/${part_id}/`, arr)
                navigate(`/test-results-details/${room_code}/${participantId}`)

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
    }, [isFinished]);
    const [currentIndex, setCurrentIndex] = useState(1); // Индекс текущего массива
    const handleButtonClick = (index) => {
        setCurrentIndex(index);
      };
    const [currentI, setCurrentI] = useState(1);
    const handleButtonOptionClick = (index, i) => {
        setCurrentI(i+1)
        const newMas = [...mas];
        newMas[index] = i;
        setMas(newMas);
        const newQuesMas = [...quesMas]
        newQuesMas[index] = 0
        setQuesMas(newQuesMas)
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (window.confirm("Вы уверены, что завершаете тестирование?")) {
            try {
                let part_id = Number(participantId)
                const res = await axios.post(`http://localhost:8000/api/v1/end-test-student/${part_id}/`, answers)
                setCorrect(res.data['message'])
                setIsOpen(true)
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
      }
    useEffect(() => {
        const intervalId = setInterval(() => {
            setSeconds((prevSeconds) => {
                if (prevSeconds > 0) {
                    return prevSeconds - 1;
                } else {
                    setIsFinished(true)
                    clearInterval(intervalId); 
                    return 0;
                }
            });
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timerStart]);
    const minutes = Math.floor(seconds / 60);
    const formattedSeconds = seconds % 60;
    function getIndicesOf(searchStr, str, caseSensitive) {
        let searchStrLen = searchStr.length;
        if (searchStrLen == 0) {
            return [];
        }
        let startIndex = 0, index, indices = [];
        if (!caseSensitive) {
            str = str.toLowerCase();
            searchStr = searchStr.toLowerCase();
        }
        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
            indices.push(index);
            startIndex = index + searchStrLen;
        }
        return indices;
    }
    return(
        <div  className="tptpsection" style={{display: "flex", flexDirection: "column"}}>
            <div className="timerstyle">
              <p className="timer" style = {{display: timerStart === true? "Block":"None"}}>{String(minutes).padStart(2, '0')}:{String(formattedSeconds).padStart(2, '0')}</p>
            </div>
            <div className="count-test" >
                {questions.map((question, index) => (
                    <button className="cqbutton" style={{backgroundColor: quesMas[index]===0? "#48E499": "#5570F7", borderRadius: "10px", marginRight: "10px"}} key={index} onClick={() => handleButtonClick(index+1)}>
                        {index + 1} 
                    </button>
                ))}
            </div>
            <div className="quesblock">
                {questions.map((question, index) => (
                    <h1 key={index} className="ques1" style = {{display: index+1===currentIndex? "Block" : "None"}}>{index+1}. Вопрос:</h1>
                ))}
                {questions.map((question, index) => (
                    
                    <div key={index} style = {{display: index+1===currentIndex? "Block": "None"}} className="ques-p">
                        {((question, inn) => {
                            let p = [];
                            if(question.question_images.length===0){
                                p.push(<p key = {inn}>{question.question_text}</p>);
                            }
                            else{
                                let indices = getIndicesOf("IMAGE", question.question_text)
                                let ques_text = question.question_text
                                let ind = 0
                                for(let i = 0; i<indices.length; i++){
                                    p.push(<p key = {i}>{ques_text.substring(ind,indices[i])} <br/><img src={question.question_images[i]} alt ="" /></p>)
                                    ind = indices[i] + 5
                                }
                                p.push(<p key = {inn}>{ques_text.substring(ind)}</p>)
                            }
                            return p;
                        })(question)}
                    </div>
                ))}
              <h2 className="ques">Выберите правильный ответ:</h2>
                <form onSubmit={handleSubmit}>
                    <div style = {{display: "flex"}}>               
                        {questions.map((question, index) => (
                            <div key = {index} style = {{display: index+1===currentIndex? "Block": "None", width: "60vw"}} className="form_radio_group" >
                                {((question) => {
                                    let div = [];
                                    for (let i = 0; i < 5; i++) {
                                        div.push(<div className = "form_question_options" key={i}><div className="form_radio_group-item"  > <label form="radio" 
                                        style={{background: mas[index] === i? "#48E499" : "#5570F7", marginTop: "20px", color: "#fff", width: "50px", height: "50px", borderRadius: "10px",}} onClick={() => handleButtonOptionClick(index,i)} ><input id="radio" type="radio" name={question.question_id} value={question.options[i] } 
                                        onChange={onValueChange} />{String.fromCharCode(65 + i)}</label></div>
                                        <div className="form_question_options-text samat" style={{display: "Block"}}>
                                        {((question, inn) => {
                                            let p = [];
                                            if(question.option_images[i].length===0){
                                                p.push(<p key = {inn}>{question.options[i]}</p>);
                                            }
                                            else{
                                                let indices = getIndicesOf("IMAGE", question.options[i])
                                                let ques_text = question.options[i]
                                                let ind = 0
                                                for(let l = 0; l<indices.length; l++){
                                                    p.push(<p key = {l}>{ques_text.substring(ind,indices[l])} <br/><img src={question.option_images[i][l]} alt ="" /></p>)
                                                    ind = indices[l] + 5
                                                }
                                                p.push(<p key = {inn}>{ques_text.substring(ind)}</p>)
                                            }
                                            return p;
                                        })(question)}
                                        </div>
                                        </div>);
                                    }
                                    return div;
                                })(question)}
                                <div className = "nextPrev">
                                    <button type = "button" className="wrtNextPrev" onClick={()=>handleButtonClick(index)} style={{display: index === 0? "None": "Block"}}>{"<-Предыдущий"}</button>
                                    <button type = "button"  className="wrtNextPrev" onClick={()=>handleButtonClick(index+2)} style={{display: index === questionNum-1? "None": "Block"}}>{"Следующий->"}</button>
                                </div>
                            </div>
                        ))}
                    </div> 
                    <button  className="wrtEnd" >Завершить</button>
                </form>
            </div>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <img src={ICon} alt="Простой фото" />
                <h2 style={{marginBottom: "10px", marginTop: "20px"}}>Спасибо за участие в тесте! </h2>
                <p>Ваш результат: {correct} баллов из {questionNum} возможных .</p>
                <button className="modalback" onClick={() => navigate(`/waiting-test-results/${room_code}`) }>Закрыть</button>
            </Modal>
        </div>
	  )
}