/**
 * AcadeMe.Fund — שאלון התאמה אישית למלגות וסיוע כלכלי
 * סקריפט צד-שרת (Google Apps Script) שמקבל את תשובות השאלון
 * ושומר אותן כשורה חדשה בגיליון Google Sheets.
 *
 * התקנה מלאה מפורטת ב-README.md שבשורש הפרויקט.
 */

// שם הטאב (הגיליון) שבו יישמרו התשובות בתוך קובץ ה-Google Sheet.
// אם הטאב לא קיים, הסקריפט ייצור אותו אוטומטית בהרצה הראשונה.
var SHEET_NAME = 'תשובות';

// סדר העמודות בגיליון — תואם 1:1 לשמות השדות שנשלחים מהשאלון (script.js).
var COLUMNS = [
  'submitted_at', 'full_name', 'email', 'phone',
  'age', 'residence_town', 'grew_up_here', 'housing', 'rent_difficulty',
  'assistance_types',
  'study_status', 'institution', 'campus', 'field_of_study', 'field_of_study_other',
  'study_type', 'study_year', 'achievements', 'gpa',
  'parents_education', 'target_groups', 'haredi_background', 'haredi_support',
  'family_status', 'has_children', 'children_count', 'children_ages',
  'employment', 'monthly_income', 'scholarship_amount', 'extra_funding_year', 'extra_funding_degree',
  'service_type_status', 'service_type', 'reserve_duty', 'spouse_reserve_duty',
  'consent', 'source',
  'external_tuition_funding', 'external_tuition_funding_source'
];

/**
 * נקודת הכניסה שנקראת בכל בקשת POST מהשאלון.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('לא התקבל תוכן בבקשה');
    }
    var data = JSON.parse(e.postData.contents);
    var sheet = getOrCreateSheet_();

    var row = COLUMNS.map(function (key) {
      var value = data[key];
      if (value === undefined || value === null) return '';
      return value;
    });

    sheet.appendRow(row);

    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

/**
 * מחזיר את הגיליון היעודי לתשובות, ויוצר אותו + שורת כותרות אם צריך.
 */
function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * פונקציית בדיקה — אפשר להריץ אותה ידנית מתוך עורך ה-Apps Script
 * (בחר/י את הפונקציה testDoPost_ בתפריט העליון ולחצ/י Run),
 * כדי לוודא שהחיבור לגיליון ושורת הכותרות נוצרים כראוי,
 * לפני שמחברים את השאלון בפועל.
 */
function testDoPost_() {
  var fakeRequest = {
    postData: {
      contents: JSON.stringify({
        submitted_at: new Date().toISOString(),
        full_name: 'בדיקת מערכת',
        email: 'test@example.com',
        phone: '050-0000000',
        source: 'AcadeMe.Fund (בדיקה)'
      })
    }
  };
  var result = doPost(fakeRequest);
  Logger.log(result.getContent());
}
