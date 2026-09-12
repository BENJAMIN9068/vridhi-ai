import { Package } from 'lucide-react';

export default function DemandForecasting({ currentLanguage }) {
  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="agri-card p-5 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                <span>{currentLanguage === 'hi' ? 'कृषि संसाधन मांग व आपूर्ति प्रबंधन' : 'Agricultural Input & Resource Supply Grid'}</span>
              </h2>
              <span className="agri-chip agri-chip-amber text-xs">
                {currentLanguage === 'hi' ? 'इन्वेंटरी एपीआई लंबित' : 'ERP Sync Pending'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {currentLanguage === 'hi' 
                ? 'उद्रेक के आधार पर कीटनाशक व जैव-नियंत्रक मांग एवं राज्य गोदाम आपूर्ति प्रबंधन' 
                : 'Projected input demand vs. regional warehouse inventory'}
            </p>
          </div>
        </div>
      </div>

      {/* Clean ERP Status Card (No Fake Data) */}
      <div className="agri-card p-12 text-center bg-white border border-gray-200">
        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-gray-900">
          {currentLanguage === 'hi' ? 'गोदाम आपूर्ति व भंडार प्रणाली (ERP)' : 'State Warehouse & Input Supply Grid'}
        </h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto mt-2 leading-relaxed">
          {currentLanguage === 'hi'
            ? 'राज्य व जिला कृषि भंडारण डिपो (District Seed & Pesticide Warehouses) अभी API से सीधे नहीं जुड़े हैं। जब यह प्रणाली जुड़ेगी, तब वास्तविक स्टॉक और माँग यहाँ दिखाई देगी।'
            : 'District seed and pesticide depot inventories are not yet linked to this portal API. Real-time warehouse stocks and deficits will appear here once connected.'}
        </p>
        <p className="text-[11px] text-gray-400 mt-3">
          {currentLanguage === 'hi'
            ? 'किसानों को प्रमाणित दवाओं की सही खुराक पहुँचाने के लिए CIBRC प्रोटोकॉल और एडवाइजरी ब्रॉडकास्ट का उपयोग करें।'
            : 'Use the CIBRC Protocols and Advisory Broadcast to communicate certified pesticide dosages to farmers.'}
        </p>
      </div>
    </div>
  );
}
