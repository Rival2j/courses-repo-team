Param()
Set-Location -Path $PSScriptRoot

# Load .env into environment from project root
$envPath = Join-Path (Split-Path $PSScriptRoot -Parent) '.env'
if (Test-Path -Path $envPath) {
  Get-Content $envPath | ForEach-Object {
    if ($_ -match '^\s*#') { return }
    if ($_ -match '^\s*$') { return }
    $parts = $_ -split '='; if ($parts.Count -lt 2) { return }
    $key = $parts[0].Trim()
    $value = ($parts[1..($parts.Count-1)] -join '=').Trim()
    if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
      $value = $value.Substring(1, $value.Length - 2)
    }
    Set-Item -Path "Env:$key" -Value $value
  }
}

if (-not $env:JWT_SECRET) { Write-Host 'Warning: JWT_SECRET not set; using fallback "test-secret"' }

function b64u([string]$s){
  $b = [System.Text.Encoding]::UTF8.GetBytes($s)
  $t = [Convert]::ToBase64String($b)
  return $t.TrimEnd('=') -replace '\+','-' -replace '/','_'
}

function makeJwt([string]$claimsJson){
  $secret = $env:JWT_SECRET; if (-not $secret) { $secret = 'test-secret' }
  $header = '{"alg":"HS256","typ":"JWT"}'
  $h = b64u $header
  $p = b64u $claimsJson
  $signing = "$h.$p"
  $hmac = [System.Security.Cryptography.HMACSHA256]::new([System.Text.Encoding]::UTF8.GetBytes($secret))
  $sigBytes = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($signing))
  $sig = [Convert]::ToBase64String($sigBytes).TrimEnd('=') -replace '\+','-' -replace '/','_'
  return "$signing.$sig"
}

$now = [int][double]::Parse((Get-Date -UFormat %s))
$userClaims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"alumno","email":"juan.perez@example.com","iat":' + $now + ',"exp":' + ($now + 3600) + '}'
$adminClaims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"admin","email":"admin@example.com","iat":' + $now + ',"exp":' + ($now + 3600) + '}'

$USER_JWT = makeJwt $userClaims
$ADMIN_JWT = makeJwt $adminClaims

Write-Host "USER_JWT= $($USER_JWT.Substring(0,20))..."
Write-Host "ADMIN_JWT= $($ADMIN_JWT.Substring(0,20))..."

$port = $env:PORT; if (-not $port) { $port = 3000 }
$API_URL = "http://localhost:$port"
Write-Host "API_URL=$API_URL"

Write-Host "`n== POST /users/bootstrap =="
$body = '{"email":"juan.perez@example.com","displayName":"Juan Pérez","userId":"11111111-1111-1111-1111-111111111111"}'
curl.exe -i -s -X POST "$API_URL/users/bootstrap" -H "Authorization: Bearer $USER_JWT" -H "Content-Type: application/json" -d $body

Write-Host "`n== GET /users/me =="
curl.exe -i -s "$API_URL/users/me" -H "Authorization: Bearer $USER_JWT"

Write-Host "`n== GET /users/emails?role=alumno&format=csv =="
curl.exe -i -s "$API_URL/users/emails?role=alumno&format=csv" -H "Authorization: Bearer $ADMIN_JWT"

Write-Host "`n== GET /users =="
curl.exe -i -s "$API_URL/users" -H "Authorization: Bearer $ADMIN_JWT"

$TARGET = '11111111-1111-1111-1111-111111111111'
Write-Host "`n== POST /users/$TARGET/provision =="
$pdata = '{"role":"moderador","email":"juan.perez@example.com","displayName":"Juan Pérez"}'
curl.exe -i -s -X POST "$API_URL/users/$TARGET/provision" -H "Authorization: Bearer $ADMIN_JWT" -H "Content-Type: application/json" -d $pdata

Write-Host "`n== GET /users/$TARGET =="
curl.exe -i -s "$API_URL/users/$TARGET" -H "Authorization: Bearer $ADMIN_JWT"

Write-Host "`n== PATCH /users/$TARGET =="
$patch = '{"displayName":"Juan P. Renovado"}'
curl.exe -i -s -X PATCH "$API_URL/users/$TARGET" -H "Authorization: Bearer $ADMIN_JWT" -H "Content-Type: application/json" -d $patch

Write-Host "`nSmoke tests completed."
