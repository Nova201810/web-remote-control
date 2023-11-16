import './index.css';

export default function LabelledField({ isUpdated = false, label, name, ...props }) {
  return (
    <div className="LabelledField">
      <label className="LabelledField_Label" htmlFor={name}>{label}</label>
      <div className={`LabelledField_InputWrapper${isUpdated ? ' LabelledField_InputWrapper--updated' : ''}`}>
        <input className="LabelledField_Input" name={name} {...props} />
      </div>
    </div>
  );
}