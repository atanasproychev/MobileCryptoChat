function getPhoneGapVariables()
{
    navigator.geolocation.getCurrentPosition(
    			function(position)
    			{
    				latitudeMy = position.coords.latitude.toString();
    				longitudeMy = position.coords.longitude.toString();
    				console.log("Position " + latitudeMy + " " + longitudeMy);
    			},
    			function(error)
    			{
    				latitudeMy = 0;
    				longitudeMy = 0;
    				console.log("Error Coordinates");
    			}
    );

    var options = new ContactFindOptions();
    options.filter = "";
    options.multiple = true;
    var fields = ["displayName", "phoneNumbers", "photos"];
    navigator.contacts.find(fields, onSuccess,
    		/*function (contactArray)
    		{
    			//contacts = contactArray;
    			console.log(typeof contactArray[0].formatted);
    			var temp = new Object();
    			for(var i = 0; i < contactArray.length; i++)
    			{
    				//contacts[i] = new Object();
    				temp.name = contactArray[i].name;
    				console.log(temp.name.displayName);
    				if(contactArray[i].photos != null)
    					temp.photo = contactArray[i].photos[0].value;
    				else
    					temp.photo = defaultUserPhoto;
    				temp.phoneNumbers = new Array();
    			    for(var j = 0; j < contactArray[i].phoneNumbers.length; j++)
    			    {
    			        temp.phoneNumbers[j] = contactArray[i].phoneNumbers[j].value;
    			        console.log(temp.phoneNumbers[j] + "\n");
    			        //console.log(contacts[i].phoneNumbers[j] + "\n");
    			    }
    			    contacts.push(temp);
    			}
    			addCountryCodeToPhones();
    			/*for(var i = 0; i < contacts.length; i++)
    			{
    				//contacts[i] = new Object();
    				/*temp.name = contactArray[i].name;
    				console.log(temp.name.displayName);
    				temp.photo = contactArray[i].photos[0].value;
    				temp.phoneNumbers = new Array();*
    			    for(var j = 0; j < contacts[i].phoneNumbers.length; j++)
    			    {
    			        contacts[i].phoneNumbers[j] = contactArray[i].phoneNumbers[j].value;
    			        console.log(contacts[i].phoneNumbers[j] + "\n");
    			        //console.log(contacts[i].phoneNumbers[j] + "\n");
    			    }
    			    //contacts.push(temp);
    			}
    			addCountryCodeToPhones();*/
    		//},
    		function (error)
    		{
    			alert("Има проблем с изтеглянето на контактите.");
    		},
    		options);
}

function onSuccess(contactArray)
{
	contacts.length = contactArray.length;
	console.log(/*typeof*/ contacts.length);
	for(var i = 1; i < contactArray.length; i++)
	{
		contacts[i] = new Object();
		contacts[i].displayName = contactArray[i].displayName;
		console.log(contacts[i].displayName);
		if(contactArray[i].photos != null)
			contacts[i].photo = contactArray[i].photos[0].value;
		else
			contacts[i].photo = defaultUserPhoto;
		contacts[i].phoneNumbers = new Array();
	    for(var j = 0; j < contactArray[i].phoneNumbers.length; j++)
	    {
	        contacts[i].phoneNumbers[j] = contactArray[i].phoneNumbers[j].value;
	        console.log(contacts[i].phoneNumbers[j] + "\n");
	        //console.log(contacts[i].phoneNumbers[j] + "\n");
	    }
	    //console.log(typeof contacts);
	    /*contacts[i] = new Object();
	    contacts.push(temp);*/
	    console.log("Contact " + i + " " + contacts[i].displayName);
	}
	addCountryCodeToPhones();
}

function getTypeOfConnection()
{
	return navigator.connection.type;
}