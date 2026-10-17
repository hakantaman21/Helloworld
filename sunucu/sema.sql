-- helloworld · English Prime · Yoldaş — ortak veritabanı taslağı (Postgres / Supabase), v0.26.0
-- Üç uygulama TEK veritabanında; her satır `uygulama` taşır. Yönetim merkezi tek yerden üçünü görür.
-- Bu dosya taslaktır: sunucu kurulurken gözden geçirilip göç (migration) olarak uygulanır.

create type uygulama_kimligi as enum ('helloworld', 'english-prime', 'yoldas');
create type rol as enum ('kullanici', 'moderator', 'yonetici');
create type hesap_durumu as enum ('aktif', 'askida', 'silindi');
create type destek_turu as enum ('sikayet', 'hata', 'oneri', 'gorus');
create type destek_durumu as enum ('alindi', 'inceleniyor', 'sonuclandi', 'geriAlindi');
create type onem as enum ('dusuk', 'normal', 'yuksek', 'acil');

-- Kişi (Supabase auth.users ile bire bir). Bir kişi birden çok uygulamada üye olabilir (uyelikler).
create table kullanicilar (
  id uuid primary key references auth.users on delete cascade,
  ad text not null default '',
  ana_dil text, ogrenilen_dil text default 'en', seviye text default 'A1',
  dogum_ay_gun char(5) check (dogum_ay_gun ~ '^\d{2}-\d{2}$'), -- yalnız gün-ay; yaş tutulmaz
  yetiskin boolean not null default false,                    -- Y27: 18 yaş onayı
  saat_dilimi text not null default 'Europe/Istanbul',
  bildirim_saatleri jsonb not null default '{"uygulama":{"bas":"08:00","bit":"22:00","gunler":[0,1,2,3,4,5,6]},"arkadas":{"bas":"08:00","bit":"23:00","gunler":[0,1,2,3,4,5,6]}}',
  gizlilik jsonb not null default '{"arkadasListesi":"arkadaslar","sonGorulme":"herkes","okundu":true}',
  guvende_zaman timestamptz,
  hesap hesap_durumu not null default 'aktif',
  rol rol not null default 'kullanici',
  olusturma timestamptz not null default now()
);

create table uyelikler (                                       -- 3 uygulama arası üyelik ve çapraz indirim
  kullanici uuid references kullanicilar on delete cascade,
  uygulama uygulama_kimligi not null,
  paket text not null default 'ucretsiz',
  odeme_kaynagi text,                                          -- play | stripe | test
  bitis timestamptz,
  primary key (kullanici, uygulama)
);

create table arkadasliklar (
  a uuid references kullanicilar on delete cascade,
  b uuid references kullanicilar on delete cascade,
  durum text not null check (durum in ('istek', 'arkadas')),
  olusturma timestamptz not null default now(),
  primary key (a, b)
);
create table arkadas_tercihleri (
  sahip uuid references kullanicilar on delete cascade,
  kisi uuid references kullanicilar on delete cascade,
  tercih jsonb not null default '{}',                         -- {mesaj:true, an:true, ...}
  aski_bitis timestamptz,
  primary key (sahip, kisi)
);
create table engeller (
  sahip uuid references kullanicilar on delete cascade,
  kisi uuid references kullanicilar on delete cascade,
  primary key (sahip, kisi)
);

create table mesajlar (
  id text primary key,                                         -- istemcinin giden kutusu kimliği (tekil teslim)
  gonderen uuid references kullanicilar on delete cascade,
  alici uuid references kullanicilar on delete cascade,
  metin text, foto text,
  olusturma timestamptz not null default now(),
  teslim_zamani timestamptz not null default now(),            -- alıcının iletişim saatine göre
  teslim_edildi timestamptz, okundu timestamptz
);
create index mesaj_teslim on mesajlar (teslim_zamani) where teslim_edildi is null;

create table destek_kayitlari (
  id text primary key,                                         -- istemci kimliği (d-…)
  uygulama uygulama_kimligi not null,
  kullanici uuid references kullanicilar on delete set null,
  tur destek_turu not null, kategori text, metin text,
  hedef jsonb,                                                 -- {kimlik, ad, tur:'kisi'|'an', an}
  onem onem not null, yol text not null check (yol in ('yonetici', 'otomatik')),
  durum destek_durumu not null default 'alindi',
  atanan uuid references kullanicilar,
  olusturma timestamptz not null default now(), geri_alinma timestamptz
);
create index destek_kuyruk on destek_kayitlari (uygulama, durum, onem desc, olusturma);
create table destek_yanitlari (
  id bigserial primary key,
  kayit text references destek_kayitlari on delete cascade,
  yanitlayan uuid references kullanicilar,
  metin text not null, sonuc boolean not null default true,
  olusturma timestamptz not null default now()
);

create table bildirimler (                                     -- kutu öğeleri (kat: mesaj, arkadas, anlar, ogrenme, hesap, uygulama, destek)
  id bigserial primary key,
  uygulama uygulama_kimligi not null,
  kullanici uuid references kullanicilar on delete cascade,
  kat text not null, baslik text not null, metin text, yol text,
  olusturma timestamptz not null default now(), okundu timestamptz
);
create table cihazlar (                                        -- Web Push abonelikleri
  kullanici uuid references kullanicilar on delete cascade,
  uygulama uygulama_kimligi not null,
  abonelik jsonb not null,
  primary key (kullanici, uygulama, abonelik)
);
create table denetim_kaydi (                                   -- yönetim işlemleri izi
  id bigserial primary key,
  yapan uuid references kullanicilar, islem text not null, hedef text, ayrinti jsonb,
  zaman timestamptz not null default now()
);

-- Satır düzeyi güvenlik: kullanıcı yalnız kendi verisini; moderatör/yönetici kendi uygulamasının kuyruğunu görür.
alter table kullanicilar enable row level security;
alter table mesajlar enable row level security;
alter table destek_kayitlari enable row level security;
alter table destek_yanitlari enable row level security;
alter table bildirimler enable row level security;

create function yonetici_mi() returns boolean language sql stable as
  $$ select exists (select 1 from kullanicilar where id = auth.uid() and rol in ('moderator', 'yonetici')) $$;

create policy kendi_profil on kullanicilar for all using (id = auth.uid() or yonetici_mi());
create policy kendi_mesaj on mesajlar for select using (
  gonderen = auth.uid() or (alici = auth.uid() and teslim_zamani <= now()) or yonetici_mi());
create policy kendi_destek on destek_kayitlari for select using (kullanici = auth.uid() or yonetici_mi());
create policy destek_yaz on destek_kayitlari for insert with check (kullanici = auth.uid());
create policy destek_yanit_oku on destek_yanitlari for select using (
  yonetici_mi() or exists (select 1 from destek_kayitlari d where d.id = kayit and d.kullanici = auth.uid()));
create policy destek_yanit_yaz on destek_yanitlari for insert with check (yonetici_mi());
create policy kendi_bildirim on bildirimler for all using (kullanici = auth.uid() or yonetici_mi());
