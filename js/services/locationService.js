export async function detectUserCountry() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return data.country_code; // Returns ISO 3166-1 alpha-2 country code
    } catch (error) {
        console.error('Error detecting country:', error);
        return 'US'; // Default fallback
    }
}
