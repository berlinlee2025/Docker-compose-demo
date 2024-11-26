import '../form.scss';
import tick from '../images/tick.jpg';
import cross from '../images/cross2.png';

const Password = ({ 
    onPasswordChange, 
    password12Char 
  }) => {
  
  return (
    <div className="form-box" >
      <label className="form-box__label" htmlFor="password">
        Password
      </label>
      <div className="form-box__secondary">
        <input
          className="form-box__secondary--input"  
          type="password"
          name="password"
          autoComplete="off"
          id="password"
          onChange={onPasswordChange}
          placeholder="Enter password"
        />
        <div className="form-box__tertiary">
            <img
              className="icon"
              type="text"
              name="12CharIcon"
              id="12CharIcon"
              src={password12Char === true ? `${tick}` : `${cross}`}
              alt="12CharIcon"
            />
            <p
              className="icon-p-empty"
            >
              12Char
            </p>
          </div>
        </div>
      </div>
  );
};

export default Password;
