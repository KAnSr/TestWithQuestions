"use strict";


//Выведем информацию о пользователе, если она записана в localStorage
var userAuthentificationData = localStorage.getItem('userAuthentificationData');
userAuthentificationData = userAuthentificationData ? JSON.parse(userAuthentificationData) : {eMail: ''};

if (userAuthentificationData.eMail !== '') {
	userAuthentificationData.startTime = new Date(userAuthentificationData.startTime);

	let userDetailsElem = document.createElement('p');
	userDetailsElem.innerHTML = 'Опрашиваемый: ' +
		userAuthentificationData.firstName + ' ' +
		userAuthentificationData.lastName;
	document.querySelector('body').insertBefore(userDetailsElem, document.querySelector('.flexContainer'));

	userDetailsElem = document.createElement('p');
	userDetailsElem.innerHTML = 'Начало тестирования: ' +
		('00' + userAuthentificationData.startTime.getDate()).slice(-2) + '.' +
		('00' + userAuthentificationData.startTime.getMonth()).slice(-2) + '.' +
		('0000' + userAuthentificationData.startTime.getFullYear()).slice(-4) + ' ' +
		('00' + userAuthentificationData.startTime.getHours()).slice(-2) + ':' +
		('00' + userAuthentificationData.startTime.getMinutes()).slice(-2) + ':' +
		('00' + userAuthentificationData.startTime.getSeconds()).slice(-2);
	document.querySelector('body').insertBefore(userDetailsElem, document.querySelector('.flexContainer'));
}

if (questionList.answerValues.eMail !== userAuthentificationData.eMail)
	questionList.answerValues = {eMail: userAuthentificationData.eMail};



//В drawQuestions у нас будет статусы и методы перерисовки списка вопросов
var drawQuestions = {};

drawQuestions.statusEnum = {static: 'Static', slideOld: 'Slide Old', slideNew: 'Slide New', shudder: 'Shudder'}; //Наши вопросы могут находиться в одном из 3-х состояний
drawQuestions.status = drawQuestions.statusEnum.static;
drawQuestions.directionsEnum = {initialize: 'Initialize', forward: 'Forward', backward: 'Backward', none: 'None'};
drawQuestions.direction = drawQuestions.directionsEnum.initialize;


drawQuestions.changeQuestion = function() {
	let prevQIndex = questionList.qIndex;

	switch (drawQuestions.direction) {
		case drawQuestions.directionsEnum.backward:
			questionList.qIndex--;
			break;
		case drawQuestions.directionsEnum.forward:
			questionList.qIndex++;
	}

	questionList.qIndex = Math.max(questionList.qIndex, 0);
	questionList.qIndex = Math.min(questionList.qIndex, questionList.length - 1);

	if (drawQuestions.direction === drawQuestions.directionsEnum.initialize)
		drawQuestions.slideNew();
	else if (prevQIndex === questionList.qIndex)
		drawQuestions.shudder();
	else
		drawQuestions.slideOld();
}


drawQuestions.redraw = function() {
	document.getElementById('question').children[0].textContent = 'Вопрос (' + (questionList.qIndex + 1) + ' из ' + questionList.length + '): ' + questionList[questionList.qIndex].question;

	 //Чистим содержимое таблицы от старого списка ответов
	while (questionTBody.firstChild) {
		questionTBody.removeChild(questionTBody.firstChild);
	}

	//Прочитаем ранее уже выбранный пользователем вариант ответа
	let answerValue = questionList[questionList.qIndex].questionId in questionList.answerValues ? questionList.answerValues[questionList[questionList.qIndex].questionId] : undefined;

	 //Рисуем новый список ответов
	for (let i = 1; i <= questionList[questionList.qIndex].answersQuantity; i++) {
		let currentAnswer = answerTemplate.cloneNode(true);

		if (String(i) === answerValue)
			currentAnswer.children[0].children[0].checked = true;

		currentAnswer.children[0].children[0].value = i;
		currentAnswer.children[0].children[0].addEventListener('change', radioChange);
		currentAnswer.children[1].textContent = questionList[questionList.qIndex]['answer' + i];
		currentAnswer.id = 'answer' + i;
		currentAnswer.title = 'Вариант ответа №' + i + ' (' + i + ')';
		questionTBody.appendChild(currentAnswer);
	}
}


drawQuestions.slideOld = function(direction) {
	drawQuestions.status = drawQuestions.statusEnum.slideOld;
	
	let questionTable = document.getElementById('questionTable');
	void questionTable.offsetWidth;
	if (drawQuestions.direction === drawQuestions.directionsEnum.forward)
		questionTable.style.animationName = 'animationLeft';
	else if (drawQuestions.direction === drawQuestions.directionsEnum.backward)
		questionTable.style.animationName = 'animationRight';
	
	questionTable.style.animationDirection = 'reverse';
}


drawQuestions.slideNew = function() {
	drawQuestions.redraw();
	drawQuestions.status = drawQuestions.statusEnum.slideNew;

	let questionTable = document.getElementById('questionTable');
	void questionTable.offsetWidth;
	if (drawQuestions.direction === drawQuestions.directionsEnum.forward
		|| drawQuestions.direction === drawQuestions.directionsEnum.initialize)
		questionTable.style.animationName = 'animationRight';
	else if (drawQuestions.direction === drawQuestions.directionsEnum.backward)
		questionTable.style.animationName = 'animationLeft';
	
	questionTable.style.animationDirection = 'normal';
}


drawQuestions.shudder = function() {
	drawQuestions.status = drawQuestions.statusEnum.shudder;

	let questionTable = document.getElementById('questionTable');
	void questionTable.offsetWidth;
	if (drawQuestions.direction === drawQuestions.directionsEnum.forward)
		questionTable.style.animationName = 'shudderLeft';
	else if (drawQuestions.direction === drawQuestions.directionsEnum.backward)
		questionTable.style.animationName = 'shudderRight';
}





var answerTemplate = document.getElementById('answer');
var questionTBody = document.getElementById('questionTBody');


drawQuestions.changeQuestion();

document.getElementById('buttonBackward').addEventListener('click', buttonForwardBackward);
document.getElementById('buttonForward').addEventListener('click', buttonForwardBackward);
document.addEventListener('keyup', keyUpEvent);
document.getElementById('questionTable').addEventListener('animationend', animationEnd);


function animationEnd(event) {
	questionTable.style.animationName = '';
	if (drawQuestions.status === drawQuestions.statusEnum.slideOld) {
		drawQuestions.slideNew();
		return;
	}

	drawQuestions.status = drawQuestions.statusEnum.static;
	drawQuestions.direction = drawQuestions.directionsEnum.none;
}


function buttonForwardBackward(event) {
	event.preventDefault();
	if (drawQuestions.status !== drawQuestions.statusEnum.static) return;

	drawQuestions.direction = drawQuestions.directionsEnum[event.target.id.replace(new RegExp('button', 'i'), '').toLowerCase()];
	drawQuestions.changeQuestion();
}


function keyUpEvent(event) {
	if ((event.key.toLowerCase() === 'arrowleft' || event.key.toLowerCase() == 'arrowright')
		&& event.ctrlKey) {
		event.preventDefault();
		if (drawQuestions.status !== drawQuestions.statusEnum.static) return;
		
		switch (event.key.toLowerCase()) {
			case 'arrowleft':
				drawQuestions.direction = drawQuestions.directionsEnum.backward;
				break;
			case 'arrowright':
				drawQuestions.direction = drawQuestions.directionsEnum.forward;
				break;
			default:
				drawQuestions.direction = drawQuestions.directionsEnum.none;
		}

		drawQuestions.changeQuestion();
	}
	else if (Number(event.key) !== NaN
		&& Number(event.key) >= 1
		&& Number(event.key) <= questionList[questionList.qIndex].answersQuantity) {
		document.getElementById('answer' + event.key).children[0].children[0].checked = true;
		questionList.answerValues[questionList[questionList.qIndex].questionId] = event.key;
		questionList.storeAnswerValues();
	}
}


function radioChange(event) {
	questionList.answerValues[questionList[questionList.qIndex].questionId] = event.target.value;
	questionList.storeAnswerValues();
}


function goToUserAuthenticanion(event) {
	open('user_authentication.html', '_self');
}


function finishTest(event) {
	userAuthentificationData.finishTime = new Date();
	localStorage.setItem('userAuthentificationData', JSON.stringify(userAuthentificationData));
	open('results.html', '_self');
}