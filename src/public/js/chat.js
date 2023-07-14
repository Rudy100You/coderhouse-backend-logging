/*eslint-disable*/
const socket = io();

let user;
let chatBox = document.getElementById('chatBox')

Swal.fire(
    {
        title:"Identificate",
        input:"text",
        text:"Ingresa el usuario para identificarte en el chat",
        inputValidator:(value)=>{
            if(!value )
                return 'Necesitas ingresar un nombre de usuario para continuar!'
            else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) 
                return 'Invalid email address';
        },
        allowOutsideClick:false
    }
).then(result=>{
    user = result.value
})

chatBox.addEventListener('keyup', e=>{
    if(e.key === "Enter")
    {
        if (chatBox.value.trim().length > 0)
        {
            socket.emit("message",{user:user, message:chatBox.value})
            chatBox.value = ""
        }
    }
})

socket.on('messageLogs', data =>{
    let log = document.getElementById('messageLogs')
    let messages = ""
    data.forEach(message=>{
        messages = messages + `<br>[${message.user}]: ${message.message}</br>\n`
    })
    log.innerHTML = messages
})