import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
export const TestResults = () =>{
    const navigate = useNavigate()
    const [faculty, setFaculty] = useState("")
    const {room_code} = useParams()
    const [students, setStudents] = useState([])
    const [maxQuestions, setMaxQuestions] = useState(0);
    const [specialty, setSpecialty] = useState("")
    const [year, setYear] = useState(0)
    const [discipline, setDiscipline] = useState("")
    const user = JSON.parse(localStorage.getItem('user'))
	const jwt_access = localStorage.getItem('access')
  useEffect(() => {
		if((jwt_access === null) && !user){
			navigate('/authorization-teacher')
		}
		// eslint-disable-next-line
	}, [])
    const Export2Word = () => {
      let filename = specialty+"_"+year+"курс"
      let element = 'exportContent'
      let preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
      let postHtml = "</body></html>";
      document.getElementById("buttons").style.display = "None"
      let html = preHtml+document.getElementById(element).innerHTML+postHtml;
      let blob = new Blob(['\ufeff', html], {
          type: 'application/msword'
      });
      // Specify link url
      let url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
      // Specify file name
      filename = filename?filename+'.doc':'document.doc';
      // Create download link element
      let downloadLink = document.createElement("a");
      document.body.appendChild(downloadLink);
      if(navigator.msSaveOrOpenBlob ){
          navigator.msSaveOrOpenBlob(blob, filename);
      }else{
          // Create a link to the file
          downloadLink.href = url;
          // Setting the file name
          downloadLink.download = filename;
          //triggering the function
          downloadLink.click();
      }
      document.getElementById("buttons").style.display = "flex"
      document.body.removeChild(downloadLink);
  }
  useEffect(() => {
		const fetchData = async () => {
		  try {
			const response = await axios.get('http://localhost:8000/api/v1/test-results/',{
				params: {
					room_code: room_code
				}
			});
            setStudents(response.data)
		  } catch (error) {
			console.log(error)
		  }
		};
    
		fetchData();
	  }, []);
    useEffect(() => {
      const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:8000/api/v1/get-test-info/', {
              params: {
                  room_code: room_code
              }
            });
            setMaxQuestions(response.data['question_num'])
            setDiscipline(response.data['discipline'])
            setYear(response.data['year'])
            setSpecialty(response.data['specialty'])
            setFaculty(response.data['faculty'])
          } catch (error) {
            navigate('/authorization-teacher')
          }
        };
    
        fetchData();
  }, [])
    const handleDelete = async () => {
      navigate('/teacher-page')
    }

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


    return(
        <div className="section" id = "exportContent">
          <div style={{width: windowSize.width, height: windowSize.height-50}} ref={nodeRef}>
          <h2 className="m2">Результаты теста</h2>
          <h3 className="m3"><span>Факультет: </span>{faculty}</h3>
          <h3 className="m3"><span>Специальность: </span>{specialty} | <span>Курс: </span>{year}</h3>
          <h3 className="m3"><span>Дисциплина: </span>{discipline}</h3>
          <div className="table-wrapper">
              <table style={{whiteSpace: "normal", margin: "0 auto", width: "60vw"}} className="fl-table">
                  <thead>
                  <tr>
                      <th>Ф. И. О.</th>
                      <th>Кол-во правильных ответов </th>
                      <th>Набранный балл</th>
                      <th>Процент</th>
                  </tr>
                  </thead>
                  <tbody>
                  {students.map((student, i) => (
                    <tr style={{backgroundColor: i%2===0?"#c9e9ff":"white"}} key={i}>
    
                      <td onClick={() => navigate(`/test-results-details/${room_code}/${student.participant_id}`)}>{student.full_name}</td>
                      <td>{student.correct_count}  /  {maxQuestions}</td>
                      <td>{student.student_point} / {student.max_point}</td>
                      <td>{((student) => {
                                        return student.percent.toFixed(2);
                                    })(student)} - {student.grade}</td>
                    </tr>
                ))}   
                  </tbody>
              </table>
              <div id = "buttons" style={{display: "flex", justifyContent: "space-between", margin: "20px 0 0 0"}}>
            <button className="resbut"  onClick={handleDelete}>Выйти</button>
            <button className="resbut" onClick={Export2Word}>Скачать отчет</button>
          </div>
          </div>
          </div>

        </div>


				

	)
}
