import math

"""
Enhanced PayPal Fee Calculator

This script calculates the gross amount needed to charge to receive a desired net amount
after PayPal fees, including domestic/international transaction fees, region-specific rates,
and currency conversion fees where applicable.
"""

# Valid PayPal country codes
VALID_COUNTRIES = {
    # All Americas
    'AG', 'AI', 'AN', 'AR', 'AW', 'BB', 'BM', 'BS', 'BZ', 'CL', 'CO', 'CR', 'DM', 'DO', 'EC',
    'FK', 'GD', 'GT', 'GY', 'HN', 'JM', 'KN', 'KY', 'LC', 'MS', 'NI', 'PA', 'PE', 'PY', 'SR',
    'SV', 'TC', 'TT', 'UY', 'VC', 'VE', 'VG', 'US',
    # Asia Pacific
    'AU', 'BN', 'BT', 'FJ', 'FM', 'HK', 'ID', 'IN', 'JP', 'KH', 'KR', 'LA', 'LK', 'MN', 'MV',
    'MY', 'NP', 'NZ', 'PG', 'PH', 'PW', 'SB', 'SG', 'TH', 'TO', 'TW', 'VN', 'VU', 'WS',
    # Europe
    'AD', 'AL', 'AT', 'BA', 'BE', 'BG', 'CH', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FO',
    'FR', 'GB', 'GE', 'GI', 'GR', 'HR', 'HU', 'IE', 'IS', 'IT', 'LI', 'LT', 'LU', 'LV', 'MC',
    'MD', 'ME', 'MK', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'RS', 'SE', 'SI', 'SK', 'SM', 'UA',
    # Middle East & Africa
    'AE', 'BH', 'BJ', 'BW', 'CI', 'CM', 'CV', 'DJ', 'DZ', 'EG', 'ER', 'ET', 'GA', 'GH', 'GM',
    'GN', 'GW', 'JO', 'KE', 'KM', 'KW', 'LB', 'LS', 'MA', 'MG', 'ML', 'MR', 'MU', 'MW', 'MZ',
    'NA', 'NE', 'NG', 'OM', 'QA', 'RW', 'SA', 'SC', 'SL', 'SN', 'ST', 'SZ', 'TD', 'TG', 'TN',
    'TZ', 'UG', 'YE', 'ZA', 'ZM', 'ZW'
}

# Region/Country codes and their standard domestic rates
REGION_RATES = {
    # Americas (5.40% + fixed fee)
    'AG': 0.054, 'BB': 0.054, 'BM': 0.054, 'BS': 0.054, 'BZ': 0.054,
    'CL': 0.054, 'CR': 0.054, 'DM': 0.054, 'DO': 0.054, 'EC': 0.054,
    'GD': 0.054, 'GT': 0.054, 'HN': 0.054, 'JM': 0.054, 'KN': 0.054,
    'KY': 0.054, 'LC': 0.054, 'NI': 0.054, 'PA': 0.054, 'PE': 0.054,
    'SV': 0.054, 'TC': 0.054, 'TT': 0.054, 'UY': 0.054, 'VE': 0.054,
    # MY & SG (3.90% + fixed fee)
    'MY': 0.039, 'SG': 0.039,
    # MA (4.40% + fixed fee)
    'MA': 0.044,
    # BH, DZ, etc (4.90% + fixed fee)
    'BH': 0.049, 'DZ': 0.049, 'FJ': 0.049, 'JO': 0.049, 'NC': 0.049,
    'OM': 0.049, 'PF': 0.049, 'PW': 0.049, 'SA': 0.049,
    # Default for all other valid PayPal countries (3.40% + fixed fee)
    'DEFAULT': 0.034
}

# Fixed fees and currency symbols by currency
CURRENCY_INFO = {
    'AUD': {'fee': 0.30, 'symbol': 'A$'},
    'BRL': {'fee': 0.60, 'symbol': 'R$'},
    'CAD': {'fee': 0.30, 'symbol': 'C$'},
    'CZK': {'fee': 10.00, 'symbol': 'Kč'},
    'DKK': {'fee': 2.60, 'symbol': 'kr'},
    'EUR': {'fee': 0.35, 'symbol': '€'},
    'HKD': {'fee': 2.35, 'symbol': 'HK$'},
    'HUF': {'fee': 90.00, 'symbol': 'Ft'},
    'ILS': {'fee': 1.20, 'symbol': '₪'},
    'JPY': {'fee': 40.00, 'symbol': '¥'},
    'MYR': {'fee': 2.00, 'symbol': 'RM'},
    'MXN': {'fee': 4.00, 'symbol': 'Mex$'},
    'TWD': {'fee': 10.00, 'symbol': 'NT$'},
    'NZD': {'fee': 0.45, 'symbol': 'NZ$'},
    'NOK': {'fee': 2.80, 'symbol': 'kr'},
    'PHP': {'fee': 15.00, 'symbol': '₱'},
    'PLN': {'fee': 1.35, 'symbol': 'zł'},
    'RUB': {'fee': 10.00, 'symbol': '₽'},
    'SGD': {'fee': 0.50, 'symbol': 'S$'},
    'SEK': {'fee': 3.25, 'symbol': 'kr'},
    'CHF': {'fee': 0.55, 'symbol': 'Fr.'},
    'THB': {'fee': 11.00, 'symbol': '฿'},
    'GBP': {'fee': 0.20, 'symbol': '£'},
    'USD': {'fee': 0.30, 'symbol': '$'}
}

def get_country_input(prompt, default="HN"):
    """
    Get a valid country code input from the user.
    """
    while True:
        response = input(f"{prompt} (default {default}, press Enter to accept): ").strip().upper()
        if response == "":
            print(f"Using default country code: {default}")
            return default
        if response in VALID_COUNTRIES:
            return response
        retry = input(f"Invalid country code. Would you like to try again? (Y/n, press Enter to use default {default}): ").strip().lower()
        if retry not in ['y', 'yes']:
            print(f"Using default country code: {default}")
            return default

def get_currency_input(prompt, default="USD"):
    """
    Get a valid currency code input from the user.
    """
    while True:
        response = input(f"{prompt} (default {default}, press Enter to accept): ").strip().upper()
        if response == "":
            print(f"Using default currency: {default}")
            return default
        if response in CURRENCY_INFO:
            return response
        retry = input(f"Invalid currency code. Would you like to try again? (Y/n, press Enter to use default {default}): ").strip().lower()
        if retry not in ['y', 'yes']:
            print(f"Using default currency: {default}")
            return default

def get_float_input(prompt):
    """
    Get a valid positive float input from the user.
    """
    while True:
        try:
            value = float(input(prompt))
            if value <= 0:
                print("Please enter a positive number.")
            else:
                return value
        except ValueError:
            print("Invalid input. Please enter a numeric value.")

def get_yes_no(prompt, default=True):
    """
    Get a yes/no response from the user with a default value.
    """
    default_response = "Y/n" if default else "y/N"
    prompt_with_default = f"{prompt} ({default_response}): "
    response = input(prompt_with_default).strip().lower()
    if response == "":
        return default
    elif response in ['yes', 'y']:
        return True
    elif response in ['no', 'n']:
        return False
    else:
        print("Please enter 'yes' or 'no'.")
        return get_yes_no(prompt, default)

def get_rounding_precision(desired_amount):
    """
    Get the rounding precision value from the user.
    """
    default_precision = 10 if desired_amount > 150 else 5
    while True:
        response = input(f"Enter the rounding precision (default {default_precision}, press Enter to accept): ")
        if response == "":
            print(f"Using default precision: {default_precision}")
            return default_precision
        try:
            precision = int(response)
            if precision <= 0:
                print("Please enter a positive integer greater than zero.")
            else:
                return precision
        except ValueError:
            print("Invalid input. Please enter an integer value.")

def calculate_fees(desired_amount, merchant_country, is_international,
                  currency, add_transfer_fee=False, transfer_type=None, rounding_precision=5):
    """
    Calculate PayPal fees and gross amount needed.
    """
    # Get base rate for merchant's country
    base_rate = REGION_RATES.get(merchant_country, REGION_RATES['DEFAULT'])

    # Add international fee if applicable (generally +1%)
    if is_international:
        base_rate += 0.01

    # Get fixed fee for currency
    fixed_fee = CURRENCY_INFO[currency]['fee']

    # Calculate initial gross amount (removed redundant calculations)
    gross_amount = (desired_amount + fixed_fee) / (1 - base_rate)

    # Calculate transfer fee
    if add_transfer_fee:
        if transfer_type == "card":
            # Fixed fee for debit card withdrawals
            transfer_fee = 5.0
        elif transfer_type == "us_bank":
            # No fee for standard ACH to US bank accounts
            transfer_fee = 0.0
        elif transfer_type == "intl_bank":
            # Fee varies by country for international bank transfers
            if merchant_country in ['HR', 'IS']:  # Croatia, Iceland
                transfer_fee = 3.00  # 3.00 EUR equivalent
            else:
                transfer_fee = 5.0  # Default international bank transfer fee
        else:
            transfer_fee = 0.0
    else:
        transfer_fee = 0.0

    # Add transfer fee to gross amount if applicable
    if transfer_fee > 0:
        gross_amount = (desired_amount + fixed_fee + transfer_fee) / (1 - base_rate)

    # Round up to the nearest multiple of rounding_precision
    gross_amount = math.ceil(gross_amount / rounding_precision) * rounding_precision

    # Recalculate fees based on rounded gross amount
    percentage_fee = gross_amount * base_rate
    total_fees = percentage_fee + fixed_fee + transfer_fee
    net_amount = gross_amount - total_fees

    # Keep increasing gross amount by rounding_precision until we meet or exceed desired amount
    while net_amount < desired_amount:
        gross_amount += rounding_precision
        percentage_fee = gross_amount * base_rate
        total_fees = percentage_fee + fixed_fee + transfer_fee
        net_amount = gross_amount - total_fees

    fees_breakdown = {
        'gross_amount': gross_amount,
        'percentage_rate': base_rate * 100,
        'percentage_fee': percentage_fee,
        'fixed_fee': fixed_fee,
        'transfer_fee': transfer_fee,
        'total_fees': total_fees,
        'net_amount': net_amount,
        'currency_symbol': CURRENCY_INFO[currency]['symbol']
    }

    return gross_amount, fees_breakdown

def main():
    """
    Main function that handles user input and displays the calculated amounts.
    """
    print("\n=== Enhanced PayPal Fee Calculator ===\n")

    # Get merchant's country
    merchant_country = get_country_input("Enter merchant's country code (e.g., HN for Honduras)")

    # Get currency
    currency = get_currency_input("Enter the currency code for the transaction")
    currency_symbol = CURRENCY_INFO[currency]['symbol']

    # Get desired amount
    desired_amount = get_float_input(f"Enter the desired amount to receive after fees ({currency_symbol}): ")

    # Get rounding precision
    rounding_precision = get_rounding_precision(desired_amount)

    # Check if international
    is_international = get_yes_no("Is this an international transaction?")

    # Check if transfer fee should be included
    add_transfer_fee = get_yes_no("Do you want to add the transfer fee?")

    transfer_type = None
    if add_transfer_fee:
        print("\nTransfer method options:")
        print("1. Debit card withdrawal (Default, $5.00 fee)")
        print("2. US Bank account (Standard ACH, no fee)")
        print("3. International bank account")

        while True:
            transfer_choice = input("\nEnter transfer method (1-3, press Enter for default): ").strip()
            if transfer_choice == "" or transfer_choice == "1":
                transfer_type = "card"
                print("Using debit card withdrawal with $5.00 fee")
                break
            elif transfer_choice == "2":
                transfer_type = "us_bank"
                print("Using US bank account with no fee")
                break
            elif transfer_choice == "3":
                transfer_type = "intl_bank"
                print("Using international bank account")
                break
            else:
                print("Invalid choice. Please enter 1, 2, or 3")

    # Calculate fees (pass transfer_type to calculate_fees)
    gross_amount, fees = calculate_fees(
        desired_amount, merchant_country, is_international,
        currency, add_transfer_fee, transfer_type, rounding_precision
    )

    # Display results
    symbol = fees['currency_symbol']
    print("\n=== Fee Calculation Results ===")
    print(f"\nAmount to charge: {symbol}{fees['gross_amount']:.2f} {currency}")
    print(f"Fee breakdown:")
    print(f"- Percentage fee ({fees['percentage_rate']:.2f}%): {symbol}{fees['percentage_fee']:.2f} {currency}")
    print(f"- Fixed fee: {symbol}{fees['fixed_fee']:.2f} {currency}")
    if add_transfer_fee:
        print(f"- Transfer fee: {symbol}{fees['transfer_fee']:.2f} {currency}")
    print(f"Total fees: {symbol}{fees['total_fees']:.2f} {currency}")
    print(f"Net amount you will receive: {symbol}{fees['net_amount']:.2f} {currency}")

if __name__ == "__main__":
    main()