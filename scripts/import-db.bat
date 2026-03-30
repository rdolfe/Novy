@echo off
echo.
echo  Importing Novy database schema...
"C:\xampp\mysql\bin\mysql.exe" -u root novy < "%~dp0..\db\schema.sql"
if %ERRORLEVEL% == 0 (
    echo.
    echo  [OK] Schema imported successfully!
) else (
    echo.
    echo  [ERROR] Import failed. Make sure MySQL is running in XAMPP.
)
pause
