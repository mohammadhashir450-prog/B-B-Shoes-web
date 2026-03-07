# MongoDB Atlas DNS Fixer
# This script changes your DNS to Google DNS (8.8.8.8) to fix MongoDB Atlas connectivity

Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   MongoDB Atlas DNS Configuration Fix     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ This script requires Administrator privileges" -ForegroundColor Red
    Write-Host "`n📌 How to run as Administrator:" -ForegroundColor Yellow
    Write-Host "   1. Right-click on PowerShell" -ForegroundColor Yellow
    Write-Host "   2. Select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host "   3. Navigate to this directory" -ForegroundColor Yellow
    Write-Host "   4. Run: .\fix-dns.ps1`n" -ForegroundColor Yellow
    
    Write-Host "🔄 Quick Option: Copy and run this command:" -ForegroundColor Cyan
    Write-Host "   Start-Process powershell -Verb RunAs -ArgumentList '-NoExit', '-Command', 'cd `"$PWD`"; .\fix-dns.ps1'" -ForegroundColor Green
    
    Read-Host "`nPress Enter to exit"
    exit 1
}

Write-Host "✅ Running with Administrator privileges`n" -ForegroundColor Green

# Function to get active network adapters
function Get-ActiveNetworkAdapters {
    $adapters = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' -and $_.Virtual -eq $false }
    return $adapters
}

# Show current DNS configuration
Write-Host "🔍 Current DNS Configuration:" -ForegroundColor Cyan
Write-Host "─────────────────────────────────────────`n" -ForegroundColor Cyan

$activeAdapters = Get-ActiveNetworkAdapters

if ($activeAdapters.Count -eq 0) {
    Write-Host "❌ No active network adapters found!" -ForegroundColor Red
    Read-Host "`nPress Enter to exit"
    exit 1
}

foreach ($adapter in $activeAdapters) {
    Write-Host "📡 Adapter: $($adapter.Name)" -ForegroundColor Yellow
    $dnsServers = Get-DnsClientServerAddress -InterfaceAlias $adapter.Name -AddressFamily IPv4
    if ($dnsServers.ServerAddresses) {
        Write-Host "   Current DNS: $($dnsServers.ServerAddresses -join ', ')" -ForegroundColor White
    } else {
        Write-Host "   Current DNS: Automatic (DHCP)" -ForegroundColor White
    }
}

# Ask for confirmation
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🔧 This will change DNS to:" -ForegroundColor Yellow
Write-Host "   • Preferred DNS:  8.8.8.8 (Google)" -ForegroundColor Green
Write-Host "   • Alternate DNS:  8.8.4.4 (Google)" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

$confirm = Read-Host "Do you want to proceed? (Y/N)"

if ($confirm -ne 'Y' -and $confirm -ne 'y') {
    Write-Host "`n❌ Operation cancelled by user" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 0
}

Write-Host "`n🔄 Applying DNS changes...`n" -ForegroundColor Cyan

# Apply DNS changes
$successCount = 0
$failCount = 0

foreach ($adapter in $activeAdapters) {
    Write-Host "🔧 Configuring: $($adapter.Name)" -ForegroundColor Yellow
    
    try {
        # Set Google DNS servers
        Set-DnsClientServerAddress -InterfaceAlias $adapter.Name -ServerAddresses ("8.8.8.8", "8.8.4.4")
        Write-Host "   ✅ DNS changed successfully" -ForegroundColor Green
        $successCount++
    } catch {
        Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
}

# Flush DNS cache
Write-Host "`n🧹 Flushing DNS cache..." -ForegroundColor Cyan
try {
    ipconfig /flushdns | Out-Null
    Clear-DnsClientCache
    Write-Host "✅ DNS cache cleared successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Warning: Could not clear DNS cache" -ForegroundColor Yellow
}

# Show results
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 Results:" -ForegroundColor Cyan
Write-Host "   • Success: $successCount adapter(s)" -ForegroundColor Green
Write-Host "   • Failed:  $failCount adapter(s)" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Gray" })
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

if ($successCount -gt 0) {
    Write-Host "✅ DNS Configuration Updated!" -ForegroundColor Green
    Write-Host "`n📝 New DNS Configuration:" -ForegroundColor Cyan
    
    foreach ($adapter in $activeAdapters) {
        $dnsServers = Get-DnsClientServerAddress -InterfaceAlias $adapter.Name -AddressFamily IPv4
        Write-Host "   $($adapter.Name): $($dnsServers.ServerAddresses -join ', ')" -ForegroundColor White
    }
    
    Write-Host "`n🔄 Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Wait 5-10 seconds for DNS to refresh" -ForegroundColor White
    Write-Host "   2. Test connection: node fix-atlas-connection.js" -ForegroundColor White
    Write-Host "   3. Start dev server: npm run dev" -ForegroundColor White
    Write-Host "   4. Check logs for: '✅ MongoDB Atlas Connected Successfully!'`n" -ForegroundColor White
    
    Write-Host "🧪 Testing MongoDB Atlas DNS now..." -ForegroundColor Cyan
    Start-Sleep -Seconds 3
    
    Write-Host "`nRunning diagnostic..." -ForegroundColor Yellow
    node fix-atlas-connection.js
    
} else {
    Write-Host "❌ Failed to update DNS configuration" -ForegroundColor Red
    Write-Host "`n💡 Manual Steps:" -ForegroundColor Yellow
    Write-Host "   1. Open Control Panel" -ForegroundColor White
    Write-Host "   2. Network and Internet → Network Connections" -ForegroundColor White
    Write-Host "   3. Right-click your connection → Properties" -ForegroundColor White
    Write-Host "   4. Select IPv4 → Properties" -ForegroundColor White
    Write-Host "   5. Use DNS: 8.8.8.8 and 8.8.4.4`n" -ForegroundColor White
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

# Option to revert
Write-Host "💡 To revert to automatic DNS later:" -ForegroundColor Cyan
Write-Host "   Run: Set-DnsClientServerAddress -InterfaceAlias 'Your-Adapter-Name' -ResetServerAddresses`n" -ForegroundColor Gray

Read-Host "Press Enter to exit"
