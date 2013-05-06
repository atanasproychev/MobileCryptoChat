function onLoad() {
    document.addEventListener("deviceready",
            function()
            {
                $.mobile.changePage($("#start"), { transition: "fade" });
                $("#orangeBackground").fadeOut(1400, function()
                									{
                										$("#blueBackground").fadeOut(2400);
                									});
                getPhoneGapVariables();
                getMSISDN();
                $.mobile.changePage($("#login"), { transition: "fade" });
                document.addEventListener("backbutton", 
                					function()
                					{
                						if($("#login").length > 0 || $("#register").length > 0)
                							navigator.app.exitApp();
                						else
                							navigator.app.backHistory();
                					},
                false);
                document.addEventListener("menubutton",
                					function()
                					{
                						
                					},
                false);
            },
    false);
}

function getMSISDN()
{
	if(localStorage.msisdn != null)
	{
		$("#MSISDN-login2").hide();
		$("#MSISDN-register2").hide();
		msisdn = localStorage.msisdn;
		$("#MSISDN-login").val(msisdn);
		$("#MSISDN-register").val(msisdn);
		var password = getCookie("pass");
		if(password != null)
			login(false, password);
	}
	else
	{
		$("#MSISDN-login").hide();
		$("#MSISDN-register").hide();
	}
	getSettings();
}

function getMSISDNIfNull()
{
	var numPattern = /^\+[1-9][0-9]{2,20}$/;
	var number = $("#MSISDN-register2").val();
	var match;
	var countryCode;
	if(!number)
		number = $("#MSISDN-login2").val();
	if(!number)
	{
		customAlert("Празно поле", "Моля, попълнете всички полета преди да продължите.");
		return false;
	}
	match = number.match(numPattern);
	if(match)
	{
		msisdn = match.toString();
		localStorage.msisdn = msisdn;
		$("#MSISDN-login").val(msisdn);
		$("#MSISDN-register").val(msisdn);
		$("#MSISDN-login2").hide();
		$("#MSISDN-register2").hide();
		$("#MSISDN-login").show();
		$("#MSISDN-register").show();
		return true;
	}
	else
	{
		customAlert("Неправилен формат", "Моля, попълнете всички полета в дадения формат.");
		return false;
	}
}

function setCookie(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value + "; path=/";
}

function getCookie(c_name)
{
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name)
		{
			return unescape(y);
		}
	}
}

function setSettings()
{
	if($("#getMesInterval").val() > 0)
		localStorage.mesInterval = $("#getMesInterval").val() * 1000;
	if(localStorage.language != $("#language").val())
		localStorage.language = $("#language").val();
	if(localStorage.wi_fi != $("#wi-fi").val())
		localStorage.wi_fi = $("#wi-fi").val();
	if(localStorage.wi_fi_map != $("#wi-fi-map").val())
		localStorage.wi_fi_map = $("#wi-fi-map").val();
	if(localStorage.countryCode == null || localStorage.countryCode != $("#countryCode").val())
	{
        var countryCode = $("#countryCode").val();
        if(countryCode.match(/^\+[1-9]{1,4}$/))
        {
            localStorage.countryCode = countryCode;
            addCountryCodeToPhones();
        }
        else
            $.mobile.changePage($("#settings"), { transition: "fade" });
	}
}

function getSettings()
{
	if(localStorage.mesInterval == null)
		localStorage.mesInterval = 1000;
	if(localStorage.language == null)
		localStorage.language = "Български";
	if(localStorage.wi_fi == null)
		localStorage.wi_fi = "Не";
	if(localStorage.wi_fi_map == null)
		localStorage.wi_fi_map = "Не";
	if(localStorage.countryCode == null)
	    customAlert("Въведете код", "Моля, въведете международен телефонен код от меню настройки.");
	$("#getMesInterval").val(localStorage.mesInterval / 1000);
	$("#language").val(localStorage.language);
	$("#wi-fi").val(localStorage.wi_fi);
	$("#wi-fi-map").val(localStorage.wi_fi_map);
	$("#countryCode").val(localStorage.countryCode);
}

function errorHandler(err)
{
	var error = JSON.parse(err.responseText);
	var message, header;
	switch(error.errorCode)
	{
		case "ERR_DUPLICATE":
			message = "Повтарящ се номер!";
			break;
		case "ERR_USR_NAME":
			message = "Некоректен номер!";
			break;
		case "ERR_GENERAL":
			message = "Грешка!";
			break;
		case "ERR_INV_LOGIN":
			message = "Некоректно име или парола!";
			break;
		case "ERR_SESSIONID":
			$.mobile.changePage($("#login"), { transition: "slide", reverse: "true" });
			break;
		case "ERR_USER_OFF":
			message = "Търсеният потребител е извън линия!";
			break;
		case "ERR_AUTO_CHAT":
			message = "Не можете да си чатите със себе си!";
			break;
		case "ERR_BAD_CHAL":
			message = "Невалиден таен код!";
			break;
		case "ERR_BAD_RESP":
			message = "Невалиден таен код!";
			break;
		case "ERR_INVALID_STATE":
			message = "Грешен таен код!";
			break;
		case "ERR_BAD_MSG":
			message = "Некоректно кодиране на съобщението!";
			break;
	}
	customAlert("Грешка", message);
}

function customAlert(header, message)
{
	$("#alertHeader").html(header);
	$("#alertContent").html(message);
	$.mobile.changePage($("#alert"), { transition: "fade" });
}

function customPrompt(header, message, type)
{
	$("#promptHeader").html(header);
	$("#promptContent").html(message);
	$.mobile.changePage($("#prompt"), { transition: "fade" });
	$("#confirm").on("click", confirmPrompt(event));
}

function confirmPrompt(event)
{
	var tempSecret = $("#promptInput").val();
	if(tempSecret == "")
	{
		customAlert("Парола", "Моля, попълнете парола.");
		tempSecret = null;
		return;
	}
	$.mobile.changePage($("#listFriends"), { transition: "fade" });
}

function haveConnection()
{
	if(getTypeOfConnection() == Connection.NONE)
	{
		customAlert("Грешка", "Няма достъп до интернет.");
		return false;
	}
	return true;
}

function addCountryCodeToPhones()
{
    var code = localStorage.countryCode;
    if(code == null)
        return;
    console.log(code + "\nContacts: " + contacts.length);
    for(var i = 1; i < contacts.length; i++)
    {
        for(var j = 0; j < contacts[i].phoneNumbers.length; j++)
        {
            console.log(contacts[i].phoneNumbers[j] + "\n");
            if(contacts[i].phoneNumbers[j].match(/^0/) && !contacts[i].phoneNumbers[j].match(/^00/))
            {
                contacts[i].phoneNumbers[j] = code + contacts[i].phoneNumbers[j].substr(1);
            }
            if(contacts[i].phoneNumbers[j].match(/^00/))
                contacts[i].phoneNumbers[j] = "+" + contacts[i].phoneNumbers[j].substr(2);
            console.log(contacts[i].phoneNumbers[j] + "\n");
        }
    }
}

function login(register, pass)
{
	//console.log(msisdn);
	var process = register == true ? "register" : "login";
	//console.log(process);
	if(msisdn == null)
		if(getMSISDNIfNull() == false)
			return;
	if(pass == null)
	{
		pass = $("#Password-" + process).val();
		if(pass == "")
		{
			customAlert("Парола", "Моля, попълнете парола.");
			return;
		}
		if(process == "register")
		{
			if($("#rememberMeReg").prop("checked"))
				setCookie("pass", pass, 30);
		}
		else if($("#rememberMeLog").prop("checked"))
				setCookie("pass", pass, 30);
	}
	if(!haveConnection())
		return;
	$.ajax({
	  url: service_url + "/" + process,
	  type: "POST",
	  timeout: 5000,
	  contentType: "application/json",
	  data: JSON.stringify({ msisdn : msisdn, authCode : Sha1.hash(msisdn + pass) }),
	  success:
	        function (session)
		    {
				sessionId = session.sessionID;
				getmes = setInterval(function(){getMessage();}, localStorage.mesInterval);
				$.mobile.changePage($("#listFriends"), { transition: "slide" });
				getList();
			},
	  error:
			function (err)
			{
				errorHandler(err);
			}
	});
}

function logout()
{
	if(chatStatus == "Active")
	{
		preCancelChat();
	}
	$.ajax({
	  url: service_url + "/logout/" + sessionId,
	  type: "GET",
	  timeout: 5000,
	  contentType: "application/json",
	  success:
			function()
			{
				sessionId = null;
				recipientMSISDN = null;
				chatSecret = null;
			},
	  error:
			function(err)
			{
				errorHandler(err);
			}
	});
	clearInterval(getmes);
	$.mobile.changePage($("#login"), { transition: "slide", reverse: "true" });
}

function getMessage()
{
	if(!haveConnection())
	{
		logout();
		return;
	}
	$.ajax({
	  url: service_url + "/get-next-message/" + sessionId,
	  type: "GET",
	  timeout: 1000,
	  contentType: "application/json",
	  success:
			function(data)
			{
				var message = data;
				//console.log(data.msgType);
				if(message.msgType == "MSG_USER_ONLINE")
					addToList(message.msisdn);
				else if(message.msgType == "MSG_USER_OFFLINE")
					removeFromList(message.msisdn);
				else if(message.msgType == "MSG_CHALLENGE")
					response(message.msisdn, message.msgText);
				else if(message.msgType == "MSG_RESPONSE")
					responseChallenge(message.msisdn, message.msgText);
				else if(message.msgType == "MSG_CHAT_MESSAGE")
					displayMessage(message.msgText);
				else if(message.msgType == "MSG_START_CHAT")
				{
					preStart(message.msisdn);
				}
				else if(message.msgType == "MSG_CANCEL_CHAT")
				{
					$("#msgbox").html("");
					firstMy = true;
					firstOther = true;
					$.mobile.changePage($("#listFriends"), { transition: "slideup", reverse: "true" });
					chatSecret = null;
					chatStatus = "Invalid";
				}
			},
	  error:
			function(err)
			{
				errorHandler(err);
			}
	});
}

function getList()
{
	$.ajax({
	  url: service_url + "/list-users/" + sessionId,
	  type: "GET",
	  timeout: 5000,
	  contentType: "application/json",
	  success:
			function(users)
			{
				for(var i = 0; i < users.length; i++)
				{
					addToList(users[i]);
				}
			},
	  error:
			function(err)
			{
				errorHandler(err);
			}
	});
}

function addToList(usersNumber)
{
	if(usersNumber == msisdn)
		return;
	if(usersEverBeenOnline.indexOf(usersNumber) != -1)
	{
		$("#" + usersNumber.slice(1)).attr("style", "");
	}
	else
	{
		for(var i = 1; i < contacts.length; i++)
		{
			if(contacts[i].phoneNumbers.indexOf(usersNumber) != -1)
			{
				var print = "";
				print += "<li><a href='#' id=" + usersNumber.slice(1) + " onclick='invite(" + usersNumber + ")'><h2>" + contacts[i].displayName + "</h2><p>" + usersNumber + "</p></a></li>";
				$("#userlist").append(print);
				$('#userlist').listview('refresh');
				usersEverBeenOnline.splice(-1,0,usersNumber);
			}
		}
	}
}

function removeFromList(usersNumber)
{
	if(usersEverBeenOnline.indexOf(usersNumber) != -1)
	{
		$("#" + usersNumber.slice(1)).attr("style", "color: rgb(179, 179, 179);");
	}
}

function invite(recipient)
{
	var other = new Object();
	other.sessionID = sessionId;
	other.recipientMSISDN = "+" + recipient.toString();
	tempSecret = prompt("Въведете тайния ключ за чат с " + other.recipientMSISDN, "");
	console.log(tempSecret);
	if(tempSecret == null)
		return;
	rand = Math.floor(Math.random()*1000000000);
	other.challenge = Aes.Ctr.encrypt(rand.toString(), tempSecret, 256);
	saveSecret(other.recipientMSISDN, tempSecret);
	$.ajax({
	  url: service_url + "/invite-user",
	  type: "POST",
	  timeout: 5000,
	  contentType: "application/json",
	  data: JSON.stringify(other),
	  success:
			function()
			{
				chatStatus = "Invitation sent";
			},
	  error:
			function(err)
			{
				errorHandler(err);
			}
	});
	tempSecret = null;
}

function response(from, code)
{
	var other = new Object();
	other.sessionID = sessionId;
	other.recipientMSISDN = from;
	tempSecret = prompt("Въведете тайния ключ за чат с " + other.recipientMSISDN, "");
	if(tempSecret == null)
		return;
	other.response = Aes.Ctr.encrypt((999999999 - Aes.Ctr.decrypt(code, tempSecret, 256)).toString(), tempSecret, 256);
	saveSecret(from, tempSecret);
	$.ajax({
	  url: service_url + "/response-chat-invitation",
	  type: "POST",
	  timeout: 5000,
	  contentType: "application/json",
	  data: JSON.stringify(other),
	  success:
			function()
			{
				chatStatus = "Response sent";
			},
	  error:
			function(err)
			{
				errorHandler(err);
			}
	});
	tempSecret = null;
}

function saveSecret(number, secret)
{
	for(var i=0; i < chats.length; i++)
	{
		if(chats[i].number == number)
		{
			chats[i].secret = secret;
			return;
		}
	}
	var saveSecret = new Object();
	saveSecret.number = number;
	saveSecret.secret = secret;
	chats.splice(-1, 0, saveSecret);
}

function responseChallenge(from, code)
{
	findSecretWith(from);
	if(chatSecret != null && Aes.Ctr.decrypt(code, chatSecret, 256) == 999999999 - rand)
	{
		startChat();
	}
	else
	{
		customAlert("Грешка", "Другият потребител даде грешен таен код.");
		cancelChat();
	}
}

function findSecretWith(someone)
{
	for(var i = 0; i < chats.length; i++)
	{
		if(chats[i].number == someone)
		{
			chatSecret = chats[i].secret;
			recipientMSISDN = someone;
			return;
		}
	}
}

function preStart(withSomeone)
{
	for(var i = 1; i < contacts.length; i++)
	{
		if(contacts[i].phoneNumbers.indexOf(withSomeone) != -1)
		{
			chatWith = contacts[i];
		}
	}
	$("#chatWith").html("Чат с " + chatWith.displayName);
	$.mobile.changePage($("#chat"), { transition: "slideup" });
	chatStatus = "Active";
	if(chatSecret == null)
		findSecretWith(withSomeone);
	loadInfo();
}

function loadInfo()
{
	var page = $("#moreInfo");
	var name = chatWith.displayName;
	var phones = "<ol type='1'>";
	for(var i = 0; i < chatWith.phoneNumbers.length; i++)
	{
		phones += "<li>" + chatWith.phoneNumbers[i] + ";</li>";
	}
	phones += "</ol>";
	/*var photo;
	if(chatWith.photos)
		photo = chatWith.photo;
	else
		photo = "./Images/Android.png";*/
	var mapUrl;
	var mapUrlInet;
	if(haveConnection())
	{
		if((localStorage.wi_fi_map == "Да" && getTypeOfConnection() != Connection.WIFI) || (latitudeOther == 0 || longitudeOther == 0))
		{
			mapUrl = "./Images/ImageNotFound.jpg";
			mapUrlInet = "#";
		}
		else
		{
			mapUrl = "http://maps.googleapis.com/maps/api/staticmap?center=" + latitudeOther + "," + longitudeOther + "&zoom=15&size=300x300&maptype=roadmap&markers=color:blue%7Clabel:A%7C" + latitudeOther + "," + longitudeOther + "&sensor=false";
			mapUrlInet = "https://maps.google.bg/maps?hl=bg&ll=" + latitudeOther + "," + longitudeOther + "&t=h&z=19";
		}
	}
	var htmlCode = "<div data-role='content'>\
						<div id='personal'>\
							<img src='" + chatWith.photo + "' width='100' height='100'>\
							<h2>" + name + "</h2>\
						</div>\
						<div id='phones'" + phones + "\
						</div>\
						<div id='map'>\
							<p>" + name + " се намира:</p>\
							<a href = " + mapUrlInet + " target='_blank'><img src=" + mapUrl + " width='200' height='200'></a>\
						</div>\
					<a href='#' class='more' id='backMore' data-role='button' data-rel='back' data-transition='slide' data-direction='reverse'>>></a>\
					</div>";
	page.html(htmlCode);
}

function startChat()
{
	$.ajax({
	  url: service_url + "/start-chat",
	  type: "POST",
	  timeout: 5000,
	  contentType: "application/json",
	  data: JSON.stringify({ "sessionID" : sessionId, "recipientMSISDN" : recipientMSISDN }),
	  success:
			function()
			{
				preStart(recipientMSISDN);
			},
	  error:
			function(err)
			{
				errorHandler(err);
			}
	});
}

function sendMessage()
{
	var encryptedMsg;
	var msg = $("#message").val();
	if(firstMy)
	{
		$("#msgbox").append("<p class='my'>" + msg + "</p>");
		msg += "lllll" + latitudeMy.replace(".", "t") + "a" + longitudeMy.replace(".", "t") + "lllll";
		firstMy = false;
	}
	else
		$("#msgbox").append("<p class='my'>" + msg + "</p>");
	encryptedMsg = Aes.Ctr.encrypt(msg, chatSecret, 256);
	$("#message").val("");
	$("#message").attr("style", "");
	$.ajax({
	  url: service_url + "/send-chat-message",
	  type: "POST",
	  timeout: 5000,
	  contentType: "application/json",
	  data: JSON.stringify({ "sessionID" : sessionId, "recipientMSISDN" : recipientMSISDN, "encryptedMsg" : encryptedMsg }),
	  success:
			function()
			{},
	  error:
			function(err)
			{
				errorHandler(err);
			}
	});
}

function displayMessage(text)
{
	var decryptedMsg = Aes.Ctr.decrypt(text, chatSecret, 256);
	if(firstOther)
	{
		var coordsRegExp = /lllll([0-9t]{9})a([0-9t]{9})lllll/;
		console.log(decryptedMsg);
		var coords = decryptedMsg.match(coordsRegExp);
		latitudeOther = coords[1].replace("t", ".");
		longitudeOther = coords[2].replace("t", ".");
		decryptedMsg = decryptedMsg.replace(coordsRegExp, "");
		firstOther = false;
	}
	$("#msgbox").append("<p class='other'>" + decryptedMsg + "</p>");
}

function preCancelChat()
{
	alert("Текущият чат ще бъде затворен!");
	cancelChat();
	$.mobile.changePage($("#listFriends"), { transition: "slideup", reverse: "true" });
}

function cancelChat()
{
	$("#msgbox").html("");
	firstMy = true;
	firstOther = true;
	$.ajax({
	  url: service_url + "/cancel-chat",
	  type: "POST",
	  timeout: 5000,
	  contentType: "application/json",
	  data: JSON.stringify({ "sessionID" : sessionId, "recipientMSISDN" : recipientMSISDN }),
	  success:
			function()
			{
				chatStatus = "Invalid";
				chatSecret = null;
				recipientMSISDN = null;
			},
	  error:
			function(err)
			{
				errorHandler(err);
			}
	});
}