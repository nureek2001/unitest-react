import React, { useEffect, useState } from "react";
import LP from "../../images/Frame.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export const AuthorizationStudent = () =>{
	const navigate = useNavigate()
	const [formdata, setFormData] = useState({
		room: "",
		full_name: ""
	})
	const [error, setError] = useState("")
	const handleOnChange = (e) => {
		setFormData({...formdata, [e.target.name]:e.target.value})
	}
	const handleSubmit = async (e) => {
		e.preventDefault()
		const {room, full_name}=formdata
		if(!room || !full_name){
			setError("Заполните все поля")
		}
		else{
			try {
				const res = await axios.post("http://localhost:8000/api/v1/join-to-room/", formdata)
				if (res.status === 201){
					const participant = {
						"full_name": formdata.full_name
					}

					localStorage.setItem("participant", JSON.stringify(participant))
					localStorage.setItem("room_code", JSON.stringify(formdata.room))
					navigate(`/waiting-room-student/${room}`)
				}
			}
			catch(error){
				localStorage.clear()

				setError(error.response.data['non_field_errors'])
			}
		}
	}
	return(
		<div className="assection" >
			<div className="asfirst-block">
				<h1 className="topic">Добро пожаловать в <br/><span style={{color: "#4461F2"}}>Uni</span>Test</h1>
				<p className="phar">Наш сайт предлагает студентам удобную платформу для прохождения тестов по<br/> различным дисциплинам. Современный дизайн, интуитивно понятный интерфейс и <br /> широкий выбор заданий делают наше обучение эффективным и увлекательным</p>
				<img className="asfoto" src={LP} alt="Простой фото" />
			</div>
			<div className="assecond-block">
				<p className="role">Выберите роль</p>
				<p className="chosenRole">Выбран роль : <span style = {{fontWeight: "700", fontSize: "17px", color: "#4461F2"}}>Студента</span></p>
				<div style={{display: "flex"}}>
					<p className="button-active"><a className="at" href="/authorization-teacher">Преподaватель</a></p>
					<p className="button-deactive"><a className="as" href="/authorization-student">Студент</a></p>
				</div>
				<form action="#" onSubmit = {handleSubmit}>
					<input name = "full_name" value = {formdata.full_name} onChange={handleOnChange} className="ti" type="text" placeholder="Ф. И. О."/>
					<input maxLength={4} name = "room" value = {formdata.room} onChange={handleOnChange} className="ti" type="text" placeholder="Код комнаты..."/>
					<p style={{marginTop: "10px",textAlign: "center", color: "red"}}>{error?error: ""}</p>
					<button className="fb" type="submit" >Войти</button>   
				</form>
			</div>
		</div>
	)
}