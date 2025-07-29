// src/components/PwaUpdateNotifier.jsx
import { MdRefresh } from 'react-icons/md';

const PwaUpdateNotifier = ({ onUpdate }) => {
  return (
    <div className="update-notifier">
      <span>Pembaruan tersedia!</span>
      <button onClick={onUpdate}>
        <MdRefresh /> Perbarui
      </button>
    </div>
  );
};

export default PwaUpdateNotifier;