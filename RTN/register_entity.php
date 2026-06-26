<?php
declare(strict_types=1);

// ================== ERROR HANDLING ==================
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
set_time_limit(300);

// ================== SECURITY HEADERS ==================
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');

// ================== CONFIG ==================
$dbHost = 'localhost';
$dbName = 'pranapps_pran_db';
$dbUser = 'pranapps_pran_db';
$dbPass = 'dNVzAzArrxD5YdrJud5m';

$uploadBaseAbsolute = dirname(__DIR__) . '/uploads';
$uploadBaseRelative = 'uploads';

// ================== REQUEST METHOD CHECK ==================
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

// ================== DB CONNECT ==================
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
    $conn->set_charset('utf8mb4');
} catch (Throwable $e) {
    error_log('DB connection failed: ' . $e->getMessage());
    http_response_code(500);
    exit('A server error occurred. Please try again later.');
}

// ================== HELPERS ==================
function failAndRedirect(string $message): void
{
    header('Location: NGOregister.html?error=' . urlencode($message));
    exit();
}

function cleanFolderName(string $name): string
{
    $name = strtolower(trim($name));
    $name = preg_replace('/[^a-z0-9]+/', '_', $name);
    $name = trim((string)$name, '_');
    return $name !== '' ? $name : 'entity';
}

function postStringOrNull(string $key, int $maxLen = 5000): ?string
{
    $value = $_POST[$key] ?? null;

    if ($value === null || !is_string($value)) {
        return null;
    }

    $value = trim($value);

    if ($value === '') {
        return null;
    }

    if (mb_strlen($value) > $maxLen) {
        $value = mb_substr($value, 0, $maxLen);
    }

    return $value;
}

function postIntOrNull(string $key): ?int
{
    $value = $_POST[$key] ?? null;

    if ($value === null || $value === '') {
        return null;
    }

    return (int)$value;
}

function checkboxInt(string $key): int
{
    return isset($_POST[$key]) ? 1 : 0;
}

function uploadFileSimple(
    array $possibleKeys,
    string $folder,
    string $baseFolder,
    string $uploadBaseAbsolute,
    string $uploadBaseRelative
): ?string {
    $file = null;
    $usedKey = null;

    foreach ($possibleKeys as $key) {
        if (isset($_FILES[$key]) && is_array($_FILES[$key])) {
            $file = $_FILES[$key];
            $usedKey = $key;
            break;
        }
    }

    if ($file === null) {
        error_log('Upload missing for keys: ' . implode(', ', $possibleKeys));
        return null;
    }

    if (!isset($file['error'], $file['name'], $file['tmp_name'])) {
        error_log("Invalid upload structure for {$usedKey}");
        return null;
    }

    if ($file['error'] === UPLOAD_ERR_NO_FILE) {
        error_log("No file selected for {$usedKey}");
        return null;
    }

    if ($file['error'] !== UPLOAD_ERR_OK) {
        error_log("Upload error for {$usedKey}: " . $file['error']);
        return null;
    }

    if (!is_uploaded_file($file['tmp_name'])) {
        error_log("Invalid uploaded file source for {$usedKey}");
        return null;
    }

    $originalName = (string)$file['name'];
    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    $extension = $extension !== '' ? $extension : 'bin';

    $targetDir = rtrim($uploadBaseAbsolute, '/\\') . DIRECTORY_SEPARATOR
        . $baseFolder . DIRECTORY_SEPARATOR
        . $folder . DIRECTORY_SEPARATOR;

    if (!is_dir($targetDir) && !mkdir($targetDir, 0755, true) && !is_dir($targetDir)) {
        error_log("Failed to create upload dir for {$usedKey}: {$targetDir}");
        return null;
    }

    $safeName = bin2hex(random_bytes(16)) . '.' . $extension;
    $targetFile = $targetDir . $safeName;

    if (!move_uploaded_file($file['tmp_name'], $targetFile)) {
        error_log("move_uploaded_file failed for {$usedKey}");
        return null;
    }

    @chmod($targetFile, 0644);

    return trim($uploadBaseRelative, '/\\') . '/' . $baseFolder . '/' . $folder . '/' . $safeName;
}

function getBindTypes(array $data): string
{
    $types = '';
    foreach ($data as $value) {
        $types .= is_int($value) ? 'i' : 's';
    }
    return $types;
}

// ================== NORMALIZED INPUTS ==================
$ngo_name = postStringOrNull('ngo_name', 255);
$registration_type = postStringOrNull('registration_type', 100);
$other_registration_type = postStringOrNull('other_registration_type', 255);
$registration_number = postStringOrNull('registration_number', 100);
$registration_date = postStringOrNull('registration_date', 20);
$ngo_pan = postStringOrNull('ngo_pan', 20);
$darpan_id = postStringOrNull('darpan_id', 100);
$website = postStringOrNull('website', 500);
$registered_address = postStringOrNull('registered_address', 2000);
$city = postStringOrNull('city', 100);
$state = postStringOrNull('state', 100);
$pincode = postStringOrNull('pincode', 10);
$org_email = postStringOrNull('org_email', 255);
$org_phone = postStringOrNull('org_phone', 20);

$authorized_person = postStringOrNull('authorized_person', 255);
$designation = postStringOrNull('designation', 150);
$gender = postStringOrNull('gender', 50);
$person_email = postStringOrNull('person_email', 255);
$person_phone = postStringOrNull('person_phone', 20);

$work_areas = postStringOrNull('work_areas', 1000);
$other_work_area = postStringOrNull('other_work_area', 255);
$operational_regions = postStringOrNull('operational_regions', 500);
$num_operational_states = postIntOrNull('num_operational_states');
$operational_states_names = postStringOrNull('operational_states_names', 1000);
$ongoing_projects = postIntOrNull('ongoing_projects');
$establishment_year = postIntOrNull('establishment_year');
$team_members = postIntOrNull('team_members');
$project_category = postStringOrNull('project_category', 100);

$certificate_12a = postStringOrNull('certificate_12a', 100);
$certificate_80g = postStringOrNull('certificate_80g', 100);
$fcra_number = postStringOrNull('fcra_number', 100);

$annual_turnover = postIntOrNull('annual_turnover');
$bank_name = postStringOrNull('bank_name', 255);
$account_number = postStringOrNull('account_number', 50);
$ifsc_code = postStringOrNull('ifsc_code', 20);
$gst_number = postStringOrNull('gst_number', 30);

$vision_mission = postStringOrNull('vision_mission', 5000);
$achievements = postStringOrNull('achievements', 5000);
$terms_consent = checkboxInt('terms_consent');

// ================== DATA ARRAY ==================
$data = [
    $ngo_name,
    $registration_type,
    $other_registration_type,
    $registration_number,
    $registration_date,
    $ngo_pan,
    $darpan_id,
    $website,
    $registered_address,
    $city,
    $state,
    $pincode,
    $org_email,
    $org_phone,
    $authorized_person,
    $designation,
    $gender,
    $person_email,
    $person_phone,
    $work_areas,
    $other_work_area,
    $operational_regions,
    $num_operational_states,
    $operational_states_names,
    $ongoing_projects,
    $establishment_year,
    $team_members,
    $project_category,
    $certificate_12a,
    $certificate_80g,
    $fcra_number,
    $annual_turnover,
    $bank_name,
    $account_number,
    $ifsc_code,
    $gst_number,
    $vision_mission,
    $achievements,
    $terms_consent
];

try {
    // ================== STEP 1: INSERT MAIN DATA ==================
    $sql = "INSERT INTO ngos (
        ngo_name, registration_type, other_registration_type, registration_number, registration_date, ngo_pan,
        darpan_id, website, registered_address, city, state, pincode, org_email, org_phone,
        authorized_person, designation, gender, person_email, person_phone,
        work_areas, other_work_area, operational_regions, num_operational_states, operational_states_names,
        ongoing_projects, establishment_year, team_members, project_category,
        certificate_12a, certificate_80g, fcra_number,
        annual_turnover, bank_name, account_number, ifsc_code, gst_number,
        vision_mission, achievements, terms_consent
    ) VALUES (" . rtrim(str_repeat('?,', count($data)), ',') . ")";

    $stmt = $conn->prepare($sql);
    $types = getBindTypes($data);
    $stmt->bind_param($types, ...$data);
    $stmt->execute();

    $ngo_id = $conn->insert_id;
    $stmt->close();

    $baseFolder = 'ngo_' . $ngo_id . '_' . cleanFolderName((string)($ngo_name ?? 'entity'));

    // ================== STEP 2: UPLOAD FILES ==================
    $id_proof = uploadFileSimple(
        ['id_proof', 'id_proof'],
        'id_proof',
        $baseFolder,
        $uploadBaseAbsolute,
        $uploadBaseRelative
    );

    $registration_certificate = uploadFileSimple(
        ['registration_certificate', 'registrationCertificate'],
        'certificates',
        $baseFolder,
        $uploadBaseAbsolute,
        $uploadBaseRelative
    );

    $pan_card_file = uploadFileSimple(
        ['pan_card_file', 'panCardFile'],
        'documents',
        $baseFolder,
        $uploadBaseAbsolute,
        $uploadBaseRelative
    );

    $address_proof = uploadFileSimple(
        ['address_proof', 'addressProof'],
        'documents',
        $baseFolder,
        $uploadBaseAbsolute,
        $uploadBaseRelative
    );

    $authorization_letter = uploadFileSimple(
        ['authorization_letter', 'authorizationLetter'],
        'documents',
        $baseFolder,
        $uploadBaseAbsolute,
        $uploadBaseRelative
    );

    $fcra_certificate = uploadFileSimple(
        ['fcra_certificate', 'fcraCertificate'],
        'documents',
        $baseFolder,
        $uploadBaseAbsolute,
        $uploadBaseRelative
    );

    $audited_report = uploadFileSimple(
        ['audited_report', 'auditedReport'],
        'financials',
        $baseFolder,
        $uploadBaseAbsolute,
        $uploadBaseRelative
    );

    // ================== STEP 3: UPDATE FILE PATHS ==================
    $updateSql = "UPDATE ngos SET
        id_proof = COALESCE(?, id_proof),
        registration_certificate = COALESCE(?, registration_certificate),
        pan_card_file = COALESCE(?, pan_card_file),
        address_proof = COALESCE(?, address_proof),
        authorization_letter = COALESCE(?, authorization_letter),
        fcra_certificate = COALESCE(?, fcra_certificate),
        audited_report = COALESCE(?, audited_report)
        WHERE id = ?";

    $update = $conn->prepare($updateSql);
    $update->bind_param(
        'sssssssi',
        $id_proof,
        $registration_certificate,
        $pan_card_file,
        $address_proof,
        $authorization_letter,
        $fcra_certificate,
        $audited_report,
        $ngo_id
    );
    $update->execute();
    $update->close();

    header('Location: NGOregister.html?success=1');
    exit();
} catch (Throwable $e) {
    error_log('NGO registration failed: ' . $e->getMessage());
    failAndRedirect('Submission failed. Please try again.');
} finally {
    $conn->close();
}
?>