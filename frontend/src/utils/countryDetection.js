import { countries, getCountryByCode, getDefaultCountry } from '../data/countries';

export const detectUserCountry = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.country) {
      const detectedCountry = getCountryByCode(data.country);
      if (detectedCountry) {
        return detectedCountry;
      }
    }
    
    // Fallback to default country if detection fails
    return getDefaultCountry();
  } catch (error) {
    console.error('Error detecting country:', error);
    return getDefaultCountry();
  }
};

export const searchCountries = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return countries.filter(country =>
    country.name.toLowerCase().includes(term) ||
    country.phoneCode.includes(term) ||
    country.code.toLowerCase().includes(term)
  );
}; 