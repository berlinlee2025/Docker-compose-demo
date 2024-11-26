import '../form.scss';
import tick from '../images/tick.jpg';
import cross from '../images/cross2.png';

const Name = ( { onNameChange, nameValid } ) => {

    return (
    <div className="form-box" >
      <label className="form-box__label" htmlFor="name">
        Name
      </label>
      <div className="form-box__secondary">
        <input
          className="form-box__secondary--input"  
          type="text"
          name="name"
          id="name"
          onChange={onNameChange}
          placeholder="Enter name"
        />
        <div className="form-box__tertiary">
            <img
              className="icon"
              type="text"
              name="nameIcon"
              id="nameIcon"
              src={nameValid === true ? `${tick}` : `${cross}`}
              alt="nameIcon"
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

export default Name;