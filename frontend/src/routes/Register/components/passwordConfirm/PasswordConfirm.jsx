import '../form.scss';
import tick from '../images/tick.jpg';
import cross from '../images/cross2.png';

const PasswordConfirm = ({ 
  onPasswordConfirmChange, 
  password1SpecialChar 
}) => {

return (
  <div className="form-box" >
    <label className="form-box__label" htmlFor="passwordConfirm">
      Confirm Password
    </label>
    <div className="form-box__secondary">
      <input
        className="form-box__secondary--input"  
        type="password"
        name="passwordConfirm"
        autoComplete="off"
        id="passwordConfirm"
        onChange={onPasswordConfirmChange}
        placeholder="Confirm password"
      />
      <div className="form-box__tertiary">
          <img
            className="icon"
            type="text"
            name="password1SpecialChar"
            id="password1SpecialChar"
            src={password1SpecialChar === true ? `${tick}` : `${cross}`}
            alt="password1SpecialChar"
          />
          <p
            className="icon-p-empty"
          >
            1Symbol
          </p>
        </div>
      </div>
    </div>
);
};

export default PasswordConfirm;
