import './index.css';

export default function Button({ kind, ...props }) {
  return (
    <button className={`Button Button--${kind}`} {...props} />
  );
}