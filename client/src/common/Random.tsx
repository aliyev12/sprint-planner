import React from "react";
import "./Random.css";

export const Or = ({ text = "join existing room:" }) => (
  <div className="Random or">or, {text}</div>
);

export const Loader = () => {
  return (
    <div className="Loader container flex-centered">
      <div className="preloader-wrapper big active">
        <div className="spinner-layer spinner-blue-only">
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div>
          <div className="gap-patch">
            <div className="circle"></div>
          </div>
          <div className="circle-clipper right">
            <div className="circle"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export const LoaderInline = () => {
  return (
    <div className="preloader-wrapper small active">
      <div className="spinner-layer spinner-blue-only">
        <div className="circle-clipper left">
          <div className="circle"></div>
        </div>
        <div className="gap-patch">
          <div className="circle"></div>
        </div>
        <div className="circle-clipper right">
          <div className="circle"></div>
        </div>
      </div>
    </div>
  );
};

export const Alert = ({
  type = "error",
  text = "Something went wrong",
}: any) => {
  return (
    <div className={`Alert ${type} card`}>
      <div className="card-content">{text}</div>
    </div>
  );
};

export const WrongRoomAlert = ({ roomId }) => (
  <Alert
    text={
      <div>
        Sorry, room with room ID{roomId ? ":" : ""}{" "}
        {roomId ? (
          <div
            style={{
              display: "block",
              padding: "3px 7px",
              borderRadius: "3px",
              margin: "5px auto",
            }}
            className="grey lighten-2 black-text"
          >
            "{roomId}"
          </div>
        ) : (
          "that you have used"
        )}{" "}
        does not exist.
      </div>
    }
  />
);
