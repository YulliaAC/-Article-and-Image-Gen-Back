// const robot = require("robotjs");

// client.channels
// .fetch("1097873441333448789")
// .then((channel) => {
//     console.log(`Found channel: ${channel.name}`);
//     channel.send("image");
// })
// .catch(console.error);

// client.on("messageCreate", (message) => {
//   if (message.content === "image") {
//     var mouse=robot.getMousePos();
//         console.log("Mouse is at x:" + mouse.x + " y:" + mouse.y);
//         robot.typeString(`/imagine prompt: ${title}`);
//         setTimeout(() => robot.keyTap("enter"), 1000);
//         setTimeout(() => robot.keyTap("enter"), 2000);
//   }

//   if (message.content.includes("893133616538869790")) {
//     console.log("it`s midjorney");
//     image = message.attachments.map((el) => el.url);
//     console.log(image);
//   }
// });