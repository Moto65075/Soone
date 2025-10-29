@echo off
TITLE Ferramenta de Desenvolvimento Soone

REM --- VARIAVEIS GLOBAIS ---
SET "PROJECT_DIR=%USERPROFILE%\Desktop\Soone"
SET "PACKAGE_NAME=com.ecliptia.soone"
SET "APK_PATH=app\build\outputs\apk\debug\app-debug.apk"

REM --- MENU PRINCIPAL ---

:MAIN_MENU
cls
ECHO =========================================================
ECHO           Ferramenta de Desenvolvimento Soone
ECHO =========================================================
ECHO [1] - Limpar, Buildar e Instalar o APK (assembleDebug)
ECHO [2] - Menu de Debug (Logcat / PID / Arquivo)
ECHO [3] - Sair
ECHO =========================================================

REM CHOICE /C 123 /N /M "Escolha uma opcao:"
SET /P CHOICE="Escolha uma opcao (1, 2 ou 3): "

IF "%CHOICE%"=="1" GOTO BUILD_AND_INSTALL
IF "%CHOICE%"=="2" GOTO DEBUG_MENU
IF "%CHOICE%"=="3" GOTO :EOF

ECHO Escolha invalida. Pressione qualquer tecla para tentar novamente.
PAUSE > nul
GOTO MAIN_MENU


REM --- ROTINA: BUILD E INSTALAÇÃO ---

:BUILD_AND_INSTALL
cls
ECHO --- 1. BUILD E INSTALACAO ---
ECHO.

REM 1. Verifica se o diretorio existe
IF NOT EXIST "%PROJECT_DIR%\" (
    ECHO ERRO CRITICO: O diretorio nao foi encontrado: "%PROJECT_DIR%"
    PAUSE
    GOTO MAIN_MENU
)

REM Entra no diretorio
ECHO Entrando no diretorio: "%PROJECT_DIR%"
CD /D "%PROJECT_DIR%"

IF ERRORLEVEL 1 (
    ECHO ERRO: Nao foi possivel entrar no diretorio.
    PACHO
    GOTO MAIN_MENU
)

REM 2. Executa o build do Gradle
ECHO.
ECHO Iniciando o build: gradlew assembleDebug...
CALL gradlew assembleDebug

IF ERRORLEVEL 1 (
    ECHO ERRO: O comando "gradlew assembleDebug" falhou.
    PAUSE
    GOTO MAIN_MENU
)

REM 3. Executa o comando ADB
ECHO.
ECHO O build terminou. Tentando instalar o APK...
IF NOT EXIST "%APK_PATH%" (
    ECHO AVISO: O arquivo APK (%APK_PATH%) nao foi encontrado.
    GOTO INSTALL_COMPLETE
)

ECHO Instalando o APK: adb install -r "%APK_PATH%"
adb install -r "%APK_PATH%"

:INSTALL_COMPLETE
ECHO.
ECHO --- BUILD & INSTALL CONCLUIDO ---
PAUSE
GOTO MAIN_MENU

REM --- MENU DE DEBUG ---

:DEBUG_MENU
cls
ECHO =========================================================
ECHO               Menu de Debug (Logcat)
ECHO =========================================================
ECHO [1] - Logcat em tempo real (Filtrado por %PACKAGE_NAME%)
ECHO [2] - Loggar somente o chromium
ECHO [3] - Loggar com tag especifica
ECHO [4] - Logcat e Salvar em Arquivo (soone_log.txt)
ECHO [5] - instalar
ECHO [6] - Voltar ao Menu Principal
ECHO =========================================================

SET /P DEBUG_CHOICE="Escolha uma opcao de Debug (1, 2, 3 ou 4): "

IF "%DEBUG_CHOICE%"=="1" GOTO LOGCAT_REALTIME
IF "%DEBUG_CHOICE%"=="2" GOTO LOG_ONLY_CHROMIUM
IF "%DEBUG_CHOICE%"=="3" GOTO LOG_WITH_TAG
IF "%DEBUG_CHOICE%"=="4" GOTO LOGCAT_TO_FILE
IF "%DEBUG_CHOICE%"=="5" GOTO INSTALL
IF "%DEBUG_CHOICE%"=="6" GOTO MAIN_MENU

ECHO Escolha invalida. Pressione qualquer tecla para tentar novamente.
PAUSE > nul
GOTO DEBUG_MENU


REM --- ROTINA: LOGCAT TEMPO REAL ---

:LOGCAT_REALTIME
cls
ECHO --- Logcat em Tempo Real ---
ECHO.
ECHO Pressione CTRL+C para parar o log e voltar ao menu.
ECHO =========================================================

REM Limpa o logcat e inicia a exibicao filtrada
adb logcat -c
adb logcat *:I | FINDSTR /i "%PACKAGE_NAME%"

REM O adb logcat eh contínuo, entao o controle volta ao script quando o usuario
REM pressiona CTRL+C, levando-o de volta ao menu principal.
GOTO DEBUG_MENU

:LOG_ONLY_CHROMIUM
cls
ECHO --- LOGGANDO COM CHROMIUM ---
ECHO Pressione CTRL+C para parar o log e voltar ao menu.
ECHO.
ECHO =========================================================

adb logcat -c
adb logcat "%PACKAGE_NAME%":I chromium:I cr_*:I *:S

GOTO DEBUG_MENU

:LOG_WITH_TAG 
cls 
ECHO --- LOGGANDO COM TAG ESPECIFICA ---
ECHO =========================================================
ECHO.

SET /P TAG_TO_DEBUG="Digite a tag para debugar (exemplo chromium, sooneMediaPlayer): "
ECHO "%TAG_TO_DEBUG%"
adb logcat -c
adb logcat "%APK_PATH%":I "%TAG_TO_DEBUG%":* cr_*:I *:S

GOTO DEBUG_MENU

REM --- ROTINA: LOGCAT PARA ARQUIVO ---

:LOGCAT_TO_FILE
cls
SET "LOG_FILE_NAME=soone_log_%DATE:/=-%_%TIME::=-%.txt"

ECHO --- Logcat para Arquivo ---
ECHO.
ECHO O log sera gravado em: "%LOG_FILE_NAME%"
ECHO Pressione CTRL+C para parar e finalizar a gravacao.
ECHO =========================================================

REM Limpa o logcat e inicia a gravacao filtrada para o arquivo
adb logcat -c
adb logcat *:I | FINDSTR /i "%PACKAGE_NAME%" > "%LOG_FILE_NAME%"

ECHO.
ECHO Gravacao finalizada.
PAUSE
GOTO DEBUG_MENU

:INSTALL 
cls 
ECHO --- INSTALLING WITH ADB ---
ECHO.
ECHO =========================================================

adb install -r "%PROJECT_DIR%/%APK_PATH%"

ECHO.
ECHO --- Instalacao finalizada ---
PAUSE 
GOTO DEBUG_MENU