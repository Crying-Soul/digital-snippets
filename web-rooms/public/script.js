const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const chat = document.getElementById("chat");

const sendBtn = document.getElementById('send-msg');


const myPeer = new Peer({
  config: {
    iceServers: [{ url: "stun:stun.l.google.com:19302" }],
  } /* Sample servers, please use appropriate ones */,
});
const myVideo = document.createElement("video");
myVideo.muted = true;
const peers = {};

const sendMsgLocal = (text) => {
  userConnectedMsg = document.createElement("div");
  userConnectedMsg.classList.add("msg");
  userConnectedMsg.innerText = text;
  chat.appendChild(userConnectedMsg);
}

sendBtn.addEventListener('click', e => {
  const inputData = document.getElementById('chat-msg');
  if (inputData.value){
    socket.emit('chat-msg', inputData.value);
    sendMsgLocal(inputData.value)
    inputData.value = '';
  }
}, false)

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);

    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
      sendMsgLocal("User " + userId + " have connected!")
     
    });
  });

socket.on("user-disconnected", (userId) => {
  if (peers[userId]) peers[userId].close();
  sendMsgLocal("User " + userId + " have disconnected!")
});

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
