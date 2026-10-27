// Настройки подключения к Supabase.
// Оставьте поля пустыми — приложение работает в локальном демо-режиме (данные только в этом браузере).
// Где взять значения: Supabase → Project Settings → API → «Project URL» и ключ «anon public».
// Ключ anon можно публиковать на GitHub: он рассчитан на браузер, а данные защищены правилами RLS из supabase/schema.sql.
// НИКОГДА не вставляйте сюда ключ service_role — он даёт полный доступ к базе.
window.STUDHUB_CONFIG = {
  supabaseUrl: '',      // например: 'https://abcdefghijkl.supabase.co'
  supabaseAnonKey: ''   // длинная строка, начинается с 'eyJ...' (или 'sb_publishable_...')
};
