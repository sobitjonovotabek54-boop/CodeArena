# Agent to'xtaganda: ~10+ qator o'zgarish bo'lsa commit + push
$inputJson = [Console]::In.ReadToEnd()

$repoRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
if (-not (Test-Path (Join-Path $repoRoot ".git"))) {
  $repoRoot = (Get-Location).Path
}
Set-Location $repoRoot

$status = git status --porcelain 2>$null
if (-not $status) {
  Write-Output '{}'
  exit 0
}

# Ignore env/secrets
$lines = $status -split "`n" | Where-Object {
  $_ -and
  ($_ -notmatch '\.env(\.|$)') -and
  ($_ -notmatch 'credentials') -and
  ($_ -notmatch 'secret')
}

if (-not $lines) {
  Write-Output '{}'
  exit 0
}

$diffStat = git diff --numstat HEAD 2>$null
$stagedStat = git diff --cached --numstat 2>$null
$changedLines = 0
foreach ($row in (@($diffStat) + @($stagedStat))) {
  if (-not $row) { continue }
  $parts = ($row -split '\s+')
  if ($parts.Length -ge 2 -and $parts[0] -match '^\d+$') {
    $changedLines += [int]$parts[0] + [int]$parts[1]
  }
}

# Untracked fayllar uchun taxminiy hisob
$untracked = git ls-files --others --exclude-standard 2>$null
foreach ($f in $untracked) {
  if (-not $f) { continue }
  if ($f -match '\.env' -or $f -match 'credentials' -or $f -match 'secret') { continue }
  try {
    $changedLines += (Get-Content -LiteralPath $f -ErrorAction SilentlyContinue | Measure-Object -Line).Lines
  } catch {}
}

if ($changedLines -lt 10) {
  Write-Output '{}'
  exit 0
}

git add -A 2>$null
# Remove secrets if staged by mistake
git reset HEAD -- "*.env" "*.env.*" "*credentials*" "*secret*" 2>$null | Out-Null

$msg = "chore: auto-save after ~$changedLines lines"
git commit -m $msg 2>$null | Out-Null
if ($LASTEXITCODE -eq 0) {
  git push origin HEAD 2>$null | Out-Null
}

Write-Output '{}'
exit 0
