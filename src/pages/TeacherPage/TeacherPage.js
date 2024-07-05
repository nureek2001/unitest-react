import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import TR from "../../images/teacheroom.png";
import TPLine from "../../images/tpline.png";
import axios from "axios";
export const TeacherPage = () =>{
	const [faculties, setFaculties] = useState([])
	const [specialties, setSpecialties] = useState([])
	const [error, setError] = useState("")
	const navigate = useNavigate()
	const user = JSON.parse(localStorage.getItem('user'))
	const jwt_access = localStorage.getItem('access')
	const [selectedFaculty, setSelectedFaculty] = useState("")
	useEffect(() => {
		if((jwt_access === null) && !user){
			navigate('/authorization-teacher')
		}
		// eslint-disable-next-line
	}, [])
	const full_name = user? (user['first_name'] + " " + user['last_name']) : ""
	const formData = new FormData();
	useEffect(() => {
		const fetchData = async () => {
		  	try {
				const response = await axios.get('http://localhost:8000/api/v1/get-faculties/');
				setFaculties(response.data);
		  	} catch (error) {
				console.error(error)
		  	}
		};
		fetchData();
	}, []);
	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		formData.append(event.target.name, file)
		formData.append('teacher_login', user['login'])
		formData.append('faculty', selectedFaculty)
	}
	const refresh=JSON.parse(localStorage.getItem('refresh'))
	const handleOnChangeFaculty = async (e) => {
		setSelectedFaculty(e.target.value)
		try {
			const facultyObject = faculties.find(faculty=>faculty.faculty_name === e.target.value)
			const response = await axios.get(`http://localhost:8000/api/v1/get-specialties/${facultyObject.id}/`);
			setSpecialties(response.data);
		} catch (error) {
			console.error(error)
		}
	}
	const handleOnChange = async (e) => {
		formData.append(e.target.name, e.target.value)
	}
	const handleLogout = async () => {
		const res = await axios.post("http://localhost:8000/api/v1/logout/", {"refresh_token":refresh })
		if (res.status === 200){
			localStorage.removeItem('access')
			localStorage.removeItem('refresh')
			localStorage.removeItem('user')
			navigate('/authorization-teacher')
		}
	}
	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const res = await axios.post("http://localhost:8000/api/v1/create-room/", formData)
			if (res.status === 201){
				localStorage.removeItem("specialty")
				localStorage.removeItem("year")
				localStorage.removeItem("minutes")
				localStorage.removeItem("question_num")
				localStorage.removeItem('discipline')

				localStorage.setItem("specialty", formData.get("specialty"))
				localStorage.setItem("year", formData.get("year"))
				localStorage.setItem("minutes", formData.get("minutes"))
				localStorage.setItem("question_num", formData.get("question_num"))
				localStorage.setItem('discipline', formData.get("discipline"))
				navigate("/waiting-room-teacher")
			}
			else{
				alert(res.data)
			}
		}
		catch(error){
			console.log(error)
			setError(error.response.data)
		}
	}
	return(
        <div  className="tpsection section">
			<img className="tpimg" src={TR} alt="Простой фото" />
			<div className="tp" style={{marginTop: "5vh", padding: "5px 0 0 0"}}>
				<h1><span>Uni</span>Test</h1>
				<h2>Добро пожаловать,</h2>
				<h3 style={{marginTop: "10px"}}>{full_name}</h3>
				<button className="tpb" onClick={()=>navigate('/history-page')} >История тестирований</button>

				<button className="tpb" onClick={handleLogout} >Выйти</button>
				<img style={{width: "90%", marginLeft: "5%", marginTop: "20px", marginBottom: "10px"}} src={TPLine} alt="Простой фото" />
				<form onSubmit = {handleSubmit} className="demo">
					<select defaultValue={'DEFAULT'} name = "faculty" onChange={handleOnChangeFaculty}>
						<option value="DEFAULT" disabled>Выберите факультет..</option>
						{faculties.map((faculty, i) => (
							<option key={i}>{faculty.faculty_name}</option>
						))}
					</select>
					<select defaultValue={'DEFAULT'} name = "specialty" onChange={handleOnChange} style = {{marginTop: "10px"}}>
						<option value="DEFAULT" disabled>Выберите специальность..</option>
						{specialties && specialties.map((specialty, i) => (
							<option key={i}>{specialty.specialty_name}</option>
						))}
					</select>
					<input className="tpinput" name = "year" onChange={handleOnChange} type="number" min="1" max="4" placeholder="Курс"/>
					<input className="tpinput" name = "minutes" onChange={handleOnChange} type="number" min="0" max="50" placeholder="Длительность (мин)"/>
					<input className="tpinput" name = "question_num" onChange={handleOnChange} type="number" min = "0" max = "50" placeholder="Кол-во вопросов"/>
					<input className="tpinput" name = "max_point" onChange={handleOnChange} type="number" min="0" max="100" placeholder="Макс. балл"/>
					
					<input className="tpinput" name = "discipline" onChange={handleOnChange} type="text" placeholder="Название дисциплины"/>
					<label className="input-file">
						<input type="file" name="test_file" accept=".docx" onChange={handleFileUpload} />		
						<span>Выберите файл</span>
					</label>
					<button className="tpb" type="submit">Создать комнату</button>
					<p>{error?error: ""}</p>
				</form>
			</div>
        </div>
	)
}