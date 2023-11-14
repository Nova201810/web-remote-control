import './index.css';

export default function LabelledField({ label, name, ...props }) {
  return (
    <div className="LabelledField">
      <label className="LabelledField_Label" for={name}>{label}</label>
      <input className="LabelledField_Field" name={name} {...props} />
    </div>
  );
}