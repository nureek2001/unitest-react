import React, {useState, useEffect} from "react";
import PN from "../../images/pn3.png";
import Line from "../../images/Line3.png";

export const TestPageTeacher = () =>{
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

	return(
        <div style={{display: "flex",width: windowSize.width, height: windowSize.height}} className="section">
			<img style={{marginLeft: "50px",marginTop: "110px", width: "910px", height: "620px"}} src={PN} alt="Простой фото" />
			<div className="wr">
				<div className="wrb">
					<p>Комната теста</p>
					<img style={{marginLeft: "85px", paddingTop: "20px"}} src={Line} alt="Простой фото" />
				</div>
				<div className="sbr">
					<p>Идентификатор :</p>
					<p style={{marginLeft: "40px"}}>fghfghfhfghfh</p>
				</div>
				<div className="sbr">
					<p>Статус :</p>
					<p style={{marginLeft: "80px"}}>В ожидании <span>(9)</span></p>
				</div>
				<button className="wrt">Начать тест</button> 
				<button className="wrt2" >Отменить</button> 
			</div>
        </div>
	)
}