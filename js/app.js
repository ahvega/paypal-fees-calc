import { getCountries, getBaseRate, getCurrencyInfo, getCurrencies } from './config.js';
import { detectUserCountry } from './services/locationService.js';

// Initialize DOM elements
const amountInput = document.getElementById('amount');
const countrySelect = document.getElementById('country');
const currencySelect = document.getElementById('currency');
const themeToggle = document.getElementById('theme-toggle');
const currencySymbol = document.getElementById('currency-symbol');
const includeTransferFeeCheckbox = document.getElementById('include-transfer-fee');
const transferTypeSelect = document.getElementById('transfer-type-select');
const transferTypeDropdown = document.getElementById('transfer-type');
const roundingPrecisionInput = document.getElementById('rounding-precision');

// Initialize app state
let currentCurrency = 'USD';
let currentTheme = localStorage.getItem('theme') || 'dark';
let isTransferFeeIncluded = false;
let selectedTransferType = 'card';
let roundingPrecision = 5;

// Populate country and currency dropdowns
function initDropdowns() {
    // Country options
    getCountries().forEach(({ code, name }) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = name;
        countrySelect.appendChild(option);
    });

    // Currency options
    getCurrencies().forEach(({ code, name, symbol }) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = `${name} (${code})`;
        currencySelect.appendChild(option);
    });

    // Only set currency default, country will be set by detectUserCountry
    currencySelect.value = 'USD';
}

// Theme handling
function handleTheme() {
    // Apply smooth transitions
    document.documentElement.style.transition = 'background-color 0.3s, color 0.3s';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
}

// Initialize theme toggle
function initThemeToggle() {
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        handleTheme();
    });
}

// Calculate fees based on inputs
function validateInputs() {
    const amount = parseFloat(amountInput.value);
    const precision = parseInt(roundingPrecisionInput.value);

    if (isNaN(amount) || amount <= 0) {
        amountInput.classList.add('input-error');
        return false;
    }
    amountInput.classList.remove('input-error');

    if (isNaN(precision) || precision <= 0) {
        roundingPrecisionInput.classList.add('input-error');
        return false;
    }
    roundingPrecisionInput.classList.remove('input-error');

    return true;
}

function calculateFees() {
    if (!validateInputs()) {
        document.querySelectorAll('.stat-value').forEach(el => el.textContent = '-');
        return;
    }

    let amount = parseFloat(amountInput.value);
    const country = countrySelect.value;
    const isInternational = document.querySelector('input[name="transaction-type"]:checked').value === 'international';
    const currency = currencySelect.value;
    isTransferFeeIncluded = includeTransferFeeCheckbox.checked;
    selectedTransferType = transferTypeDropdown.value;

    // Dynamic default rounding precision
    roundingPrecisionInput.placeholder = amount < 150 ? '5' : '10'; // Set default placeholder
    roundingPrecision = parseInt(roundingPrecisionInput.value) || (amount < 150 ? 5 : 10);

    const currencyInfo = getCurrencyInfo(currency);
    let baseRate = getBaseRate(country);
    if (isInternational) baseRate += 0.01;

    let fixedFee = currencyInfo.fee;
    let transferFee = 0;

    if (isTransferFeeIncluded) {
        transferTypeSelect.style.display = 'block'; // Show transfer type dropdown
        if (selectedTransferType === 'card') {
            transferFee = 5.0; // Fixed fee for debit card withdrawals
        } else if (selectedTransferType === 'intl_bank') {
            transferFee = 5.0; // Default international bank transfer fee
        } // US bank has no transfer fee
    } else {
        transferTypeSelect.style.display = 'none'; // Hide transfer type dropdown
    }

    let grossAmount = (amount + fixedFee + transferFee) / (1 - baseRate);

    // Rounding logic
    grossAmount = Math.ceil(grossAmount / roundingPrecision) * roundingPrecision;

    const percentageFee = grossAmount * baseRate;
    const totalFees = percentageFee + fixedFee + transferFee;
    const netAmount = grossAmount - totalFees;

    updateUI({
        grossAmount,
        percentageFee,
        fixedFee,
        transferFee,
        totalFees,
        netAmount: netAmount,
        roundedGrossAmount: grossAmount,
        currencySymbol: currencyInfo.symbol,
        baseRate: baseRate * 100 // Convert to percentage
    });
}

// Update UI with calculation results
function updateUI(results) {
    const formatCurrency = (value) => {
        if (value === null || value === undefined || isNaN(value)) {
            return '$0.00'; // Or "Not Included" for transfer fee
        }
        return value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    document.getElementById('gross-amount').textContent =
        `${results.currencySymbol}${formatCurrency(results.grossAmount)}`;
    document.getElementById('percentage-fee').textContent =
        `(${results.baseRate.toFixed(2)}%) ${results.currencySymbol}${formatCurrency(results.percentageFee)}`;
    document.getElementById('fixed-fee').textContent =
        `${results.currencySymbol}${formatCurrency(results.fixedFee)}`;
    let transferFeeText;
    if (!isTransferFeeIncluded) {
        transferFeeText = 'Not Included';
    } else {
        transferFeeText = `${results.currencySymbol}${formatCurrency(results.transferFee)}`;
        if (selectedTransferType === 'card') {
            transferFeeText = '(Debit Card withdrawal) ' + transferFeeText;
        } else if (selectedTransferType === 'us_bank') {
            transferFeeText = '(US Bank account) ' + transferFeeText;
        } else if (selectedTransferType === 'intl_bank') {
            transferFeeText = '(International bank account) ' + transferFeeText;
        }
    }
    document.getElementById('transfer-fee').textContent = transferFeeText;
    document.getElementById('total-fees').textContent =
        `${results.currencySymbol}${formatCurrency(results.totalFees)}`;
    document.getElementById('net-amount').textContent =
        `${results.currencySymbol}${formatCurrency(results.netAmount)}`;
    document.getElementById('rounded-gross-amount').textContent =
        `${results.currencySymbol}${formatCurrency(results.roundedGrossAmount)}`;
}

// Event listeners
function initEventListeners() {
    [amountInput, countrySelect, currencySelect, includeTransferFeeCheckbox,
     transferTypeDropdown, roundingPrecisionInput].forEach(element => {
        element.addEventListener('input', calculateFees);
    });

    document.querySelectorAll('input[name="transaction-type"]').forEach(radio => {
        radio.addEventListener('change', calculateFees);
    });

    currencySelect.addEventListener('change', () => {
        currentCurrency = currencySelect.value;
        const { symbol } = getCurrencyInfo(currentCurrency);
        currencySymbol.textContent = symbol;
    });

    includeTransferFeeCheckbox.addEventListener('change', () => {
        transferTypeSelect.style.display = includeTransferFeeCheckbox.checked ? 'block' : 'none';
        calculateFees(); // Recalculate fees when transfer fee inclusion changes
    });

    transferTypeDropdown.addEventListener('change', calculateFees);
    roundingPrecisionInput.addEventListener('change', calculateFees);
}

// Handle window resize and orientation change
function handleWindowResize() {
    document.body.style.fontSize = Math.min(16, window.innerHeight / 60) + 'px';
}

function handleOrientationChange() {
    if (window.innerHeight > window.innerWidth) {
        document.body.classList.add('portrait');
        document.body.classList.remove('landscape');
    } else {
        document.body.classList.add('landscape');
        document.body.classList.remove('portrait');
    }
}

window.addEventListener('resize', handleWindowResize);
window.addEventListener('orientationchange', handleOrientationChange);

// Initialize app
async function initializeForm() {
    const countrySelect = document.getElementById('country');

    // Add loading state
    countrySelect.innerHTML = '<option value="" selected>Detecting location...</option>';

    try {
        const userCountry = await detectUserCountry();

        // Populate countries (your existing code)
        initDropdowns();

        // Set detected country as selected
        if (countrySelect.querySelector(`option[value="${userCountry}"]`)) {
          console
            countrySelect.value = userCountry;
            // Trigger change event to update related fields
            countrySelect.dispatchEvent(new Event('change'));
        }
    } catch (error) {
        console.error('Error initializing form:', error);
        initDropdowns(); // Fallback to normal initialization
    }
}

// Call initializeForm instead of populateCountries directly
document.addEventListener('DOMContentLoaded', initializeForm);

function init() {
    handleTheme();
    initThemeToggle();
    initEventListeners();
    calculateFees();
    handleWindowResize();
    handleOrientationChange();
}

init();
