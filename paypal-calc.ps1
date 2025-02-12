[CmdletBinding()]
param (
    [Parameter(Mandatory = $false, HelpMessage = "Merchant's country code (e.g., HN for Honduras)")]
    [string]$Country = "",

    [Parameter(Mandatory = $false, HelpMessage = "Currency code for the transaction (e.g., USD)")]
    [string]$Currency = "",

    [Parameter(Mandatory = $false, HelpMessage = "Desired amount to receive after fees")]
    [decimal]$Amount = 0,

    [Parameter(Mandatory = $false, HelpMessage = "Rounding precision for calculations")]
    [int]$RoundingPrecision = 0,

    [Parameter(Mandatory = $false, HelpMessage = "Specify if this is an international transaction")]
    [switch]$International,

    [Parameter(Mandatory = $false, HelpMessage = "Include transfer fee in calculations")]
    [switch]$IncludeTransferFee,

    [Parameter(Mandatory = $false, HelpMessage = "Transfer method: card, us_bank, or intl_bank")]
    [ValidateSet("card", "us_bank", "intl_bank")]
    [string]$TransferMethod = "card",

    [Parameter(Mandatory = $false, HelpMessage = "Show help information")]
    [switch]$Help
)

# Get the directory where this PowerShell script is located
$scriptPath = $PSScriptRoot
# Get the full path to the Python script
$pythonScriptPath = Join-Path $scriptPath "paypal-price.py"

function Show-Help {
    Write-Host @"
PayPal Fee Calculator
Usage: .\paypal-calc.ps1 [parameters]

Run without parameters for interactive mode.

Required Parameters (when not using interactive mode):
    -Amount <decimal>           The desired amount to receive after fees

Optional Parameters:
    -Country <string>          Merchant's country code (default: HN)
    -Currency <string>         Transaction currency code (default: USD)
    -RoundingPrecision <int>   Rounding precision for calculations (default: 5)
    -International            Flag for international transactions
    -IncludeTransferFee       Include transfer fee in calculations
    -TransferMethod <string>   Transfer method (card, us_bank, or intl_bank)
    -Help                     Show this help message

Examples:
    # Run in interactive mode
    .\paypal-calc.ps1

    # Calculate fees for receiving $100 USD
    .\paypal-calc.ps1 -Amount 100

    # International transaction in Euros with transfer fee
    .\paypal-calc.ps1 -Amount 50 -Currency EUR -Country DE -International -IncludeTransferFee -TransferMethod intl_bank

    # Domestic transaction with custom rounding
    .\paypal-calc.ps1 -Amount 75.50 -RoundingPrecision 10
"@
    exit
}

# Show help if requested
if ($Help) {
    Show-Help
}

# Check if we're running in interactive mode (no parameters specified)
$isInteractiveMode = $Country -eq "" -and $Currency -eq "" -and $Amount -eq 0 -and $RoundingPrecision -eq 0 -and 
                    -not $International.IsPresent -and -not $IncludeTransferFee.IsPresent

if ($isInteractiveMode) {
    # Run Python script in interactive mode using full path
    python $pythonScriptPath
}
else {
    # Validate required parameters for non-interactive mode
    if ($Amount -eq 0) {
        Write-Host "Error: Amount parameter is required when not running in interactive mode." -ForegroundColor Red
        Write-Host "Run with -Help for usage information or run without parameters for interactive mode." -ForegroundColor Yellow
        exit 1
    }

    # Set default values if not provided
    if ($Country -eq "") { $Country = "HN" }
    if ($Currency -eq "") { $Currency = "USD" }
    if ($RoundingPrecision -eq 0) { $RoundingPrecision = 5 }

    # Prepare the Python command with arguments using full path
    $pythonArgs = @(
        $pythonScriptPath
    )

    # Simulate interactive input by creating an input string
    $inputString = @"
$Country
$Currency
$Amount
$RoundingPrecision
$($International.IsPresent ? "y" : "n")
$($IncludeTransferFee.IsPresent ? "y" : "n")
"@

    # Add transfer method selection if transfer fee is included
    if ($IncludeTransferFee.IsPresent) {
        $transferMethodNum = switch ($TransferMethod) {
            "card" { "1" }
            "us_bank" { "2" }
            "intl_bank" { "3" }
        }
        $inputString += "`n$transferMethodNum"
    }

    # Execute the Python script with the prepared input using full path
    $inputString | python $pythonArgs
} 