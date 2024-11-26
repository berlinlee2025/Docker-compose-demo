import '../form.scss';
import tick from '../images/tick.jpg';
import cross from '../images/cross2.png';

const Email = ( { onEmailChange, emailValid } ) => {

    return (
      <div className="form-box" >
      <label className="form-box__label" htmlFor="email">
        Email
      </label>
      <div className="form-box__secondary">
        <input
          className="form-box__secondary--input"  
          type="email"
          name="email"
          id="email"
          onChange={onEmailChange}
          placeholder="Enter email"
        />
        <div className="form-box__tertiary">
            <img
              className="icon"
              type="text"
              name="emailIcon"
              id="emailIcon"
              src={emailValid === true ? `${tick}` : `${cross}`}
              alt="emailIcon"
            />
            <p
              className="icon-p-empty"
            >
            </p>
          </div>
        </div>
      </div>
    )
};

export default Email;