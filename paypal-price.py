import math

"""
PayPal Fee Calculator

This script calculates the gross amount needed to charge in order to receive
a desired net amount after PayPal fees. It handles both domestic and international
transactions, and allows for custom rounding precision.
"""

def get_float_input(prompt):
    """
    Get a valid positive float input from the user.

    Args:
        prompt (str): The prompt message to display to the user

    Returns:
        float: The validated positive float value

    Raises:
        ValueError: If input cannot be converted to float
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

    Args:
        prompt (str): The prompt message to display
        default (bool): The default value if user presses enter

    Returns:
        bool: True for yes, False for no
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

    Args:
        desired_amount (float): The desired net amount, used to determine default precision

    Returns:
        int: The rounding precision value (must be positive integer)

    Raises:
        ValueError: If input cannot be converted to integer
    """
    default_precision = 10 if desired_amount > 150 else 5
    while True:
        response = input(f"Enter the rounding precision (default {default_precision}): ")
        if response == "":
            return default_precision
        try:
            precision = int(response)
            if precision <= 0:
                print("Please enter a positive integer greater than zero.")
            else:
                return precision
        except ValueError:
            print("Invalid input. Please enter an integer value.")

def calculate_gross_amount(desired_amount, is_international, add_transfer_fee, rounding_precision):
    """
    Calculate the gross amount needed to charge to receive the desired net amount after fees.

    Args:
        desired_amount (float): The desired net amount to receive
        is_international (bool): True for international transactions, False for domestic
        add_transfer_fee (bool): Whether to include the transfer fee
        rounding_precision (int): The rounding precision for the final amount

    Returns:
        tuple: (gross_amount, net_amount) where:
            gross_amount (float): The amount to charge
            net_amount (float): The amount received after fees
    """
    if is_international:
        fee_percentage = 0.044
    else:
        fee_percentage = 0.029
    fixed_fee = 0.30
    transfer_fee = 5.0 if add_transfer_fee else 0.0

    # Calculate gross amount before rounding
    gross_amount = (desired_amount + fixed_fee + transfer_fee) / (1 - fee_percentage)

    # Round up to the nearest multiple of rounding_precision
    rounded_gross = math.ceil(gross_amount / rounding_precision) * rounding_precision

    # Calculate net amount received
    fees = rounded_gross * fee_percentage + fixed_fee + transfer_fee
    net_amount = rounded_gross - fees

    # Check if net_amount meets the desired amount, if not, round up to the next multiple
    while net_amount < desired_amount:
        rounded_gross += rounding_precision
        fees = rounded_gross * fee_percentage + fixed_fee + transfer_fee
        net_amount = rounded_gross - fees

    return rounded_gross, net_amount

def main():
    """
    Main function that handles user input and displays the calculated amounts.
    """
    desired_amount = get_float_input("Enter the desired amount to receive after fees: $")
    is_international = get_yes_no("Is the transaction international?", default=True)
    add_transfer_fee = get_yes_no("Do you want to add the transfer fee?", default=True)
    rounding_precision = get_rounding_precision(desired_amount)

    gross_amount, net_amount = calculate_gross_amount(desired_amount, is_international, add_transfer_fee, rounding_precision)

    print(f"Amount to charge: ${gross_amount:.2f}")
    print(f"Net amount you will get: ${net_amount:.2f}")

if __name__ == "__main__":
    main()
