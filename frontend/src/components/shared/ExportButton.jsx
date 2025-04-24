import { Download } from 'lucide-react';

const ExportButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
    >
      <Download className="w-4 h-4 mr-2" />
      Export Summary
    </button>
  );
};

export default ExportButton; 