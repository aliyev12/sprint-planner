import React from "react";
import { toast } from "react-toastify";

export const onMessase = (socket) => {
  socket.on("message", (message) => {
    if (message.text)
      toast.success(
        <span>
          <strong style={{ fontWeight: 800, color: "#0e47a1" }}>
            {message.user}:{" "}
          </strong>
          {message.text}
        </span>
      );
  });
};
