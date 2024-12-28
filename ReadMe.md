# PayPal Fees Calculator

This script calculates the gross amount you need to charge in order to receive a desired net amount after PayPal fees. It takes into account whether the transaction is international and whether to include a transfer fee.

## Features

- Calculates the gross amount to charge to receive a desired net amount.
- Supports both domestic and international transactions.
- Option to include a transfer fee.
- Allows setting a custom rounding precision.

## Requirements

- Python 3.x

## Usage

1. Clone the repository or download the script file `paypal-price.py`.
2. Run the script using Python:

    ```sh
    python paypal-price.py
    ```

3. Follow the prompts to enter the desired amount, transaction type, and other options.

## Prompts

- **Enter the desired amount to receive after fees:** Enter the net amount you want to receive after all fees.
- **Is the transaction international? (Y/n):** Specify if the transaction is international. Default is 'Yes'.
- **Do you want to add the transfer fee? (Y/n):** Specify if you want to include the transfer fee. Default is 'Yes'.
- **Enter the rounding precision (default X):** Enter the rounding precision. Default is 10 if the desired amount is greater than $150, otherwise 5.

## Example

```sh
Enter the desired amount to receive after fees: $100
Is the transaction international? (Y/n): n
Do you want to add the transfer fee? (Y/n): y
Enter the rounding precision (default 5): 5
```

Output:

```sh
Amount to charge: $110.00
Net amount you will get: $101.51
```

## License

This project is licensed under the MIT License.
