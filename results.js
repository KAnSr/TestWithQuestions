"use strict";




//Выведем информацию о пользователе, если она записана в localStorage

var userDataTemplate = document.getElementById('userDataTemplate');
var userDataParentNode = userDataTemplate.parentNode;
userDataParentNode.removeChild(userDataTemplate);
userDataTemplate.removeAttribute('id');

var userAuthentificationData = localStorage.getItem('userAuthentificationData');
userAuthentificationData = userAuthentificationData ? JSON.parse(userAuthentificationData) : {eMail: ''};
if (userAuthentificationData.eMail !== '') {

	let newElem = userDataTemplate.cloneNode(true);
	newElem.innerHTML = 'Опрашиваемый: ' +
		userAuthentificationData.firstName + ' ' +
		userAuthentificationData.lastName;
	userDataParentNode.appendChild(newElem);

	newElem = userDataTemplate.cloneNode(true);
	newElem.innerHTML = 'E-mail: ' +
		userAuthentificationData.eMail;
	userDataParentNode.appendChild(newElem);

	newElem = userDataTemplate.cloneNode(true);
	userAuthentificationData.startTime = new Date(userAuthentificationData.startTime);
	userAuthentificationData.startTime = new Date(userAuthentificationData.startTime - userAuthentificationData.startTime.getMilliseconds());
	newElem.innerHTML = 'Начало тестирования: ' +
		('00' + userAuthentificationData.startTime.getDate()).slice(-2) + '.' +
		('00' + userAuthentificationData.startTime.getMonth()).slice(-2) + '.' +
		('0000' + userAuthentificationData.startTime.getFullYear()).slice(-4) + ' ' +
		('00' + userAuthentificationData.startTime.getHours()).slice(-2) + ':' +
		('00' + userAuthentificationData.startTime.getMinutes()).slice(-2) + ':' +
		('00' + userAuthentificationData.startTime.getSeconds()).slice(-2);
	userDataParentNode.appendChild(newElem);

	newElem = userDataTemplate.cloneNode(true);
	newElem.innerHTML = 'Окончание тестирования: ';
	if (userAuthentificationData.finishTime) {
		userAuthentificationData.finishTime = new Date(userAuthentificationData.finishTime);
		userAuthentificationData.finishTime = new Date(userAuthentificationData.finishTime - userAuthentificationData.finishTime.getMilliseconds());
		newElem.innerHTML = newElem.innerHTML +
			('00' + userAuthentificationData.finishTime.getDate()).slice(-2) + '.' +
			('00' + userAuthentificationData.finishTime.getMonth()).slice(-2) + '.' +
			('0000' + userAuthentificationData.finishTime.getFullYear()).slice(-4) + ' ' +
			('00' + userAuthentificationData.finishTime.getHours()).slice(-2) + ':' +
			('00' + userAuthentificationData.finishTime.getMinutes()).slice(-2) + ':' +
			('00' + userAuthentificationData.finishTime.getSeconds()).slice(-2);
	}
	else
		newElem.innerHTML = newElem.innerHTML + '———';
	userDataParentNode.appendChild(newElem);

	newElem = userDataTemplate.cloneNode(true);
	newElem.innerHTML = 'Затраченное время: ';
	if (userAuthentificationData.finishTime) {
		let totalTime = new Date(userAuthentificationData.finishTime - userAuthentificationData.startTime);	
		newElem.innerHTML = newElem.innerHTML +
			('00' + userAuthentificationData.finishTime.getUTCHours()).slice(-2) + ':' +
			('00' + userAuthentificationData.finishTime.getUTCMinutes()).slice(-2) + ':' +
			('00' + userAuthentificationData.finishTime.getUTCSeconds()).slice(-2);
	}
	else
		newElem.innerHTML = newElem.innerHTML + '———';
	userDataParentNode.appendChild(newElem);
}




//Выведем информацию результаты ответов на вопросы

var questionTemplate = document.getElementById('questionTemplate');
var anwserTemplate = document.getElementById('anwserTemplate');
var questionParentNode = questionTemplate.parentNode;
questionParentNode.removeChild(questionTemplate);
questionParentNode.removeChild(anwserTemplate);
questionTemplate.removeAttribute('id');
anwserTemplate.removeAttribute('id');


for (let qIndex = 0; qIndex < questionList.length; qIndex++) {
	let newElem = questionTemplate.cloneNode(true);
	newElem.innerHTML = '' + (qIndex + 1) + '. ' + questionList[qIndex].question;
	questionParentNode.appendChild(newElem);

	let userAnswerIsCorrect = false;
	if (questionList[qIndex].questionId in questionList.answerValues
		&& questionList.answerValues.eMail === userAuthentificationData.eMail) {
		newElem = anwserTemplate.cloneNode(true);
		let userAnswerNo = questionList.answerValues[questionList[qIndex].questionId];
		newElem.innerHTML = 'Ответ пользователя: «' + questionList[qIndex]['answer' + userAnswerNo] + '»';
		userAnswerIsCorrect = String(userAnswerNo) === String(questionList[qIndex].correctAnswer);
		newElem.classList.add(userAnswerIsCorrect ? 'correctAnswer' : 'wrongAnswer');
		questionParentNode.appendChild(newElem);
	}

	newElem = anwserTemplate.cloneNode(true);
	newElem.innerHTML = 'Правильный ответ: «' + questionList[qIndex]['answer' + questionList[qIndex].correctAnswer] + '»';
	newElem.classList.add(userAnswerIsCorrect ? 'correctAnswer' : 'wrongAnswer');
	questionParentNode.appendChild(newElem);
}