const sendSingleDeviceNotification = async data => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    'key=AAAAb3u0jj4:APA91bFcu9G4BNzHcnSa7hcTcBLqUEQg1GnCfEdXxr-e3DvH4Xc7KBb4MAYex2dsbJV3Zjt7azHQJzTBR6ELermlv7GXz6SquuIEcOTGGiFAiuBzJmHYoXGlrNTRk7n1Wo7q4QzJrw19',
    // 'key=AAAAb6Hj-ho:APA91bG7qb8CKBX_tE9kkn7RTCmwJRZ-dlTRLYnjH6ZJ_Id9KQwlJr694pSIsv6dM8acWNiN9sRbsJO5cKe9tqc6wwpAPvc68cHE0hPBCMH4lI5vjzzimN7gW5KBcRviNzo76A2ngcsw',
  );

  var raw = JSON.stringify({
    data: {
      pickup: data.pickup,
      destination: data.destination,
      pickupGeo: data.pickupGeo,
      destinationGeo: data.destinationGeo,
      fare: data.fare,
      distance: data.distance,
      duration: data.duration,
    },
    notification: {
      body: data.body,
      title: data.title,
      vibrate: 1,
      default_sound: true,
      show_in_foreground: true,
      notification_priority: 'PRIORITY_HIGH',
      content_available: true,
      default_vibrate_timings: true,
      default_light_settings: true,
    },
    to: data.token,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  // let response = await fetch("https://fcm.googleapis.com/fcm/send", {
  //   method: "POST",
  //   headers,
  //   body: JSON.stringify(message),
  // })
  let response;
  try {
    response = await fetch(
      'https://fcm.googleapis.com/fcm/send',
      requestOptions,
    );

    // response = await response.text();
  } catch (error) {}

  return response;

  // fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
  //   .then(response => response.text())
  //   .then(result => console.log(result))
  //   .catch(error => console.log('error', error));
};

const sendMultiDeviceNotification = data => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    'key=AAAAb3u0jj4:APA91bFcu9G4BNzHcnSa7hcTcBLqUEQg1GnCfEdXxr-e3DvH4Xc7KBb4MAYex2dsbJV3Zjt7azHQJzTBR6ELermlv7GXz6SquuIEcOTGGiFAiuBzJmHYoXGlrNTRk7n1Wo7q4QzJrw19',
    // 'key=AAAAb6Hj-ho:APA91bG7qb8CKBX_tE9kkn7RTCmwJRZ-dlTRLYnjH6ZJ_Id9KQwlJr694pSIsv6dM8acWNiN9sRbsJO5cKe9tqc6wwpAPvc68cHE0hPBCMH4lI5vjzzimN7gW5KBcRviNzo76A2ngcsw',
  );

  var raw = JSON.stringify({
    data: {},
    notification: {
      body: data.body,
      title: data.title,
    },
    registration_ids: data.token,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
    .then(response => console.log({response: response.text()}))
    .then(result => console.log({result: result}))
    .catch(error => console.log('error:', error));
};

export default {
  sendSingleDeviceNotification,
  sendMultiDeviceNotification,
};
