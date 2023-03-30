

export function sendSMS(body,number){
    fetch("/api/sns/sendsms",{
        method: 'POST',
        body: JSON.stringify({
            body,
            number
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        }
    })
    .then(async res => {
        const result = await res.json();
    })
    .catch(err=>console.log(err));
}

export function sendEmail(emailObject){
    fetch("/api/sns/sendemail",{
        method: 'POST',
        body: JSON.stringify(emailObject),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        }
    })
    .then(async res => {
        const result = await res.json();
        // console.log(result)
    })
    .catch(err=>console.log(err));
}