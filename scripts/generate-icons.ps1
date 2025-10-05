param(
  [Parameter(Mandatory=$true)][string]$SourcePath,
  [string]$OutDir = "public/icons"
)

if (!(Test-Path $SourcePath)) { throw "Source image not found: $SourcePath" }

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

Add-Type -AssemblyName System.Drawing

function Resize-Png {
  param([string]$path, [int]$size)
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $gfx = [System.Drawing.Graphics]::FromImage($bmp)
  $gfx.SmoothingMode = 'HighQuality'
  $gfx.InterpolationMode = 'HighQualityBicubic'
  $gfx.PixelOffsetMode = 'HighQuality'
  $img = [System.Drawing.Image]::FromFile($path)

  $srcRect = New-Object System.Drawing.Rectangle(0,0,$img.Width,$img.Height)
  $dstRect = New-Object System.Drawing.Rectangle(0,0,$size,$size)
  $gfx.Clear([System.Drawing.Color]::White)
  $gfx.DrawImage($img, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

  return @($bmp,$gfx,$img)
}

function Save-And-Dispose {
  param($bmp,$gfx,$img,[string]$outfile)
  $bmp.Save($outfile, [System.Drawing.Imaging.ImageFormat]::Png)
  $gfx.Dispose(); $img.Dispose(); $bmp.Dispose();
}

# Required sizes
$targets = @(
  @{ Size = 192; Name = 'icon-192.png' },
  @{ Size = 512; Name = 'icon-512.png' },
  @{ Size = 512; Name = 'maskable-512.png' },
  @{ Size = 180; Name = 'apple-touch-icon-180.png' }
)

foreach ($t in $targets) {
  $objs = Resize-Png -path $SourcePath -size $t.Size
  $outfile = Join-Path $OutDir $t.Name
  Save-And-Dispose @objs -outfile $outfile
  Write-Host "wrote $outfile"
}

Write-Host "Done. Update real icons are now in $OutDir"

