import React from "react";
import { toast } from "react-toastify";

export const onMessase = (socket) => {
  socket.on("message", (message) => {
    if (message.text) {
      const splitMessage = message.text.split("::");
      let messageText = message.text,
        toastType = "success";
      if (splitMessage.length > 1 && splitMessage[1]) {
        messageText = splitMessage[0];
        toastType = splitMessage[1];
      }

      toast[toastType](
        <span>
          <strong style={{ fontWeight: 800, color: "#0e47a1" }}>
            {message.user}:{" "}
          </strong>
          {messageText}
        </span>
      );
    }
  });
};
