// Country codes and their full names
const COUNTRY_NAMES = {
    'AG': 'Antigua and Barbuda', 'AI': 'Anguilla', 'AN': 'Netherlands Antilles', 'AR': 'Argentina',
    'AW': 'Aruba', 'BB': 'Barbados', 'BM': 'Bermuda', 'BS': 'Bahamas', 'BZ': 'Belize',
    'CL': 'Chile', 'CO': 'Colombia', 'CR': 'Costa Rica', 'DM': 'Dominica', 'DO': 'Dominican Republic',
    'EC': 'Ecuador', 'FK': 'Falkland Islands', 'GD': 'Grenada', 'GT': 'Guatemala', 'GY': 'Guyana',
    'HN': 'Honduras', 'JM': 'Jamaica', 'KN': 'Saint Kitts and Nevis', 'KY': 'Cayman Islands',
    'LC': 'Saint Lucia', 'MS': 'Montserrat', 'NI': 'Nicaragua', 'PA': 'Panama', 'PE': 'Peru',
    'PY': 'Paraguay', 'SR': 'Suriname', 'SV': 'El Salvador', 'TC': 'Turks and Caicos Islands',
    'TT': 'Trinidad and Tobago', 'UY': 'Uruguay', 'VC': 'Saint Vincent', 'VE': 'Venezuela',
    'VG': 'British Virgin Islands', 'US': 'United States', 'AU': 'Australia', 'BN': 'Brunei',
    'BT': 'Bhutan', 'FJ': 'Fiji', 'FM': 'Micronesia', 'HK': 'Hong Kong', 'ID': 'Indonesia',
    'IN': 'India', 'JP': 'Japan', 'KH': 'Cambodia', 'KR': 'South Korea', 'LA': 'Laos',
    'LK': 'Sri Lanka', 'MN': 'Mongolia', 'MV': 'Maldives', 'MY': 'Malaysia', 'NP': 'Nepal',
    'NZ': 'New Zealand', 'PG': 'Papua New Guinea', 'PH': 'Philippines', 'PW': 'Palau',
    'SB': 'Solomon Islands', 'SG': 'Singapore', 'TH': 'Thailand', 'TO': 'Tonga', 'TW': 'Taiwan',
    'VN': 'Vietnam', 'VU': 'Vanuatu', 'WS': 'Samoa', 'AD': 'Andorra', 'AL': 'Albania',
    'AT': 'Austria', 'BA': 'Bosnia and Herzegovina', 'BE': 'Belgium', 'BG': 'Bulgaria',
    'CH': 'Switzerland', 'CY': 'Cyprus', 'CZ': 'Czech Republic', 'DE': 'Germany', 'DK': 'Denmark',
    'EE': 'Estonia', 'ES': 'Spain', 'FI': 'Finland', 'FO': 'Faroe Islands', 'FR': 'France',
    'GB': 'United Kingdom', 'GE': 'Georgia', 'GI': 'Gibraltar', 'GR': 'Greece', 'HR': 'Croatia',
    'HU': 'Hungary', 'IE': 'Ireland', 'IS': 'Iceland', 'IT': 'Italy', 'LI': 'Liechtenstein',
    'LT': 'Lithuania', 'LU': 'Luxembourg', 'LV': 'Latvia', 'MC': 'Monaco', 'MD': 'Moldova',
    'ME': 'Montenegro', 'MK': 'North Macedonia', 'MT': 'Malta', 'NL': 'Netherlands', 'NO': 'Norway',
    'PL': 'Poland', 'PT': 'Portugal', 'RO': 'Romania', 'RS': 'Serbia', 'SE': 'Sweden',
    'SI': 'Slovenia', 'SK': 'Slovakia', 'SM': 'San Marino', 'UA': 'Ukraine', 'AE': 'United Arab Emirates',
    'BH': 'Bahrain', 'BJ': 'Benin', 'BW': 'Botswana', 'CI': 'Ivory Coast', 'CM': 'Cameroon',
    'CV': 'Cape Verde', 'DJ': 'Djibouti', 'DZ': 'Algeria', 'EG': 'Egypt', 'ER': 'Eritrea',
    'ET': 'Ethiopia', 'GA': 'Gabon', 'GH': 'Ghana', 'GM': 'Gambia', 'GN': 'Guinea',
    'GW': 'Guinea-Bissau', 'JO': 'Jordan', 'KE': 'Kenya', 'KM': 'Comoros', 'KW': 'Kuwait',
    'LB': 'Lebanon', 'LS': 'Lesotho', 'MA': 'Morocco', 'MG': 'Madagascar', 'ML': 'Mali',
    'MR': 'Mauritania', 'MU': 'Mauritius', 'MW': 'Malawi', 'MZ': 'Mozambique', 'NA': 'Namibia',
    'NE': 'Niger', 'NG': 'Nigeria', 'OM': 'Oman', 'QA': 'Qatar', 'RW': 'Rwanda',
    'SA': 'Saudi Arabia', 'SC': 'Seychelles', 'SL': 'Sierra Leone', 'SN': 'Senegal',
    'ST': 'São Tomé and Príncipe', 'SZ': 'Eswatini', 'TD': 'Chad', 'TG': 'Togo',
    'TN': 'Tunisia', 'TZ': 'Tanzania', 'UG': 'Uganda', 'YE': 'Yemen', 'ZA': 'South Africa',
    'ZM': 'Zambia', 'ZW': 'Zimbabwe'
};

const VALID_COUNTRIES = Object.keys(COUNTRY_NAMES);

const REGION_RATES = {
    'AG': 0.054, 'BB': 0.054, 'BM': 0.054, 'BS': 0.054, 'BZ': 0.054,
    'CL': 0.054, 'CR': 0.054, 'DM': 0.054, 'DO': 0.054, 'EC': 0.054,
    'GD': 0.054, 'GT': 0.054, 'HN': 0.054, 'JM': 0.054, 'KN': 0.054,
    'KY': 0.054, 'LC': 0.054, 'NI': 0.054, 'PA': 0.054, 'PE': 0.054,
    'SV': 0.054, 'TC': 0.054, 'TT': 0.054, 'UY': 0.054, 'VE': 0.054,
    'MY': 0.039, 'SG': 0.039, 'MA': 0.044, 'BH': 0.049, 'DZ': 0.049,
    'FJ': 0.049, 'JO': 0.049, 'NC': 0.049, 'OM': 0.049, 'PF': 0.049,
    'PW': 0.049, 'SA': 0.049, 'DEFAULT': 0.034
};

const CURRENCY_INFO = {
    'AUD': {fee: 0.30, symbol: 'A$', name: 'Australian Dollar'},
    'BRL': {fee: 0.60, symbol: 'R$', name: 'Brazilian Real'},
    'CAD': {fee: 0.30, symbol: 'C$', name: 'Canadian Dollar'},
    'CZK': {fee: 10.00, symbol: 'Kč', name: 'Czech Koruna'},
    'DKK': {fee: 2.60, symbol: 'kr', name: 'Danish Krone'},
    'EUR': {fee: 0.35, symbol: '€', name: 'Euro'},
    'HKD': {fee: 2.35, symbol: 'HK$', name: 'Hong Kong Dollar'},
    'HUF': {fee: 90.00, symbol: 'Ft', name: 'Hungarian Forint'},
    'ILS': {fee: 1.20, symbol: '₪', name: 'Israeli New Shekel'},
    'JPY': {fee: 40.00, symbol: '¥', name: 'Japanese Yen'},
    'MYR': {fee: 2.00, symbol: 'RM', name: 'Malaysian Ringgit'},
    'MXN': {fee: 4.00, symbol: 'Mex$', name: 'Mexican Peso'},
    'TWD': {fee: 10.00, symbol: 'NT$', name: 'New Taiwan Dollar'},
    'NZD': {fee: 0.45, symbol: 'NZ$', name: 'New Zealand Dollar'},
    'NOK': {fee: 2.80, symbol: 'kr', name: 'Norwegian Krone'},
    'PHP': {fee: 15.00, symbol: '₱', name: 'Philippine Peso'},
    'PLN': {fee: 1.35, symbol: 'zł', name: 'Polish Złoty'},
    'RUB': {fee: 10.00, symbol: '₽', name: 'Russian Ruble'},
    'SGD': {fee: 0.50, symbol: 'S$', name: 'Singapore Dollar'},
    'SEK': {fee: 3.25, symbol: 'kr', name: 'Swedish Krona'},
    'CHF': {fee: 0.55, symbol: 'Fr.', name: 'Swiss Franc'},
    'THB': {fee: 11.00, symbol: '฿', name: 'Thai Baht'},
    'GBP': {fee: 0.20, symbol: '£', name: 'British Pound'},
    'USD': {fee: 0.30, symbol: '$', name: 'US Dollar'}
};

export function getCountries() {
    return VALID_COUNTRIES.sort().map(code => ({
        code,
        name: COUNTRY_NAMES[code]
    }));
}

export function getBaseRate(countryCode) {
    return REGION_RATES[countryCode] || REGION_RATES.DEFAULT;
}

export function getCurrencyInfo(currencyCode) {
    return CURRENCY_INFO[currencyCode] || CURRENCY_INFO.USD;
}

export function getCurrencies() {
    return Object.entries(CURRENCY_INFO).map(([code, info]) => ({
        code,
        name: info.name,
        symbol: info.symbol
    }));
}

export { CURRENCY_INFO, COUNTRY_NAMES };