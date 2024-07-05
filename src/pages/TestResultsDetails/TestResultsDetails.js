import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// import axiosInstance from "../../utils/axiosInstance";
import axios from "axios";
export const TestResultsDetails = () =>{
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const [faculty, setFaculty] = useState("")
    
    const {room_code, participant_id} = useParams()
    const [maxQuestions, setMaxQuestions] = useState(0);
    const [specialty, setSpecialty] = useState("")
    const [year, setYear] = useState(0)
    const [discipline, setDiscipline] = useState("")

    const [fullName, setFullName] = useState("")
    const [participantQuestions, setParticipantQuestions] = useState([])
    const [participantAnswers, setParticipantAnswers] = useState([])
    const [participantCorrects, setParticipantCorrects] = useState([])
    const [questionImages, setQuestionImages] = useState([])
    const [chosenOptionImages, setChosenOptionImages] = useState([])
    const [correctOptionImages, setCorrectOptionImages] = useState([])
    const [lengthsQuestions, setLengthsQuestions] = useState([])
    const [lengthsChosens, setLengthsChosens] = useState([])
    const [lengthsCorrects, setLengthsCorrects] = useState([])

    const Export2Word = () => {
      let filename = specialty+"_"+year+"курс_"+fullName
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
  
        useEffect(() => {
            const fetchData = async () => {
              try {
                const response = await axios.get('http://localhost:8000/api/v1/test-results-details/',{
                    params: {
                        room_code: room_code,
                        participant_id: participant_id,
                    }
                });
                const obje = JSON.parse(response.data)
                setFullName(obje.full_name)
                setParticipantQuestions(obje['participant_questions'])
                setQuestionImages(obje.question_images)
                setParticipantAnswers(obje['participant_answers'])
                setChosenOptionImages(obje.chosen_option_images)
                setParticipantCorrects(obje['participant_corrects'])
                setCorrectOptionImages(obje.correct_option_images)
                setLengthsQuestions(obje.lengthsQuestions)
                setLengthsChosens(obje.lengthsChosens)
                setLengthsCorrects(obje.lengthsCorrects)
                
              } catch (error) {
                console.log("katego")
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
         const handleDelete = async () => {
            navigate('/teacher-page')
        
          }
    const nodeRef = useRef(null);
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
        <div className="section" id = "exportContent">
          <div style={{width: windowSize.width, height: "auto"}} ref={nodeRef}>
          <h2 className="m2">Результаты теста</h2>
          <h3 className="m3"><span>Факультет: </span>{faculty}</h3>
          <h3 className="m3"><span>Специальность: </span>{specialty} | <span>Курс: </span>{year}</h3>
          <h3 className="m3"><span>Дисциплина: </span>{discipline}</h3>


          <div className="table-wrapper">
              <table style={{margin: "0 auto", width: "60vw", overflow: "scroll", whiteSpace: "normal"}} className="fl-table">
                  <thead>
                  <tr style = {{border: "1px solid black"}}>
                      <th>Ф. И. О.</th>
                      <th>Вопросы</th>
                      <th>Выбранный вариант</th>

                      <th>Правильный вариант</th>

                  </tr>
                  </thead>
                  <tbody style = {{border: "1px solid black"}}>
                  <tr style = {{border: "1px solid black"}}>
                    <td style = {{border: "1px solid black"}} rowSpan={maxQuestions}>{fullName}</td>
                    <td style = {{border: "1px solid black"}}>
                      <div style={{display: "Block"}}>
                      {(() => {
                            let p = [];
                            if(lengthsQuestions[0]===0){
                                p.push(<p >{participantQuestions[0]}</p>);
                            }
                            else{
                                let indices = getIndicesOf("IMAGE", String(participantQuestions[0]))
                                let ques_text = String(participantQuestions[0])
                                let ind = 0
                                for(let l = 0; l<indices.length; l++){
                                    p.push(<p key = {l}>{ques_text.substring(ind,indices[l])} <br/><img src={questionImages[0][l]} alt ="" /></p>)
                                    ind = indices[l] + 5
                                }
                                p.push(<p>{ques_text.substring(ind)}</p>)
                            }
                            return p;
                        })()}
                        </div>
                    </td>
                    <td style = {{border: "1px solid black",backgroundColor: (participantAnswers[0]===participantCorrects[0]) ? "#adffaf" : "#ff9999"} }>
                      <div style={{display: "Block"}}>
                      {(() => {
                            let p = [];
                            if(lengthsChosens[0]===0){
                                p.push(<p >{participantAnswers[0]}</p>);
                            }
                            else{
                                let indices = getIndicesOf("IMAGE", String(participantAnswers[0]))
                                let ques_text = String(participantAnswers[0])
                                let ind = 0
                                for(let l = 0; l<indices.length; l++){
                                    p.push(<p key = {l}>{ques_text.substring(ind,indices[l])} <br/><img src={chosenOptionImages[0][l]} alt ="" /></p>)
                                    ind = indices[l] + 5
                                }
                                p.push(<p>{ques_text.substring(ind)}</p>)
                            }
                            return p;
                        })()}
                      
                        </div>
                      </td>
                    <td style = {{border: "1px solid black",backgroundColor: (participantAnswers[0]===participantCorrects[0]) ? "#adffaf" : "#ff9999"}}>
                      <div style={{display: "Block"}}>
                      {(() => {
                            let p = [];
                            if(lengthsCorrects[0]===0){
                                p.push(<p >{participantCorrects[0]}</p>);
                            }
                            else{
                                let indices = getIndicesOf("IMAGE", String(participantCorrects[0]))
                                let ques_text = String(participantCorrects[0])
                                let ind = 0
                                for(let l = 0; l<indices.length; l++){
                                    p.push(<p key = {l}>{ques_text.substring(ind,indices[l])} <br/><img src={correctOptionImages[0][l]} alt ="" /></p>)
                                    ind = indices[l] + 5
                                }
                                p.push(<p>{ques_text.substring(ind)}</p>)
                            }
                            return p;
                        })()}

                        </div>
                      </td>


                  </tr>
                  {(() => {
                  let tr = [];
        
                  for (let i = 1; i < maxQuestions; i++) {
                      tr.push(
                      <tr key={i} style = {{border: "1px solid black"}}>
                        <td style = {{border: "1px solid black"}}>
                          <div style={{display: "Block"}}>
                          {(() => {
                            let p = [];
                            if(lengthsQuestions[i]===0){
                                p.push(<p >{participantQuestions[i]}</p>);
                            }
                            else{
                                let indices = getIndicesOf("IMAGE", String(participantQuestions[i]))
                                let ques_text = String(participantQuestions[i])
                                let ind = 0
                                for(let l = 0; l<indices.length; l++){
                                    p.push(<p key = {l}>{ques_text.substring(ind,indices[l])} <br/><img src={questionImages[i][l]} alt ="" /></p>)
                                    ind = indices[l] + 5
                                }
                                p.push(<p>{ques_text.substring(ind)}</p>)
                            }
                            return p;
                        })()}

                     
                        </div>
                          </td>
                        <td style = {{border: "1px solid black",backgroundColor: (participantAnswers[i]===participantCorrects[i]) ? "#adffaf" : "#ff9999"}}>
                        <div style={{display: "Block"}}>
                        {(() => {
                            let p = [];
                            if(lengthsChosens[i]===0){
                                p.push(<p >{participantAnswers[i]}</p>);
                            }
                            else{
                                let indices = getIndicesOf("IMAGE", String(participantAnswers[i]))
                                let ques_text = String(participantAnswers[i])
                                let ind = 0
                                for(let l = 0; l<indices.length; l++){
                                    p.push(<p key = {l}>{ques_text.substring(ind,indices[l])} <br/><img src={chosenOptionImages[i][l]} alt ="" /></p>)
                                    ind = indices[l] + 5
                                }
                                p.push(<p>{ques_text.substring(ind)}</p>)
                            }
                            return p;
                        })()}

                     
                        </div>
                          </td>
                        <td style = {{border: "1px solid black",backgroundColor: (participantAnswers[i]===participantCorrects[i]) ? "#adffaf" : "#ff9999"}}>
                          <div style={{display: "Block"}}>
                          {(() => {
                            let p = [];
                            if(lengthsCorrects[i]===0){
                                p.push(<p >{participantCorrects[i]}</p>);
                            }
                            else{
                                let indices = getIndicesOf("IMAGE", String(participantCorrects[i]))
                                let ques_text = String(participantCorrects[i])
                                let ind = 0
                                for(let l = 0; l<indices.length; l++){
                                    p.push(<p key = {l}>{ques_text.substring(ind,indices[l])} <br/><img src={correctOptionImages[i][l]} alt ="" /></p>)
                                    ind = indices[l] + 5
                                }
                                p.push(<p>{ques_text.substring(ind)}</p>)
                            }
                            return p;
                        })()}


                        </div>
                        </td>
                      </tr>);
                  }
                  return tr;
              })()}
                </tbody>

                  

              </table>
              <div id = "buttons" style={{display: "flex", justifyContent: "space-between", margin: "20px 0 0 0"}}>
            <button className="resbut"  onClick={handleDelete}>Выйти</button>
            <button className="resbut"  onClick={Export2Word}>Скачать отчет</button>

          </div>
          </div>
          </div>

        </div>


				

	)
}