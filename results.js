"use strict";

var userDataTemplate = document.getElementById('userDataTemplate');
//document.querySelector('header div')

//Выведем информацию о пользователе, если она записана в localStorage
var userAuthentificationData = localStorage.getItem('userAuthentificationData');
userAuthentificationData = userAuthentificationData ? JSON.parse(userAuthentificationData) : {eMail: ''};
if (userAuthentificationData.eMail !== '') {
	/*
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
	*/
}
