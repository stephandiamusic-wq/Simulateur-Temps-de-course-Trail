import React, { useState } from 'react';
import { UploadIcon } from './icons';

interface GpxUploadProps {
  onUpload: (file: File, courseName: string, eventName: string) => void;
  isLoading: boolean;
}

const GpxUpload: React.FC<GpxUploadProps> = ({ onUpload, isLoading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [courseName, setCourseName] = useState('');
  const [eventName, setEventName] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.toLowerCase().endsWith('.gpx')) {
        setFile(selectedFile);
        setError('');
      } else {
        setFile(null);
        setError('Veuillez sélectionner un fichier .gpx valide.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Un fichier GPX est requis.');
      return;
    }
    if (!courseName.trim()) {
      setError('Le nom du parcours est requis.');
      return;
    }
    onUpload(file, courseName, eventName);
  };

  return (
    <div className="max-w-2xl mx-auto bg-base-200 p-8 rounded-2xl shadow-lg border border-base-300">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">Importer un Parcours</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="courseName" className="block text-sm font-medium mb-2">Nom du Parcours</label>
          <input
            id="courseName"
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="ex: UTMB 2024"
            className="w-full bg-gray-50 border border-base-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition"
            required
          />
        </div>
        <div>
          <label htmlFor="eventName" className="block text-sm font-medium mb-2">Nom de l'Événement (Optionnel)</label>
          <input
            id="eventName"
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="ex: Ultra-Trail du Mont-Blanc"
            className="w-full bg-gray-50 border border-base-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition"
          />
        </div>
        <div>
            <label htmlFor="gpxFile" className="block text-sm font-medium mb-2">Fichier GPX</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-base-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="gpxFile" className="relative cursor-pointer bg-base-200 rounded-md font-medium text-primary hover:text-primary-focus focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-base-200 focus-within:ring-primary">
                            <span>Sélectionnez un fichier</span>
                            <input id="gpxFile" name="gpxFile" type="file" className="sr-only" onChange={handleFileChange} accept=".gpx" />
                        </label>
                        <p className="pl-1">ou glissez-déposez</p>
                    </div>
                    <p className="text-xs text-gray-500">{file ? file.name : 'Fichier GPX jusqu\'à 10MB'}</p>
                </div>
            </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-primary transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement...
            </>
          ) : 'Charger le Parcours'}
        </button>
      </form>
    </div>
  );
};

export default GpxUpload;