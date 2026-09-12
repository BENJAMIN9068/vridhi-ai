// Multi-State Agricultural & Geospatial Cadastral Dataset (SIH Problem Statement 26131)
// Organization: Department of Agriculture (State-Wise Isolated Portals)

// EXACT crops available on website https://krashi-mitrasih.vercel.app/
export const WEBSITE_CROPS = [
  { id: 'rice', nameEn: 'Rice / Paddy', nameHi: 'धान', icon: '🌾', color: '#22c55e' },
  { id: 'sugarcane', nameEn: 'Sugarcane', nameHi: 'गन्ना', icon: '🎋', color: '#16a34a' },
  { id: 'wheat', nameEn: 'Wheat', nameHi: 'गेहूं', icon: '🌾', color: '#eab308' },
  { id: 'cotton', nameEn: 'Cotton', nameHi: 'कपास', icon: '🪴', color: '#f59e0b' },
  { id: 'potato', nameEn: 'Potato', nameHi: 'आलू', icon: '🥔', color: '#d97706' },
  { id: 'maize', nameEn: 'Maize / Corn', nameHi: 'मक्का', icon: '🌽', color: '#ea580c' },
  { id: 'onion', nameEn: 'Onion', nameHi: 'प्याज', icon: '🧅', color: '#9333ea' }
];

export const STATES_CONFIG = {
  // =========================================================================
  // 1. UTTAR PRADESH (UP) - Precise Cadastral Farm Plots (Mauza Rithora / Invertis Farmlands)
  // =========================================================================
  uttar_pradesh: {
    id: 'uttar_pradesh',
    code: 'UP',
    nameEn: 'Uttar Pradesh',
    nameHi: 'उत्तर प्रदेश शासन — कृषि विभाग',
    departmentName: 'Department of Agriculture, Govt. of Uttar Pradesh',
    tagline: 'प्रादेशिक कृषी अधिकारी नियंत्रण कक्ष (Invertis Zone - Bareilly)',
    helpline: '1800-180-1551',
    center: [28.3242, 79.5190], // Center of village farmland chak (Bareilly / Rithora)
    defaultZoom: 16, // High default zoom right on the farm parcels
    officer: {
      name: 'Dr. A. K. Gangwar',
      designation: 'Joint Director (Agri) — Bareilly Division',
      id: 'UP-AGRI-0881',
      zone: 'Rohilkhand / Central UP Zone',
      universityLab: 'ICAR - IVRI Bareilly / CSA Kanpur'
    },
    divisions: [
      { id: 'all', nameEn: 'All UP Grid', nameHi: 'समस्त उत्तर प्रदेश ग्रिड', center: [27.1303, 80.8597], zoom: 7 },
      { id: 'rohilkhand', nameEn: 'Bareilly (Invertis Farmlands)', nameHi: 'बरेली / रुहेलखंड कृषि प्रक्षेत्र', center: [28.3242, 79.5190], zoom: 16, districts: ['Bareilly', 'Pilibhit', 'Shahjahanpur', 'Badaun'] },
      { id: 'lucknow', nameEn: 'Lakhimpur Kheri (Sugarcane Belt)', nameHi: 'लखीमपुर खीरी (गन्ना प्रक्षेत्र)', center: [28.4350, 80.5780], zoom: 15, districts: ['Lakhimpur Kheri', 'Sitapur', 'Hardoi', 'Lucknow'] },
      { id: 'meerut', nameEn: 'Meerut / Sardhana (Wheat & Cane)', nameHi: 'मेरठ / सरधना प्रक्षेत्र', center: [29.1450, 77.6180], zoom: 15, districts: ['Meerut', 'Muzaffarnagar', 'Bulandshahr', 'Saharanpur'] },
      { id: 'agra', nameEn: 'Agra / Khandauli (Potato Belt)', nameHi: 'आगरा / खंदौली (आलू प्रक्षेत्र)', center: [27.3020, 78.0850], zoom: 15, districts: ['Agra', 'Mathura', 'Aligarh', 'Firozabad'] },
      { id: 'kanpur', nameEn: 'Farrukhabad / Kaimganj (Maize Belt)', nameHi: 'फर्रुखाबाद / कायमगंज प्रक्षेत्र', center: [27.5380, 79.3450], zoom: 15, districts: ['Farrukhabad', 'Kannauj', 'Kanpur', 'Etawah'] },
      { id: 'varanasi', nameEn: 'Varanasi / Pindra (Onion Belt)', nameHi: 'वाराणसी / पिंडरा प्रक्षेत्र', center: [25.4820, 82.8420], zoom: 15, districts: ['Varanasi', 'Jaunpur', 'Ghazipur', 'Mirzapur'] },
      { id: 'gorakhpur', nameEn: 'Gorakhpur / Sahjanwa (Paddy Belt)', nameHi: 'गोरखपुर / सहजनवा प्रक्षेत्र', center: [26.7720, 83.1850], zoom: 15, districts: ['Gorakhpur', 'Deoria', 'Kushinagar', 'Basti'] }
    ],
    farmPlots: [],
    hotspots: [
      {
        id: 'UP-HOT-01',
        district: 'Bareilly (Invertis Farmlands)',
        taluka: 'Rithora & Nawabganj',
        division: 'rohilkhand',
        crop: 'rice',
        cropName: 'Rice (धान)',
        disease: 'Bacterial Leaf Blight / जीवाणु झुलसा (BLB)',
        severity: 'critical',
        coordinates: [28.3242, 79.5190],
        affectedAreaHa: 1350,
        farmersAffected: 620,
        confidenceScore: 94.2,
        weatherTrigger: 'Tarai standing water + RH 92% after heavy monsoon'
      }
    ],
    metrics: {
      activeOutbreakClusters: 16,
      criticalRedAlerts: 5,
      totalHectaresUnderSurveillance: 520000,
      activeAffectedAreaHa: 8970,
      farmersMonitored: 68400,
      cropLossPreventedCrores: 64.8,
      targetedPesticideReductionPercent: 34.2,
      averageResponseTimeHours: 2.4,
      pendingLabVerifications: 28,
      demandShortageAlertsCount: 9
    }
  },

  // =========================================================================
  // 2. UTTARAKHAND (UK) - Pantnagar / Kichha Research Farmland Grid
  // =========================================================================
  uttarakhand: {
    id: 'uttarakhand',
    code: 'UK',
    nameEn: 'Uttarakhand',
    nameHi: 'उत्तराखंड शासन — कृषि निदेशालय',
    departmentName: 'Directorate of Agriculture, Govt. of Uttarakhand',
    tagline: 'राज्य कृषी नियंत्रण कक्ष (Pantnagar Agriculture Zone)',
    helpline: '1800-180-1551 / 0135-2710188',
    center: [28.9720, 79.4980],
    defaultZoom: 16,
    officer: {
      name: 'Dr. Harish Chandra Joshi',
      designation: 'Chief Agriculture Officer — Udham Singh Nagar',
      id: 'UK-AGRI-0419',
      zone: 'Tarai & Bhabhar Agro-Climatic Zone',
      universityLab: 'GB Pant University of Agriculture & Technology, Pantnagar'
    },
    divisions: [
      { id: 'all', nameEn: 'All Uttarakhand Grid', nameHi: 'समस्त उत्तराखंड ग्रिड', center: [29.5892, 79.6467], zoom: 8 },
      { id: 'us_nagar', nameEn: 'Pantnagar University Farmlands', nameHi: 'पंतनगर / ऊधम सिंह नगर प्रक्षेत्र', center: [28.9720, 79.4980], zoom: 16, districts: ['Pantnagar', 'Kichha', 'Rudrapur', 'Kashipur', 'Sitarganj'] },
      { id: 'haridwar', nameEn: 'Haridwar / Laksar (Cane Belt)', nameHi: 'हरिद्वार / लक्सर प्रक्षेत्र', center: [29.7540, 78.0210], zoom: 15, districts: ['Laksar', 'Roorkee', 'Bhagwanpur'] }
    ],
    farmPlots: [],
    metrics: {
      activeOutbreakClusters: 8,
      criticalRedAlerts: 3,
      totalHectaresUnderSurveillance: 185000,
      activeAffectedAreaHa: 3420,
      farmersMonitored: 24600,
      cropLossPreventedCrores: 28.4,
      targetedPesticideReductionPercent: 38.1,
      averageResponseTimeHours: 1.9,
      pendingLabVerifications: 14,
      demandShortageAlertsCount: 4
    }
  },

  // =========================================================================
  // 3. MAHARASHTRA (MH) - Lasalgaon Rural Onion Farmland Grid
  // =========================================================================
  maharashtra: {
    id: 'maharashtra',
    code: 'MH',
    nameEn: 'Maharashtra',
    nameHi: 'महाराष्ट्र शासन — कृषी आयुक्तालय',
    departmentName: 'Commissionerate of Agriculture, Govt. of Maharashtra',
    tagline: 'प्रादेशिक कृषी अधिकारी नियंत्रण कक्ष (Pune / Western Maharashtra)',
    helpline: '1800-233-4000 / 020-25537558',
    center: [20.1425, 74.2255],
    defaultZoom: 16,
    officer: {
      name: 'Dr. Suresh V. Patil',
      designation: 'Divisional Joint Director (Agri) — Pune Division',
      id: 'MH-AGRI-0211',
      zone: 'Western Ghats & Marathwada Grid',
      universityLab: 'MPKV Rahuri / Dr. PDKV Akola'
    },
    divisions: [
      { id: 'all', nameEn: 'All Maharashtra Grid', nameHi: 'समस्त महाराष्ट्र ग्रिड', center: [19.7515, 75.7139], zoom: 7 },
      { id: 'nashik', nameEn: 'Lasalgaon Onion Fields', nameHi: 'नाशिक / लासलगाव कांदा प्रक्षेत्र', center: [20.1425, 74.2255], zoom: 16, districts: ['Nashik', 'Niphad', 'Yeola', 'Jalgaon'] }
    ],
    farmPlots: [],
    metrics: {
      activeOutbreakClusters: 12,
      criticalRedAlerts: 4,
      totalHectaresUnderSurveillance: 410000,
      activeAffectedAreaHa: 6840,
      farmersMonitored: 52100,
      cropLossPreventedCrores: 51.2,
      targetedPesticideReductionPercent: 32.5,
      averageResponseTimeHours: 2.2,
      pendingLabVerifications: 21,
      demandShortageAlertsCount: 6
    }
  }
};

// Quick helper to get state by ID
export const getStateData = (stateId) => {
  return STATES_CONFIG[stateId] || STATES_CONFIG.uttar_pradesh;
};
