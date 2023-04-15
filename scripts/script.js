// Default values for boiler info
let boilerInfoObj = {
  boilerID: '',
  purchaseDate: '',
  maxTemp: '',
  maxPSI: '',
};

// Loads the boiler's data for the app
function loadData() {
  if (localStorage.getItem('boilerInfo') == null) {
    document.getElementById('boilerInfo').style.display = 'none';
  } else {
    document.getElementById('currentBoilID').innerHTML = JSON.parse(
      localStorage.getItem('boilerInfo')
    ).boilerID;
    document.getElementById('currentDoP').innerHTML = JSON.parse(
      localStorage.getItem('boilerInfo')
    ).purchaseDate;
    document.getElementById('currentMaxPressure').innerHTML = JSON.parse(
      localStorage.getItem('boilerInfo')
    ).maxPSI;
    document.getElementById('currentMaxTemperature').innerHTML = JSON.parse(
      localStorage.getItem('boilerInfo')
    ).maxTemp;
    document.getElementById('error').style.display = 'none';
  }
  // Loads graphics for app
  loadGraphs();
  loadRecommendations();
  setPsiRecomText();
  setTempRecomText();
}

// Add numbers to the pin value on the pin screen
function addValueToPassword(value) {
  const currentValue = document.getElementById('passcode').value;

  let newValue = '';

  if (value == 'bksp') {
    newValue = currentValue.substring(0, currentValue.length - 1);
  } else {
    newValue = currentValue + value;
  }
  document.getElementById('passcode').value = newValue;
}

// Checks for the correct password. If correct it will log into the app
function passwordCheck() {
  const pinValue = JSON.parse(localStorage.getItem('pin'));
  const currentURL = window.location.href;

  if (localStorage.getItem('pin') == null) {
    localStorage.setItem('pin', JSON.stringify(1111));
    passcode.value = '';
    alert('You have not set up your pin yet! Default Pin is 1111!');
  } else {
    if (passcode.value == pinValue) {
      passcode.value = '';
      location.replace(currentURL + '#pageMenu');
    } else {
      alert('There was an error! Please try again!');
      passcode.value = '';
    }
  }
}

// Changes the password to a new password upon providing the current pin
function changePassword() {
  currentPin = JSON.parse(localStorage.getItem('pin'));

  const currentPinValue = document.getElementById('currentPassword').value;
  const newPinValue = document.getElementById('newPassword').value;

  if (currentPin == currentPinValue) {
    localStorage.setItem('pin', JSON.stringify(newPinValue));
    alert('Your pin has been succesfully updated!');
  } else {
    alert('Your current pin does not match! Please try again!');
  }

  document.getElementById('currentPassword').value = '';
  document.getElementById('newPassword').value = '';
}

// Allows the user to set and update boiler info
function updateBoiler() {
  let boilerIDValue = document.getElementById('boilID').value;
  let purchaseValue = document.getElementById('purchase').value;
  let maxPSIValue = document.getElementById('maxPSI').value;
  let maxTempValue = document.getElementById('maxTemp').value;

  if (
    boilerIDValue == '' ||
    purchaseValue == '' ||
    maxPSIValue == '' ||
    maxTempValue == ''
  ) {
    alert('Please fill out all require feilds!');
  } else {
    boilerInfoObj.boilerID = boilerIDValue;
    boilerInfoObj.purchaseDate = purchaseValue;
    boilerInfoObj.maxPSI = maxPSIValue;
    boilerInfoObj.maxTemp = maxTempValue;

    try {
      localStorage.setItem('boilerInfo', JSON.stringify(boilerInfoObj));
      const boilerInfo = JSON.parse(localStorage.getItem('boilerInfo'));
      console.log(boilerInfo);
    } catch (e) {
      alert('There was an error! Please try again!');
    }
    alert('Information was updated Successfully!');
    window.location.reload();
  }
}

// Allows user to track the performace of the boiler
function trackPerformace() {
  const psiValue = document.getElementById('currentPSI').value;
  const tempValue = document.getElementById('currentTemp').value;

  try {
    if (psiValue == '' || tempValue == '') {
      alert('Please fill in all require feilds!');
    } else {
      const d = new Date();
      let day = d.getDate();
      let month = d.getMonth() + 1;
      let year = d.getFullYear();
      let fullDate = `${month}-${day}-${year}`;

      if (localStorage.getItem('dateData') == null) {
        localStorage.setItem('dateData', '[]');
      }
      const oldDateData = JSON.parse(localStorage.getItem('dateData'));
      oldDateData.push(fullDate);

      localStorage.setItem('dateData', JSON.stringify(oldDateData));

      if (localStorage.getItem('tempData') == null) {
        localStorage.setItem('tempData', '[]');
      }
      const oldTempData = JSON.parse(localStorage.getItem('tempData'));
      oldTempData.push(tempValue);

      localStorage.setItem('tempData', JSON.stringify(oldTempData));

      if (localStorage.getItem('psiData') == null) {
        localStorage.setItem('psiData', '[]');
      }

      const oldPsiData = JSON.parse(localStorage.getItem('psiData'));
      oldPsiData.push(psiValue);
      localStorage.setItem('psiData', JSON.stringify(oldPsiData));

      document.getElementById('currentPSI').value = '';
      document.getElementById('currentTemp').value = '';
    }
  } catch (e) {
    alert('There was an error! Please try again!');
  }
  alert('Data Submit Successfully!');
  window.location.reload();
}

// Loads line graph
function loadGraphs() {
  if (localStorage.getItem('dateData') == null) {
    document.getElementById('performGraph').style.display = 'none';
  } else {
    document.getElementById('graphError').style.display = 'none';
  }
}

// Loads recommendation graphs and texts if data is set
function loadRecommendations() {
  if (JSON.parse(localStorage.getItem('psiData')) == null) {
    document.getElementById('psiRecom').style.display = 'none';
    document.getElementById('tempRecom').style.display = 'none';
  } else {
    document.getElementById('errorRecom').style.display = 'none';
  }
}

// Gives user suggestion bases on the percetage of the max used
function setPsiRecomText() {
  if (monitorPercentage >= 91) {
    document.getElementById('psiText').style.color = 'red';
    document.getElementById(
      'psiText'
    ).innerHTML = `Your average temperature percentage is ${monitorPercentage}%. You should lower your PSI gauge. If your average PSI does not drop contact your local repair service provider!`;
  } else if (monitorPercentage <= 41) {
    document.getElementById('psiText').style.color = 'red';
    document.getElementById(
      'psiText'
    ).innerHTML = `Your average temperature percentage is ${monitorPercentage}%. You should raise your PSI gauge. If your average PSI does not increase contact your local repair service provider!`;
  } else {
    document.getElementById('psiText').style.color = 'green';
    document.getElementById(
      'psiText'
    ).innerHTML = `Your average PSI percentage is ${monitorPercentage}%. Keep doing what you are doing!`;
  }
}

// Gives user suggestion bases on the percetage of the max used
function setTempRecomText() {
  if (tempMonitorPercentage >= 91) {
    document.getElementById('tempText').style.color = 'red';
    document.getElementById(
      'tempText'
    ).innerHTML = `Your average temperature percentage is ${tempMonitorPercentage}%. You should lower your temperature gauge. If your average temperature does not drop contact your local repair service provider!`;
  } else if (tempMonitorPercentage <= 41) {
    document.getElementById('tempText').style.color = 'red';
    document.getElementById(
      'tempText'
    ).innerHTML = `Your average temperature percentage is ${tempMonitorPercentage}%. You should raise your temperature gauge. If your average temperature does not increase contact your local repair service provider!`;
  } else {
    document.getElementById('tempText').style.color = 'green';
    document.getElementById(
      'tempText'
    ).innerHTML = `Your average temperature percentage is ${tempMonitorPercentage}%. Keep doing what you are doing!`;
  }
}
