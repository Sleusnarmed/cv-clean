import { useEffect, useState } from 'react';

const PDFPreview = ({ pdfUrl }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  if (!pdfUrl) return null;

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
        <div className="flex space-x-2">
          <button 
            onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
            className="px-3 py-1 bg-white rounded"
          >
            -
          </button>
          <span className="px-3 py-1">{Math.round(scale * 100)}%</span>
          <button 
            onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
            className="px-3 py-1 bg-white rounded"
          >
            +
          </button>
        </div>
        <a
          href={pdfUrl}
          download="my_cv.pdf"
          className="text-blue-600 hover:text-blue-800"
        >
          Download
        </a>
      </div>
      <div className="overflow-auto bg-gray-200 p-4">
        <iframe
          src={pdfUrl}
          title="CV Preview"
          className="w-full bg-white"
          style={{ height: '800px', transform: `scale(${scale})`, transformOrigin: '0 0' }}
        />
      </div>
    </div>
  );
};

export default PDFPreview;