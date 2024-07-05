import React, { useState, useEffect } from "react";
import LP from "../../images/Frame.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthorizationTeacher = () =>{
	const user = JSON.parse(localStorage.getItem('user'))
	const jwt_access = localStorage.getItem('access')
	useEffect(() => {
		if((jwt_access !== null) && user){
			navigate('/teacher-page')
		}
		// eslint-disable-next-line
	}, [])
	const [logindata, setLoginData] = useState({
		login: "",
		password: ""
	})
	const [error, setError] = useState("")
	const navigate = useNavigate()
	const handleOnChange = (e) => {
		setLoginData({...logindata, [e.target.name]:e.target.value})
	}
	const handleSubmit = async (e) => {
		e.preventDefault()
		const {login, password}=logindata
		if(!login || !password){
			setError("Заполните все поля")
		}
		else{
			try {
				const res = await axios.post("http://localhost:8000/api/v1/login/", logindata)
				const response = res.data
				const user = {
					"login": response.login,
					"first_name": response.first_name,
					"last_name": response.last_name,
				}
				localStorage.setItem("user", JSON.stringify(user))
				localStorage.setItem("access", JSON.stringify(response.access_token))
				localStorage.setItem("refresh", JSON.stringify(response.refresh_token))
				navigate("/teacher-page")
			}
			catch(error){
				setError(error.response.data['detail'])
			}
		}
	}
	return(
		<div className="assection">
			<div className="asfirst-block">
				<h1 className="topic">Добро пожаловать в <br/><span style={{color: "#4461F2"}}>Uni</span>Test</h1>
				<p className="phar">Наш сайт предлагает студентам удобную платформу для прохождения тестов по<br/> различным дисциплинам. Современный дизайн, интуитивно понятный интерфейс и <br /> широкий выбор заданий делают наше обучение эффективным и увлекательным</p>
				<img className="asfoto" src={LP} alt="Простой фото" />
			</div>
			<div className="assecond-block">
				<p className="role">Выберите роль</p>
				<p className="chosenRole">Выбран роль : <span style = {{fontWeight: "700", fontSize: "17px", color: "#4461F2"}}>Преподaвателя</span></p>

				<div style={{display: "flex"}}>
					<p className="button-deactive"><a className="as" href="/authorization-teacher">Преподaватель</a></p>
					<p className="button-active"><a className="at" href="/authorization-student">Студент</a></p>
				</div>
				<form action="#" onSubmit = {handleSubmit}>
							<input className="ti" name = "login" value = {logindata.login} onChange={handleOnChange} type="text" placeholder="Логин"/>
							<input className="ti" name = "password" value = {logindata.password} onChange={handleOnChange} type="password" placeholder="Пароль"/>
							<p style={{ marginTop: "10px", textAlign: "center", color: "red"}}>{error?error: ""}</p>
							<button className="fb" type="submit" >Войти</button>   
				</form>
			</div>
		</div>
	)
}