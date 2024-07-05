
import React, { useEffect, useState } from "react";
import IL from "../../images/Ilustration.png";

export const NotFound = () =>{

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
        <div style={{display: "flex" , width: windowSize.width, height: windowSize.height}} className="section">
			<div style={{marginTop: "28vh", marginLeft: "10vw",width: "400px", height: "320px"}}>
				<h2 className="nfh2">Упс .... </h2>
				<h3 className="nfh3">Страница не найдена</h3>
				<p className="nfp">Эта страница не существует или была удалена! <br /> Мы предлагаем вам вернуться домой.</p>
				<button className="nfb">На главную страницу</button>
			</div>
			<img style={{marginLeft: "5vw",marginTop: "12vh", width: "810px", height: "520px"}} src={IL} alt="Простой фото" />
        </div>
	)
}