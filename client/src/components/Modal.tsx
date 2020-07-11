import React from "react";
import M from "materialize-css";

interface Props {}

export const Modal = (props: Props) => {
  let _modalRef;

  React.useEffect(() => {
    M.Modal.init(_modalRef);
  }, []);

  return (
    <div>
      <button data-target="modal1" className="btn modal-trigger">
        Modal
      </button>

      <div
        id="modal1"
        className="modal"
        ref={(modalRef) => {
          _modalRef = modalRef;
        }}
      >
        <div className="modal-content">
          <h4>Modal Header</h4>
          <p>A bunch of text</p>
        </div>
        <div className="modal-footer">
          <a
            href="#!"
            className="modal-close waves-effect waves-green btn-flat"
          >
            Agree
          </a>
        </div>
      </div>
    </div>
  );
};
